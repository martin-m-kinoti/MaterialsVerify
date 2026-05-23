<template>
  <app-layout title="Order Tracking">

    <!-- Search -->
    <div class="search-row">
      <input v-model="search" type="text" class="search-input" placeholder="Search by batch number or material…" />
    </div>

    <!-- Filter tabs -->
    <div class="filter-tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab"
        :class="{ 'tab--active': activeTab === tab }"
        @click="activeTab = tab"
      >{{ tab }}</button>
    </div>

    <!-- Two-column layout -->
    <div class="tracking-layout">

      <!-- Left: order list -->
      <div class="order-list">
        <div
          class="order-item"
          v-for="order in filteredOrders"
          :key="order.batch"
          :class="{ 'order-item--active': selectedOrder && selectedOrder.batch === order.batch }"
          @click="selectedOrder = order"
        >
          <div class="oi-header">
            <span class="oi-batch">{{ order.batch }}</span>
            <span class="oi-badge" :class="`badge-${order.statusType}`">{{ order.status }}</span>
          </div>
          <p class="oi-material">{{ order.material }}</p>
          <div class="oi-meta">
            <span class="oi-qty">Qty: {{ order.qty }}</span>
            <span class="oi-date">{{ order.date }}</span>
          </div>
        </div>
      </div>

      <!-- Right: detail panels -->
      <div class="detail-col" v-if="selectedOrder">

        <!-- Order details -->
        <div class="detail-panel">
          <div class="panel-header">
            <h3 class="panel-title">Order Details</h3>
            <span class="panel-badge" :class="`badge-${selectedOrder.statusType}`">{{ selectedOrder.status }}</span>
          </div>
          <div class="detail-grid">
            <div class="detail-item" v-for="(item, i) in orderDetails" :key="i">
              <span class="detail-label">{{ item.label }}</span>
              <span class="detail-value">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <!-- Delivery status timeline -->
        <div class="detail-panel">
          <h3 class="panel-title">Delivery Status</h3>
          <div class="timeline">
            <div
              class="timeline-step"
              v-for="(step, i) in deliverySteps"
              :key="i"
              :class="{ 'tl-done': step.done, 'tl-active': step.active }"
            >
              <div class="tl-dot"></div>
              <div class="tl-content">
                <span class="tl-label">{{ step.label }}</span>
                <span class="tl-time">{{ step.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Supplier chat -->
        <div class="detail-panel chat-panel">
          <h3 class="panel-title">Supplier Chat</h3>
          <div class="chat-messages" ref="chatBox">
            <div
              class="chat-msg"
              v-for="(msg, i) in chatMessages"
              :key="i"
              :class="msg.from === 'me' ? 'msg-me' : 'msg-them'"
            >
              <span class="msg-bubble">{{ msg.text }}</span>
              <span class="msg-time">{{ msg.time }}</span>
            </div>
          </div>
          <div class="chat-input-row">
            <input
              v-model="newMessage"
              type="text"
              class="chat-input"
              placeholder="Send a message…"
              @keyup.enter="sendMessage"
            />
            <button class="btn-send" @click="sendMessage">Send</button>
          </div>
        </div>

      </div>

      <!-- Right: empty state -->
      <div class="detail-empty" v-else>
        <p>Select an order from the list to view details.</p>
      </div>

    </div>

  </app-layout>
</template>

<script>
import AppLayout from '@/components/AppLayout.vue'

export default {
  name: 'OrderTracking',
  components: { AppLayout },
  data() {
    return {
      search: '',
      activeTab: 'All',
      tabs: ['All', 'Delivered', 'Dispatched', 'Approved', 'Pending'],
      selectedOrder: null,
      newMessage: '',
      orders: [
        { batch: 'BM-2024-001', material: 'Portland Cement 50kg',   qty: '50 bags',   status: 'Delivered',  statusType: 'green', date: '12 May 2026', supplier: 'Bamburi Cement Ltd',  amount: '37,500', orderNo: 'ORD-0094' },
        { batch: 'BM-2024-002', material: 'Deformed Steel Bar Y12', qty: '200 pcs',   status: 'Dispatched', statusType: 'blue',  date: '10 May 2026', supplier: 'Steel Makers EA',     amount: '24,000', orderNo: 'ORD-0093' },
        { batch: 'BM-2024-003', material: 'Roofing Timber 2×4',     qty: '120 pcs',   status: 'Dispatched', statusType: 'blue',  date: '09 May 2026', supplier: 'Kenya Timbers Ltd',   amount: '11,400', orderNo: 'ORD-0092' },
        { batch: 'BM-2024-004', material: 'Ballast Aggregate 20mm', qty: '5 tonnes',  status: 'Approved',   statusType: 'amber', date: '08 May 2026', supplier: 'Quarry Masters KE',   amount: '8,800',  orderNo: 'ORD-0091' },
      ],
      chatMessages: [
        { from: 'them', text: 'Your order has been confirmed and packed.', time: '09:14' },
        { from: 'me',   text: 'What time will it be dispatched?',           time: '09:22' },
        { from: 'them', text: 'Dispatch is scheduled for 2 PM today.',      time: '09:25' },
      ],
    }
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(o => {
        if (this.activeTab !== 'All' && o.status !== this.activeTab) return false
        const q = this.search.toLowerCase()
        if (q && !o.batch.toLowerCase().includes(q) && !o.material.toLowerCase().includes(q)) return false
        return true
      })
    },
    orderDetails() {
      if (!this.selectedOrder) return []
      const o = this.selectedOrder
      return [
        { label: 'Order No.',   value: '#' + o.orderNo },
        { label: 'Batch ID',    value: o.batch },
        { label: 'Material',    value: o.material },
        { label: 'Supplier',    value: o.supplier },
        { label: 'Quantity',    value: o.qty },
        { label: 'Amount',      value: 'KES ' + o.amount },
        { label: 'Order Date',  value: o.date },
        { label: 'Status',      value: o.status },
      ]
    },
    deliverySteps() {
      const all = [
        { label: 'Order Placed',    time: '08 May, 10:00 AM' },
        { label: 'Approved',        time: '08 May, 02:30 PM' },
        { label: 'Dispatched',      time: '10 May, 09:00 AM' },
        { label: 'In Transit',      time: '11 May, 08:00 AM' },
        { label: 'Delivered',       time: '12 May, 03:15 PM' },
      ]
      const statusMap = { 'Approved': 1, 'Dispatched': 2, 'In Transit': 3, 'Delivered': 4 }
      const status = this.selectedOrder ? this.selectedOrder.status : null
      const reached = statusMap[status] !== undefined ? statusMap[status] : 0
      return all.map((s, i) => ({
        ...s,
        done: i < reached,
        active: i === reached,
        time: i <= reached ? s.time : '—',
      }))
    },
  },
  methods: {
    sendMessage() {
      const text = this.newMessage.trim()
      if (!text) return
      const now = new Date()
      this.chatMessages.push({
        from: 'me',
        text,
        time: now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0'),
      })
      this.newMessage = ''
      this.$nextTick(() => {
        const box = this.$refs.chatBox
        if (box) box.scrollTop = box.scrollHeight
      })
    },
  },
}
</script>

<style scoped>
/* ── SEARCH ── */
.search-row { display: flex; }
.search-input {
  width: 55%;
  padding: 11px 18px;
  border-radius: 10px;
  border: 1.5px solid #e0ede8;
  background: #f8fdfb;
  color: #1a1a1a;
  font-size: 0.88rem;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: #0f7a55; background: #fff; }
.search-input::placeholder { color: #bbb; }

/* ── FILTER TABS ── */
.filter-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.tab {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1.5px solid #e0ede8;
  background: transparent;
  color: #777;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.tab:hover { border-color: #0f7a55; color: #0f7a55; }
.tab--active { background: #0f7a55; border-color: #0f7a55; color: #fff; font-weight: 600; }

/* ── TWO-COLUMN LAYOUT ── */
.tracking-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 20px;
  align-items: start;
  flex: 1;
}

/* ── ORDER LIST ── */
.order-list { display: flex; flex-direction: column; gap: 10px; }
.order-item {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.order-item:hover { border-color: #0f7a55; }
.order-item--active { border-color: #0f7a55; box-shadow: 0 0 0 3px rgba(15,122,85,0.1); }
.oi-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.oi-batch {
  font-family: 'Sora', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: #0f2419;
}
.oi-material { font-size: 0.85rem; color: #555; margin-bottom: 8px; line-height: 1.4; }
.oi-meta { display: flex; justify-content: space-between; }
.oi-qty, .oi-date { font-size: 0.75rem; color: #aaa; }

.oi-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
}
.badge-green { background: #e8f7f1; color: #0a5e40; border: 1px solid #b6e8d4; }
.badge-amber { background: #fff8e6; color: #8a5a00; border: 1px solid #f5d68a; }
.badge-blue  { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

/* ── DETAIL COLUMN ── */
.detail-col { display: flex; flex-direction: column; gap: 16px; }
.detail-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px dashed #c8ead9;
  border-radius: 14px;
  padding: 60px;
  color: #bbb;
  font-size: 0.875rem;
  background: #f8fdfb;
}

/* ── PANELS ── */
.detail-panel {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 14px;
  padding: 18px 20px;
}
.panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.panel-title {
  font-family: 'Sora', sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  color: #0f2419;
  margin-bottom: 14px;
}
.panel-header .panel-title { margin-bottom: 0; }
.panel-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
}

/* Order details grid */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
}
.detail-item { display: flex; flex-direction: column; gap: 2px; }
.detail-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; color: #bbb; }
.detail-value { font-size: 0.85rem; color: #333; font-weight: 500; }

/* Timeline */
.timeline { display: flex; flex-direction: column; gap: 0; }
.timeline-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 16px;
  position: relative;
}
.timeline-step:last-child { padding-bottom: 0; }
.timeline-step::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 18px;
  bottom: 0;
  width: 2px;
  background: #e8f0ec;
}
.timeline-step:last-child::before { display: none; }
.tl-done::before { background: #0f7a55; }

.tl-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #e0ede8;
  background: #fff;
  flex-shrink: 0;
  margin-top: 2px;
  transition: background 0.2s, border-color 0.2s;
  z-index: 1;
}
.tl-done .tl-dot  { background: #0f7a55; border-color: #0f7a55; }
.tl-active .tl-dot { background: #fff; border-color: #0f7a55; box-shadow: 0 0 0 3px rgba(15,122,85,0.15); }

.tl-content { display: flex; flex-direction: column; gap: 2px; }
.tl-label { font-size: 0.83rem; font-weight: 600; color: #444; }
.tl-time  { font-size: 0.72rem; color: #bbb; }
.tl-done .tl-label  { color: #0f2419; }
.tl-active .tl-label { color: #0f7a55; }

/* Chat */
.chat-panel { display: flex; flex-direction: column; gap: 12px; }
.chat-panel .panel-title { margin-bottom: 0; }
.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 160px;
  overflow-y: auto;
  padding: 4px 0;
}
.chat-msg { display: flex; flex-direction: column; gap: 2px; }
.msg-me   { align-items: flex-end; }
.msg-them { align-items: flex-start; }
.msg-bubble {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 0.83rem;
  line-height: 1.5;
  max-width: 80%;
}
.msg-me   .msg-bubble { background: #0f7a55; color: #fff; border-bottom-right-radius: 4px; }
.msg-them .msg-bubble { background: #f4faf7; color: #333; border: 1px solid #e0ede8; border-bottom-left-radius: 4px; }
.msg-time { font-size: 0.68rem; color: #ccc; }

.chat-input-row { display: flex; gap: 8px; }
.chat-input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #e0ede8;
  background: #f8fdfb;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s;
}
.chat-input:focus { border-color: #0f7a55; background: #fff; }
.chat-input::placeholder { color: #bbb; }
.btn-send {
  padding: 10px 18px;
  background: #0f7a55;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.btn-send:hover { background: #0a5e40; }

@media (max-width: 1000px) { .tracking-layout { grid-template-columns: 1fr; } }
</style>
