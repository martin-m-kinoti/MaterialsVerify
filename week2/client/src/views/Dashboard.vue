<template>
  <div class="db-layout">

    <!-- ── SIDEBAR ── -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <img src="/logo.png" alt="MaterialsVerify" class="logo-img" />
        <span class="logo-text">MaterialsVerify</span>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/dashboard"      class="nav-item" active-class="nav-item--active" exact>Overview</router-link>
        <router-link to="/materials"      class="nav-item" active-class="nav-item--active">Materials</router-link>
        <router-link to="/orders"         class="nav-item" active-class="nav-item--active">Orders</router-link>
        <router-link to="/order-tracking" class="nav-item" active-class="nav-item--active">Order Tracking</router-link>
      </nav>

      <div class="sidebar-user">
        <div class="user-avatar">{{ userInitials }}</div>
        <div class="user-meta">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">{{ userRole }}</span>
        </div>
      </div>
    </aside>

    <!-- ── MAIN ── -->
    <main class="main">

      <!-- Topbar -->
      <header class="topbar">
        <h1 class="page-title">Dashboard</h1>
        <div class="topbar-right">
          <span class="topbar-greeting">Hello, {{ userName }}</span>
          <div class="topbar-avatar">{{ userInitials }}</div>
        </div>
      </header>

      <div class="content">

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
          <div class="orders-footer">
            <router-link to="/orders" class="view-all-link">View all orders →</router-link>
          </div>
        </div>

      </div>
    </main>

  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      userName: '',
      userRole: '',
      statCards: [
        { label: 'Materials Verified',    value: '14,500+', sub: 'Total on platform',       color: 'val-green'   },
        { label: 'Active Orders',         value: '24',      sub: '3 awaiting delivery',      color: 'val-default' },
        { label: 'Registered Suppliers',  value: '820+',    sub: 'Across all categories',    color: 'val-default' },
        { label: 'Flags Raised',          value: '6',       sub: 'Pending investigation',    color: 'val-red'     },
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
  computed: {
    userInitials() {
      return this.userName
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    },
  },
  created() {
    const raw = localStorage.getItem('mv_user')
    if (raw) {
      const user = JSON.parse(raw)
      this.userName = user.name || user.email || 'User'
      this.userRole = user.role || 'Member'
    } else {
      this.$router.replace('/login')
    }
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

/* ── ROOT LAYOUT ────────────────────────────────── */
.db-layout {
  font-family: 'DM Sans', sans-serif;
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #f4faf7;
}

/* ── SIDEBAR ────────────────────────────────────── */
.sidebar {
  width: 210px;
  flex-shrink: 0;
  background: #0f7a55;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px 28px;
  border-bottom: 1px solid rgba(255,255,255,0.15);
}
.logo-img {
  height: 28px;
  width: auto;
  border-radius: 50%;
}
.logo-text {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: #fff;
  letter-spacing: -0.3px;
  white-space: nowrap;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 20px 12px 0;
}
.nav-item {
  display: block;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.nav-item:hover {
  background: rgba(255,255,255,0.12);
  color: #fff;
}
.nav-item--active {
  background: rgba(255,255,255,0.2);
  color: #fff;
  font-weight: 600;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid rgba(255,255,255,0.15);
}
.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 1.5px solid rgba(255,255,255,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Sora', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.user-meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.user-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-role {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.55);
}

/* ── MAIN ───────────────────────────────────────── */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
}

/* Topbar */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
  background: #fff;
}
.page-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f2419;
  letter-spacing: -0.5px;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.topbar-greeting {
  font-size: 0.875rem;
  color: #777;
}
.topbar-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #0f7a55;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Sora', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
}

/* Content area */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ── SEARCH ─────────────────────────────────────── */
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
.search-input::placeholder { color: #bbb; }
.search-input:focus { border-color: #0f7a55; background: #fff; }

/* ── STAT CARDS ─────────────────────────────────── */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.stat-card {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 14px;
  padding: 18px 18px 16px;
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
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #999;
}
.sc-visual {
  width: 100%;
  height: 72px;
  border-radius: 8px;
  background: #f4faf7;
  border: 1.5px dashed #c8ead9;
}
.sc-value {
  font-family: 'Sora', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;
}
.sc-sub {
  font-size: 0.78rem;
  color: #aaa;
}
.val-green   { color: #0f7a55; }
.val-red     { color: #dc2626; }
.val-default { color: #0f2419; }

/* ── ORDERS TABLE ───────────────────────────────── */
.orders-section {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 14px;
  overflow: hidden;
}
.orders-heading {
  font-family: 'Sora', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f2419;
  padding: 18px 20px 14px;
  border-bottom: 1px solid #f0f0f0;
}
.table-wrap { overflow-x: auto; }
.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}
.orders-table th {
  padding: 11px 16px;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #aaa;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
  background: #fafafa;
}
.orders-table td {
  padding: 13px 16px;
  color: #444;
  border-bottom: 1px solid #f7f7f7;
}
.orders-table tbody tr:last-child td { border-bottom: none; }
.orders-table tbody tr:hover td { background: #f8fdfb; }
.td-id {
  font-family: 'Sora', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #888;
}
.order-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.3px;
}
.badge-green { background: #e8f7f1; color: #0a5e40; border: 1px solid #b6e8d4; }
.badge-amber { background: #fff8e6; color: #8a5a00; border: 1px solid #f5d68a; }
.badge-blue  { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

.orders-footer {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
}
.view-all-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f7a55;
  text-decoration: none;
  transition: color 0.2s;
}
.view-all-link:hover { color: #0a5e40; }

/* ── RESPONSIVE ─────────────────────────────────── */
@media (max-width: 1100px) {
  .stat-cards { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 860px) {
  .sidebar { width: 170px; }
  .search-input { width: 100%; }
}
@media (max-width: 640px) {
  .db-layout { flex-direction: column; height: auto; }
  .sidebar { width: 100%; }
  .sidebar-nav { flex-direction: row; flex-wrap: wrap; padding: 12px; }
  .main { height: 100vh; }
  .stat-cards { grid-template-columns: repeat(2, 1fr); }
}
</style>
