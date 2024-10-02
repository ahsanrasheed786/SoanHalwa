// File path: app/api/products/route.js

import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client

// export async function GET(request) {
//     const mode = request.url.includes("mode=admin") ? "admin" : "";
    
//     if (mode === "admin") {
//         try {
//             const adminProducts = await prisma.product.findMany({});
//             return new Response(JSON.stringify(adminProducts), { status: 200 });
//         } catch (error) {
//             return new Response(JSON.stringify({ error: "Error fetching products" }), { status: 500 });
//         }
//     } else {
//         const url = new URL(request.url);
//         const page = Number(url.searchParams.get("page")) || 1;
//         let filterObj = {};
//         let sortObj = {};
//         let sortByValue = url.searchParams.get("sort") || "defaultSort";

//         // Handle filters and sorting
//         // (Add your filtering logic similar to the original code here)

//         let products;
//         if (Object.keys(filterObj).length === 0) {
//             products = await prisma.product.findMany({
//                 skip: (page - 1) * 10,
//                 take: 12,
//                 include: { category: { select: { name: true } } },
//                 orderBy: sortObj,
//             });
//         } else {
//             products = await prisma.product.findMany({
//                 skip: (page - 1) * 10,
//                 take: 12,
//                 where: filterObj,
//                 include: { category: { select: { name: true } } },
//                 orderBy: sortObj,
//             });
//         }

//         return new Response(JSON.stringify(products), { status: 200 });
//     }
// }
 
export async function GET(request) {
  const mode = request.url.includes("mode=admin") ? "admin" : "";
  
  if (mode === "admin") {
    // Admin mode: Fetch all products without pagination or filters
    try {
      const adminProducts = await prisma.product.findMany({});
      return new Response(JSON.stringify(adminProducts), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Error fetching products" }), { status: 500 });
    }
  } else {
    // User mode: Handle pagination, filtering, and sorting
    // /api/products?page=2
    // /api/products?category=Electronics
    // /api/products?sort=price_asc
    // /api/products?sort=price_desc
// /api/products?minPrice=100&maxPrice=1000
// /api/products?page=2&category=Electronics&sort=price_desc&minPrice=100&maxPrice=500

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = 12; // Set the number of products per page
    
    // Initialize filter and sort objects
    let filterObj = {};
    let sortObj = {};

    // Add sorting logic (you can expand on this based on your requirements)
    const sortByValue = url.searchParams.get("sort");
    switch (sortByValue) {
      case "price_asc":
        sortObj = { price: "asc" };
        break;
      case "price_desc":
        sortObj = { price: "desc" };
        break;
      case "rating":
        sortObj = { rating: "desc" };
        break;
      default:
        sortObj = { title: "asc" }; // Default sorting by title (modify as needed)
    }

    // Add filtering logic (e.g., category, price range, etc.)
    const category = url.searchParams.get("category");
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");

    if (category) {
      filterObj.category = { name: category };
    }

    if (minPrice || maxPrice) {
      filterObj.price = {};
      if (minPrice) filterObj.price.gte = Number(minPrice);
      if (maxPrice) filterObj.price.lte = Number(maxPrice);
    }

    // Fetch products with pagination, filters, and sorting
    try {
      const products = await prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: filterObj,
        // include: { category: { select: { name: true } } }, 
        orderBy: sortObj,
      });

      return new Response(JSON.stringify(products), { status: 200 });
    } catch (error) {
      console.error("Error fetching products:", error);
      return new Response(JSON.stringify({ error: "Error fetching products" }), { status: 500 });
    }
  }
}


export async function POST(request) {
    try {
        const {
            slug,
            title,
            mainImage,
            price,
            description,
            manufacturer,
            categoryId,
            inStock,
        } = await request.json(); // Parse JSON body

        const product = await prisma.product.create({
            data: {
                slug,
                title,
                mainImage,
                price,
                rating: 5,
                description,
                manufacturer,
                categoryId,
                inStock,
            },
        });
        return new Response(JSON.stringify(product), { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return new Response(JSON.stringify({ error: "Error creating product" }), { status: 500 });
    }
}
