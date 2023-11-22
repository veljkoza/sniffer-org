import { IRecordingController, MethodType } from '@sniffer/domain';
import { RequestFactoryType, createRequestFactory } from '../utils';

export interface IRecordingService {
  requestFactory: RequestFactoryType;
  generateUrl: MethodType<IRecordingController['generateUrl']>;
  getRecording: MethodType<IRecordingController['getRecording']>;
}
