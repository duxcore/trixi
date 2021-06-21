import { ClientAssertCallback, ClientOperatorCallback, ClientMessageCallback } from "./Connection";
import { AssertedPayloadManager, MessagePayloadManager, OperatorPayloadManager } from "./Payload";

export interface TrixiClient {
  readonly url: string;
  onOp(op: string, event: ClientOperatorCallback): void;
  sendOp(op: string, payload: any): Promise<OperatorPayloadManager>;

  send(payload: any): Promise<MessagePayloadManager>;
  assert(payload: any): Promise<AssertedPayloadManager>;

  onPayload(event: ClientMessageCallback): void;
  onAssert(event: ClientAssertCallback): void;

  close(): Promise<void>;
}

export interface TrixiClientOptions {
  url: string;
}
