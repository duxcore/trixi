import { connection } from "websocket";
import { AssertedPayloadManager, OperatorPayloadManager, MessagePayloadManager } from "./Payload";

export type ClientOperatorCallback = (event: OperatorPayloadManager) => void;
export type ClientMessageCallback = (event: MessagePayloadManager) => void;
export type ClientAssertCallback = (event: AssertedPayloadManager) => void;
export type ConnectionCloseCallback = () => {}

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

  onOp(op: string, event: ClientOperatorCallback): void;
  sendOp(op: string, payload: any): Promise<OperatorPayloadManager>;

  send(payload: any): Promise<MessagePayloadManager>;
  assert(payload: any): Promise<AssertedPayloadManager>;

  onPayload(event: ClientMessageCallback): void;
  onAssert(event: ClientAssertCallback): void;

  onClose(event: ConnectionCloseCallback): void
}