import { connection } from 'websocket';
import { RawSocketObject } from '../types/socket';

export default function sendWsObject(connection: connection, object: RawSocketObject) {
  connection.send(JSON.stringify(object));
  return;
}