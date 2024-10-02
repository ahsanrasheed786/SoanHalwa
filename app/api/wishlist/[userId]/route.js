// File path: app/api/wishlist/[userId]/route.js

import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client

export async function GET(request, { params }) {
    const { userId } = params; // Get userId from URL parameters
    try {
        const wishlist = await prisma.wishlist.findMany({
            where: { userId: userId },
            include: { product: true }, // Include product details
        });
        return new Response(JSON.stringify(wishlist), { status: 200 });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return new Response(JSON.stringify({ error: "Error fetching wishlist" }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { userId } = params; // Get userId from URL parameters
    const { productId } = await request.json(); // Parse JSON body for productId
    try {
        await prisma.wishlist.deleteMany({
            where: {
                userId: userId,
                productId: productId,
            },
        });
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting wish item:", error);
        return new Response(JSON.stringify({ error: "Error deleting wish item" }), { status: 500 });
    }
}

// Method to delete all wish items for a specific user
export async function DELETE_ALL(request, { params }) {
    const { userId } = params; // Get userId from URL parameters
    try {
        await prisma.wishlist.deleteMany({
            where: {
                userId: userId,
            },
        });
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting wish items:", error);
        return new Response(JSON.stringify({ error: "Error deleting wish items" }), { status: 500 });
    }
}
