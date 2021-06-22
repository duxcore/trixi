import { connection, w3cwebsocket } from "websocket";
import createPayload from "../helpers/createPayload";
import createRawPayload from "../helpers/createRawPayload";
import { assertedPayloadManager, messagePayloadManager, operatorPayloadManager } from "../helpers/payloadManagers";
import { ClientAssertCallback, ClientOperatorCallback, ClientMessageCallback } from "../types/Connection";
import { PayloadType, RawPayloadObject } from "../types/Payload";
import { TrixiClient, TrixiClientOptions } from "../types/TrixiClient";
import Collection from '@discordjs/collection';

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
  let payloadEventCallbacks: ClientMessageCallback[] = [];
  let operatorEventCallbacks = new Collection<string, ClientOperatorCallback>();

  const getConnection: Promise<connection> = new Promise(r => wscon().then(() => r(ws._connection as connection)));

  ws.onopen = async () => {
    const connection = (await ws._connection) as connection
    ws.onmessage = e => {
      const json: RawPayloadObject = JSON.parse(e.data.toString());

      operatorEventCallbacks.map((cb, operator) => {
        const manager = operatorPayloadManager(connection, json);
        if (manager.op !== operator || manager.type !== PayloadType.Operator) return;

        return cb(manager);
      });

      assertionEventCallbacks.map(cb => {
        const manager = assertedPayloadManager(connection, json);
        if (json.meta.type !== PayloadType.AssertedMessage) return;
  
        return cb(manager);
      });

      payloadEventCallbacks.map(cb => {
        const json: RawPayloadObject = JSON.parse(e.data.toString());
        const manager = messagePayloadManager(connection, json);

        if (json.meta.type !== PayloadType.Message) return;

        return cb(manager);
      })
    }
  }

  return {
    url,
    onOp(operator: string, event) { operatorEventCallbacks.set(operator, event); },
    onAssert(event) { assertionEventCallbacks.push(event); }, 
    onPayload(event) { payloadEventCallbacks.push(event); }, 

    sendOp(operator: string, args: any) {
      return new Promise(async (resolve, reject) => {
        console.log("attempting to send op")
        const connection = await getConnection;
        console.log("connection established")

        const payload = createRawPayload(createPayload(operator, args), { type: PayloadType.Operator });
        const payloadString = JSON.stringify(payload, null, 2);

        ws.send(payloadString);
        console.log("payload sent");
        return resolve(operatorPayloadManager(connection, payload));
      })
    },
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

    close() {
      return new Promise(async (resolve, _rej) => {
        const connection = await getConnection;
        connection.close();
        return resolve();
      });
    }
  };
}