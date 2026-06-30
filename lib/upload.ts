import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3";

export async function uploadFileToS3(base64Data: string, fileName: string): Promise<string> {
  const buffer = Buffer.from(base64Data, "base64");
  const bucketName = process.env.R2_BUCKET_NAME || "pos-mentai";

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: "image/jpeg"
    })
  );

  const publicUrl = process.env.R2_PUBLIC_URL || `https://${bucketName}.r2.cloudflarestorage.com`;
  return `${publicUrl}/${fileName}`;
}
