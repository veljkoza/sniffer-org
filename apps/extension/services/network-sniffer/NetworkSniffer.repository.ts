export class NetworkSnifferRepository {
  isRecording = false;
  requests = [] as any[];
  requestsMap: { [k: string]: any } = {};
  constructor() {}

  #arrayBufferToString = (buffer: BufferSource) => {
    let decoder = new TextDecoder("utf-8");
    return decoder.decode(buffer);
  };

  arrayBufferToJson = (buffer: BufferSource) => {
    try {
      return JSON.parse(this.#arrayBufferToString(buffer));
    } catch (error) {}
  };

  onBeforeRequest = (details: any) => {
    this.requests.push(details.url);
    this.requestsMap[details.requestId] = details;
    console.log({ requests: this.requestsMap });

    if (
      details.method === "POST" &&
      details.requestBody &&
      details.requestBody.raw &&
      details.requestBody.raw[0]
    ) {
      let buffer = details.requestBody.raw[0].bytes;
      if (buffer) {
        let jsonBody = this.arrayBufferToJson(buffer);
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
    this.isRecording = true;
    this.requests = [];
    this.requestsMap = {};
  };

  stopRecording = () => {
    this.isRecording = false;
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
