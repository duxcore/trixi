import Collection from "@discordjs/collection";
import { connection } from "websocket";
import createPayload from "../helpers/createPayload";
import createRawPayload from "../helpers/createRawPayload";
import { assertedPayloadManager, messagePayloadManager, operatorPayloadManager } from "../helpers/payloadManagers";
import { ClientAssertCallback, ClientMessageCallback, ClientOperatorCallback, ConnectionCloseCallback, SocketConnectionObject, SocketConnectionOptions } from "../types/Connection";
import { PayloadType, RawPayloadObject } from "../types/Payload";

export default function socketConnection({
  connection,
  origin,
  host,
  remoteAddress
}: SocketConnectionOptions): SocketConnectionObject {

  let assertionEventCallbacks: ClientAssertCallback[] = [];
  let payloadEventCallbacks: ClientMessageCallback[] = [];
  let operatorEventCallbacks = new Collection<string, ClientOperatorCallback>();
  let connectionCloseEventCallbacks: ConnectionCloseCallback[] = [];

  connection.on("message", data => {
    const json: RawPayloadObject = JSON.parse(data.utf8Data ?? "");

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
      const json: RawPayloadObject = JSON.parse(data.utf8Data ?? "");
      const manager = messagePayloadManager(connection, json);

      if (json.meta.type !== PayloadType.Message) return;

      return cb(manager);
    })
  });

  connection.on("close", () => {
    connectionCloseEventCallbacks.map(e => {
      e();
    })
  })

  return {
    host,
    origin,
    remoteAddress,
    
    onOp(operator: string, event) { operatorEventCallbacks.set(operator, event); },
    onAssert(event) { assertionEventCallbacks.push(event); }, 
    onPayload(event) { payloadEventCallbacks.push(event); }, 
    onClose(event) { connectionCloseEventCallbacks.push(event) },

    sendOp(operator: string, args: any) {
      return new Promise(async (resolve, reject) => {
        const payload = createRawPayload(createPayload(operator, args), { type: PayloadType.Operator });
        const payloadString = JSON.stringify(payload, null, 2);

        connection.send(payloadString, err => {
          if (err) return reject(err);
          return resolve(messagePayloadManager(connection, payload));
        });
      })
    },
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
    }
  };    
}