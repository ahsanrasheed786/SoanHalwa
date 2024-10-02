// File path: app/api/users/route.js

import prisma from "@/utils/connect"; // Ensure this connects to your Prisma client
import bcrypt from "bcryptjs"; // Import bcrypt for hashing passwords

export async function GET(request) {
    try {
        const users = await prisma.user.findMany({});
        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(JSON.stringify({ error: "Error fetching users" }), { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { email, password, role } = await request.json(); // Parse JSON body
        const hashedPassword = await bcrypt.hash(password, 5);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
            },
        });
        return new Response(JSON.stringify(user), { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return new Response(JSON.stringify({ error: "Error creating user" }), { status: 500 });
    }
}
