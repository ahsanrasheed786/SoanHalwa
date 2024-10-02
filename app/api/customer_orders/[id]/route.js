// File path: app/api/orders/[id]/route.js

import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client

export async function GET(request, { params }) {
  const { id } = params; // Get ID from URL parameters
  try {
    const order = await prisma.customer_order.findUnique({
      where: { id },
    });
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return new Response(JSON.stringify({ error: "Error fetching order" }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params; // Get ID from URL parameters
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
      dateTime,
      status,
      city,
      country,
      orderNotice,
      total,
    } = await request.json(); // Parse JSON body

    const existingOrder = await prisma.customer_order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    const updatedOrder = await prisma.customer_order.update({
      where: { id: existingOrder.id },
      data: {
        name,
        lastname,
        phone,
        email,
        company,
        adress,
        apartment,
        postalCode,
        dateTime,
        status,
        city,
        country,
        orderNotice,
        total,
      },
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
    await prisma.customer_order.delete({
      where: { id },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting order:", error);
    return new Response(JSON.stringify({ error: "Error deleting order" }), { status: 500 });
  }
}
