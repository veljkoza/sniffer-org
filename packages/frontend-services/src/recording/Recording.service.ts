import { RequestFactoryType, createRequestFactory } from '../utils';
import { IRecordingService } from './IRecording.service';
import {
  IRecordingController,
  MethodType,
  RecordingModels,
} from '@sniffer/domain';

// const recordingRequestFactory = createRequestFactory('/recording');
class RecordingService implements IRecordingService {
  requestFactory: RequestFactoryType;
  constructor(apiUrl: string) {
    this.requestFactory = createRequestFactory(`${apiUrl}/recording`);
  }

  generateUrl: MethodType<IRecordingController['generateUrl']> = async (
    params
  ) => {
    const res =
      await this.requestFactory<RecordingModels.GenerateUrl.IResponseDTO>({
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
      await this.requestFactory<RecordingModels.GetRecording.IResponseDTO>({
        url: `/get/${params.id}`,
      });

    const sortedNetworkRequests = res.data.networkRecording.sort((a, b) =>
      a.startsAt < b.startsAt ? -1 : 1
    );
    // const res = await http.get<RecordingModels.GetRecording.IResponseDTO>(
    //   `/recording/get/${params.id}`
    // );

    res.data.networkRecording = sortedNetworkRequests;

    return res.data;
  };
}

export { RecordingService };
