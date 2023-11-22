import { RecordingService } from '../recording';

const frontendServicesFactory = (apiUrl: string) => {
  const recordingService = new RecordingService(apiUrl);
  const services = { recording: recordingService };

  return services;
};

export { frontendServicesFactory };
