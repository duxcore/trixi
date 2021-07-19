import { IMessage } from 'websocket';
import { Routes } from '../lib/createServer';
import { RawSocketObject } from '../types/socket';

export function handleWebSocketMessage(msg: IMessage, routes: Routes) {
  const parsedMessage: RawSocketObject = JSON.parse(msg.utf8Data as string);
}