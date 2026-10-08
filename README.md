# 모아 AI 챗봇

HTML, CSS, JavaScript와 Express로 만든 대화형 챗봇입니다. OpenAI `gpt-4o-mini`를 사용하며, 대화 맥락은 브라우저 메모리에만 유지합니다. 새로고침하면 대화가 초기화됩니다.

## 로컬 실행

필요한 버전은 Node.js 24입니다. `.env.example`을 복사해 `.env`를 만들고 `OPENAI_API_KEY`를 설정한 다음 실행하세요.

```bash
npm install
npm start
```

브라우저에서 `http://localhost:3000`을 엽니다.

## Vercel 배포

GitHub 저장소를 Vercel 프로젝트로 가져오면 Express 앱을 자동 감지해 배포합니다. Root Directory는 저장소 루트로 두고, 별도의 Build Command나 Output Directory는 지정하지 않아도 됩니다. Project Settings → Environment Variables에 `OPENAI_API_KEY`를 설정한 뒤 배포하세요.

`server.js`가 Vercel에서 Express 앱 진입점으로 사용되고, `public/`의 프런트엔드 파일은 정적 자산으로 제공됩니다. 로컬 실행은 `local.js`에서 Express 앱을 포트에 연결합니다. `/api/health`로 서버 상태를 확인할 수 있습니다.

대화 기록은 브라우저에만 저장되고 서버는 요청 때 전달된 최근 대화 내용을 OpenAI에 보냅니다. API 키는 백엔드에서만 사용됩니다.
