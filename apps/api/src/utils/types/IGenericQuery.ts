import { Query } from "express-serve-static-core";
export interface IGenericQuery<T extends Query> extends Express.Request {
  query: T;
}
