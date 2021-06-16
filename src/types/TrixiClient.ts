import { ClientAssertCallback, ClientOperatorCallback, ClientMessageCallback } from "./Connection";
import { AssertedPayloadManager, MessagePayloadManager } from "./Payload";

export interface TrixiClient {
  readonly url: string;
  onOp(op: string, event: ClientOperatorCallback): void;
  sendOp(op: string, payload: any): void;

  send(payload: any): Promise<MessagePayloadManager>;
  assert(payload: any): Promise<AssertedPayloadManager>;

  onPayload(event: ClientMessageCallback): void;
  onAssert(event: ClientAssertCallback): void;
}

export interface TrixiClientOptions {
  url: string;
}
