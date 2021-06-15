import { connection } from "websocket";
import createPayload from "../helpers/createPayload";
import createRawPayload from "../helpers/createRawPayload";
import { assertedPayloadManager, messagePayloadManager } from "../helpers/payloadManagers";
import { ClientAssertCallback, ClientMessageCallback, SocketConnectionObject, SocketConnectionOptions } from "../types/Connection";
import { PayloadType, RawPayloadObject } from "../types/Payload";

export default function socketConnection({
  connection,
  origin,
  host,
  remoteAddress
}: SocketConnectionOptions): SocketConnectionObject {

  let assertionEventCallbacks: ClientAssertCallback[] = [];
  let messageEventCallbacks: ClientMessageCallback[] = [];

  connection.on("message", data => {
    const json: RawPayloadObject = JSON.parse(data.utf8Data ?? "");

    assertionEventCallbacks.map(cb => {
      const manager = assertedPayloadManager(connection, json);
      if (json.meta.type !== PayloadType.AssertedMessage) return;

      return cb(manager);
    });

    messageEventCallbacks.map(cb => {
      const json: RawPayloadObject = JSON.parse(data.utf8Data ?? "");
      const manager = messagePayloadManager(connection, json);

      if (json.meta.type !== PayloadType.Message) return;

      return cb(manager);
    })
  })

  return {
    host,
    origin,
    remoteAddress,
    
    on() {},
    onAssert(event) {
      assertionEventCallbacks.push(event);
    }, 
    onMessage(event) {
      messageEventCallbacks.push(event)
    },  

    emit() {},
    send(args: any) {
      return new Promise((resolve, reject) => {
        const payload = createRawPayload(createPayload("trixi:message", args), { type: PayloadType.Message })
        const payloadString = JSON.stringify(payload, null, 2);

        connection.send(payloadString, err => {
          if (err) return reject(err);
          return resolve(messagePayloadManager(connection, payload));
        });
      })
    },
    assert(args: any) {
      return new Promise((resolve, reject) => {
        const payload = createRawPayload(createPayload("trixi:assertion", args), { type: PayloadType.AssertedMessage })
        const payloadString = JSON.stringify(payload, null, 2);

        connection.send(payloadString, err => {
          if (err) return reject(err);
          return resolve(assertedPayloadManager(connection, payload));
        });
      })
    },
  };    
}