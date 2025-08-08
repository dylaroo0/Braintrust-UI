
import fetch from 'node-fetch';

export async function askGemini(prompt, history = []) {
  const body = {
    contents: [
      ...history,
      { role: 'user', parts: [{ text: prompt }] }
    ]
  };

  const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GEMINI_API_KEY
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) throw new Error(await resp.text());
  const json = await resp.json();
  return { text: json.candidates?.[0]?.content?.parts?.[0]?.text || '' };
}
