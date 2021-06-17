import http from 'http';
import { request } from 'websocket';
import { SocketConnectionObject } from './Connection';

export type RequestValidator = (request: request) => boolean;
export type ConnectionListener = (connection: SocketConnectionObject) => void;

export interface TrixiServer {
  httpServer: http.Server;
  onConnection(connection: ConnectionListener): void,
}

export interface TrixiServerEvents {
  "connection": (connection: SocketConnectionObject) => void;
}

export interface TrixiServerOptions {
  httpServer: http.Server;
}