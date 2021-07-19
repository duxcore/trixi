import { assert } from 'ps-std';
import { IMessage } from 'websocket';
import { Routes } from '../lib/createServer';
import parseURL from '../lib/parseURL';
import { InteractionMethod, InteractionStack } from '../types/interaction';
import { RawSocketObject } from '../types/socket';

const INVALID_QUERY = {
	status: 400,
	error: 'INVALID_QUERY',
};

const INVALID_ROUTE = {
	status: 404,
	error: 'INVALID_ROUTE',
};

type WSMHR =
	| {
			status: number;
			headers?: {
				[key: string]: string;
			};
			data?: object;
			error?: string | object;
	  }
	| Promise<WSMHR>;

export function handleWebSocketMessage(
	msg: IMessage,
	routes: Routes
): Promise<WSMHR> {
	return new Promise((resolve_respond) => {
		let responded = false;
		const respond = (response: WSMHR) => {
			if (responded) return;
			responded = true;
			resolve_respond(response);
		};
		try {
			const rawData = msg.utf8Data as string;
			assert(typeof rawData === 'string');

			const parsedData = JSON.parse(rawData);
			assert(typeof parsedData === 'object');

			const parsedMessage: RawSocketObject = parsedData;

			let url = parsedMessage.url || '/';
			assert(typeof url === 'string');

			let method = (parsedMessage.method || 'GET').toUpperCase();
			assert(typeof method === 'string');

			const headers: {
				[name: string]: string | string[];
			} = parsedMessage.headers;

			for (const hval of Object.values(headers)) {
				if (typeof hval === 'string') {
					assert(hval);
				} else if (assert(hval instanceof Array)) {
					hval.forEach((a) => assert(typeof a === 'string'));
				}
			}

			const { parts, query } = parseURL(url);

			if (parsedMessage.query) {
				for (const [key, value] of Object.entries(parsedMessage.query)) {
					if (typeof value === 'string') {
						query[key] = [value];
					} else {
						value.forEach((a) => assert(typeof a === 'string'));
						query[key] = value;
					}
				}
			}

			let params: {
				[key: string]: string;
			} = parsedMessage.params || {};

			assert(typeof params === 'object');

			let r:
				| Routes
				| InteractionStack
				| {
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
					return INVALID_ROUTE;
				}
			}

			// Handle both any verb, and specific verb
			if (!(r instanceof Array)) {
				r = r[method];
			}

			if (r instanceof Array) {
				(async () => {
					const cookies = (() => {
						const cks = headers['Cookie'];
						if (!cks) return {};

						const splitA = cks
							.toString()
							.split(';')
							.map((val) => val.trim());
						let response = {};
						splitA.map((val) => {
							const split = val.split('=');
							response[split[0]] = split[1];
						});

						return response;
					})();

					const request = {
						uri: url,
						method,
						cookies,
						headers,
						query,
						params,
					};

					const response_headers: {
						[name: string]: string;
					} = {};

					const response = {
						respond: (status: number, data: object) => {
							respond({ status, data, headers: response_headers });
						},
						setHeader: (name: string, value: string) => {
							response_headers[name] = value;
							return;
						},
					};
					// execute stuff; r is an InteractionStack
					// headers => { [ string ] : string | string[] }
					// query => { [ string ] : string | string[] }
					// params => [ ...string ]

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
				return respond(INVALID_ROUTE);
			}
		} catch (e) {
			respond(INVALID_QUERY);
		}
	});
}
