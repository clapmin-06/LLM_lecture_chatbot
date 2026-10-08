# 모아 AI 챗봇

HTML, CSS, JavaScript와 Express로 만든 간단한 대화형 챗봇입니다. OpenAI `gpt-4o-mini`를 사용하며, 현재 탭을 새로고침하기 전까지 대화 맥락을 브라우저 메모리에 보관합니다. 데이터베이스는 사용하지 않습니다.

## 로컬 실행

1. Node.js 18 이상을 준비합니다.
2. `.env.example`을 복사해 `.env` 파일을 만들고 API 키를 설정합니다. `.env`는 Git에서 제외됩니다.

   ```env
   OPENAI_API_KEY=your_api_key
   ```

3. 의존성을 설치하고 서버를 실행합니다.

   ```bash
   npm install
   npm start
   ```

4. 브라우저에서 `http://localhost:3000`을 엽니다.

## Vercel 배포

프로젝트를 Vercel에 가져온 뒤 Project Settings → Environment Variables에 `OPENAI_API_KEY`를 추가하고 배포합니다. 프레임워크 프리셋은 Other로 두어도 됩니다. `vercel.json`이 Express 앱에 페이지와 API 요청을 연결합니다.

대화 내역은 클라이언트 메모리에만 있으며 요청마다 최근 메시지를 API로 전송합니다. 서버 로그에는 API 오류 요약만 기록하고 대화 내용은 기록하지 않습니다.
