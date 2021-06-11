import { TrixiClient, TrixiClientOptions } from "./TrixiClient";
import { TrixiServer, TrixiServerOptions } from "./TrixiServer";

export interface Trixi {
  createServer: (options: TrixiServerOptions) => TrixiServer;
  createClient: (options: TrixiClientOptions) => TrixiClient;
}