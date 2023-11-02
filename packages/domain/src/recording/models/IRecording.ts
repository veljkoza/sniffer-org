/* eslint-disable @typescript-eslint/no-namespace */
import { Recording } from '@sniffer/infrastructure';

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
    export type IResponseDTO = Recording;
  }

  export namespace GenerateUrl {
    export interface IRequestDTO {
      screenRecording: string;
      networkRecording: any;
    }
    export interface IRepositoryPayload {
      screenRecording: string;
      networkRecording: any;
    }
    export interface IResponseDTO {
      url: string;
    }
  }

  export namespace GetRecording {
    export interface IRequestDTO {
      [k: string]: any;
      id: string;
    }
    export type IResponseDTO = Recording;
  }
}
