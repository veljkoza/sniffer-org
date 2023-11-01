import { RecordingModels } from "../models/IRecording";
import { appDataSource } from "@sniffer/infrastructure";

export interface IRecordingRepository {
  dataSource: ReturnType<(typeof appDataSource)["getRepository"]>;
  createRecording(
    params: RecordingModels.CreateRecording.IRepositoryPayload
  ): Promise<RecordingModels.CreateRecording.IResponseDTO>;

  getRecording(
    params: RecordingModels.GetRecording.IRequestDTO
  ): Promise<RecordingModels.GetRecording.IResponseDTO>;
}
