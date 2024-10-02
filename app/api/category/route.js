// File path: app/api/categories/route.js

import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client
 
export async function POST(request) {
   try {
    const { name, slug } = await request.json();  
    const upperCasedName = name.toUpperCase();
    const category = await prisma.category.create({
      data: { 
        name:upperCasedName, 
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),   
      },
    });
    return new Response(JSON.stringify(category), { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return new Response(JSON.stringify({ error: "Error creating category" }), { status: 500 });
  }
}


export async function GET() { 
  try {
    const categories = await prisma.category.findMany({});
     return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new Response(JSON.stringify({ error: "Error fetching categories" }), { status: 500 });
  }
}
