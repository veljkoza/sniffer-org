import axios from "axios";
import { RecordingModels } from "./IRecording";
import { IRecordingService } from "./IRecording.service";

class RecordingService implements IRecordingService {
  async createRecording(
    params: RecordingModels.CreateRecording.IRequestDTO
  ): Promise<{ url: string }> {
    const res = await axios.post<{ url: string }>(
      "http://localhost:4000/recording/generate-url",
      params
    );

    return res.data;
  }
}

const recordingService = new RecordingService();

export { recordingService, RecordingService };
