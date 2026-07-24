<template>
  <admin-layout title="Client Messages">

    <div class="adminchat">

      <!-- Left: conversation list -->
      <div class="convo-list" :class="{ 'convo-list--hidden': mobileThread }">
        <div class="convo-list-header">
          <p class="cl-title">Conversations</p>
          <span class="cl-count">{{ conversations.length }}</span>
        </div>

        <div v-if="loadingConvos" class="cl-state">Loading…</div>
        <div v-else-if="!conversations.length" class="cl-state">No client messages yet.</div>

        <div
          v-else
          class="convo-item"
          v-for="c in conversations"
          :key="c._id"
          :class="{ 'convo-item--active': selected && selected._id === c._id }"
          @click="openConvo(c)"
        >
          <div class="ci-avatar">{{ initials(c.user) }}</div>
          <div class="ci-body">
            <p class="ci-name">{{ fullName(c.user) }}</p>
            <p class="ci-last" :class="c.lastSender === 'client' ? 'ci-last--unread' : ''">
              <span v-if="c.lastSender === 'admin'" class="ci-you">You: </span>{{ c.lastText }}
            </p>
          </div>
          <div class="ci-meta">
            <span class="ci-time">{{ relTime(c.lastAt) }}</span>
            <span v-if="c.lastSender === 'client'" class="ci-dot"></span>
          </div>
        </div>
      </div>

      <!-- Right: thread -->
      <div class="thread" :class="{ 'thread--visible': !mobileThread || mobileThread }">

        <!-- Empty state -->
        <div v-if="!selected" class="thread-empty">
          <div class="te-icon">💬</div>
          <p class="te-title">Select a conversation</p>
          <p class="te-sub">Choose a client from the list to view and reply to their messages.</p>
        </div>

        <template v-else>
          <!-- Thread header -->
          <div class="thread-header">
            <button class="back-btn" @click="mobileThread = false; selected = null">← Back</button>
            <div class="th-avatar">{{ initials(selected.user) }}</div>
            <div class="th-info">
              <p class="th-name">{{ fullName(selected.user) }}</p>
              <p class="th-email">{{ selected.user ? selected.user.email : '' }}</p>
            </div>
          </div>

          <!-- Messages -->
          <div class="thread-body" ref="threadBody">
            <div v-if="loadingThread" class="thread-state">Loading…</div>
            <template v-else>
              <div
                class="msg-row"
                v-for="(msg, i) in threadMessages"
                :key="msg._id || i"
                :class="msg.sender === 'admin' ? 'row-me' : 'row-them'"
              >
                <div v-if="msg.sender === 'client'" class="msg-avatar">{{ initials(selected.user) }}</div>
                <div class="msg-wrap">
                  <div class="msg-bubble" :class="msg.sender === 'admin' ? 'bubble-me' : 'bubble-them'">
                    {{ msg.text }}
                  </div>
                  <span class="msg-time">{{ formatTime(msg.createdAt) }}</span>
                </div>
              </div>
            </template>
          </div>

          <!-- Reply input -->
          <div class="thread-footer">
            <input
              v-model="reply"
              type="text"
              class="reply-input"
              :placeholder="'Reply to ' + fullName(selected.user) + '…'"
              @keyup.enter="sendReply"
              :disabled="sending"
            />
            <button class="btn-send" @click="sendReply" :disabled="!reply.trim() || sending">
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </template>

      </div>
    </div>

  </admin-layout>
</template>

<script>
import AdminLayout from '@/components/AdminLayout.vue'
import axios from 'axios'

const API = 'https://backend-materials-verify.vercel.app'

