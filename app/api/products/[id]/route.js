// File path: app/api/products/[id]/route.js

import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client

export async function GET(request, { params }) {
    const { id } = params; // Get ID from URL parameters
    console.log(id)
    try {
        const product = await prisma.product.findUnique({
            where: { slug:id },
            // include: { category: true },
        });
        if (!product) {
            return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(product), { status: 200 });
    } catch (error) {
        console.error("Error fetching product:", error);
        return new Response(JSON.stringify({ error: "Error fetching product" }), { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = params; // Get ID from URL parameters
    try {
        const {
            slug,
            title,
            mainImage,
            price,
            rating,
            description,
            manufacturer,
            categoryId,
            inStock,
        } = await request.json(); // Parse JSON body

        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                slug,
                title,
                mainImage,
                price,
                rating,
                description,
                manufacturer,
                categoryId,
                inStock,
            },
        });

        return new Response(JSON.stringify(updatedProduct), { status: 200 });
    } catch (error) {
        console.error("Error updating product:", error);
        return new Response(JSON.stringify({ error: "Error updating product" }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params; // Get ID from URL parameters
    try {
        // Check for related records in the customer_order_product table
        const relatedOrderProductItems = await prisma.customer_order_product.findMany({
            where: { productId: id },
        });
        if (relatedOrderProductItems.length > 0) {
            return new Response(JSON.stringify({ error: 'Cannot delete product due to foreign key constraint.' }), { status: 400 });
        }

        await prisma.product.delete({
            where: { id },
        });
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting product:", error);
        return new Response(JSON.stringify({ error: "Error deleting product" }), { status: 500 });
    }
}

// Method for searching products
export async function searchProducts(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    if (!query) {
        return new Response(JSON.stringify({ error: "Query parameter is required" }), { status: 400 });
    }

    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { description: { contains: query } },
                ],
            },
        });
        return new Response(JSON.stringify(products), { status: 200 });
    } catch (error) {
        console.error("Error searching products:", error);
        return new Response(JSON.stringify({ error: "Error searching products" }), { status: 500 });
    }
}
