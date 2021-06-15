import { connection } from "websocket";
import createPayload from "../helpers/createPayload";
import createRawPayload from "../helpers/createRawPayload";
import { messagePayloadManager } from "../helpers/payloadManagers";
import { SocketConnectionObject, SocketConnectionOptions } from "../types/Connection";
import { RawPayloadObject } from "../types/Payload";

export default function socketConnection({
  connection,
  origin,
  host,
  remoteAddress
}: SocketConnectionOptions): SocketConnectionObject {

  return {
    host,
    origin,
    remoteAddress,
    
    on() {},
    onAssert() {},
    async onMessage(event) {
      connection.on('message', data => {
        const json: RawPayloadObject = JSON.parse(data.utf8Data ?? "");
        const manager = messagePayloadManager(connection, json);

        return event(manager);
      });
      return;
    }, 

    emit() {},
    send(args: any) {
      return new Promise((resolve, reject) => {
        const payload = createPayload("trixi:message", args);
        const payloadString = JSON.stringify(payload, null, 2);

        connection.send(payloadString, err => {
          if (err) return reject(err);
          return resolve(payload);
        });
      })
    },
    assert() {}
  };    
}