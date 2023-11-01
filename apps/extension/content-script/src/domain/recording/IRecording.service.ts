import { RecordingModels } from "./IRecording";

export interface IRecordingService {
  createRecording(
    params: RecordingModels.CreateRecording.IRequestDTO
  ): Promise<{ url: string }>;
}
