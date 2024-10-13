
//  "use client";
// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { FaStar, FaStarHalfAlt, FaCloudUploadAlt, FaTimes } from "react-icons/fa";

// const ReviewSection = ({ productId }) => {
//     const [reviews, setReviews] = useState([]);
//     const [rating, setRating] = useState(0); // Default rating to 0
//     const [hoverRating, setHoverRating] = useState(0);
//     const [comment, setComment] = useState("");
//     const [images, setImages] = useState([]);
//     const [userName, setUserName] = useState("");
//     const [imagePreviews, setImagePreviews] = useState([]);

//     // Fetch reviews when the component loads
//     useEffect(() => {
//         const fetchReviews = async () => {
//             try {
//                 const response = await fetch(`/api/reviews/${productId}`);
//                 const data = await response.json();
//                 setReviews(data);
//             } catch (error) {
//                 console.error("Error fetching reviews:", error);
//             }
//         };
//         fetchReviews();
//     }, [productId]);

//     // Handle image selection and show preview
//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);
//         setImages((prevImages) => [...prevImages, ...files]);

//         // Generate image previews
//         const previews = files.map((file) => URL.createObjectURL(file));
//         setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
//     };

//     // Handle image removal before upload
//     const handleRemoveImage = (index) => {
//         setImages((prevImages) => prevImages.filter((_, i) => i !== index));
//         setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
//     };

//     // Upload images to the server only if there are selected images
//     const uploadImages = async () => {
//         if (images.length === 0) return []; // No images to upload

//         const formData = new FormData();
//         images.forEach((image) => {
//             formData.append("files", image);
//         });

//         const response = await fetch("/api/imageuploader", {
//             method: "POST",
//             body: formData,
//         });

//         const data = await response.json();
//         return data.data.map((img) => img.secure_url); // Return uploaded image URLs
//     };

//     // Handle review submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const uploadedImageUrls = await uploadImages();

//             const response = await fetch(`/api/reviews/${productId}`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     rating: rating,
//                     comment: comment,
//                     images: uploadedImageUrls,
//                     userId: "userId", // Replace with actual userId
//                     userName: userName,
//                     productId: productId,
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error("Error submitting review");
//             }

//             const data = await response.json();
//             setReviews([...reviews, data]); // Update the review list

//             // Reset form after submit
//             setRating(0);
//             setHoverRating(0);
//             setComment("");
//             setImages([]);
//             setImagePreviews([]);
//             setUserName("");
//         } catch (error) {
//             console.error("Error submitting review:", error);
//         }
//     };

//     // Handle star rating hover
//     const handleStarHover = (index) => {
//         setHoverRating(index);
//     };

//     // Handle star rating click
//     const handleStarClick = (index) => {
//         setRating(index);
//     };

//     return (
//         <div className="review-section bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-10">
//             <h2 className="text-3xl font-semibold text-gray-800 mb-5">
//                 Customer Reviews
//             </h2>

//             {/* Existing Reviews */}
//             {reviews?.length > 0 ? (
//                 reviews?.map((review, idx) => (
//                     <div
//                         key={idx}
//                         className="review-item bg-gray-100 p-4 mb-4 rounded-lg shadow"
//                     >
//                         <div className="flex items-center justify-between mb-2">
//                             <div className="review-rating flex items-center">
//                                 {[...Array(Math.floor(review.rating))].map((_, i) => (
//                                     <FaStar key={i} className="text-yellow-500" />
//                                 ))}
//                                 {review.rating % 1 !== 0 && <FaStarHalfAlt className="text-yellow-500" />}
//                             </div>
//                             <p className="text-gray-500">{review.userName}</p>
//                         </div>
//                         <p className="text-gray-700 mb-2">{review.comment}</p>
//                         {review?.images?.length > 0 && (
//                             <div className="review-images flex space-x-2">
//                                 {review.images.map((img, idx) => (
//                                     <Image
//                                         key={idx}
//                                         src={img}
//                                         alt="Review image"
//                                         width={100}
//                                         height={100}
//                                         className="rounded-lg"
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 ))
//             ) : (
//                 <p className="text-gray-500">No reviews yet.</p>
//             )}

//             {/* Review Form */}
//             <form onSubmit={handleSubmit} className="review-form mt-5">
//                 <label className="block mb-3">
//                     User Name:
//                     <input
//                         type="text"
//                         value={userName}
//                         onChange={(e) => setUserName(e.target.value)}
//                         required
//                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     />
//                 </label>

//                 {/* Star Rating Input */}
//                 <label className="block mb-3">
//                     Rating:
//                     <div className="flex items-center">
//                         {[...Array(5)].map((_, index) => (
//                             <FaStar
//                                 key={index}
//                                 className={`cursor-pointer text-3xl ${index < (hoverRating || rating) ? "text-yellow-500" : "text-gray-400"}`}
//                                 onMouseEnter={() => handleStarHover(index + 1)}
//                                 onMouseLeave={() => handleStarHover(rating)}
//                                 onClick={() => handleStarClick(index + 1)}
//                             />
//                         ))}
//                     </div>
//                 </label>

//                 <label className="block mb-3">
//                     Comment:
//                     <textarea
//                         value={comment}
//                         onChange={(e) => setComment(e.target.value)}
//                         required
//                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     ></textarea>
//                 </label>

