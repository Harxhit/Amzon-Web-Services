import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

async function listBuckets() {
  try {
    const result = await s3.send(new ListBucketsCommand({}));
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

listBuckets();
