import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');

app.use(express.json({ limit: '32kb' }));
app.use(express.static(publicDir));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: '대화 내용을 입력해 주세요.' });
  }

  const conversation = messages.slice(-20);
  if (conversation.some((message) =>
    !message || !['user', 'assistant'].includes(message.role) ||
    typeof message.content !== 'string' || message.content.length > 8000
  )) {
    return res.status(400).json({ error: '메시지 형식이 올바르지 않습니다.' });
  }
  if (conversation.at(-1)?.role !== 'user') {
    return res.status(400).json({ error: '마지막 메시지는 사용자 메시지여야 합니다.' });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: '서버에 OPENAI_API_KEY가 설정되지 않았습니다.' });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '너는 친절하고 정확한 한국어 AI 도우미야. 친구와 대화하듯 편안하고 자연스러운 반말로 답해. 이전 대화의 맥락을 고려하고, 모르는 내용은 솔직하게 말해.' },
        ...conversation,
      ],
      temperature: 0.7,
    });
    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) throw new Error('모델이 빈 응답을 반환했습니다.');
    return res.json({ reply });
  } catch (error) {
    console.error('OpenAI request failed:', error.message);
    return res.status(502).json({ error: '답변을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.' });
  }
});

app.get('*', (_req, res) => res.sendFile(path.join(publicDir, 'index.html')));

export default app;
