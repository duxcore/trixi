import { client as WebSocketClient, connection } from "websocket";
import createPayload from "../helpers/createPayload";
import createRawPayload from "../helpers/createRawPayload";
import { assertedPayloadManager, messagePayloadManager } from "../helpers/payloadManagers";
import { ClientAssertCallback, ClientMessageCallback } from "../types/Connection";
import { AssertedPayloadManager, PayloadType, RawPayloadObject } from "../types/Payload";
import { TrixiClient, TrixiClientOptions } from "../types/TrixiClient";

export default function trixiClient({
  url
}: TrixiClientOptions): TrixiClient {
  const ws = new WebSocketClient();
  let assertionEventCallbacks: ClientAssertCallback[] = [];
  let messageEventCallbacks: ClientMessageCallback[] = [];

  ws.connect(url, "echo-protocol", "trixi:client");
  ws.on('connectFailed', err => { throw err; })

  const getConnection: Promise<connection> = new Promise(r => ws.on('connect', r));

  ws.on("connect", connection => {
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
  })

  return {
    url,
    on() {},
    onAssert(event) {
      assertionEventCallbacks.push(event);
    }, 
    onMessage(event) {
      messageEventCallbacks.push(event)
    }, 

    emit() {},
    send(args: any) {
      return new Promise(async (resolve, reject) => {
        const connection = await getConnection;

        const payload = createRawPayload(createPayload("trixi:message", args), { type: PayloadType.Message });
        const payloadString = JSON.stringify(payload, null, 2);

        connection.send(payloadString, err => {
          if (err) return reject(err);
          return resolve(messagePayloadManager(connection, payload));
        });
      })
    },
    assert(args: any) {
      return new Promise(async (resolve, reject) => {
        const connection = await getConnection;

        const payload = createRawPayload(createPayload("trixi:assertion", args), { type: PayloadType.AssertedMessage });
        const payloadString = JSON.stringify(payload, null, 2);

        connection.send(payloadString, err => {
          if (err) return reject(err);
          return resolve(assertedPayloadManager(connection, payload));
        });
      })
    },
  };
}