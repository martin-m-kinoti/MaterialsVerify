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
      <header class="topbar">
        <h1 class="page-title">{{ title }}</h1>
        <div class="topbar-right">
          <span class="topbar-greeting">Hello, {{ userName }}</span>
          <div class="topbar-avatar">{{ userInitials }}</div>
        </div>
      </header>
      <div class="content">
        <slot />
      </div>
    </main>

  </div>
</template>

<script>
export default {
  name: 'AppLayout',
  props: {
    title: { type: String, required: true },
  },
  data() {
    return { userName: '', userRole: '' }
  },
  computed: {
    userInitials() {
      return this.userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    },
  },
  created() {
    const raw = localStorage.getItem('mv_user')
    if (raw) {
      const u = JSON.parse(raw)
      this.userName = u.name || u.email || 'User'
      this.userRole = u.role || 'Member'
    } else {
      this.$router.replace('/login')
    }
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.db-layout {
  font-family: 'DM Sans', sans-serif;
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ── SIDEBAR ── */
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
.logo-img { height: 28px; width: auto; border-radius: 50%; }
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
.nav-item:hover { background: rgba(255,255,255,0.12); color: #fff; }
.nav-item--active { background: rgba(255,255,255,0.2); color: #fff; font-weight: 600; }

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
.user-meta { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.user-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-role { font-size: 0.72rem; color: rgba(255,255,255,0.55); }

/* ── MAIN ── */
.main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #fff; }

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
.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-greeting { font-size: 0.875rem; color: #777; }
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

.content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 860px) { .sidebar { width: 170px; } }
@media (max-width: 640px) {
  .db-layout { flex-direction: column; height: auto; }
  .sidebar { width: 100%; }
  .sidebar-nav { flex-direction: row; flex-wrap: wrap; padding: 12px; }
  .main { height: 100vh; }
}
</style>
