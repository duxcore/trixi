import handleHttpRequest from '../handlers/handleHttpRequest';
import { handleWebSocketMessage } from '../handlers/handleWebSocketMessage';
import { InteractionStack } from '../types/interaction';
import createHttpServer from './createHttpServer';
import {TypedEmitter} from 'tiny-typed-emitter';
import TrixiEvents from '../types/events';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'ALL';

// much types
export type Routes = {
	[part: string]: Routes | {
		[method: string]: InteractionStack;
	}
}

export let events = new TypedEmitter<TrixiEvents>()

function setRoute (routes: Routes, method: string, route: string, methods: InteractionStack) {
	let r: object = routes;
	for (let part of route.split(/[\\\/]+/g).filter(a=>a)) {
		if ((part[0] === ':') || (part === '*')) {
			if (!r['*']) r['*'] = {};
			(r = r['*']).__param_name = part.substr(1);
		} else {
			if (!r[part]) {
				r[part] = {};
			}
			r = r[part];
		}
	}
	r[method] = methods;
}

export default function createServer(options: CreateServerOptions, started?: () => void) {
	const routes: Routes = {};

	const { server, ws } = createHttpServer(options, handleHttpRequest(routes));
  started && process.nextTick(started);

	const isOriginAllowed = (origin: string) => {
		return true;
	};

	ws.on('request', (request) => {
		if (isOriginAllowed(request.origin))
			return request.reject(401, 'Request denied');

		const connection = request.accept('echo-protocol', request.origin);
		connection.on('message', (msg) => {
			const interaction = handleWebSocketMessage(connection, msg, routes);
		});
	});

	return Object.assign(events, {
    port: options.port,
		get(route: string, ...methods: InteractionStack) {
			setRoute(routes, 'GET', route, methods);
		},
		post(route: string, ...methods: InteractionStack) {
			setRoute(routes, 'POST', route, methods);
		},
		put(route: string, ...methods: InteractionStack) {
			setRoute(routes, 'PUT', route, methods);
		},  
		delete(route: string, ...methods: InteractionStack) {
			setRoute(routes, 'DELETE', route, methods);
		},
		patch(route: string, ...methods: InteractionStack) {
			setRoute(routes, 'PATCH', route, methods);
		},
		all(route: string, ...methods: InteractionStack) {
			setRoute(routes, '*', route, methods);
		},
		set (method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | '*', route: string, methods: InteractionStack) {
			return setRoute(routes, method.toUpperCase(), route, methods);
		},
	}) 
}

export interface CreateServerOptions {
	port: number | number[];
	ignorePortBindingError?: boolean;
}