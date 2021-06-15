export interface RawPayloadObject {
  payload: PayloadObject,
  meta: RawPayloadMeta
}

export enum PayloadType {
  Event = "type:event",
  Message = "type:message",
  MessageResponse = "type:message_response",
  AssertedMessage = "type:asserted_message",
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

export interface EventPayloadManager extends PayloadManagerBase {}

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