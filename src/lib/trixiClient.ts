import { client as WebSocketClient, connection } from "websocket";
import createPayload from "../helpers/createPayload";
import createRawPayload from "../helpers/createRawPayload";
import { messagePayloadManager } from "../helpers/payloadManagers";
import { PayloadType, RawPayloadObject } from "../types/Payload";
import { TrixiClient, TrixiClientOptions } from "../types/TrixiClient";

export default function trixiClient({
  url
}: TrixiClientOptions): TrixiClient {
  const ws = new WebSocketClient();
  let msgEventCallbacks = [];

  ws.connect(url, "echo-protocol", "trixi:client");
  ws.on('connectFailed', err => { throw err; })

  const getConnection: Promise<connection> = new Promise(r => ws.on('connect', r));

  return {
    url,
    on() {},
    onAssert() {},
    async onMessage(event) {
      const connection = await getConnection;
      connection.on('message', data => {
        const json: RawPayloadObject = JSON.parse(data.utf8Data ?? "");
        const manager = messagePayloadManager(connection, json);

        return event(manager);
      });
      return;
    }, 

    emit() {},
    send(args: any) {
      return new Promise(async (resolve, reject) => {
        const connection = await getConnection;

        const payload = createRawPayload(createPayload("trixi:message", args), { type: PayloadType.Message })
        const payloadString = JSON.stringify(payload, null, 2);

        connection.send(payloadString, err => {
          if (err) return reject(err);
          return resolve(messagePayloadManager(connection, payload));
        });
      })
    },
    assert() {}
  };
}