// File path: app/api/orders/[id]/route.js

import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client

export async function GET(request, { params }) {
    const { id } = params; // Get ID from URL parameters
    try {
        const orders = await prisma.customer_order_product.findMany({
            where: {
                customerOrderId: id, // Use customerOrderId for searching
            },
            include: {
                product: true, // Including information about a product for response
            },
        });

        if (orders.length === 0) {
            return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(orders), { status: 200 });
    } catch (error) {
        console.error("Error fetching product order:", error);
        return new Response(JSON.stringify({ error: "Error fetching product order" }), { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = params; // Get ID from URL parameters
    try {
        const { customerOrderId, productId, quantity } = await request.json(); // Parse JSON body

        const existingOrder = await prisma.customer_order_product.findUnique({
            where: { id },
        });

        if (!existingOrder) {
            return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
        }

        const updatedOrder = await prisma.customer_order_product.update({
            where: { id: existingOrder.id },
            data: { customerOrderId, productId, quantity },
        });

        return new Response(JSON.stringify(updatedOrder), { status: 200 });
    } catch (error) {
        console.error("Error updating order:", error);
        return new Response(JSON.stringify({ error: "Error updating order" }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params; // Get ID from URL parameters
    try {
        await prisma.customer_order_product.deleteMany({
            where: { customerOrderId: id },
        });
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting product orders:", error);
        return new Response(JSON.stringify({ error: "Error deleting product orders" }), { status: 500 });
    }
}
