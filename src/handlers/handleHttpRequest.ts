import JSONB from 'json-buffer';
import { IncomingMessage, ServerResponse } from 'http';
import { Routes } from '../lib/createServer';
import parseURL from '../lib/parseURL';
import { InteractionMethod, InteractionStack } from '../types/interaction';

// import this from somewhere or something idk
function rejectInvalidRoute(
	method: string,
	route: string[],
	res: ServerResponse
) {
	res.statusCode = 400;
	res.write(`Cannot ${method.toUpperCase()} /${route.join('/')}`);
	res.end();
}

export default function handleHttpRequest(routes: Routes) {
	return function handleRequest(
		req: IncomingMessage,
		res: ServerResponse,
		body: Buffer
	) {
		let uri = req.url || '/';
		let method = (req.method || 'GET').toUpperCase();

		const header_pairs: [string, string][] = [];

		for (let i = 0; i < req.rawHeaders.length; i += 2) {
			header_pairs.push([`${req.rawHeaders[i]}`, `${req.rawHeaders[i + 1]}`]);
		}

		let headers_ar: {
			[name: string]: string[];
		} = {};

		for (const [name, val] of header_pairs) {
			if (name && val !== undefined) {
				if (headers_ar[name]) {
					headers_ar[name].push(val);
				} else {
					headers_ar[name] = [val];
				}
			}
		}

		const headers: {
			[name: string]: string | string[];
		} = {};

		for (const [name, val] of Object.entries(headers_ar)) {
			if (val.length > 1) {
				headers[name] = val;
			} else {
				headers[name] = val[0];
			}
		}

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
				return rejectInvalidRoute(method, parts, res);
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
				const response = {
					respond: (status: number, data: object) => {
						res.statusCode = status;
						if (data instanceof Buffer) {
							res.write(data);
						} else {
							res.setHeader('Content-Type', 'application/json');
							res.write(JSONB.stringify(data));
						}
						res.end();
					},
					setHeader: (header: string, value: string) => {
						res.setHeader(header, value);
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
			return rejectInvalidRoute(method, parts, res);
		}
	};
}