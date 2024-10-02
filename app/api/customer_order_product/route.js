// File path: app/api/orders/route.js

import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client
 
export async function POST(request) {
    try {
        const { customerOrderId, productId, quantity } = await request.json(); // Parse JSON body
        const order = await prisma.customer_order_product.create({
            data: {
                customerOrderId,
                productId,
                quantity,
            },
        });
        return new Response(JSON.stringify(order), { status: 201 });
    } catch (error) {
        console.error("Error creating product order:", error);
        return new Response(JSON.stringify({ error: "Error creating product order" }), { status: 500 });
    }
}

export async function GET() {
    try {
        const productOrders = await prisma.customer_order_product.findMany({
            select: {
                productId: true,
                quantity: true,
                customerOrder: {
                    select: {
                        id: true,
                        name: true,
                        lastname: true,
                        phone: true,
                        email: true,
                        company: true,
                        adress: true,
                        apartment: true,
                        postalCode: true,
                        dateTime: true,
                        status: true,
                        total: true,
                    },
                },
            },
        });

        const ordersMap = new Map();

        for (const order of productOrders) {
            const { customerOrder, productId, quantity } = order;
            const { id, ...orderDetails } = customerOrder;

            const product = await prisma.product.findUnique({
                where: { id: productId },
                select: {
                    id: true,
                    title: true,
                    mainImage: true,
                    price: true,
                    slug: true,
                },
            });

            if (ordersMap.has(id)) {
                ordersMap.get(id).products.push({ ...product, quantity });
            } else {
                ordersMap.set(id, {
                    customerOrderId: id,
                    customerOrder: orderDetails,
                    products: [{ ...product, quantity }],
                });
            }
        }

        const groupedOrders = Array.from(ordersMap.values());

        return new Response(JSON.stringify(groupedOrders), { status: 200 });
    } catch (error) {
        console.error("Error fetching all product orders:", error);
        return new Response(JSON.stringify({ error: "Error fetching all product orders" }), { status: 500 });
    }
}
