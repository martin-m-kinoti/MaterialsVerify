<template>
  <div class="ps-wrapper">

    <!-- Segmented bar -->
    <div class="ps-bar">
      <div
        v-for="i in 4"
        :key="i"
        :class="['ps-segment', segmentClass(i)]"
      ></div>
    </div>

    <!-- Label + criteria -->
    <div class="ps-meta" v-if="password">
      <span :class="['ps-label', strengthLevel]">{{ strengthLabel }}</span>
      <span class="ps-hint">{{ hint }}</span>
    </div>

    <!-- Checklist -->
    <ul class="ps-checklist" v-if="password">
      <li v-for="rule in rules" :key="rule.label" :class="{ passed: rule.passed }">
        <span class="ps-icon">{{ rule.passed ? '✓' : '○' }}</span>
        {{ rule.label }}
      </li>
    </ul>

  </div>
</template>

<script>
export default {
  name: 'PasswordStrength',

  props: {
    password: {
      type: String,
      default: ''
    }
  },

  computed: {
    rules() {
      const p = this.password || ''
      return [
        { label: 'At least 8 characters',       passed: p.length >= 8 },
        { label: 'One uppercase letter (A–Z)',   passed: /[A-Z]/.test(p) },
        { label: 'One number (0–9)',             passed: /[0-9]/.test(p) },
        { label: 'One special character (!@#$)', passed: /[^A-Za-z0-9]/.test(p) }
      ]
    },

    score() {
      return this.rules.filter(r => r.passed).length
    },

    strengthLevel() {
      if (!this.password) return ''
      if (this.score <= 1) return 'weak'
      if (this.score <= 3) return 'fair'
      return 'strong'
    },

    strengthLabel() {
      return { weak: 'Weak', fair: 'Fair', strong: 'Strong' }[this.strengthLevel] || ''
    },

    hint() {
      if (this.strengthLevel === 'weak') return '— Add uppercase, numbers, or symbols'
      if (this.strengthLevel === 'fair') return '— Getting there, keep going'
      if (this.strengthLevel === 'strong') return '— Great password!'
      return ''
    }
  },

  methods: {
    segmentClass(i) {
      if (!this.password || this.score === 0) return 'empty'
      if (i > this.score) return 'empty'
      return this.strengthLevel
    }
  }
}
</script>

<style scoped>
.ps-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

/* Segmented bar */
.ps-bar {
  display: flex;
  gap: 6px;
}
.ps-segment {
  flex: 1;
  height: 5px;
  border-radius: 3px;
  transition: background 0.3s;
}
.ps-segment.empty   { background: #e8e8e8; }
.ps-segment.weak    { background: #e24b4a; }
.ps-segment.fair    { background: #f5a623; }
.ps-segment.strong  { background: #0f7a55; }

/* Label row */
.ps-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ps-label {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.ps-label.weak   { color: #e24b4a; }
.ps-label.fair   { color: #f5a623; }
.ps-label.strong { color: #0f7a55; }

.ps-hint {
  font-size: 0.78rem;
  color: #999;
}

/* Checklist */
.ps-checklist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ps-checklist li {
  font-size: 0.8rem;
  color: #aaa;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
}
.ps-checklist li.passed { color: #0f7a55; }
.ps-icon {
  font-size: 0.75rem;
  width: 14px;
  text-align: center;
}
</style>