export namespace RecordingModels {
  export interface IRecording {
    screenRecording: string;
    networkRecording: any;
  }

  export namespace CreateRecording {
    export interface IRequestDTO {
      screenRecording: string;
      networkRecording: any;
    }
    export interface IRepositoryPayload {
      screenRecording: string;
      networkRecording: any;
    }
    export interface IResponseDTO extends IRecording {}
  }
}
