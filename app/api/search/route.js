// File path: app/api/products/search/route.js

import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query'); // Get the query parameter

    if (!query) {
        return new Response(JSON.stringify({ error: "Query parameter is required" }), { status: 400 });
    }

    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { description: { contains: query } },
                ],
            },
        });

        return new Response(JSON.stringify(products), { status: 200 });
    } catch (error) {
        console.error("Error searching products:", error);
        return new Response(JSON.stringify({ error: "Error searching products" }), { status: 500 });
    }
}
