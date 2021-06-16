<span align=center>
  <h1>
    Trixi WebSocket Wrapper
    <br />
      <a href="https://discord.gg/dTGJ5Bchnq">
    <img src="https://img.shields.io/discord/844279877503025182?label=Discord&logo=discord&logoColor=white&style=for-the-badge" />
  </a>
    <img src="https://img.shields.io/github/license/duxcore/trixi?style=for-the-badge" />
  </h1>
</span>

Trixi is a WebSocket wrapper that enables developers to create better and stricter acpplications.  The way we do this is that we use scoped socket interactions which allows you to have a scope for unidirectional payloads, operator based payloads, and bidirectional payloads.  All of this is done through the use of a standardized payload schema.

# Unidirectional Payloads
If you need to send a payload with out the possibility of a response, then you can send a unidirectional payload, otherwise knon as an assertion.  Both the client and server can send an assertion to each other, once the assertion is sent, it cannot be replied to in any way.
```ts
import trixi from 'trixi';
import { Server } from 'http';

const httpServer = new Server();
const app = trixi();

/**
 * Server Example
 */
httpServer.listen(8080, () => {
  const server = app.createServer({ httpServer });

  server.onConnection(connection => {
    console.log("A new socket connection has been established from", connection.remoteAddress);

    // Send your assertion message on start
    connection.assert("Welcome...");

    // Create a listener for assertions from the client
    connection.onAssert(assertion => {
      console.log("New assertion from client:", assertion.data);
    });
  });
});

/**
 * Client Example
 */
const client = app.createClient({ url: "ws://localhost:8080" });
client.assert("I have arrived!!"); 

client.onAssert(assertion => {
  console.log("New assertion from server:", assertion.data);
});
```

# Bidirectional Payloads
Sometimes you want to be able to hear back from your client when you send a message, so with bidirectional payloads, you'll be able to send a payload, and recieve payload in response if you so choose.  When you response, it will be sent directionally to the original payload which you can start a listener for a response on.
```ts
import trixi from 'trixi';
import { Server } from 'http';

const httpServer = new Server();
const app = trixi();

/**
 * Server Example
 */
httpServer.listen(8080, () => {
  const server = app.createServer({ httpServer });

  server.onConnection(connection => {
    console.log("A new socket connection has been established from", connection.remoteAddress);

    // Create your listener
    connection.onPayload(msg => {
      console.log("Recieved a payload from the client", msg.data);
      msg.reply({ recieved: true });
    })
  });
});

/**
 * Client Example
 */
const client = app.createClient({ url: "ws://localhost:8080" });

// Send a message to the server and await a response
client.send({ hello: "world" }).then(payload => {
  payload.onResponse(response => {
    console.log("Recieved response from the server", response.data);
  })
});
```

# Operator Payloads
Operator payloads are something that you can use to send a payload with a specific operator code attached to it.  Once you send the operator payload, the client can listen for it and if it choose to, it can reply in the same manor as the bidrectional payload.
```ts
import trixi from 'trixi';
import { Server } from 'http';

const httpServer = new Server();
const app = trixi();

/**
 * Server Example
 */
httpServer.listen(8080, () => {
  const server = app.createServer({ httpServer });

  server.onConnection(connection => {
    console.log("A new socket connection has been established from", connection.remoteAddress);

    // When a new connection is established, send the "hello:world" operator.
    connection.sendOp("hello:world", { greeting: "Hello World" });
  });
});

/**
 * Client Example
 */
const client = app.createClient({ url: "ws://localhost:8080" });

// Create a listener on the operator "hello:world"
client.onOp("hello:world", e => {
  console.log("New message on 'hello:world':", e.data);
});
```

> **NOTE**: You can send a string or a json object as a payload.