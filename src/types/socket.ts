
export interface RawSocketObject {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  payload: any | null;
  operator: string;
  reference: string;
}