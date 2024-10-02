// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// async function uploadMainImage(req, res) {
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).json({ message: "Nema otpremljenih fajlova" });
//     }
  
//     // Get file from a request
//     const uploadedFile = req.files.uploadedFile;
  
//     // Using mv method for moving file to the directory on the server
//     uploadedFile.mv('../public/' + uploadedFile.name, (err) => {
//       if (err) {
//         return res.status(500).send(err);
//       }
  
//       res.status(200).json({ message: "Fajl je uspešno otpremljen" });
//     });
//   }

//   module.exports = {
//     uploadMainImage
// };


// File path: app/api/upload/route.js

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Ensure the directory for uploads exists
const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(request) {
    const formData = await request.formData(); // Get form data from the request
    const uploadedFile = formData.get('uploadedFile'); // Access the uploaded file
 
    if (!uploadedFile || typeof uploadedFile === 'string') {
        return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const filePath = path.join(uploadDir, uploadedFile.name); // Define the file path

    // Move the file to the uploads directory
    const buffer = await uploadedFile.arrayBuffer(); // Convert to buffer
    fs.writeFileSync(filePath, Buffer.from(buffer)); // Write file to server

    return NextResponse.json({ message: "File uploaded successfully" }, { status: 200 });
}
