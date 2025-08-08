
// relay-patch/server.js – add to your existing express server
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { askGemini, askOpenAI, askDeepSeek } from './services/index.js'

const app = express();
app.use(cors());
app.use(express.json());

app.post('/askAgent', async (req, res) => {
  try {
    const { agentId, prompt, history = [] } = req.body;
    let data;
    switch (agentId) {
      case 'designer':
        data = await askGemini(prompt, history);
        break;
      case 'developer':
        data = await askOpenAI(prompt, history);
        break;
      case 'engineer':
        data = await askDeepSeek(prompt, history);
        break;
      default:
        data = { text: 'Unknown agent' };
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log('Braintrust relay listening on', PORT));
