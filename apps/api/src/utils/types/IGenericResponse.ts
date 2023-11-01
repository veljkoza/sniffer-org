import { Send } from "express-serve-static-core";
export interface IGenericResponse<ResBody> extends Express.Response {
  json: Send<ResBody, this>;
}
