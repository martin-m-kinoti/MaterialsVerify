<template>
  <admin-layout title="Orders — marTex">

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <input v-model="search" type="text" class="search-input" placeholder="Search by order ID, material, or client…" />
        <select v-model="statusFilter" class="filter-select" @change="fetchOrders">
          <option value="">All statuses</option>
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div class="orders-count">{{ filtered.length }} order{{ filtered.length !== 1 ? 's' : '' }}</div>
    </div>

    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>
    <div v-if="errorMsg"   class="alert alert-error">{{ errorMsg }}</div>

    <!-- Desktop table -->
    <div class="table-card">
      <div v-if="loading" class="state-msg">Loading orders…</div>
      <div v-else-if="!filtered.length" class="state-msg">No orders found.</div>
      <div v-else class="table-wrap">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Client</th>
              <th>Material</th>
              <th>Qty</th>
              <th>Amount (KES)</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filtered" :key="order._id">
              <td class="td-id">#{{ order.orderNo }}</td>
              <td class="td-client">
                <span class="client-name">{{ clientName(order) }}</span>
                <span class="client-email">{{ clientEmail(order) }}</span>
              </td>
              <td class="td-material">{{ order.material }}</td>
              <td class="td-qty">{{ order.qty }}</td>
              <td class="td-amount">{{ order.amount }}</td>
              <td class="td-date">{{ order.date }}</td>
              <td>
                <span class="status-badge" :class="`badge-${order.statusType}`">{{ order.status }}</span>
              </td>
              <td>
                <select class="status-select" :value="order.status" @change="updateStatus(order, $event.target.value)">
                  <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile cards -->
    <div v-if="!loading && filtered.length" class="mobile-cards">
      <div class="order-card" v-for="order in filtered" :key="'m'+order._id">
        <div class="oc-top">
          <span class="oc-id">#{{ order.orderNo }}</span>
          <span class="status-badge" :class="`badge-${order.statusType}`">{{ order.status }}</span>
        </div>
        <p class="oc-client">{{ clientName(order) }}</p>
        <p class="oc-material">{{ order.material }}</p>
        <div class="oc-meta">
          <span class="oc-amount">KES {{ order.amount }}</span>
          <span class="oc-date">{{ order.date }}</span>
        </div>
        <select class="status-select status-select--full" :value="order.status" @change="updateStatus(order, $event.target.value)">
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
    </div>

    <!-- Order detail drawer -->
    <transition name="slide">
      <div v-if="detail" class="detail-overlay" @click.self="detail = null">
        <div class="detail-panel">
          <div class="dp-header">
            <h3 class="dp-title">Order #{{ detail.orderNo }}</h3>
            <button class="dp-close" @click="detail = null">×</button>
          </div>
          <div class="dp-body">
            <div class="dp-section">
              <p class="dp-label">Client</p>
              <p class="dp-value">{{ clientName(detail) }} — {{ clientEmail(detail) }}</p>
            </div>
            <div class="dp-section">
              <p class="dp-label">Material(s)</p>
              <p class="dp-value">{{ detail.material }}</p>
            </div>
            <div class="dp-section">
              <p class="dp-label">Delivery</p>
              <p class="dp-value" v-if="detail.delivery">
                {{ detail.delivery.name }} · {{ detail.delivery.phone }}<br/>
                {{ detail.delivery.address }}, {{ detail.delivery.county }}<br/>
                Expected: {{ detail.delivery.date }}
              </p>
            </div>
            <div class="dp-section">
              <p class="dp-label">Grand Total</p>
              <p class="dp-value dp-total">KES {{ detail.amount }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </admin-layout>
</template>

<script>
import AdminLayout from '@/components/AdminLayout.vue'
import axios from 'axios'

const API = 'http://localhost:9000'

export default {
  name: 'AdminOrders',
  components: { AdminLayout },
  data() {
    return {
      orders: [],
      search: '',
      statusFilter: '',
      loading: true,
      successMsg: '',
      errorMsg: '',
      detail: null,
      statuses: ['Pending', 'Approved', 'Dispatched', 'In Transit', 'Delivered'],
    }
  },
  computed: {
    filtered() {
      const q = this.search.toLowerCase()
      return this.orders.filter(o => {
        if (this.statusFilter && o.status !== this.statusFilter) return false
        if (!q) return true
        return (
          o.orderNo.toLowerCase().includes(q) ||
          o.material.toLowerCase().includes(q) ||
          this.clientName(o).toLowerCase().includes(q) ||
          this.clientEmail(o).toLowerCase().includes(q)
        )
      })
    },
  },
  created() {
    this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      this.loading = true
      try {
        const params = this.statusFilter ? { status: this.statusFilter } : {}
        const { data } = await axios.get(API + '/api/admin/orders', { params, withCredentials: true })
        this.orders = data
      } catch (e) {
        this.errorMsg = 'Failed to load orders.'
      }
      this.loading = false
    },
    clientName(o) {
      if (!o.userId) return 'Unknown'
      const u = o.userId
      if (typeof u === 'object') return ((u.firstName || '') + ' ' + (u.lastName || '')).trim() || u.email || '—'
      return '—'
    },
    clientEmail(o) {
      if (!o.userId || typeof o.userId !== 'object') return ''
      return o.userId.email || ''
    },
    async updateStatus(order, status) {
      try {
        const { data } = await axios.patch(
          `${API}/api/admin/orders/${order._id}/status`,
          { status },
          { withCredentials: true }
        )
        const idx = this.orders.findIndex(o => o._id === order._id)
        if (idx !== -1) {
          this.$set(this.orders, idx, Object.assign({}, this.orders[idx], {
            status: data.status,
            statusType: data.statusType,
          }))
        }
        this.flash('success', `Order #${order.orderNo} updated to ${status}`)
      } catch (e) {
        this.flash('error', 'Failed to update status.')
      }
    },
    flash(type, msg) {
      if (type === 'success') { this.successMsg = msg; this.errorMsg = '' }
      else                    { this.errorMsg = msg;   this.successMsg = '' }
      setTimeout(() => { this.successMsg = ''; this.errorMsg = '' }, 3000)
    },
  },
}
</script>

