import { Query } from "express-serve-static-core";

export interface IGenericRequest<T extends Query, U> extends Express.Request {
  body: U;
  query: T;
}
