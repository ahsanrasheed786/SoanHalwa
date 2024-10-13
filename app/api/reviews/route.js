import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client

// POST request to create a review
export async function POST(request) {
    try {
        // Parse request body
        const { productId, userId, rating, comment, images } = await request.json();

        // Check for required fields
        if (!productId || !userId || !rating) {
            return new Response(JSON.stringify({ error: "Product ID, User ID, and Rating are required." }), { status: 400 });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return new Response(JSON.stringify({ error: "Rating must be between 1 and 5." }), { status: 400 });
        }

        // Create the review in the database
        const newReview = await prisma.review.create({
            data: {
                productId,
                userId,
                rating,
                comment,
                images: images || [], // Store images as an array in JSON format, default to an empty array if none provided
            },
        });

        // Return success response
        return new Response(JSON.stringify(newReview), { status: 201 });
    } catch (error) {
        console.error("Error creating review:", error);
        return new Response(JSON.stringify({ error: "Error creating review" }), { status: 500 });
    }
}
