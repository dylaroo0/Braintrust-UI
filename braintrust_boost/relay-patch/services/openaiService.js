
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function askOpenAI(prompt, history = []) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      ...history,
      { role: 'user', content: prompt }
    ]
  });
  return { text: response.choices[0].message.content };
}
