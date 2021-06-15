import { connection } from "websocket";
import { SocketConnectionObject } from "../types/Connection";
import { AssertedPayloadManager, MessagePayloadManager, PayloadObject, PayloadType, RawPayloadObject } from "../types/Payload";
import createRawPayload from "./createRawPayload";

export function messagePayloadManager(connection: connection, {
  payload,
  meta: {
    timestamp,
    type
  }
}: RawPayloadObject): MessagePayloadManager {

  return {
    data: payload.p,
    op: payload.op,
    parsed: payload,
    reference: payload.ref,
    timestamp,
    type,
    reply(data) {
      const payloadBase = createRawPayload({
        op: this.op,
        p: data,
        ref: this.reference
      }, { type: PayloadType.MessageResponse });

      

      connection.send(JSON.stringify(payloadBase));
    },
    onResponse(callback) {
      connection.on("message", (data) => {
        const jsonData: RawPayloadObject = JSON.parse(data.utf8Data ?? "");
        if (jsonData.payload.ref == this.reference && jsonData.meta.type == PayloadType.MessageResponse) callback(messagePayloadManager(connection, jsonData));
      })
    }
  }
}

export function assertedPayloadManager(connection: connection, {
  payload,
  meta: {
    timestamp,
    type
  }
}: RawPayloadObject): AssertedPayloadManager {

  return {
    data: payload.p,
    op: payload.op,
    parsed: payload,
    reference: payload.ref,
    timestamp,
    type
  }
} 