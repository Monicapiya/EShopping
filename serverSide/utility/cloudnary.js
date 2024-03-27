import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "serverSide/config/config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload_file = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      (result) => {
        resolve({
          public_id: result.public_id,
          url: result.url,
        });
      },
      {
        resource_type: "auto",
        folder,
      }
    );
  });
};

export const delete_file = async (file) => {
  try {
    const res = await cloudinary.v2.uploader.destroy(file);
    return res?.result === "ok"; // Returning boolean value directly
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    return false; // Return false in case of any error
  }
};