export default {
  name: 'AdminChat',
  components: { AdminLayout },
  data() {
    return {
      conversations: [],
      loadingConvos: true,
      selected: null,
      threadMessages: [],
      loadingThread: false,
      reply: '',
      sending: false,
      mobileThread: false,
      pollTimer: null,
    }
  },
  async created() {
    await this.fetchConvos()
    this.pollTimer = setInterval(() => {
      this.fetchConvos(true)
      if (this.selected) this.fetchThread(this.selected, true)
    }, 4000)
  },
  beforeDestroy() {
    clearInterval(this.pollTimer)
  },
  methods: {
    async fetchConvos(silent = false) {
      if (!silent) this.loadingConvos = true
      try {
        const { data } = await axios.get(API + '/api/admin/chat/conversations', { withCredentials: true })
        this.conversations = data
      } catch (e) { /* ignore */ }
      this.loadingConvos = false
    },
    async openConvo(c) {
      this.selected = c
      this.mobileThread = true
      await this.fetchThread(c)
    },
    async fetchThread(c, silent = false) {
      if (!silent) this.loadingThread = true
      try {
        const userId = c._id
        const { data } = await axios.get(`${API}/api/admin/chat/${userId}`, { withCredentials: true })
        this.threadMessages = data
        this.$nextTick(this.scrollBottom)
      } catch (e) { /* ignore */ }
      this.loadingThread = false
    },
    async sendReply() {
      const text = this.reply.trim()
      if (!text || this.sending || !this.selected) return
      this.sending = true
      this.reply = ''
      try {
        const userId = this.selected._id
        const { data } = await axios.post(`${API}/api/admin/chat/${userId}`, { text }, { withCredentials: true })
        this.threadMessages.push(data)
        this.$nextTick(this.scrollBottom)
        await this.fetchConvos(true)
      } catch (e) {
        this.reply = text
      }
      this.sending = false
    },
    scrollBottom() {
      const el = this.$refs.threadBody
      if (el) el.scrollTop = el.scrollHeight
    },
    fullName(user) {
      if (!user) return 'Unknown'
      return ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || user.email || 'Unknown'
    },
    initials(user) {
      if (!user) return '?'
      const f = (user.firstName && user.firstName[0]) || ''
      const l = (user.lastName  && user.lastName[0])  || ''
      return (f + l).toUpperCase() || (user.email ? user.email[0].toUpperCase() : '?')
    },
    formatTime(iso) {
      if (!iso) return ''
      const d = new Date(iso)
      const today = new Date()
      if (d.toDateString() === today.toDateString()) {
        return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      }
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' · ' +
             d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    },
    relTime(iso) {
      if (!iso) return ''
      const diff = Date.now() - new Date(iso).getTime()
      const m = Math.floor(diff / 60000)
      if (m < 1)  return 'now'
      if (m < 60) return m + 'm'
      const h = Math.floor(m / 60)
      if (h < 24) return h + 'h'
      return Math.floor(h / 24) + 'd'
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');

.adminchat {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 16px;
  height: 100%;
  min-height: 0;
}

/* conversation list */
.convo-list {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.convo-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}
.cl-title { font-family: 'Sora', sans-serif; font-size: 0.88rem; font-weight: 700; color: #0f2419; }
.cl-count {
  background: #e8f7f1;
  color: #0a5e40;
  border: 1px solid #b6e8d4;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}
.cl-state { padding: 24px 16px; font-size: 0.84rem; color: #bbb; }

.convo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  cursor: pointer;
  border-bottom: 1px solid #f7f7f7;
  transition: background 0.15s;
}
.convo-item:last-child { border-bottom: none; }
.convo-item:hover { background: #f8fdfb; }
.convo-item--active { background: #f0faf5; border-left: 3px solid #0f7a55; }

.ci-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #0f7a55;
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ci-body { flex: 1; min-width: 0; }
.ci-name { font-size: 0.84rem; font-weight: 600; color: #0f2419; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ci-last {
  font-size: 0.75rem;
  color: #aaa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}
.ci-last--unread { color: #0f2419; font-weight: 500; }
.ci-you { color: #aaa; font-weight: 400; }

.ci-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.ci-time { font-size: 0.68rem; color: #ccc; }
.ci-dot { width: 8px; height: 8px; border-radius: 50%; background: #0f7a55; }

/* thread */
.thread {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.thread-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 10px;
  padding: 40px;
  text-align: center;
}
.te-icon { font-size: 2.4rem; }
.te-title { font-family: 'Sora', sans-serif; font-size: 0.95rem; font-weight: 700; color: #0f2419; }
.te-sub { font-size: 0.82rem; color: #aaa; line-height: 1.6; max-width: 280px; }

.thread-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}
.back-btn {
  display: none;
  background: none;
  border: none;
  color: #0f7a55;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}
.th-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #0f7a55;
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.th-name { font-family: 'Sora', sans-serif; font-size: 0.88rem; font-weight: 700; color: #0f2419; }
.th-email { font-size: 0.72rem; color: #aaa; margin-top: 1px; }

.thread-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fafcfb;
}
.thread-state { font-size: 0.84rem; color: #bbb; margin: auto; }

.msg-row { display: flex; align-items: flex-end; gap: 8px; }
.row-me   { flex-direction: row-reverse; }
.row-them { flex-direction: row; }
.msg-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #e8f0ec;
  color: #0f7a55;
  font-family: 'Sora', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.msg-wrap { display: flex; flex-direction: column; gap: 3px; max-width: 72%; }
.row-me   .msg-wrap { align-items: flex-end; }
.row-them .msg-wrap { align-items: flex-start; }
.msg-bubble {
  display: inline-block;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 0.86rem;
  line-height: 1.55;
  word-break: break-word;
}
.bubble-me   { background: #0f7a55; color: #fff; border-bottom-right-radius: 4px; }
.bubble-them { background: #fff; color: #333; border: 1px solid #e8f0ec; border-bottom-left-radius: 4px; }
.msg-time { font-size: 0.66rem; color: #ccc; }

.thread-footer {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  flex-shrink: 0;
}
.reply-input {
  flex: 1;
  padding: 10px 16px;
  border-radius: 24px;
  border: 1.5px solid #e0ede8;
  background: #f8fdfb;
  font-size: 0.86rem;
  font-family: 'DM Sans', sans-serif;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s;
}
.reply-input:focus { border-color: #0f7a55; background: #fff; }
.reply-input::placeholder { color: #bbb; }
.btn-send {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #0f7a55;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}
.btn-send:hover:not(:disabled) { background: #0a5e40; }
.btn-send:disabled { opacity: 0.4; cursor: not-allowed; }

/* responsive */
@media (max-width: 900px) {
  .adminchat { grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
  .convo-list { max-height: 300px; overflow-y: auto; }
}

@media (max-width: 768px) {
  .adminchat {
    position: relative;
    display: block;
    height: auto;
  }
  .convo-list { border-radius: 14px; }
  .convo-list--hidden { display: none; }
  .thread {
    position: fixed;
    inset: 0;
    z-index: 200;
    border-radius: 0;
    border: none;
  }
  .back-btn { display: block; }
}
</style>
