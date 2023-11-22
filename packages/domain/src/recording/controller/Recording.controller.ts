import { MethodType } from '../../utils';
import { IRecordingRepository } from '../repository/IRecording.repository';
import { RecordingRepository } from '../repository/Recording.repository';
import { IRecordingController } from './IRecording.controller';

export class RecordingController implements IRecordingController {
  recordingRepository: IRecordingRepository;

  constructor(
    recordingRepository: IRecordingRepository = new RecordingRepository()
  ) {
    this.recordingRepository = recordingRepository;
  }
  generateUrl: MethodType<IRecordingController['generateUrl']> = async (
    params
  ) => {
    const WEB_APP_URL = process.env['NX_WEB_APP_URL'];
    const recording = await this.recordingRepository.createRecording(params);
    const url = `${WEB_APP_URL}/recording/${recording.id}`;
    return { url };
  };

  createRecording: MethodType<IRecordingController['createRecording']> = async (
    params
  ) => {
    const recording = await this.recordingRepository.createRecording(params);
    return recording;
  };

  getRecording: MethodType<IRecordingController['getRecording']> = async (
    params
  ) => {
    const recording = await this.recordingRepository.getRecording(params);
    return recording;
  };
}
