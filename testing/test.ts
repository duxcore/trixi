import * as trixi from '../src/trixi';

const server = trixi.createServer({
  port: 2020
}, () => {
  console.log("API started on port", server.port);
});

server.get("/teapot", (req, res) => {
  res.respond(418, {teapot: true});
});

server.get('/', (req, res) => {
	res.respond(200, Buffer.from('Hello, world!'));
})

server.get("/test/:dick", (req, res) => {
  console.log(req);
  res.respond(200, {message: "test"});
})

server.get("/test/:dick/test/:rwar", (req, res) => {
  console.log(req);
  res.respond(200, {message: "test"});
})

server.get("*", (req, res) => {
	console.log(req);
	res.respond(400, { message: "Not Found =("})
});
