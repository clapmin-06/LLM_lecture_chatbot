import 'dotenv/config';
import app from './api/index.js';

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`챗봇이 http://localhost:${port} 에서 실행 중입니다.`));
