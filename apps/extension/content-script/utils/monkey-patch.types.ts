type TRequestSentToServiceWorkerPayload = {
  payload: string; //json
  response: any;
  startTime: string; //isostring,
  status: number;
  url: string;
};

export { TRequestSentToServiceWorkerPayload };
