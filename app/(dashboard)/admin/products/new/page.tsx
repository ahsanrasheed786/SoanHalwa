

"use client";
import { DashboardSidebar } from "@/components";
import { convertCategoryNameToURLFriendly as convertSlugToURLFriendly } from "@/utils/categoryFormating";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";

const AddNewProduct = () => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
    const [product, setProduct] = useState({
    title: "",
    price: 0,
    manufacturer: "",
    inStock: 1,
    mainImage: "",
    description: "",
    slug: "",
    categoryId: "",
    additionalImages: [],
    variants: [],
    additionalItems: [],
    // shippingOptions: [],
    totalRating: 0, // New field for total rating
  });

  const [categories, setCategories] = useState([]);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [variant, setVariant] = useState({ size: "", weight: 0, color: "", variantPrice: 0,shipingCost: 0,variantstock:1  });
  const [additionalItem, setAdditionalItem] = useState({ name: "", price: 0 });
  // const [shippingOption, setShippingOption] = useState({ weight: 0, price: 0 });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);

    // Generate image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
};

// Handle image removal before upload
const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
};
 
const uploadImages = async () => {
   
  if (images.length === 0) return [];

  const formData = new FormData();
  images.forEach((image) => {
    formData.append("files", image);
  });

  try {
    const response = await fetch("/api/imageuploader", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();
    const imageUrls = data.data.map((img) => ({
      url: img.secure_url ||" url",
      public_id: img.public_id ||" public_id",
      alt: "Image description",   
      caption: "Optional caption", 
    }));

    // console.log(imageUrls);  
    return imageUrls;  
  } catch (error) {
    toast.error("Image upload failed");
    return [];
  }
};


  const addProduct = async () => {
    if (product.title === "" || product.manufacturer === "" || product.description === "" || product.slug === "") {
      toast.error("Please enter values in input fields");
      return;
    }

    // Handle additional images upload before sending the product
    const imageUrls = await uploadImages();
  

    const requestOptions = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...product,
        additionalImages: imageUrls,  
      }),
    };

    fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/products`, requestOptions)
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw Error("There was an error while creating product");
        }
      })
      .then((data) => {
        toast.success("Product added successfully");
        setProduct({
          title: "",
          price: 0,
          manufacturer: "",
          inStock: 1,
          mainImage: "",
          description: "",
          slug: "",
          categoryId: "",
          additionalImages: [],
          variants: [],
          additionalItems: [],
          // shippingOptions: [],
          totalRating: 0,
          setImages: [],
        });
       })
      .catch((error) => {
        toast.error("There was an error while creating product");
      });
  };

  

  const fetchCategories = async () => {
    fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/category`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setProduct((prev) => ({
          ...prev,
          categoryId: data[0]?.id,
        }));
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add Variant
  
  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, variant],
    }));
    setVariant({ size: "", weight: 0, color: "", variantPrice: 0,shipingCost: 0,variantstock:1 }); // Reset variant input
  };

  // Add Additional Item
  const addAdditionalItem = () => {
    setProduct((prev) => ({
      ...prev,
      additionalItems: [...prev.additionalItems, additionalItem],
    }));
    setAdditionalItem({ name: "", price: 0 }); // Reset additional item input
  };
 

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:ml-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">Add new product</h1>
        
        {/* Other form fields */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Product name:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
            />
          </label>
        </div>
        <label className="block mb-3">
                    Upload Images:
                    <div className="flex items-center mt-2">
                        <label className="cursor-pointer flex flex-col items-center justify-center bg-gray-200 rounded-lg p-4 hover:bg-gray-300 transition">
                            <FaCloudUploadAlt className="text-4xl text-gray-600" />
                            <span className="mt-2 text-sm text-gray-600">Upload Images</span>
                            <input
                                type="file"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"/>
                        </label>
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative w-16 h-16 mr-2">
                                <Image src={preview} alt={`Preview ${index}`} layout="fill" objectFit="cover" className="rounded-md" />
                                <button onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                    </div>
                </label>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Product slug:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={convertSlugToURLFriendly(product?.slug)}
              onChange={(e) =>
                setProduct({
                  ...product,
                  slug: convertSlugToURLFriendly(e.target.value),
                })
              }
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Category:</span>
            </div>
            <select
              className="select select-bordered"
              value={product?.categoryId}
              onChange={(e) =>
                setProduct({ ...product, categoryId: e.target.value })
              }
            >
              {categories &&
                categories.map((category: any) => (
                  <option key={category?.id} value={category?.id}>
                    {category?.name}
                  </option>
                ))}
            </select>
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Product price:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.price}
              onChange={(e) =>
                setProduct({ ...product, price: Number(e.target.value) })
              }
            />
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Manufacturer:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.manufacturer}
              onChange={(e) =>
                setProduct({ ...product, manufacturer: e.target.value })
              }
            />
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Total Stock:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.inStock}
              onChange={(e) =>
                setProduct({ ...product, inStock:Number(e.target.value) })
              }
            />
          </label>
        </div>
        

        {/* Variants Section */}
        <div>
          <h2 className="text-lg font-semibold">Add Product Variant</h2>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Size:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={variant.size}
              onChange={(e) => setVariant({ ...variant, size: e.target.value })}
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Weight:</span>
            </div>
            <input
              type="number"
              className="input input-bordered w-full max-w-xs"
              value={variant.weight}
              onChange={(e) => setVariant({ ...variant, weight: Number(e.target.value) })}/>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Color:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={variant.color}
              onChange={(e) => setVariant({ ...variant, color: e.target.value })}/>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Price:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={variant.variantPrice}
              onChange={(e) => setVariant({ ...variant, variantPrice: e.target.value })}/>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Shipling Cost:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={variant.shipingCost}
              onChange={(e) => setVariant({ ...variant, shipingCost: e.target.value })}/>
          </label>
          {/* variantstock */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">variantstock:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={variant.variantstock}
              onChange={(e) => setVariant({ ...variant, variantstock: e.target.value })}/>
          </label>
          <button className="btn btn-primary mt-2" onClick={addVariant}>
            Add Variant
          </button>
          
          {/* Display Added Variants */}
          <ul>
            {product.variants.map((v, idx) => (
              <li key={idx}>
                Size: {v.size}, Weight: {v.weight}g, Color: {v.color},
                Variant Stock: {v.variantstock},Variant Cost: {v.shipingCost},Variant Price: {v.variantPrice}
              </li>
            ))}
          </ul>
        </div>

        {/* Additional Items Section */}
        <div>
          <h2 className="text-lg font-semibold">Add Additional Item</h2>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Item Name:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={additionalItem.name}
              onChange={(e) => setAdditionalItem({ ...additionalItem, name: e.target.value })}
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Item Price:</span>
            </div>
            <input
              type="number"
              className="input input-bordered w-full max-w-xs"
              value={additionalItem.price}
              onChange={(e) => setAdditionalItem({ ...additionalItem, price: Number(e.target.value) })}
            />
          </label>
          <button className="btn btn-primary mt-2" onClick={addAdditionalItem}>
            Add Additional Item
          </button>

          {/* Display Added Additional Items */}
          <ul>
            {product.additionalItems.map((item, idx) => (
              <li key={idx}>
                {item.name}: ${item.price}
              </li>
            ))}
          </ul>
        </div>

        <div>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Product description:</span>
             </div>
              <textarea
              className="textarea textarea-bordered h-24"
              value={product?.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            ></textarea>
          </label>
        </div>
        
        <button className="btn btn-success" onClick={addProduct}>Add Product</button>
      </div>
    </div>
  );
};

export default AddNewProduct;
 