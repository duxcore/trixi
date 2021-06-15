import { connection } from "websocket";
import { AssertedPayloadManager, EventPayloadManager, MessagePayloadManager } from "./Payload";

export type ClientEventCallback = (event: EventPayloadManager) => void;
export type ClientMessageCallback = (event: MessagePayloadManager) => void;
export type ClientAssertCallback = (event: AssertedPayloadManager) => void;

export interface SocketConnectionOptions {
  connection: connection; // Raw Socket Connection Object
  origin: string; // origin of the socket connection
  host: string; // The host of the socket connection
  remoteAddress: string; // The remote address of the socket connection
}

export interface SocketConnectionObject {
  host: string;
  remoteAddress: string;
  origin: string;

  on(op: string, event: ClientEventCallback): void;
  emit(op: string, payload: any): void;

  send(payload: any): void;
  assert(payload: any): void;

  onMessage(event: ClientMessageCallback): void;
  onAssert(event: ClientAssertCallback): void;
}