import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import * as dotenv from 'dotenv';

/**
 * AWS S3 client for file storage operations (only pictures in v0.1.0).
 */
class awsS3Client {
    #s3Client: S3Client;
    constructor(){
        dotenv.config();
        const s3ClientConfig: S3ClientConfig = {
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY as string,
                secretAccessKey: process.env.AWS_SECRET_KEY as string
            }
        };
        this.#s3Client = new S3Client(s3ClientConfig);
    }

    async putObject(file: Buffer, filename: string){
        try{
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: filename,
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

    async getObject(filename: string){
        try{
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: filename,
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

    async deleteObject(filename: string){
        try{
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: filename,
            }
            const command = new DeleteObjectCommand(params);
            const data = await this.#s3Client.send(command);
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