/* eslint-disable @typescript-eslint/no-namespace */

interface HttpHeader {
  name: string;
  value: string;
}
namespace NetworkRecordingModels {
  export interface INetworkRecording {
    url: string;
    type: string;
    tabId: number;
    method: string;
    frameId: number;
    frameType: string;
    initiator: string;
    requestId: string;
    timeStamp: number;
    documentId: string;
    statusCode: number;
    parentFrameId: number;
    requestHeaders: HttpHeader[];
    responseHeaders: HttpHeader[];
    documentLifecycle: string;
    startsAt: number;
  }
}

export { NetworkRecordingModels };
