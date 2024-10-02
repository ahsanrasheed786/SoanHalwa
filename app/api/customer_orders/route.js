// // File path: app/api/customer_orders/route.js

// import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client

// export async function POST(request) {
//   console.log("request comes on order booked")
//   try {
//     const {
//       name,
//       lastname,
//       phone,
//       email,
//       company,
//       adress,
//       apartment,
//       postalCode,
//       status,
//       city,
//       country,
//       orderNotice,
//       total,
//     } = await request.json(); // Parse JSON body

//     const corder = await prisma.customer_order.create({
//       data: {
//         name,
//         lastname,
//         phone,
//         email,
//         company,
//         adress,
//         apartment,
//         postalCode,
//         status,
//         city,
//         country,
//         orderNotice,
//         total,
//       },
//     });
//     return new Response(JSON.stringify(corder), { status: 201 });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return new Response(JSON.stringify({ error: "Error creating order" }), { status: 500 });
//   }
// }

// export async function GET() {
//   try {
//     const orders = await prisma.customer_order.findMany({});
//     return new Response(JSON.stringify(orders), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return new Response(JSON.stringify({ error: "Error fetching orders" }), { status: 500 });
//   }
// }
import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client

// export async function POST(request) {
//   console.log("request comes on order booked");
  
//   try {
//     const {
//       name,
//       lastname,
//       phone,
//       email,
//       company,
//       adress,
//       apartment,
//       postalCode,
//       status,
//       city,
//       country,
//       orderNotice,
//       total,
//       products
//     } = await request.json(); // Parse JSON body
//     // Input validation
//     if (!name || !lastname || !email || !phone) {
//       return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
//     }

//     const  order = await prisma.customer_order.create({
//       data: {
//         name,
//         lastname,
//         phone,
//         email,
//         company,
//         adress,
//         apartment,
//         postalCode,
//         status,
//         city,
//         country,
//         orderNotice,
//         total,
//         products:create: [products]
//       },
//     });
//     console.log(order)
//     return new Response(JSON.stringify( order), { status: 201 });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return new Response(JSON.stringify({ error: "Error creating order" }), { status: 500 });
//   }
// }
export async function POST(request) {
  console.log("request comes on order booked");
  
  try {
    const {
      name,
      lastname,
      phone,
      email,
      company,
      adress,
      apartment,
      postalCode,
      status,
      city,
      country,
      orderNotice,
      total,
      // products // Assuming this is an array of product objects
    } = await request.json(); // Parse JSON body

    // Input validation
    if (!name || !lastname || !email || !phone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const order = await prisma.customer_order.create({
      data: {
        name,
        lastname,
        phone,
        email,
        company,
        adress,
        apartment,
        postalCode,
        status,
        city,
        country,
        orderNotice,
        total,
        // products: {
        //   create: products.map(product => ({
        //     productId: product.id,
        //     quantity: product.amount,
        //   }))
        // }
      },
    });
    
    // console.log(order);
    return new Response(JSON.stringify(order), { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(JSON.stringify({ error: "Error creating order" }), { status: 500 });
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = 10; // Number of orders to fetch per page

  try {
    const orders = await prisma.customer_order.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(JSON.stringify({ error: "Error fetching orders" }), { status: 500 });
  }
}
