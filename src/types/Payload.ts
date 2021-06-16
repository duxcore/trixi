export interface RawPayloadObject {
  payload: PayloadObject,
  meta: RawPayloadMeta
}

export enum PayloadType {
  Message = "type:message",
  Operator = "type:Operator",
  MessageResponse = "type:message_response",
  AssertedMessage = "type:asserted_message",
  OperatorResponse = "type:operator_response",
}

interface PayloadManagerBase {
  readonly op: string,
  readonly data: any,
  readonly parsed: PayloadObject,
  readonly reference: string,
  readonly type: PayloadType,
  readonly timestamp: number
}

export interface MessagePayloadManager extends PayloadManagerBase {
  reply(data: any): void;
  onResponse(callback: (payload: MessagePayloadManager) => void): void;
}

export interface AssertedPayloadManager extends PayloadManagerBase {}

export interface OperatorPayloadManager extends PayloadManagerBase {
  reply(data: any): void;
  onResponse(callback: (payload: OperatorPayloadManager) => void): void;
}

export interface RawPayloadMeta {
  type: PayloadType;
  timestamp: number;
}

export interface CreateRawPayloadOpts {
  type: PayloadType;
}

export interface PayloadObject {
  op: string; // Operator Code
  p: any | null; // Payload Data
  ref: string; // Reference ID
}