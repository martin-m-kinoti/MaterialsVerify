<template>
  <div class="db-layout">

    <!-- Mobile overlay -->
    <transition name="fade">
      <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>
    </transition>

    <!-- ── SIDEBAR ── -->
    <aside class="sidebar" :class="{ 'sidebar--open': sidebarOpen }">
      <!-- Mobile close button -->
      <button class="sidebar-close" @click="sidebarOpen = false" aria-label="Close menu">×</button>

      <div class="sidebar-logo">
        <img src="/logo.png" alt="MaterialsVerify" class="logo-img" />
        <span class="logo-text">MaterialsVerify</span>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/"               class="nav-item" active-class="nav-item--active" exact>Home</router-link>
        <router-link to="/dashboard"      class="nav-item" active-class="nav-item--active" exact>Overview</router-link>
        <router-link to="/materials"      class="nav-item" active-class="nav-item--active">Materials</router-link>
        <router-link to="/orders"         class="nav-item" active-class="nav-item--active">Orders</router-link>
        <router-link to="/order-tracking" class="nav-item" active-class="nav-item--active">Order Tracking</router-link>
        <router-link v-if="userRole === 'admin'" to="/admin/users" class="nav-item nav-item--admin" active-class="nav-item--active">Users</router-link>
      </nav>

      <div class="sidebar-user">
        <div class="user-avatar">{{ userInitials }}</div>
        <div class="user-meta">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">{{ userRole }}</span>
        </div>
      </div>

      <button class="logout-btn" @click="logout">Sign out</button>
    </aside>

    <!-- ── MAIN ── -->
    <main class="main">
      <header class="topbar">
        <!-- Hamburger (mobile only) -->
        <button class="hamburger" @click="sidebarOpen = true" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>

        <h1 class="page-title">{{ title }}</h1>

        <div class="topbar-right">
          <span class="topbar-greeting">Hello, {{ firstName }}</span>
          <div class="user-menu-wrap" @click.stop="dropdownOpen = !dropdownOpen">
            <div class="topbar-avatar">{{ userInitials }}</div>
            <transition name="dd">
              <div class="topbar-dropdown" v-if="dropdownOpen" @click.stop>
                <div class="dd-header">
                  <span class="dd-name">{{ userName }}</span>
                  <span class="dd-email">{{ userEmail }}</span>
                </div>
                <div class="dd-divider"></div>
                <router-link to="/" class="dd-item" @click.native="dropdownOpen = false">← Home</router-link>
                <button class="dd-item dd-logout" @click="logout">Sign out</button>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <div class="content">
        <slot />
      </div>
    </main>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AppLayout',
  props: {
    title: { type: String, required: true },
  },
  data() {
    return {
      firstName: '',
      userName: '',
      userEmail: '',
      userRole: '',
      sidebarOpen: false,
      dropdownOpen: false,
    }
  },
  computed: {
    userInitials() {
      return this.userName.split(' ').map(w => w[0]).filter(Boolean).join('').toUpperCase().slice(0, 2) || '?'
    },
  },
  watch: {
    $route() {
      this.sidebarOpen = false
      this.dropdownOpen = false
    },
  },
  async created() {
    const raw = localStorage.getItem('mv_user')
    if (!raw) {
      this.$router.replace('/login')
      return
    }
    try {
      const { data } = await axios.get('http://localhost:9000/api/auth/session', { withCredentials: true })
      const isGoogle = data.provider === 'google'
      this.firstName = isGoogle
        ? (data.email ? data.email.split('@')[0] : 'User')
        : (data.firstName || 'User')
      this.userName  = (data.firstName && data.lastName) ? (data.firstName + ' ' + data.lastName) : (data.email || 'User')
      this.userEmail = data.email || ''
      this.userRole  = data.role  || 'Member'
      // Keep localStorage in sync with live server data
      localStorage.setItem('mv_user', JSON.stringify({
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        role:      data.role,
        avatar:    data.avatar,
        provider:  data.provider,
      }))
    } catch {
      localStorage.removeItem('mv_user')
      this.$router.replace('/login')
    }
  },
  mounted() {
    document.addEventListener('click', this.closeDropdown)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeDropdown)
  },
  methods: {
    closeDropdown() {
      this.dropdownOpen = false
    },
    async logout() {
      try {
        await axios.post('http://localhost:9000/api/auth/logout', {}, { withCredentials: true })
      } finally {
        localStorage.removeItem('mv_user')
        this.$router.push('/login')
      }
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

/* root */
.db-layout {
  font-family: 'DM Sans', sans-serif;
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* overlay */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 299;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter, .fade-leave-to { opacity: 0; }

/* sidebar */
.sidebar {
  width: 210px;
  flex-shrink: 0;
  background: #0f7a55;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  position: relative;
  z-index: 300;
}
.sidebar-close {
  display: none;
  position: absolute;
  top: 14px;
  right: 14px;
  background: rgba(255,255,255,0.15);
  border: none;
  color: #fff;
  font-size: 1.2rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background 0.15s;
}
.sidebar-close:hover { background: rgba(255,255,255,0.25); }

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
  padding: 11px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.nav-item:hover { background: rgba(255,255,255,0.12); color: #fff; }
.nav-item--active { background: rgba(255,255,255,0.2); color: #fff; font-weight: 600; }
.nav-item--admin { border-top: 1px solid rgba(255,255,255,0.1); margin-top: 8px; padding-top: 14px; }

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

.logout-btn {
  margin: 0 12px 8px;
  padding: 9px 14px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: rgba(255,255,255,0.75);
  font-size: 0.82rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, color 0.15s;
}
.logout-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }

/* main */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  min-width: 0;
}

/* topbar */
.topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
  height: 64px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
  background: #fff;
}
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 4px;
  flex-shrink: 0;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: #0f2419;
  border-radius: 2px;
}
.page-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f2419;
  letter-spacing: -0.4px;
  flex: 1;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.topbar-greeting {
  font-size: 0.85rem;
  color: #888;
  white-space: nowrap;
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
  flex-shrink: 0;
  cursor: pointer;
}

/* User menu dropdown */
.user-menu-wrap {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.topbar-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 200px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.12);
  z-index: 500;
  overflow: hidden;
}
.dd-header {
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.dd-name {
  font-family: 'Sora', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: #0f2419;
}
.dd-email {
  font-size: 0.75rem;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dd-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 0;
}
.dd-item {
  display: block;
  width: 100%;
  padding: 11px 16px;
  font-size: 0.875rem;
  font-family: 'DM Sans', sans-serif;
  color: #333;
  text-decoration: none;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
}
.dd-item:hover { background: #f5f5f5; }
.dd-logout { color: #c0392b; }
.dd-logout:hover { background: #fff5f5; }
.dd-enter-active, .dd-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dd-enter, .dd-leave-to { opacity: 0; transform: translateY(-4px); }

/* content */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* responsive */

/* Tablet: narrower sidebar */
@media (max-width: 1024px) {
  .sidebar { width: 190px; }
  .topbar-greeting { display: none; }
}

/* Mobile: slide-in sidebar */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 240px;
    transform: translateX(-100%);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .sidebar--open {
    transform: translateX(0);
    box-shadow: 4px 0 32px rgba(0, 0, 0, 0.18);
  }
  .sidebar-close { display: flex; }
  .hamburger { display: flex; }
  .content { padding: 16px; }
  .topbar { padding: 0 16px; }
}

@media (max-width: 480px) {
  .page-title { font-size: 1rem; }
  .content { padding: 12px; gap: 14px; }
}
</style>
