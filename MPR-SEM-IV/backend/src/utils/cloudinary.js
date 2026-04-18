import {v2 as cloudinary} from "cloudinary";
import fs from "fs"
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFileonCloudinary= async (localfilepath)=>{
    try {
        if(!localfilepath) return null;
        const response= await cloudinary.uploader.upload(localfilepath,{
            resource_type: "auto"
        })
        //file has been successfully uploaded 
        console.log("file has been uploaded on cloudinary",response.url);
        fs.unlinkSync(localfilepath)
        return response;
    } catch (error) {
        console.log("Cloudinary Upload Error:", error);  
        fs.unlinkSync(localfilepath) //remove the file that has been temporarily stored as 
        //the upload failed
        return null
    }
}

export {uploadFileonCloudinary};


//this file is used when we have to upload the temporary stored local file path on cloudinary
//so here we assume that the local file path has already been uploaded temporarily on the server