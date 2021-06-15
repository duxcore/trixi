import { ClientAssertCallback, ClientEventCallback, ClientMessageCallback } from "./Connection";
import { MessagePayloadManager } from "./Payload";

export interface TrixiClient {
  readonly url: string;
  on(op: string, event: ClientEventCallback): void;
  emit(op: string, payload: any): void;

  send(payload: any): Promise<MessagePayloadManager>;
  assert(payload: any): void;

  onMessage(event: ClientMessageCallback): void;
  onAssert(event: ClientAssertCallback): void;
}

export interface TrixiClientOptions {
  url: string;
}
