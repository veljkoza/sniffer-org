import { appDataSource, AWS } from "@sniffer/infrastructure";
import { Recording } from "@sniffer/infrastructure";
import { IRecordingRepository } from "./IRecording.repository";
import { MethodType } from "../../utils";
import { Repository } from "typeorm";

export class RecordingRepository implements IRecordingRepository {
  dataSource: Repository<Recording>;

  constructor(
    dataSource: Repository<Recording> = appDataSource.getRepository(Recording)
  ) {
    this.dataSource = dataSource;
  }
  createRecording: MethodType<IRecordingRepository["createRecording"]> = async (
    params
  ) => {
    const s3Result = await AWS.uploadBase64VideoToS3(params.screenRecording);
    if (!s3Result?.url) throw new Error("Upload to S3 failed");

    const recording = this.dataSource.create({
      networkRecording: params.networkRecording,
      screenRecording: s3Result?.url,
    });
    const result = await this.dataSource.save(recording);

    return result;
  };

  getRecording: MethodType<IRecordingRepository["getRecording"]> = (params) => {
    const recording = this.dataSource.findOneOrFail({
      where: {
        id: params.id,
      },
    });

    return recording;
  };
}