//                 <label className="block mb-3">
//                     Upload Images:
//                     <div className="flex items-center mt-2">
//                         <label className="cursor-pointer flex flex-col items-center justify-center bg-gray-200 rounded-lg p-4 hover:bg-gray-300 transition">
//                             <FaCloudUploadAlt className="text-4xl text-gray-600" />
//                             <span className="mt-2 text-sm text-gray-600">Upload Images</span>
//                             <input
//                                 type="file"
//                                 multiple
//                                 onChange={handleImageChange}
//                                 className="hidden"
//                             />
//                         </label>
//                     </div>
//                 </label>

//                 {/* Image Previews with Remove Button */}
//                 {imagePreviews.length > 0 && (
//                     <div className="image-previews flex space-x-4 mt-4">
//                         {imagePreviews.map((preview, index) => (
//                             <div key={index} className="relative">
//                                 <img
//                                     src={preview}
//                                     alt="Preview"
//                                     className="w-24 h-24 object-cover rounded-lg"
//                                 />
//                                 <button
//                                     type="button"
//                                     className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
//                                     onClick={() => handleRemoveImage(index)}
//                                 >
//                                     <FaTimes />
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 <button
//                     type="submit"
//                     className="w-full bg-indigo-600 text-white py-2 px-4 mt-5 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                     Submit Review
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default ReviewSection;

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FaStar, FaStarHalfAlt, FaCloudUploadAlt, FaTimes } from "react-icons/fa";

const ReviewSection = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    // const [userName, setUserName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalReviews, setTotalReviews] = useState(0);
    const { data: session, status } = useSession();
    const [userName, setUserName] = useState("");
    // console.log(session)
    const reviewsPerPage = 10; // Number of reviews to display per page

    // Fetch reviews when the component loads or currentPage changes
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/reviews/${productId}?page=${currentPage}&limit=${reviewsPerPage}`);
                const data = await response.json();
                setReviews(data.reviews); // Assuming the API returns an object with 'reviews' array
                setTotalReviews(data.totalReviews); // Assuming the API returns the total number of reviews
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        fetchReviews();
    }, [productId, currentPage]);

    // Handle image selection and show preview
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

    // Upload images to the server only if there are selected images
    const uploadImages = async () => {
        if (images.length === 0) return []; // No images to upload

        const formData = new FormData();
        images.forEach((image) => {
            formData.append("files", image);
        });

        const response = await fetch("/api/imageuploader", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        return data.data.map((img) => img.secure_url); // Return uploaded image URLs
    };

    // Handle review submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const uploadedImageUrls = await uploadImages();

            const response = await fetch(`/api/reviews/${productId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rating: rating,
                    comment: comment,
                    images: uploadedImageUrls,
                    userId: session.user.id || "userId", // Replace with actual userId
                    userName: userName,
                    productId: productId,
                }),
            });

            if (!response.ok) {
                throw new Error("Error submitting review");
            }

            const data = await response.json();
            setReviews((prevReviews) => [data, ...prevReviews]); // Update the review list

            // Reset form after submit
            setRating(0);
            setHoverRating(0);
            setComment("");
            setImages([]);
            setImagePreviews([]);
            setUserName("");
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    // Handle star rating hover
    const handleStarHover = (index) => {
        setHoverRating(index);
    };

    // Handle star rating click
    const handleStarClick = (index) => {
        setRating(index);
    };

    // Pagination control functions
    const nextPage = () => {
        if (currentPage * reviewsPerPage < totalReviews) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="review-section bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-10">
            <h2 className="text-3xl font-semibold text-gray-800 mb-5">
                Customer Reviews
            </h2>

            {/* Existing Reviews */}
            {reviews?.length > 0 ? (
                reviews?.map((review, idx) => (
                    <div
                        key={idx}
                        className="review-item bg-gray-100 p-4 mb-4 rounded-lg shadow"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="review-rating flex items-center">
                                {[...Array(Math.floor(review.rating))].map((_, i) => (
                                    <FaStar key={i} className="text-yellow-500" />
                                ))}
                                {review.rating % 1 !== 0 && <FaStarHalfAlt className="text-yellow-500" />}
                            </div>
                            <p className="text-gray-500">{review.userName}</p>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        {review?.images?.length > 0 && (
                            <div className="review-images flex space-x-2">
                                {review.images.map((img, idx) => (
                                    <Image
                                        key={idx}
                                        src={img}
                                        alt="Review image"
                                        width={100}
                                        height={100}
                                        className="rounded-lg"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No reviews yet.</p>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
                <button onClick={prevPage} disabled={currentPage === 1} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md">
                    Previous
                </button>
                <button onClick={nextPage} disabled={currentPage * reviewsPerPage >= totalReviews} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md">
                    Next
                </button>
            </div>

            {/* Review Form */}
            <form onSubmit={handleSubmit} className="review-form mt-5">
                <label className="block mb-3">
                    User Name:
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </label>

                {/* Star Rating Input */}
                <label className="block mb-3">
                    Rating:
                    <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                            <FaStar
                                key={index}
                                className={`cursor-pointer text-3xl ${index < (hoverRating || rating) ? "text-yellow-500" : "text-gray-400"}`}
                                onMouseEnter={() => handleStarHover(index + 1)}
                                onMouseLeave={() => handleStarHover(rating)}
                                onClick={() => handleStarClick(index + 1)}
                            />
                        ))}
                    </div>
                </label>

                <label className="block mb-3">
                    Comment:
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                </label>

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
                                className="hidden"
                            />
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

                <button type="submit" className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md">
                    Submit Review
                </button>
            </form>
        </div>
    );
};

export default ReviewSection;
