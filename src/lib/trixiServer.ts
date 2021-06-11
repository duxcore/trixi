import { TrixiServer, TrixiServerOptions } from "../types/TrixiServer";

export default function trixiServer({
  port
}: TrixiServerOptions): TrixiServer {
  return {
    port,
  }
}