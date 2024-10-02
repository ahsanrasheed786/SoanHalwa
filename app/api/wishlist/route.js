// File path: app/api/wishlist/route.js

import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client

export async function GET(request) {
    try {
        const wishlist = await prisma.wishlist.findMany({
            include: {
                product: true, // Include product details
            },
        });
        return new Response(JSON.stringify(wishlist), { status: 200 });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return new Response(JSON.stringify({ error: "Error fetching wishlist" }), { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { userId, productId } = await request.json(); // Parse JSON body

        const wishItem = await prisma.wishlist.create({
            data: {
                userId,
                productId,
            },
        });
        return new Response(JSON.stringify(wishItem), { status: 201 });
    } catch (error) {
        console.error("Error creating wish item:", error);
        return new Response(JSON.stringify({ error: "Error creating wish item" }), { status: 500 });
    }
}
