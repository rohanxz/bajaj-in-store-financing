import { createServer } from 'vite';

const server = await createServer({
  root: new URL('.', import.meta.url).pathname,
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
});

await server.listen();
const info = server.httpServer?.address();
const port = typeof info === 'object' && info ? info.port : 5173;
console.log(`Vite server running at http://localhost:${port}`);

// Keep the event loop active indefinitely
setInterval(() => {}, 1 << 30);
