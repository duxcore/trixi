import { connection } from 'websocket';
import { IMessage } from 'websocket';
import { Routes } from '../lib/createServer';
import parseURL from '../lib/parseURL';
import sendWsObject from '../lib/sendWSObject';
import { InteractionMethod, InteractionStack } from '../types/interaction';
import * as uuid from 'uuid';
import { RawSocketObject } from '../types/socket';

function rejectInvalidRoute(method: string, route: string[], msg: RawSocketObject, connection: connection) {
  return sendError(`Cannot ${method.toUpperCase()} /${route.join('/')}`, "INVALID_ROUTE", method, route, msg, connection);
}

function sendError( message: string, code: string, method: string, route: string[], msg: RawSocketObject, connection: connection) {
  const reference = msg.reference;
  const responseObject = {
    error: {
      message,
      code
    }
  }
  
  sendWsObject(connection, {
    headers: {},
    status: 400,
    method: msg.method,
    operator: `ERROR_${msg.uri}`,
    reference: reference ?? uuid.v4(),
    uri: msg.uri,
    data: responseObject
  }) 
}

export function handleWebSocketMessage(connection: connection, msg: IMessage, routes: Routes) {
  const req: RawSocketObject = JSON.parse(msg.utf8Data?.toString() as string);

  let uri = req.uri || '/';
  let method = (req.method || 'GET').toUpperCase();

  const headers: {
    [name: string]: string | string[];
  } = req.headers ?? {};

  const { parts, query } = parseURL(uri);

  let params: {
    [key: string]: string;
  } = {};
  
  let r: | Routes | InteractionStack | {
    [method: string]: InteractionStack;
  } = routes;

  for (const part of parts) {
    const lcp = part.toLowerCase();
    if (r[lcp]) {
      r = r[lcp];
    } else if (r['*']) {
      r = r['*'];
      params[`${(r as any).__param_name}` || ''] = part;
    } else {
      return rejectInvalidRoute(method, parts, req, connection);
    }
  }

  if (r instanceof Array) {
    (async () => {
      const cookies = (() => {
        const cks = headers['Cookie'];
        if (!cks) return {}

        const splitA = cks.toString().split(";").map(val => val.trim());
        let response = {}
        splitA.map(val => {
          const split = val.split('=');
          response[split[0]] = split[1]; 
        });

        return response;
      })();

      const request = {
        uri,
        method,
        cookies,
        headers,
        query,
        params,
      };

      let responseHeaders = {};

      const response = {
        respond: (status: number, data: object) => {
          const responseObject: RawSocketObject = {
            uri,
            status,
            operator: `REPLY_${uri}`,
            headers: responseHeaders,
            method: req.method,
            reference: req.reference ?? uuid.v4(),
            data: data
          }
        },
        setHeader: (header: string, value: string) => {
          responseHeaders[header] = value;
          return;
        },
      };

      const rr = [...r];
      const executor = rr.pop() as InteractionMethod;
      const middleware = rr;

      let proms: Promise<void>[] = middleware.map(
        (fn) => new Promise((res) => fn(request, response, res))
      );

      if (proms.length > 0) await Promise.all(proms);

      executor(request, response);
    })();
  } else {
    return rejectInvalidRoute(method, parts, req, connection);
  }
}
