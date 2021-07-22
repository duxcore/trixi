import { HeaderType } from "./general";

export interface ClientOptions {
  url: string,
  origin: string,
  headers?: HeaderType
}