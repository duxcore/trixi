import trixiClient from "./lib/trixiClient";
import trixiServer from "./lib/trixiServer";
import { Trixi } from "./types/Trixi";

export default function trixi(): Trixi {
  return {
    createServer: trixiServer,
    createClient: trixiClient
  }; 
}