<style scoped>
/* toolbar */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.toolbar-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; flex: 1; }
.search-input {
  flex: 1;
  min-width: 200px;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1.5px solid #e0ede8;
  background: #f8fdfb;
  font-size: 0.88rem;
  font-family: 'DM Sans', sans-serif;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: #0f7a55; background: #fff; }
.search-input::placeholder { color: #bbb; }
.filter-select {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #e0ede8;
  background: #f8fdfb;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  color: #555;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}
.filter-select:focus { border-color: #0f7a55; }
.orders-count { font-size: 0.8rem; color: #aaa; font-weight: 500; white-space: nowrap; }

/* alerts */
.alert {
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
}
.alert-success { background: #e8f7f1; color: #0a5e40; border: 1px solid #b6e8d4; }
.alert-error   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

/* table */
.table-card {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 14px;
  overflow: hidden;
}
.state-msg { padding: 40px; text-align: center; color: #bbb; font-size: 0.88rem; }
.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.orders-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; min-width: 760px; }
.orders-table th {
  padding: 11px 14px;
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
.orders-table td {
  padding: 12px 14px;
  color: #444;
  border-bottom: 1px solid #f7f7f7;
  vertical-align: middle;
}
.orders-table tbody tr:last-child td { border-bottom: none; }
.orders-table tbody tr:hover td { background: #f8fdfb; }

.td-id { font-family: 'Sora', sans-serif; font-size: 0.78rem; font-weight: 700; color: #0f7a55; white-space: nowrap; }
.td-client { display: flex; flex-direction: column; gap: 2px; }
.client-name { font-weight: 600; color: #0f2419; font-size: 0.84rem; }
.client-email { font-size: 0.72rem; color: #aaa; }
.td-material { max-width: 200px; line-height: 1.4; }
.td-qty, .td-date { white-space: nowrap; color: #777; font-size: 0.82rem; }
.td-amount { font-family: 'Sora', sans-serif; font-weight: 700; color: #0f2419; white-space: nowrap; }

/* badges */
.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  white-space: nowrap;
}
.badge-green { background: #e8f7f1; color: #0a5e40; border: 1px solid #b6e8d4; }
.badge-amber { background: #fff8e6; color: #8a5a00; border: 1px solid #f5d68a; }
.badge-blue  { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

/* status select */
.status-select {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1.5px solid #e0ede8;
  background: #f8fdfb;
  font-size: 0.8rem;
  font-family: 'DM Sans', sans-serif;
  color: #555;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
}
.status-select:focus { border-color: #0f7a55; }
.status-select--full { width: 100%; }

/* mobile cards (hidden on desktop) */
.mobile-cards { display: none; flex-direction: column; gap: 12px; }
.order-card {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.oc-top { display: flex; align-items: center; justify-content: space-between; }
.oc-id { font-family: 'Sora', sans-serif; font-size: 0.82rem; font-weight: 700; color: #0f7a55; }
.oc-client { font-size: 0.84rem; font-weight: 600; color: #0f2419; }
.oc-material { font-size: 0.82rem; color: #555; line-height: 1.4; }
.oc-meta { display: flex; justify-content: space-between; }
.oc-amount { font-family: 'Sora', sans-serif; font-weight: 700; color: #0f2419; font-size: 0.88rem; }
.oc-date { font-size: 0.76rem; color: #aaa; }

/* detail drawer */
.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 400;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.detail-panel {
  background: #fff;
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-width: 560px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.dp-header { display: flex; align-items: center; justify-content: space-between; }
.dp-title { font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 700; color: #0f2419; }
.dp-close {
  width: 28px; height: 28px; border-radius: 50%;
  background: #f0f0f0; border: none; font-size: 1rem;
  cursor: pointer; line-height: 1;
}
.dp-body { display: flex; flex-direction: column; gap: 14px; }
.dp-section { display: flex; flex-direction: column; gap: 3px; }
.dp-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #bbb; }
.dp-value { font-size: 0.88rem; color: #333; line-height: 1.55; }
.dp-total { font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 800; color: #0f7a55; }

.slide-enter-active, .slide-leave-active { transition: opacity 0.2s ease; }
.slide-enter, .slide-leave-to { opacity: 0; }

/* responsive */
@media (max-width: 900px) {
  .table-card { display: none; }
  .mobile-cards { display: flex; }
}
@media (max-width: 768px) {
  .toolbar { flex-direction: column; align-items: stretch; }
  .toolbar-left { flex-direction: column; }
  .search-input { min-width: unset; }
}
</style>
