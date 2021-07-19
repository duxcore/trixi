
export interface RawSocketObject {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  payload?: any | null;
  headers: {
    [name: string]: string
  }
  operator: string;
  reference: string;
}