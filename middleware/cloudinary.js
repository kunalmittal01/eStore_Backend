import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({ 
    cloud_name: 'dwhi3vv7k', 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret 
});

export const uploadImage = async(file) => {
    const response = await new Promise((resolve, reject)=>{
        const uploader = cloudinary.uploader.upload_stream(
            {folder: 'jobs'},
            (err, res)=>{
                if(err) reject(err);
                else resolve(res);
            }
        )
        uploader.end(file.buffer);
    })
    return response.secure_url;
}