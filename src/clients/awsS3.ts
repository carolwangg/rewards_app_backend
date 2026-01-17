import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import * as dotenv from 'dotenv';
import { FILES_FOLDER_URL } from "../constants.js";
import e from "express";

/**
 * AWS S3 client for file storage operations (only pictures in v0.1.0).
 */
class awsS3Client {
    #s3Client: S3Client;
    constructor(){
        dotenv.config();
        const s3ClientConfig: any = {
            region: process.env.AWS_REGION as string,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY as string,
                secretAccessKey: process.env.AWS_SECRET_KEY as string
            }
        };
        this.#s3Client = new S3Client(s3ClientConfig);
    }

    async putObject(file: Buffer, key: string){
        if (process.env.TEST === "true"){
            const url = `${FILES_FOLDER_URL}/${key}`;
            await fs.writeFile(url, file, (err=>{
                if (err) {
                    console.error("Error writing file: "+err);
                }
            }));
            const params = {
                Key: key,
            
            }
            return {url: url, key: params.Key}
        }

        try{
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
                Body: file,
                ContentType: "image/jpg,jpeg,png",
            }
            const command = new PutObjectCommand(params);
            const data = await this.#s3Client.send(command);
            
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

    async getObject(key: string){
        try{
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
            }
            const command = new GetObjectCommand(params);
            const data = await this.#s3Client.send(command);
            
            if (data.$metadata.httpStatusCode != 200){
                return;
            }
            console.log(data)
            return data
        }catch(err){
            console.error(err);
        }
    }

    async deleteObject(key: string){
        try{
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
            }
            const command = new DeleteObjectCommand(params);
            const data = await this.#s3Client.send(command);
            console.log(data)
            if (data.$metadata.httpStatusCode != 204){
                console.error("Some error occurred (status not 204)");
                return;
            }
            console.log(data)
            return data
        }catch(err){
            console.error(err);
        }
    }

    makeFolder(folderName: string){
        if (process.env.TEST === "true"){
            const url = `../files/${folderName}`;
            fs.mkdir(url, { recursive: true }, (err) => {
            if (err) {
            console.error('Error creating folder:', err);
            } else {
            console.log('Folder created successfully!');
            }
            });
        }       
    }
    
    getKeyFromUrl(url: string): string {
        const url_split = url.split('amazonaws.com/');
        if (url_split.length === 0){
            throw new Error("URL format incorrect (amazonaws.com/ expected): "+url);
        }

        return url_split[1]; // Remove leading '/'
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