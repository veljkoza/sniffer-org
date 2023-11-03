import { createRequestFactory } from '../utils';
import { IRecordingService } from './IRecording.service';
import {
  IRecordingController,
  MethodType,
  RecordingModels,
} from '@sniffer/domain';

const recordingRequestFactory = createRequestFactory('/recording');

class RecordingService implements IRecordingService {
  generateUrl: MethodType<IRecordingController['generateUrl']> = async (
    params
  ) => {
    const res =
      await recordingRequestFactory<RecordingModels.GenerateUrl.IResponseDTO>({
        url: '/generate-url',
        body: params,
        method: 'post',
      });

    // const res2 = await http.post<RecordingModels.GenerateUrl.IResponseDTO>(
    //   '/recording/generate-url',
    //   params
    // );

    return res.data;
  };
  getRecording: MethodType<IRecordingController['getRecording']> = async (
    params
  ) => {
    const res =
      await recordingRequestFactory<RecordingModels.GetRecording.IResponseDTO>({
        url: `/get/${params.id}`,
      });
    // const res = await http.get<RecordingModels.GetRecording.IResponseDTO>(
    //   `/recording/get/${params.id}`
    // );

    return res.data;
  };
}

const recordingService = new RecordingService();

export { recordingService, RecordingService };
