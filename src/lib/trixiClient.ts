import { connection, w3cwebsocket } from "websocket";
import createPayload from "../helpers/createPayload";
import createRawPayload from "../helpers/createRawPayload";
import { assertedPayloadManager, messagePayloadManager } from "../helpers/payloadManagers";
import { ClientAssertCallback, ClientMessageCallback } from "../types/Connection";
import { PayloadType, RawPayloadObject } from "../types/Payload";
import { TrixiClient, TrixiClientOptions } from "../types/TrixiClient";

export default function trixiClient({
  url
}: TrixiClientOptions): TrixiClient {
  const ws = new w3cwebsocket(url, 'echo-protocol', "trixi:client");

  const wscon = ((): Promise<connection> => {
    return new Promise(r => {
      const interval = setInterval(() => {
        if (!ws._connection) return;

        r(ws._connection);
        return clearInterval(interval)
      }, 10)
    });
  })

  let assertionEventCallbacks: ClientAssertCallback[] = [];
  let messageEventCallbacks: ClientMessageCallback[] = [];

  ws.onerror = err => { throw err; }

  const getConnection: Promise<connection> = new Promise(r => wscon().then(() => r(ws._connection as connection)));

  ws.onopen = async () => {
    const connection = (await ws._connection) as connection
    ws.onmessage = e => {
      const json: RawPayloadObject = JSON.parse(e.data.toString());

      assertionEventCallbacks.map(cb => {
        const manager = assertedPayloadManager(connection, json);
        if (json.meta.type !== PayloadType.AssertedMessage) return;
  
        return cb(manager);
      });

      messageEventCallbacks.map(cb => {
        const json: RawPayloadObject = JSON.parse(e.data.toString());
        const manager = messagePayloadManager(connection, json);

        if (json.meta.type !== PayloadType.Message) return;

        return cb(manager);
      })
    }
  }

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