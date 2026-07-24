<template>
  <admin-layout title="Admin Dashboard">

    <!-- Stat cards -->
    <div class="stat-grid">
      <div class="stat-card" v-for="card in statCards" :key="card.label">
        <div class="sc-icon" :class="card.iconBg">{{ card.icon }}</div>
        <div class="sc-body">
          <p class="sc-label">{{ card.label }}</p>
          <p class="sc-value" :class="card.color">
            <template v-if="loading">—</template>
            <template v-else>{{ card.value }}</template>
          </p>
          <p class="sc-sub">{{ card.sub }}</p>
        </div>
      </div>
    </div>

    <!-- Recent orders -->
    <div class="panel">
      <div class="panel-header">
        <h2 class="panel-title">Recent Orders</h2>
        <router-link to="/admin/orders" class="panel-link">View all →</router-link>
      </div>

      <div v-if="loading" class="panel-state">Loading…</div>
      <div v-else-if="!recentOrders.length" class="panel-state">No orders yet.</div>

      <!-- Desktop table -->
      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Client</th>
              <th>Material</th>
              <th>Amount (KES)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in recentOrders" :key="o._id">
              <td class="td-id">#{{ o.orderNo }}</td>
              <td>{{ clientName(o) }}</td>
              <td class="td-material">{{ o.material }}</td>
              <td class="td-amount">{{ o.amount }}</td>
              <td><span class="status-badge" :class="'badge-' + o.statusType">{{ o.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile cards -->
      <div v-if="!loading && recentOrders.length" class="mobile-cards">
        <div class="order-card" v-for="o in recentOrders" :key="'m'+o._id">
          <div class="oc-top">
            <span class="td-id">#{{ o.orderNo }}</span>
            <span class="status-badge" :class="'badge-' + o.statusType">{{ o.status }}</span>
          </div>
          <p class="oc-client">{{ clientName(o) }}</p>
          <div class="oc-meta">
            <span class="td-material">{{ o.material }}</span>
            <span class="td-amount">KES {{ o.amount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent messages -->
    <div class="panel">
      <div class="panel-header">
        <h2 class="panel-title">Recent Client Messages</h2>
        <router-link to="/admin/chat" class="panel-link">View all →</router-link>
      </div>

      <div v-if="loading" class="panel-state">Loading…</div>
      <div v-else-if="!conversations.length" class="panel-state">No messages yet.</div>

      <div v-else class="convo-list">
        <div class="convo-row" v-for="c in conversations.slice(0, 5)" :key="c._id">
          <div class="cr-avatar">{{ convInitials(c.user) }}</div>
          <div class="cr-body">
            <p class="cr-name">{{ convName(c.user) }}</p>
            <p class="cr-last" :class="c.lastSender === 'client' ? 'cr-unread' : ''">{{ c.lastText }}</p>
          </div>
          <div class="cr-time">{{ relTime(c.lastAt) }}</div>
        </div>
      </div>
    </div>

  </admin-layout>
</template>

<script>
import AdminLayout from '@/components/AdminLayout.vue'
import axios from 'axios'

const API = 'https://backend-materials-verify.vercel.app'

export default {
  name: 'AdminDashboard',
  components: { AdminLayout },
  data() {
    return {
      loading: true,
      orders: [],
      users: [],
      conversations: [],
    }
  },
  computed: {
    statCards() {
      const pending   = this.orders.filter(o => o.status === 'Pending').length
      const delivered = this.orders.filter(o => o.status === 'Delivered').length
      const unread    = this.conversations.filter(c => c.lastSender === 'client').length
      return [
        { icon: '📦', iconBg: 'bg-green',  label: 'Total Orders',       value: this.orders.length,        sub: 'All time',           color: 'val-green'  },
        { icon: '⏳', iconBg: 'bg-amber',  label: 'Pending Orders',     value: pending,                   sub: 'Awaiting processing', color: 'val-amber'  },
        { icon: '✅', iconBg: 'bg-teal',   label: 'Delivered',          value: delivered,                 sub: 'Successfully completed', color: 'val-teal' },
        { icon: '💬', iconBg: 'bg-blue',   label: 'Unread Messages',    value: unread,                    sub: 'Client conversations', color: 'val-blue'  },
        { icon: '👥', iconBg: 'bg-purple', label: 'Registered Clients', value: this.users.length,         sub: 'Active accounts',    color: 'val-default'},
      ]
    },
    recentOrders() {
      return this.orders.slice(0, 6)
    },
  },
  async created() {
    await Promise.all([this.fetchOrders(), this.fetchUsers(), this.fetchConvos()])
    this.loading = false
  },
  methods: {
    async fetchOrders() {
      try {
        const { data } = await axios.get(API + '/api/admin/orders', { withCredentials: true })
        this.orders = data
      } catch (e) { /* ignore */ }
    },
    async fetchUsers() {
      try {
        const { data } = await axios.get(API + '/api/admin/users', { withCredentials: true })
        this.users = data.filter(u => u.role !== 'admin')
      } catch (e) { /* ignore */ }
    },
    async fetchConvos() {
      try {
        const { data } = await axios.get(API + '/api/admin/chat/conversations', { withCredentials: true })
        this.conversations = data
      } catch (e) { /* ignore */ }
    },
    clientName(o) {
      if (!o.userId || typeof o.userId !== 'object') return '—'
      const u = o.userId
      return ((u.firstName || '') + ' ' + (u.lastName || '')).trim() || u.email || '—'
    },
    convName(user) {
      if (!user) return 'Unknown'
      return ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || user.email || 'Unknown'
    },
    convInitials(user) {
      if (!user) return '?'
      const f = (user.firstName && user.firstName[0]) || ''
      const l = (user.lastName  && user.lastName[0])  || ''
      return (f + l).toUpperCase() || (user.email ? user.email[0].toUpperCase() : '?')
    },
    relTime(iso) {
      if (!iso) return ''
      const diff = Date.now() - new Date(iso).getTime()
      const m = Math.floor(diff / 60000)
      if (m < 1)  return 'now'
      if (m < 60) return m + 'm ago'
      const h = Math.floor(m / 60)
      if (h < 24) return h + 'h ago'
      return Math.floor(h / 24) + 'd ago'
    },
  },
}
</script>

<style scoped>
/* stat grid */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}
.stat-card {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.stat-card:hover { border-color: #0f7a55; box-shadow: 0 4px 16px rgba(15,122,85,0.08); }
.sc-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.bg-green  { background: #e8f7f1; }
.bg-amber  { background: #fff8e6; }
.bg-teal   { background: #e0f7f0; }
.bg-blue   { background: #eff6ff; }
.bg-purple { background: #f3e8ff; }

.sc-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.sc-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #aaa; }
.sc-value { font-family: 'Sora', sans-serif; font-size: 1.5rem; font-weight: 800; line-height: 1.1; }
.sc-sub   { font-size: 0.72rem; color: #bbb; }
.val-green   { color: #0f7a55; }
.val-amber   { color: #d97706; }
.val-teal    { color: #0d9488; }
.val-blue    { color: #1d4ed8; }
.val-default { color: #0f2419; }

/* panels */
.panel {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 14px;
  overflow: hidden;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
}
.panel-title { font-family: 'Sora', sans-serif; font-size: 0.88rem; font-weight: 700; color: #0f2419; }
.panel-link  { font-size: 0.82rem; font-weight: 600; color: #0f7a55; text-decoration: none; }
.panel-link:hover { text-decoration: underline; }
.panel-state { padding: 32px; text-align: center; color: #bbb; font-size: 0.86rem; }

/* table */
.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; min-width: 560px; }
.data-table th {
  padding: 10px 16px;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #aaa;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
}
.data-table td { padding: 12px 16px; color: #444; border-bottom: 1px solid #f7f7f7; vertical-align: middle; }
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover td { background: #f8fdfb; }

.td-id     { font-family: 'Sora', sans-serif; font-size: 0.78rem; font-weight: 700; color: #0f7a55; white-space: nowrap; }
.td-material { max-width: 220px; line-height: 1.4; }
.td-amount { font-family: 'Sora', sans-serif; font-weight: 700; color: #0f2419; white-space: nowrap; }

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
}
.badge-green { background: #e8f7f1; color: #0a5e40; border: 1px solid #b6e8d4; }
.badge-amber { background: #fff8e6; color: #8a5a00; border: 1px solid #f5d68a; }
.badge-blue  { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

/* mobile order cards — hidden on desktop */
.mobile-cards { display: none; flex-direction: column; gap: 0; }
.order-card { padding: 14px 16px; border-bottom: 1px solid #f0f0f0; display: flex; flex-direction: column; gap: 6px; }
.order-card:last-child { border-bottom: none; }
.oc-top { display: flex; align-items: center; justify-content: space-between; }
.oc-client { font-size: 0.84rem; font-weight: 600; color: #0f2419; }
.oc-meta { display: flex; justify-content: space-between; }

/* conversation list */
.convo-list { display: flex; flex-direction: column; }
.convo-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f7f7f7;
  transition: background 0.15s;
}
.convo-row:last-child { border-bottom: none; }
.convo-row:hover { background: #f8fdfb; }
.cr-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #0f7a55;
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cr-body { flex: 1; min-width: 0; }
.cr-name { font-size: 0.84rem; font-weight: 600; color: #0f2419; }
.cr-last { font-size: 0.76rem; color: #aaa; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
.cr-unread { color: #0f2419; font-weight: 500; }
.cr-time  { font-size: 0.7rem; color: #ccc; flex-shrink: 0; white-space: nowrap; }

/* responsive */
@media (max-width: 1200px) {
  .stat-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 900px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .table-wrap { display: none; }
  .mobile-cards { display: flex; }
}
@media (max-width: 600px) {
  .stat-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 380px) {
  .stat-grid { grid-template-columns: 1fr; }
}
</style>
