<template>
  <app-layout title="Dashboard">

    <!-- Search bar -->
    <div class="search-wrap">
      <input type="text" class="search-input" placeholder="Search materials, orders, suppliers…" />
    </div>

    <!-- Stat cards -->
    <div class="stat-cards">
      <div class="stat-card" v-for="(card, i) in statCards" :key="i">
        <p class="sc-label">{{ card.label }}</p>
        <div class="sc-visual"></div>
        <p class="sc-value" :class="card.color">{{ card.value }}</p>
        <p class="sc-sub">{{ card.sub }}</p>
      </div>
    </div>

    <!-- Recent orders table -->
    <div class="orders-section">
      <h2 class="orders-heading">Recent Orders</h2>
      <div class="table-wrap">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Material</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Amount (KES)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, i) in recentOrders" :key="i">
              <td class="td-id">{{ order.id }}</td>
              <td>{{ order.material }}</td>
              <td>{{ order.supplier }}</td>
              <td>
                <span class="order-badge" :class="`badge-${order.statusType}`">
                  {{ order.status }}
                </span>
              </td>
              <td>{{ order.amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Mobile card list (shown instead of table on small screens) -->
      <div class="order-cards-mobile">
        <div class="order-card-m" v-for="(order, i) in recentOrders" :key="'m'+i">
          <div class="ocm-top">
            <span class="ocm-id">{{ order.id }}</span>
            <span class="order-badge" :class="`badge-${order.statusType}`">{{ order.status }}</span>
          </div>
          <p class="ocm-material">{{ order.material }}</p>
          <div class="ocm-meta">
            <span class="ocm-supplier">{{ order.supplier }}</span>
            <span class="ocm-amount">KES {{ order.amount }}</span>
          </div>
        </div>
      </div>
      <div class="orders-footer">
        <router-link to="/orders" class="view-all-link">View all orders →</router-link>
      </div>
    </div>

  </app-layout>
</template>

<script>
import AppLayout from '@/components/AppLayout.vue'

export default {
  name: 'Dashboard',
  components: { AppLayout },
  data() {
    return {
      statCards: [
        { label: 'Materials Verified',   value: '14,500+', sub: 'Total on platform',      color: 'val-green'   },
        { label: 'Active Orders',         value: '24',      sub: '3 awaiting delivery',    color: 'val-default' },
        { label: 'Registered Suppliers', value: '820+',    sub: 'Across all categories',  color: 'val-default' },
        { label: 'Flags Raised',          value: '6',       sub: 'Pending investigation',  color: 'val-red'     },
      ],
      recentOrders: [
        { id: '#ORD-0094', material: 'Portland Cement 50kg',   supplier: 'Bamburi Cement Ltd', status: 'Delivered',  statusType: 'green', amount: '37,500' },
        { id: '#ORD-0093', material: 'Deformed Steel Bar Y12', supplier: 'Steel Makers EA',    status: 'In Transit', statusType: 'amber', amount: '24,000' },
        { id: '#ORD-0092', material: 'Roofing Timber 2×4',     supplier: 'Kenya Timbers Ltd',  status: 'Processing', statusType: 'blue',  amount: '11,400' },
        { id: '#ORD-0091', material: 'Ballast Aggregate 20mm', supplier: 'Quarry Masters KE',  status: 'Pending',    statusType: 'amber', amount: '8,800'  },
        { id: '#ORD-0090', material: 'Portland Cement 50kg',   supplier: 'Bamburi Cement Ltd', status: 'Delivered',  statusType: 'green', amount: '22,500' },
      ],
    }
  },
}
</script>

<style scoped>
/* search */
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

/* stat cards */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.stat-card {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.stat-card:hover {
  border-color: #0f7a55;
  box-shadow: 0 4px 16px rgba(15,122,85,0.08);
}
.sc-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #aaa;
}
.sc-visual {
  width: 100%;
  height: 64px;
  border-radius: 8px;
  background: #f4faf7;
  border: 1.5px dashed #c8ead9;
}
.sc-value {
  font-family: 'Sora', sans-serif;
  font-size: 1.7rem;
  font-weight: 800;
  line-height: 1;
}
.sc-sub { font-size: 0.76rem; color: #aaa; }
.val-green   { color: #0f7a55; }
.val-red     { color: #dc2626; }
.val-default { color: #0f2419; }

/* orders table */
.orders-section {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 14px;
  overflow: hidden;
}
.orders-heading {
  font-family: 'Sora', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f2419;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #f0f0f0;
}
.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
  min-width: 560px;
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
}
.orders-table tbody tr:last-child td { border-bottom: none; }
.orders-table tbody tr:hover td { background: #f8fdfb; }
.td-id {
  font-family: 'Sora', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: #888;
}

/* Mobile card list — hidden on desktop */
.order-cards-mobile { display: none; }

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
  padding: 14px 20px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
}
.view-all-link {
  font-size: 0.84rem;
  font-weight: 600;
  color: #0f7a55;
  text-decoration: none;
}
.view-all-link:hover { color: #0a5e40; }

/* responsive */
@media (max-width: 1100px) {
  .stat-cards { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .search-input { width: 100%; }
  .stat-cards { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  /* Swap table for mobile cards */
  .table-wrap { display: none; }
  .order-cards-mobile { display: flex; flex-direction: column; gap: 0; }
}

@media (max-width: 480px) {
  .stat-cards { grid-template-columns: 1fr; }
  .sc-visual { height: 48px; }
}

/* Mobile order cards */
.order-card-m {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.order-card-m:last-child { border-bottom: none; }
.ocm-top { display: flex; align-items: center; justify-content: space-between; }
.ocm-id {
  font-family: 'Sora', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: #888;
}
.ocm-material { font-size: 0.88rem; color: #0f2419; font-weight: 500; }
.ocm-meta { display: flex; justify-content: space-between; align-items: center; }
.ocm-supplier { font-size: 0.78rem; color: #999; }
.ocm-amount { font-family: 'Sora', sans-serif; font-size: 0.84rem; font-weight: 700; color: #0f2419; }
</style>
