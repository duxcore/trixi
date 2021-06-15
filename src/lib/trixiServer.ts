import { ConnectionListener, RequestValidator, TrixiServer, TrixiServerEvents, TrixiServerOptions } from "../types/TrixiServer";
import { connection, request, server as WebSocketServer} from 'websocket';
import { TypedEmitter } from 'tiny-typed-emitter';
import socketConnection from "./socketConnection";

export default function trixiServer({
  httpServer
}: TrixiServerOptions): TrixiServer {
  const ws = new WebSocketServer({
    httpServer
  });

  let requestValidator: RequestValidator = req => true;
  let connectionListeners: ConnectionListener[] = [];

  const newConnection = (connection: connection, request: request) => {
    connectionListeners.map(cL => {
      const sco = socketConnection({
        connection,
        host: request.host,
        origin: request.origin,
        remoteAddress: request.remoteAddress
      });

      cL(sco);
    });
  }

  ws.on("request", request => {
    if (!requestValidator(request)) return request.reject();
    const connection = request.accept("echo-protocol", request.origin);
    newConnection(connection, request);
  });

  return {
    httpServer,
    onConnection(event) {
      connectionListeners.push(event);
    }
  }
}