
import fetch from 'node-fetch';

export async function askDeepSeek(prompt, history = []) {
  const body = {
    model: 'deepseek-chat',
    messages: [
      ...history,
      { role: 'user', content: prompt }
    ]
  };

  const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) throw new Error(await resp.text());
  const json = await resp.json();
  return { text: json.choices?.[0]?.message?.content || '' };
}
