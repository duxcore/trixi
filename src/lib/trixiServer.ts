import { TrixiServer, TrixiServerOptions } from "../types/TrixiServer";
import { server as WebSocketServer} from 'websocket';

export default function trixiServer({
  port
}: TrixiServerOptions): TrixiServer {
  const ws = new WebSocketServer();

  return {
    port,
  }
}