<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getCookie } from '@/utils/cookies';

export default {
  name: 'App',
  created() {
    // Theme preference lives in a cookie so it survives refresh and browser restart
    const theme = getCookie('mv_theme');
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
    }
  },
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--bg-page);
  transition: background 0.2s ease, color 0.2s ease;
}

#app {
  min-height: 100vh;
}

/* Theme variables — default (light) and dark override, toggled via the
   'theme-dark' class on <body> and persisted in the mv_theme cookie. */
:root {
  --bg-page: #f8fdfb;
  --bg-card: #ffffff;
  --bg-sunken: #fafafa;
  --text-primary: #0f2419;
  --text-secondary: #777;
  --text-muted: #aaa;
  --border-color: #e8f0ec;
}

body.theme-dark {
  --bg-page: #0b1512;
  --bg-card: #10201a;
  --bg-sunken: #0d1a15;
  --text-primary: #eaf6f0;
  --text-secondary: #a7bdb2;
  --text-muted: #7c9088;
  --border-color: #1e332a;
}
</style>
