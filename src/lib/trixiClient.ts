import { TrixiClient, TrixiClientOptions } from "../types/TrixiClient";

export default function trixiClient({
  url
}: TrixiClientOptions): TrixiClient {
  return {
    url
  };
}