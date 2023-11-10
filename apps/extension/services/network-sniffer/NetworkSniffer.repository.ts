import { ITimer } from '../timer/ITimer';
import { Timer } from '../timer/Timer';

export class NetworkSnifferRepository {
  isRecording = false;
  requests = [] as any[];
  requestsMap: { [k: string]: any } = {};
  timer: ITimer;
  constructor(timer: ITimer = new Timer()) {
    this.timer = timer;
  }

  #arrayBufferToString = (buffer: BufferSource) => {
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(buffer);
  };

  arrayBufferToJson = (buffer: BufferSource) => {
    try {
      return JSON.parse(this.#arrayBufferToString(buffer));
    } catch (error) {}
  };

  onBeforeRequest = (details: any) => {
    this.requests.push(details.url);
    const startsAt = this.timer.getElapsedTime();
    console.log('UUUIP', { startsAt });
    console.log({ startsAt });
    details.startsAt = startsAt;

    this.requestsMap[details.requestId] = details;
    console.log({ requests: this.requestsMap });

    if (
      details.method === 'POST' &&
      details.requestBody &&
      details.requestBody.raw &&
      details.requestBody.raw[0]
    ) {
      const buffer = details.requestBody.raw[0].bytes;
      if (buffer) {
        const jsonBody = this.arrayBufferToJson(buffer);
        this.requestsMap[details.requestId].requestBody = jsonBody;
      }
    }
    // Limit stored this.requests for simplicity
    if (this.requests.length > 50) {
      this.requests.shift();
    }
  };

  onSendHeaders = (details: any) => {
    this.requestsMap[details.requestId].requestHeaders = details.requestHeaders;
  };

  onHeadersReceived = (details: any) => {
    const responseHeaders = details.responseHeaders;
    setTimeout(() => {
      this.requestsMap[details.requestId].responseHeaders = responseHeaders;
    }, 200);
  };

  onCompleted = (details: any) => {
    this.requestsMap[details.requestId].statusCode = details.statusCode;
    this.requestsMap[details.requestId].responseHeaders =
      details.responseHeaders;
  };

  onErrorOccurred = (details: any) => {
    this.requestsMap[details.requestId].statusCode = details.statusCode;
    this.requestsMap[details.requestId].responseHeaders =
      details.responseHeaders;
  };

  startRecording = () => {
    this.timer.start();
    this.isRecording = true;
    this.requests = [];
    this.requestsMap = {};
  };

  stopRecording = () => {
    this.isRecording = false;
    this.timer.stop();
    this.timer.reset();
  };

  getState = () => {
    return {
      isRecording: this.isRecording,
      requestsMap: this.requestsMap,
    };
  };

  getRequestsArray = () => {
    const arr = Object.values(this.requestsMap);
    return arr;
  };
}
