// File path: app/api/products/route.js

import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client

export async function GET(request) {
    const mode = request.url.includes("mode=admin") ? "admin" : "";
    
    if (mode === "admin") {
        try {
            const adminProducts = await prisma.product.findMany({});
            return new Response(JSON.stringify(adminProducts), { status: 200 });
        } catch (error) {
            return new Response(JSON.stringify({ error: "Error fetching products" }), { status: 500 });
        }
    } else {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page")) || 1;
        let filterObj = {};
        let sortObj = {};
        let sortByValue = url.searchParams.get("sort") || "defaultSort";

        // Handle filters and sorting
        // (Add your filtering logic similar to the original code here)

        let products;
        if (Object.keys(filterObj).length === 0) {
            products = await prisma.product.findMany({
                skip: (page - 1) * 10,
                take: 12,
                include: { category: { select: { name: true } } },
                orderBy: sortObj,
            });
        } else {
            products = await prisma.product.findMany({
                skip: (page - 1) * 10,
                take: 12,
                where: filterObj,
                include: { category: { select: { name: true } } },
                orderBy: sortObj,
            });
        }

        return new Response(JSON.stringify(products), { status: 200 });
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
