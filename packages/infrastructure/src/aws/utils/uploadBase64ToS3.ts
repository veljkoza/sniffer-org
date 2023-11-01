import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3 } from '../S3/S3';
import { generateS3BucketUrl } from './generateS3BucketFromUrl';

export const uploadBase64VideoToS3 = async (base64: string) => {
  const base64Data = base64.replace(/^data:video\/webm;base64,/, '');

  const decodedData = Buffer.from(base64Data, 'base64');
  const rand = Math.random().toString().substring(2, 8); // 60502138
  const key = `recording_${rand}.webm`;
  const uploadParams = {
    Bucket: process.env['S3_BUCKET_NAME'],
    Key: key,
    Body: decodedData,
    ContentType: 'video/webm',
  };

  try {
    const data = await S3.send(new PutObjectCommand(uploadParams));
    console.log('Image uploaded successfully:', data);
    return { url: generateS3BucketUrl(key) };
  } catch (error) {
    console.log('Error uploading image:', error);
  }
};
