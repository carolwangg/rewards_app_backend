import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';

let s3Client;
class awsS3Client {
    constructor(){
        dotenv.config();
        s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY
            }
        })
    }
    
    async putObject(file, filename){
        try{
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: filename,
                Body: file,
                ContentType: "image/jpg,jpeg,png",
            }
            const command = new PutObjectCommand(params);
            const data = await s3Client.send(command);
            
            if (data.$metadata.httpStatusCode != 200){
                return;
            }

            let url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`
            console.log(url)
            return {url: url, key: params.Key}
        }catch(err){
            console.error(err);
        }
    }

    async getObject(filename){
        try{
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: filename,
            }
            const command = new GetObjectCommand(params);
            const data = await s3Client.send(command);
            
            if (data.$metadata.httpStatusCode != 200){
                return;
            }
            console.log(data)
            return data
        }catch(err){
            console.error(err);
        }
    }

    async deleteObject(filename){
        try{
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: filename,
            }
            const command = new DeleteObjectCommand(params);
            const data = await s3Client.send(command);
            console.log(data)
            if (data.$metadata.httpStatusCode != 204){
                return;
            }
            console.log(data)
            return data
        }catch(err){
            console.error(err);
        }
    }
}

// import { readFile } from "node:fs/promises";
// const file = await readFile("C:\\Users\\Public\\text_qrcodecreator.com_21_05_48.png");
// const client = new awsS3Client();
// client.deleteObject("images/reward-4c7f3399-0c31-44b2-88b4-584bacdf7a71");

// import { randomUUID } from "node:crypto";
// import { readFile } from "node:fs/promises";
// const file = await readFile("C:\\Users\\Public\\text_qrcodecreator.com_21_05_48.png");
// const client = new awsS3Client();
// const result = await client.putObject(file, `images/reward-${randomUUID()}`);
// console.log(result);
// try{const client = new awsS3Client();
//     try{
//  const file = await readFile("C:\\Users\\Public\\text_qrcodecreator.com_21_05_48.png")
//  try{client.putObject(file, "images\\helloworld");
//  }catch(err){console.error("error uploading file: "+err)}
// }catch(err){
//     console.error("errore loading file: "+err)
// }
// }catch(err){console.error("error creating awsclient: "+err)}

export default new awsS3Client();