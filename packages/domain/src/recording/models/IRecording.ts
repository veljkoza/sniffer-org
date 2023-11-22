/* eslint-disable @typescript-eslint/no-namespace */
import { Recording } from '@sniffer/infrastructure';
import { NetworkRecordingModels } from '../../network-recording';

export namespace RecordingModels {
  export interface IRecording {
    screenRecording: string;
    networkRecording: NetworkRecordingModels.INetworkRecording;
  }

  export namespace CreateRecording {
    export interface IRequestDTO {
      screenRecording: string;
      networkRecording: NetworkRecordingModels.INetworkRecording[];
    }
    export interface IRepositoryPayload {
      screenRecording: string;
      networkRecording: NetworkRecordingModels.INetworkRecording[];
    }
    export type IResponseDTO = Recording;
  }

  export namespace GenerateUrl {
    export interface IRequestDTO {
      screenRecording: string;
      networkRecording: NetworkRecordingModels.INetworkRecording[];
    }
    export interface IRepositoryPayload {
      screenRecording: string;
      networkRecording: NetworkRecordingModels.INetworkRecording[];
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
    export interface IResponseDTO {
      id: string;
      screenRecording: string;
      networkRecording: NetworkRecordingModels.INetworkRecording[];
    }
  }
}
