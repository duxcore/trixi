import http from 'http';
import { server as WebSocketServer } from 'websocket';
import { CreateServerOptions } from './createServer';

export type ListenerObject = (req, res, chunks) => void;

export default function createHttpServer(
	options: CreateServerOptions,
	listener: ListenerObject
) {
	const ports = options.port instanceof Array ? options.port : [options.port];

	const server = http.createServer((req, res) => {
		const body_chunks = Array<Buffer>();
		req.on('data', (chunk: Buffer) => body_chunks.push(chunk));
		req.on('end', () => {
			listener(req, res, Buffer.concat(body_chunks));
		});
	});

	const ws = new WebSocketServer({
		httpServer: server,
		autoAcceptConnections: false,
	});

	let listen_success = false;
	let listen_failed = false;
	let thrown_error: Error | undefined;
	for (const port of ports) {
		try {
			listen_success = true;
			server.listen(+port);
		} catch (error) {
			listen_failed = true;
			thrown_error = thrown_error;
		}
	}

	if (!listen_success || (!options.ignorePortBindingError && listen_failed)) {
		throw thrown_error || new Error('No port specified.');
	}

	return {
		server,
		ws,
	};
}
