export interface IGenericRequestBody<T> extends Express.Request {
  body: T;
}
