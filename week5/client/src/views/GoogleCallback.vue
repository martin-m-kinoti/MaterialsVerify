<template>
  <div class="callback-page">
    <div class="callback-card">
      <div class="spinner"></div>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoogleCallback',
  data() {
    return { message: 'Completing sign-in…' };
  },
  created() {
    const { email, role, firstName, lastName, avatar, error } = this.$route.query;

    if (error || !email) {
      this.message = 'Google sign-in failed. Redirecting…';
      setTimeout(() => this.$router.replace('/login?error=google_auth_failed'), 1500);
      return;
    }

    localStorage.setItem('mv_user', JSON.stringify({ email, role, firstName, lastName, avatar }));
    this.$router.replace('/dashboard');
  },
};
</script>

<style scoped>
.callback-page {
  min-height: 100vh;
  background: #0a1610;
  display: flex;
  align-items: center;
  justify-content: center;
}

.callback-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  color: #fff;
  font-family: "DM Sans", sans-serif;
  font-size: 0.95rem;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: #0f7a55;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
