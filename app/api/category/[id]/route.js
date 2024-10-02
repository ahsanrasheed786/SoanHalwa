// File path: app/api/categories/[id]/route.js

import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client
 
export async function GET(request, { params }) {
  const { id } = params; // Get ID from URL parameters
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      return new Response(JSON.stringify({ error: "Category not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return new Response(JSON.stringify({ error: "Error fetching category" }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params; // Get ID from URL parameters
  try {
    const { name } = await request.json(); // Parse JSON body
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });
    return new Response(JSON.stringify(updatedCategory), { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return new Response(JSON.stringify({ error: "Error updating category" }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params; // Get ID from URL parameters
  try {
    await prisma.category.delete({
      where: { id },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return new Response(JSON.stringify({ error: "Error deleting category" }), { status: 500 });
  }
}
