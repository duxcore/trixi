import { Eventra } from '@duxcore/eventra'
import { ClientOptions } from '../types/client';
import { RawSocketObject } from '../types/socket';
import { HeaderType } from '../types/general';
import * as uuid from 'uuid';
import Collection from '@discordjs/collection';
import { w3cwebsocket } from 'websocket';

export function createClient(options: ClientOptions) {
  let isOpen = false;
  
  const url = options.url;
  const origin = options.origin;
  const headers = options.headers ?? {};

  const wse = new Eventra<WebSocketEvents>()
  const ws = new w3cwebsocket(url, 'echo-protocol', origin);

  ws.onopen = function open() {
    isOpen = true;
    wse.emit('open');
    return;
  }

  ws.onclose = function close() {
    isOpen = false;
    wse.emit('close');
    return;
  }

  ws.onerror = function error(error) {
    throw error;
  }

  ws.onmessage = function incomming(event) {
    const interaction: RawSocketObject = JSON.parse(event.data.toString());
    wse.emit('interaction', interaction);
  }

  function assebleHeaders(...headers: HeaderType[]): HeaderType {
    let finalHeaders: HeaderType = {}

    headers.forEach(header => {
      finalHeaders = Object.assign(finalHeaders, header);
    });

    return finalHeaders;
  }

  let _responseListeners = new Collection<string, (data: RawSocketObject, error: any | null) => void>()

  wse.on('interaction', (interaction) => {
    _responseListeners.map((callback, reference) => {
      if (reference === interaction.reference) {
        _responseListeners.delete(reference);
        if (interaction.operator?.startsWith('ERROR')) {
          const error = new Error(`(${interaction.data.error.code}): ${interaction.data.error.message}`);
          return callback(interaction, error);
        }
        return callback(interaction, null);
      }
    })
  })

  function awaitResponse(reference, callback: (data: RawSocketObject, error: any) => void) {
    _responseListeners.set(reference, callback);
  }

  return {
    ws,
  
    on: wse.on,
    once: wse.once,
    addListener: wse.addListener,
    listeners: wse.listeners,
    prependListener: wse.prependListener,
    prependOnceListener: wse.prependOnceListener,

    send(dispatch: DispatchConfiguration, callback: (response: RawSocketObject | null, error: any) => void) {
      const data = dispatch.data;
      const uri = dispatch.uri;
      const method = dispatch.method;
      const reference = dispatch.reference ?? uuid.v4();

      const payloadData: RawSocketObject = {
        uri,
        data,
        headers: assebleHeaders(headers, (dispatch.headers ?? {})),
        method,
        reference
      }

      const dataString = JSON.stringify(payloadData);

      if (!isOpen) wse.on('open', () => ws.send(dataString));
      else ws.send(dataString)
      
      awaitResponse(reference, callback);
    }
  }
}

export interface DispatchConfiguration {
  uri: string;
  data?: any | object;
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  reference?: string;
  headers?: {
    [name: string]: string;
  }
}

export interface WebSocketEvents {
  'open': () => void;
  'close': () => void;
  'interaction': (interaction: RawSocketObject) => void;
}