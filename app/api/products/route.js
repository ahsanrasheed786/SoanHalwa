 
import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client
 
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
    const { slug, title, price, description, manufacturer, categoryId, inStock, variants, additionalItems, additionalImages } = await request.json();
     const existingProduct = await prisma.product.findUnique({
      where: { slug }
    });

    if (existingProduct) {
      return new Response(JSON.stringify({ error: "Slug already in use, please choose another" }), { status: 400 });
    }

    // Create the product if slug is unique
    const product = await prisma.product.create({
      data: {
        slug, title, mainImage:additionalImages[0].url, price, rating: 5, description, manufacturer, categoryId, inStock,
        variants: { create: variants },
        additionalItems: { create: additionalItems },
         images: {
          create: additionalImages.map(image => ({
            url: image.url,
            alt: image.alt,
            caption: image.caption,
            public_id: image.public_id,   
          })),
        },
      },
    });

    return new Response(JSON.stringify(product), { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return new Response(JSON.stringify({ error: "Error creating product" }), { status: 500 });
  }
}
