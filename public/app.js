const form = document.querySelector('#chat-form');
const input = document.querySelector('#message-input');
const sendButton = document.querySelector('#send-button');
const welcome = document.querySelector('#welcome');
const messagesEl = document.querySelector('#messages');
const chatArea = document.querySelector('#chat-area');

// 대화 맥락은 브라우저 메모리에만 보관하며, 서버나 데이터베이스에 저장하지 않습니다.
let conversation = [];
let busy = false;

function showConversation() {
  welcome.classList.add('hidden');
  messagesEl.classList.add('visible');
}

function addMessage(role, content, { typing = false } = {}) {
  const row = document.createElement('div');
  row.className = `message ${role}`;
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = role === 'assistant' ? 'm' : '나';
  const body = document.createElement('div');
  body.className = 'message-body';
  if (typing) {
    body.classList.add('typing');
    body.setAttribute('aria-label', '답변 작성 중');
    for (let i = 0; i < 3; i += 1) body.append(document.createElement('span'));
  } else {
    body.textContent = content;
  }
  row.append(avatar, body);
  messagesEl.append(row);
  chatArea.scrollTop = chatArea.scrollHeight;
  return row;
}

function resizeInput() {
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
}

async function sendMessage(text) {
  const content = text.trim();
  if (!content || busy) return;
  showConversation();
  conversation.push({ role: 'user', content });
  addMessage('user', content);
  input.value = '';
  resizeInput();
  busy = true;
  sendButton.disabled = true;
  const pending = addMessage('assistant', '', { typing: true });

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversation }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '요청에 실패했습니다.');
    pending.querySelector('.message-body').textContent = data.reply;
    pending.querySelector('.message-body').classList.remove('typing');
    conversation.push({ role: 'assistant', content: data.reply });
  } catch (error) {
    pending.remove();
    const row = addMessage('assistant', '');
    const note = document.createElement('div');
    note.className = 'error-note';
    note.textContent = error.message || '네트워크 연결을 확인하고 다시 시도해 주세요.';
    row.querySelector('.message-body').append(note);
    conversation.pop();
  } finally {
    busy = false;
    sendButton.disabled = false;
    input.focus();
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  sendMessage(input.value);
});
input.addEventListener('input', resizeInput);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
document.querySelectorAll('.suggestion').forEach((button) => {
  button.addEventListener('click', () => sendMessage(button.dataset.prompt));
});
function resetChat() {
  if (busy) return;
  conversation = [];
  messagesEl.replaceChildren();
  messagesEl.classList.remove('visible');
  welcome.classList.remove('hidden');
  input.focus();
}
document.querySelector('#new-chat').addEventListener('click', resetChat);
document.querySelector('#mobile-new-chat').addEventListener('click', resetChat);
document.querySelector('#clear-chat').addEventListener('click', resetChat);
