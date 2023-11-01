export const generateS3BucketUrl = (key: string) => {
  const template = `https://${process.env['S3_BUCKET_NAME']}.s3.${process.env['AWS_REGION']}.amazonaws.com/${key}`;
  return template;
};
