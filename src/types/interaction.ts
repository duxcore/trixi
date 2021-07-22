export type InteractionMethod = (req: InteractionRequest, res: InteractionResponse) => void;
export type InteractionMiddlewareMethod = (req: InteractionRequest, res: InteractionResponse, next: () => void) => void;

export type InteractionStack = [...InteractionMiddlewareMethod[] & InteractionMethod];

export interface InteractionRequest {
  uri: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | string;
  cookies: {
    [name: string]: string | string[];
  }
  headers: {
    [name: string]: string | string[];
  }
  query: {
    [name: string]: string[];
  }
  params: {
    [name: string]: string | string[];
  }
}
export interface InteractionResponse {
  respond(status: number, data: object);
  setHeader(header: string, value: string);
}