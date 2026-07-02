<template>
  <app-layout title="Overview">

    <!-- Welcome + quick actions -->
    <div class="welcome-card">
      <div class="wc-left">
        <p class="wc-greeting">Welcome back, {{ firstName }} 👋</p>
        <p class="wc-sub">Here's a summary of your activity with marTex Hardware.</p>
      </div>
      <div class="wc-actions">
        <router-link to="/materials" class="wc-btn wc-btn--primary">Browse Materials</router-link>
        <router-link to="/chat"      class="wc-btn wc-btn--ghost">Chat with marTex</router-link>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="stat-cards">
      <div class="stat-card" v-for="card in statCards" :key="card.label">
        <div class="sc-top">
          <p class="sc-label">{{ card.label }}</p>
          <span class="sc-icon" :class="card.iconBg">{{ card.icon }}</span>
        </div>
        <p class="sc-value" :class="card.color">
          <template v-if="loading">—</template>
          <template v-else>{{ card.value }}</template>
        </p>
        <p class="sc-sub">{{ card.sub }}</p>
      </div>
    </div>

    <!-- Recent orders -->
    <div class="orders-section">
      <div class="section-header">
        <h2 class="section-title">My Recent Orders</h2>
        <router-link to="/order-tracking" class="view-all-link">View all →</router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="empty-state">Loading your orders…</div>

      <!-- No orders -->
      <div v-else-if="!recentOrders.length" class="empty-state">
        <p>You haven't placed any orders yet.</p>
        <router-link to="/materials" class="empty-cta">Browse materials to get started →</router-link>
      </div>

      <!-- Desktop table -->
      <div v-else class="table-wrap">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Material</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount (KES)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order._id">
              <td class="td-id">#{{ order.orderNo }}</td>
              <td class="td-material">{{ order.material }}</td>
              <td class="td-supplier">marTex Hardware</td>
              <td class="td-date">{{ order.date }}</td>
              <td>
                <span class="order-badge" :class="'badge-' + order.statusType">{{ order.status }}</span>
              </td>
              <td class="td-amount">{{ order.amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile card list -->
      <div v-if="!loading && recentOrders.length" class="order-cards-mobile">
        <div class="order-card-m" v-for="order in recentOrders" :key="'m'+order._id">
          <div class="ocm-top">
            <span class="ocm-id">#{{ order.orderNo }}</span>
            <span class="order-badge" :class="'badge-' + order.statusType">{{ order.status }}</span>
          </div>
          <p class="ocm-material">{{ order.material }}</p>
          <div class="ocm-meta">
            <span class="ocm-date">{{ order.date }}</span>
            <span class="ocm-amount">KES {{ order.amount }}</span>
          </div>
        </div>
      </div>

      <div v-if="!loading && recentOrders.length" class="orders-footer">
        <router-link to="/order-tracking" class="view-all-link">Track all orders →</router-link>
      </div>
    </div>

    <!-- marTex supplier card -->
    <div class="supplier-card">
      <div class="sup-left">
        <div class="sup-icon">🏗</div>
        <div>
          <p class="sup-name">marTex Hardware</p>
          <p class="sup-detail">Verified supplier · KEBS certified · Kiambu, Kenya</p>
          <p class="sup-detail">All {{ materialsCount }} materials sourced from marTex Hardware</p>
        </div>
      </div>
      <router-link to="/chat" class="sup-chat-btn">Send a message →</router-link>
    </div>

  </app-layout>
</template>

<script>
import AppLayout from '@/components/AppLayout.vue'
import axios from 'axios'

const API = 'http://localhost:9000'

export default {
  name: 'Dashboard',
  components: { AppLayout },
  data() {
    return {
      loading: true,
      firstName: '',
      orders: [],
      materialsCount: 8,
    }
  },
  computed: {
    recentOrders() {
      return this.orders.slice(0, 5)
    },
    statCards() {
      const total     = this.orders.length
      const pending   = this.orders.filter(o => o.status === 'Pending').length
      const inTransit = this.orders.filter(o => o.status === 'Dispatched' || o.status === 'In Transit').length
      const delivered = this.orders.filter(o => o.status === 'Delivered').length

      return [
        {
          icon: '📦', iconBg: 'bg-green',
          label: 'My Total Orders', value: total,
          sub: 'All time', color: 'val-green',
        },
        {
          icon: '⏳', iconBg: 'bg-amber',
          label: 'Pending', value: pending,
          sub: 'Awaiting processing', color: 'val-amber',
        },
        {
          icon: '🚚', iconBg: 'bg-blue',
          label: 'In Transit', value: inTransit,
          sub: 'On the way', color: 'val-blue',
        },
        {
          icon: '✅', iconBg: 'bg-teal',
          label: 'Delivered', value: delivered,
          sub: 'Successfully received', color: 'val-teal',
        },
      ]
    },
  },
  async created() {
    const raw = localStorage.getItem('mv_user')
    if (raw) {
      try {
        const u = JSON.parse(raw)
        this.firstName = u.firstName || (u.email ? u.email.split('@')[0] : 'there')
      } catch (e) { this.firstName = 'there' }
    }
    await this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      this.loading = true
      try {
        const { data } = await axios.get(API + '/api/orders/my', { withCredentials: true })
        this.orders = data
      } catch (e) { /* ignore — AppLayout handles auth */ }
      this.loading = false
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');

/* welcome card */
.welcome-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #0f2419 0%, #0f7a55 100%);
  border-radius: 16px;
  flex-wrap: wrap;
}
.wc-greeting {
  font-family: 'Sora', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}
.wc-sub { font-size: 0.82rem; color: rgba(255,255,255,0.6); }
.wc-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.wc-btn {
  padding: 9px 20px;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}
.wc-btn--primary { background: #fff; color: #0f7a55; }
.wc-btn--primary:hover { background: #e6f7f1; }
.wc-btn--ghost  { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.25); }
.wc-btn--ghost:hover { background: rgba(255,255,255,0.22); }

/* stat cards */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.stat-card {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.stat-card:hover { border-color: #0f7a55; box-shadow: 0 4px 16px rgba(15,122,85,0.08); }
.sc-top { display: flex; align-items: center; justify-content: space-between; }
.sc-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #aaa;
}
.sc-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
}
.bg-green  { background: #e8f7f1; }
.bg-amber  { background: #fff8e6; }
.bg-blue   { background: #eff6ff; }
.bg-teal   { background: #e0f7f0; }

.sc-value {
  font-family: 'Sora', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}
.sc-sub { font-size: 0.74rem; color: #aaa; }
.val-green  { color: #0f7a55; }
.val-amber  { color: #d97706; }
.val-blue   { color: #1d4ed8; }
.val-teal   { color: #0d9488; }

/* orders section */
.orders-section {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 14px;
  overflow: hidden;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
}
.section-title {
  font-family: 'Sora', sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  color: #0f2419;
}
.view-all-link {
  font-size: 0.82rem;
  font-weight: 600;
  color: #0f7a55;
  text-decoration: none;
}
.view-all-link:hover { text-decoration: underline; }

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #bbb;
  font-size: 0.88rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.empty-cta {
  font-size: 0.84rem;
  font-weight: 600;
  color: #0f7a55;
  text-decoration: none;
}
.empty-cta:hover { text-decoration: underline; }

/* table */
.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
  min-width: 580px;
}
.orders-table th {
  padding: 10px 16px;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #aaa;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  white-space: nowrap;
}
.orders-table td {
  padding: 12px 16px;
  color: #444;
  border-bottom: 1px solid #f7f7f7;
  vertical-align: middle;
}
.orders-table tbody tr:last-child td { border-bottom: none; }
.orders-table tbody tr:hover td { background: #f8fdfb; }

.td-id       { font-family: 'Sora', sans-serif; font-size: 0.78rem; font-weight: 700; color: #0f7a55; white-space: nowrap; }
.td-material { max-width: 200px; line-height: 1.4; }
.td-supplier { color: #0f7a55; font-weight: 600; font-size: 0.82rem; white-space: nowrap; }
.td-date     { color: #aaa; font-size: 0.8rem; white-space: nowrap; }
.td-amount   { font-family: 'Sora', sans-serif; font-weight: 700; color: #0f2419; white-space: nowrap; }

/* mobile card list */
.order-cards-mobile { display: none; }
.order-card-m {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.order-card-m:last-child { border-bottom: none; }
.ocm-top { display: flex; align-items: center; justify-content: space-between; }
.ocm-id  { font-family: 'Sora', sans-serif; font-size: 0.8rem; font-weight: 700; color: #0f7a55; }
.ocm-material { font-size: 0.88rem; color: #0f2419; font-weight: 500; }
.ocm-meta { display: flex; justify-content: space-between; align-items: center; }
.ocm-date   { font-size: 0.76rem; color: #aaa; }
.ocm-amount { font-family: 'Sora', sans-serif; font-size: 0.84rem; font-weight: 700; color: #0f2419; }

.order-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
}
.badge-green { background: #e8f7f1; color: #0a5e40; border: 1px solid #b6e8d4; }
.badge-amber { background: #fff8e6; color: #8a5a00; border: 1px solid #f5d68a; }
.badge-blue  { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

.orders-footer {
  padding: 12px 20px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
}

/* supplier card */
.supplier-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  background: #f8fdfb;
  border: 1.5px solid #c8ead9;
  border-radius: 14px;
  flex-wrap: wrap;
}
.sup-left { display: flex; align-items: center; gap: 14px; }
.sup-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #e8f7f1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}
.sup-name {
  font-family: 'Sora', sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  color: #0f2419;
  margin-bottom: 3px;
}
.sup-detail { font-size: 0.76rem; color: #777; line-height: 1.5; }
.sup-chat-btn {
  display: inline-block;
  padding: 9px 18px;
  background: #0f7a55;
  color: #fff;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s;
}
.sup-chat-btn:hover { background: #0a5e40; }

/* responsive */
@media (max-width: 1100px) {
  .stat-cards { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .stat-cards { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .table-wrap { display: none; }
  .order-cards-mobile { display: flex; flex-direction: column; }
  .welcome-card { flex-direction: column; align-items: flex-start; }
  .wc-actions { width: 100%; }
  .wc-btn { flex: 1; text-align: center; }
}
@media (max-width: 480px) {
  .stat-cards { grid-template-columns: 1fr 1fr; }
  .supplier-card { flex-direction: column; align-items: flex-start; }
  .sup-chat-btn { width: 100%; text-align: center; }
}
</style>
