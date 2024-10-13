import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client

// GET: Fetch reviews for a specific product
// export async function GET(req, { params }) {
//     const { productId } = params;
// // console.log("for testing product id"+productId)
//     try {
//         // Fetch reviews for the given productId
//         const reviews = await prisma.review.findMany({
//             where: { productId },
//             // include: {
//                 // user: true,  
//             // },
//         });

//         return new Response(JSON.stringify(reviews), { status: 200 });
//     } catch (error) {
//         console.error("Error fetching reviews:", error);
//         return new Response(JSON.stringify({ error: "Error fetching reviews" }), { status: 500 });
//     }
// }
export async function GET(req, { params }) {
  const { productId } = params;
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page")) || 1; // Get the page number from query parameters
  const limit = parseInt(url.searchParams.get("limit")) || 10; // Get the limit from query parameters
  const skip = (page - 1) * limit; // Calculate the offset for the query

  try {
      // Fetch reviews for the given productId with pagination
      const reviews = await prisma.review.findMany({
          where: { productId },
          skip, // Skip the number of reviews based on the current page
          take: limit, // Limit the number of reviews fetched
          // include: {
          //     user: true,  
          // },
      });

      // Fetch the total count of reviews to calculate total pages
      const totalReviews = await prisma.review.count({
          where: { productId },
      });

      // Respond with reviews and total count
      return new Response(JSON.stringify({ reviews, totalReviews }), { status: 200 });
  } catch (error) {
      console.error("Error fetching reviews:", error);
      return new Response(JSON.stringify({ error: "Error fetching reviews" }), { status: 500 });
  }
}

export async function POST(request,{ params }) {
        const { productId } = params;

    // console.log("for testing product id"+productId)

    try {
      // Parse the JSON request body
      let {  userId, userName, rating, comment, images } = await request.json();
//    userId='admin'
      // Validate input
      if (!productId || !userId || !rating) {
        return new Response(
          JSON.stringify({ error: "Product ID, User ID, and Rating are required." }),
          { status: 400 }
        );
      }
  
      // Validate rating
      if (rating < 1 || rating > 5) {
        return new Response(
          JSON.stringify({ error: "Rating must be between 1 and 5." }),
          { status: 400 }
        );
      }
  
      // Create review
      const newReview = await prisma.review.create({
        data: {
          productId,
          userId,
          rating,
          comment,
          userName,
          images: images || [],
        },
      });
  
      return new Response(JSON.stringify(newReview), { status: 201 });
    } catch (error) {
      console.error("Error creating review:", error);
      return new Response(JSON.stringify({ error: "Error creating review" }), {
        status: 500,
      });
    }
  }
  