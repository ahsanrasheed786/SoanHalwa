 
import { v2 as cloudinary } from 'cloudinary';
  
// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  }); 
  
// Disable bodyParser for the API route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to stream file uploads to Cloudinary
function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer); // Send file buffer to Cloudinary
  });
}

// Actual API handler
export async function POST(req) {
  const formData = await req.formData();
  const files = formData.getAll('files');

  if (!files || files.length === 0) {
    return new Response(JSON.stringify({ message: 'No images provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Array of promises to upload each file to Cloudinary
    const uploadPromises = files.map(async (file) => {
      const fileBuffer = Buffer.from(await file.arrayBuffer()); // Convert file to buffer
      return uploadToCloudinary(fileBuffer); // Upload buffer to Cloudinary
    });

    const uploadResults = await Promise.all(uploadPromises);

    return new Response(JSON.stringify({ message: 'Images uploaded successfully', data: uploadResults }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Upload failed', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
