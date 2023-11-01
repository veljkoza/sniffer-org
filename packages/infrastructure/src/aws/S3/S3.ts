import { S3Client } from "@aws-sdk/client-s3";

const S3 = new S3Client({ region: "eu-north-1" });
export { S3 };
