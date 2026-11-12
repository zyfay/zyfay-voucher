import { apiRequest, unwrapList } from './client';

/** POST /api/app/chat/start — mulai sesi live chat, balikin session_id */
export async function startChatSession({ name, email } = {}) {
  return apiRequest('/api/app/chat/start', {
    method: 'POST',
    body: { name, email },
  });
}

/** POST /api/app/chat/send — kirim pesan chat (teks/gambar/VN) */
export async function sendChatMessage({ sessionId, text, attachmentUrl, type = 'text' }) {
  return apiRequest('/api/app/chat/send', {
    method: 'POST',
    body: { session_id: sessionId, text, attachment_url: attachmentUrl, type },
  });
}

/** GET /api/app/chat/messages?session_id=xxx — ambil pesan chat (dipakai untuk polling) */
export async function fetchChatMessages(sessionId) {
  const data = await apiRequest(`/api/app/chat/messages?session_id=${encodeURIComponent(sessionId)}`);
  return unwrapList(data);
}

/**
 * POST /api/app/chat/upload — upload gambar/voice note buat chat.
 * fileUri = uri lokal dari ImagePicker/Audio recorder.
 */
export async function uploadChatFile({ sessionId, fileUri, fileName, mimeType }) {
  const form = new FormData();
  form.append('session_id', sessionId);
  form.append('file', {
    uri: fileUri,
    name: fileName || 'upload',
    type: mimeType || 'application/octet-stream',
  });

  // Upload pakai FormData -> jangan set Content-Type manual (biar boundary otomatis).
  const { BASE_URL, API_KEY } = await import('../constants/config');
  const res = await fetch(`${BASE_URL}/api/app/chat/upload`, {
    method: 'POST',
    headers: { 'x-api-key': API_KEY },
    body: form,
  });
  if (!res.ok) throw new Error(`Upload gagal (${res.status})`);
  return res.json();
}
