// File path: app/api/users/[id]/route.js

import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client
import bcrypt from "bcryptjs"; // Import bcrypt for hashing passwords

export async function GET(request, { params }) {
    const { id } = params; // Get ID from URL parameters
    // console.log('backends'+id)
    try {
        const user = await prisma.user.findUnique({
            where: { email:id },
        });
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return new Response(JSON.stringify({ error: "Error fetching user" }), { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = params; // Get ID from URL parameters
    try {
        const { email, password, role } = await request.json(); // Parse JSON body
        const hashedPassword = await bcrypt.hash(password, 5);
        
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email,
                password: hashedPassword,
                role,
            },
        });

        return new Response(JSON.stringify(updatedUser), { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({ error: "Error updating user" }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params; // Get ID from URL parameters
    try {
        await prisma.user.delete({
            where: { id },
        });
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return new Response(JSON.stringify({ error: "Error deleting user" }), { status: 500 });
    }
}
