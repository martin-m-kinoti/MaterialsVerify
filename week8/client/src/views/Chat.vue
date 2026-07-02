<template>
  <app-layout title="Chat">

    <div class="chat-page">

      <!-- Chat header -->
      <div class="chat-header">
        <div class="ch-avatar">🏗</div>
        <div class="ch-info">
          <p class="ch-name">marTex Hardware</p>
          <p class="ch-status">
            <span class="online-dot"></span> Available · Usually replies within the hour
          </p>
        </div>
      </div>

      <!-- Messages -->
      <div class="chat-body" ref="chatBody">
        <div v-if="loading" class="chat-loading">Loading messages…</div>

        <div v-else-if="!messages.length" class="chat-welcome">
          <div class="welcome-icon">💬</div>
          <p class="welcome-title">Start a conversation</p>
          <p class="welcome-sub">Ask marTex Hardware anything about materials, orders, delivery, or pricing.</p>
        </div>

        <template v-else>
          <div
            class="msg-row"
            v-for="(msg, i) in messages"
            :key="msg._id || i"
            :class="msg.sender === 'client' ? 'row-me' : 'row-them'"
          >
            <div v-if="msg.sender === 'admin'" class="msg-avatar">🏗</div>
            <div class="msg-wrap">
              <div class="msg-bubble" :class="msg.sender === 'client' ? 'bubble-me' : 'bubble-them'">
                {{ msg.text }}
              </div>
              <span class="msg-time">{{ formatTime(msg.createdAt) }}</span>
            </div>
          </div>
        </template>
      </div>

      <!-- Input bar -->
      <div class="chat-footer">
        <input
          v-model="draft"
          type="text"
          class="chat-input"
          placeholder="Type a message to marTex Hardware…"
          @keyup.enter="send"
          :disabled="sending"
        />
        <button class="btn-send" @click="send" :disabled="!draft.trim() || sending">
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>

    </div>

  </app-layout>
</template>

<script>
import AppLayout from '@/components/AppLayout.vue'
import axios from 'axios'

const API = 'http://localhost:9000'

export default {
  name: 'ChatPage',
  components: { AppLayout },
  data() {
    return {
      messages: [],
      draft: '',
      loading: true,
      sending: false,
      pollTimer: null,
    }
  },
  async created() {
    await this.fetchMessages()
    this.pollTimer = setInterval(() => this.fetchMessages(true), 4000)
  },
  beforeDestroy() {
    clearInterval(this.pollTimer)
  },
  methods: {
    async fetchMessages(silent = false) {
      if (!silent) this.loading = true
      try {
        const { data } = await axios.get(API + '/api/chat', { withCredentials: true })
        this.messages = data
        this.$nextTick(this.scrollBottom)
      } catch (e) { /* ignore */ }
      this.loading = false
    },
    async send() {
      const text = this.draft.trim()
      if (!text || this.sending) return
      this.sending = true
      this.draft = ''
      try {
        const { data } = await axios.post(API + '/api/chat', { text }, { withCredentials: true })
        this.messages.push(data)
        this.$nextTick(this.scrollBottom)
      } catch (e) {
        this.draft = text
      }
      this.sending = false
    },
    scrollBottom() {
      const el = this.$refs.chatBody
      if (el) el.scrollTop = el.scrollHeight
    },
    formatTime(iso) {
      if (!iso) return ''
      const d = new Date(iso)
      const today = new Date()
      if (d.toDateString() === today.toDateString()) {
        return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      }
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' +
             d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');

.chat-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 16px;
  overflow: hidden;
}

/* header */
.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  flex-shrink: 0;
}
.ch-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0f2419, #0f7a55);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}
.ch-name {
  font-family: 'Sora', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f2419;
}
.ch-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
  color: #888;
  margin-top: 2px;
}
.online-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  flex-shrink: 0;
}

/* messages area */
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fafcfb;
}
.chat-loading {
  text-align: center;
  font-size: 0.84rem;
  color: #bbb;
  margin: auto;
}
.chat-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: auto;
  padding: 20px;
  gap: 10px;
}
.welcome-icon { font-size: 2.5rem; }
.welcome-title {
  font-family: 'Sora', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #0f2419;
}
.welcome-sub { font-size: 0.84rem; color: #aaa; line-height: 1.6; max-width: 320px; }

/* message rows */
.msg-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.row-me    { flex-direction: row-reverse; }
.row-them  { flex-direction: row; }

.msg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0f2419, #0f7a55);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
}
.msg-wrap {
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-width: 70%;
}
.row-me  .msg-wrap { align-items: flex-end; }
.row-them .msg-wrap { align-items: flex-start; }

.msg-bubble {
  display: inline-block;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 0.88rem;
  line-height: 1.55;
  word-break: break-word;
}
.bubble-me {
  background: #0f7a55;
  color: #fff;
  border-bottom-right-radius: 4px;
}
.bubble-them {
  background: #fff;
  color: #333;
  border: 1px solid #e8f0ec;
  border-bottom-left-radius: 4px;
}
.msg-time { font-size: 0.68rem; color: #ccc; }

/* footer input */
.chat-footer {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  flex-shrink: 0;
}
.chat-input {
  flex: 1;
  padding: 11px 16px;
  border-radius: 24px;
  border: 1.5px solid #e0ede8;
  background: #f8fdfb;
  font-size: 0.88rem;
  font-family: 'DM Sans', sans-serif;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s;
}
.chat-input:focus { border-color: #0f7a55; background: #fff; }
.chat-input::placeholder { color: #bbb; }
.chat-input:disabled { opacity: 0.5; }

.btn-send {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #0f7a55;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  flex-shrink: 0;
}
.btn-send:hover:not(:disabled) { background: #0a5e40; transform: scale(1.05); }
.btn-send:disabled { opacity: 0.4; cursor: not-allowed; }

/* responsive */
@media (max-width: 768px) {
  .chat-body { padding: 14px 12px 8px; }
  .chat-footer { padding: 10px 12px; }
  .msg-wrap { max-width: 85%; }
}
@media (max-width: 480px) {
  .chat-header { padding: 12px 14px; }
  .msg-wrap { max-width: 90%; }
}
</style>
