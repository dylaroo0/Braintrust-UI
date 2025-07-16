import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

app.post('/ingestDom', (req, res) => {
  console.log('POST /ingestDom');
  wss.clients.forEach((client) => {
    if (client.readyState === 1 /* WebSocket.OPEN */) {
      client.send(JSON.stringify(req.body));
    }
  });
  res.sendStatus(200);
});

const PORT = process.env.PORT || 5005;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
