import axios from 'axios';
import { IRecordingService } from './IRecording.service';
import {
  MethodType,
  RecordingController,
  RecordingModels,
} from '@sniffer/domain';

const API_URL = 'https://sniffer-api.onrender.com';
console.log({ process: API_URL });

class RecordingService implements IRecordingService {
  generateUrl: MethodType<RecordingController['generateUrl']> = async (
    params
  ) => {
    const res = await axios.post<RecordingModels.GenerateUrl.IResponseDTO>(
      `${API_URL}/recording/generate-url`,
      params
    );

    return res.data;
  };
}

const recordingService = new RecordingService();

export { recordingService, RecordingService };
