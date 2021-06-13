export interface RawPayloadObject {
  payload: PayloadObject,
  meta: RawPayloadMeta
}

export interface RawPayloadMeta {
  
}

export interface PayloadObject {
  op: string; // Operator Code
  p: any | null; // Payload Data
  ref: string; // Reference ID
}