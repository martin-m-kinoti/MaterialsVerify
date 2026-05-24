<template>
  <app-layout title="Place an Order">

    <!-- Description bar -->
    <p class="order-desc">Select the materials you want to order, then proceed to set quantities and delivery details.</p>

    <!-- Stepper -->
    <div class="stepper">
      <div
        class="step"
        v-for="(step, i) in steps"
        :key="i"
        :class="{ 'step--active': i === currentStep, 'step--done': i < currentStep }"
      >
        <div class="step-circle">
          <span v-if="i < currentStep">✓</span>
          <span v-else>{{ i + 1 }}</span>
        </div>
        <span class="step-label">{{ step }}</span>
        <div class="step-line" v-if="i < steps.length - 1"></div>
      </div>
    </div>

    <!-- Section label -->
    <div class="section-bar">
      <span class="section-bar-label">Selected Materials</span>
      <span class="section-bar-count">{{ cart.length }} item{{ cart.length !== 1 ? 's' : '' }}</span>
    </div>

    <!-- Cart items grid -->
    <div v-if="cart.length" class="cart-grid">
      <div class="cart-card" v-for="(mat, i) in cart" :key="mat.id">
        <button class="card-dismiss" @click="removeFromCart(i)" title="Remove">×</button>
        <div class="card-body">
          <div class="card-left">
            <p class="card-name">{{ mat.name }}</p>
            <p class="card-batch">{{ mat.batch }}</p>
            <p class="card-supplier">{{ mat.supplier }}</p>
          </div>
          <div class="card-right">
            <p class="card-category">{{ mat.category }}</p>
            <p class="card-price">KES {{ mat.price }}</p>
            <span class="mat-badge" :class="`badge-${mat.statusType}`">{{ mat.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-cart">
      <p>No materials selected. <router-link to="/materials">Browse the catalogue →</router-link></p>
    </div>

    <!-- Footer action -->
    <div class="order-footer">
      <button class="btn-continue" :disabled="!cart.length" @click="nextStep">
        Continue to Quantity →
      </button>
    </div>

  </app-layout>
</template>

<script>
import AppLayout from '@/components/AppLayout.vue'

export default {
  name: 'OrdersPage',
  components: { AppLayout },
  data() {
    return {
      currentStep: 0,
      steps: ['Select Materials', 'Set Quantity', 'Delivery Details', 'Review', 'Confirm'],
      cart: [],
    }
  },
  created() {
    const raw = localStorage.getItem('mv_cart')
    this.cart = raw ? JSON.parse(raw) : []
  },
  methods: {
    removeFromCart(index) {
      this.cart.splice(index, 1)
      localStorage.setItem('mv_cart', JSON.stringify(this.cart))
    },
    nextStep() {
      if (this.currentStep < this.steps.length - 1) this.currentStep++
    },
  },
}
</script>

<style scoped>
/* description */
.order-desc {
  font-size: 0.875rem;
  color: #777;
  line-height: 1.6;
  max-width: 680px;
}

/* stepper */
.stepper {
  display: flex;
  align-items: flex-start;
  gap: 0;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}
.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #e0ede8;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Sora', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: #bbb;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
  z-index: 1;
}
.step--active .step-circle {
  background: #0f7a55;
  border-color: #0f7a55;
  color: #fff;
}
.step--done .step-circle {
  background: #e8f7f1;
  border-color: #0f7a55;
  color: #0f7a55;
}
.step-label {
  margin-top: 8px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #bbb;
  text-align: center;
  white-space: nowrap;
}
.step--active .step-label { color: #0f7a55; }
.step--done .step-label { color: #0f7a55; }

.step-line {
  position: absolute;
  top: 18px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #e0ede8;
  z-index: 0;
}
.step--done .step-line { background: #0f7a55; }

/* section bar */
.section-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #f8fdfb;
  border: 1.5px solid #e8f0ec;
  border-radius: 10px;
}
.section-bar-label {
  font-family: 'Sora', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #0f2419;
}
.section-bar-count {
  font-size: 0.78rem;
  color: #0f7a55;
  font-weight: 600;
}

/* cart grid */
.cart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.cart-card {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 14px;
  padding: 18px 18px 18px 44px;
  position: relative;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.cart-card:hover {
  border-color: #0f7a55;
  box-shadow: 0 4px 16px rgba(15,122,85,0.08);
}
.card-dismiss {
  position: absolute;
  top: 14px;
  left: 14px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid #ddd;
  background: transparent;
  color: #bbb;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, color 0.15s;
}
.card-dismiss:hover { border-color: #dc2626; color: #dc2626; }

.card-body { display: flex; justify-content: space-between; gap: 12px; }
.card-left  { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }

.card-name {
  font-family: 'Sora', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f2419;
  line-height: 1.3;
}
.card-batch { font-size: 0.72rem; color: #aaa; font-family: 'Sora', sans-serif; }
.card-supplier { font-size: 0.8rem; color: #777; }
.card-category { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #0f7a55; }
.card-price { font-family: 'Sora', sans-serif; font-size: 0.95rem; font-weight: 700; color: #0f2419; }

.mat-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.3px;
}
.badge-green { background: #e8f7f1; color: #0a5e40; border: 1px solid #b6e8d4; }
.badge-amber { background: #fff8e6; color: #8a5a00; border: 1px solid #f5d68a; }
.badge-red   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

/* empty state */
.empty-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  border: 1.5px dashed #c8ead9;
  border-radius: 14px;
  background: #f8fdfb;
  color: #aaa;
  font-size: 0.9rem;
}
.empty-cart a { color: #0f7a55; font-weight: 600; text-decoration: none; }
.empty-cart a:hover { text-decoration: underline; }

/* footer */
.order-footer {
  display: flex;
  justify-content: flex-start;
  padding-top: 4px;
}
.btn-continue {
  padding: 12px 28px;
  background: #0f7a55;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: 'Sora', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-continue:hover:not(:disabled) { background: #0a5e40; }
.btn-continue:disabled { opacity: 0.4; cursor: not-allowed; }

/* responsive */
@media (max-width: 900px) {
  .cart-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  /* Compress stepper: hide labels, just show circles */
  .step-label { display: none; }
  .step-circle { width: 30px; height: 30px; font-size: 0.75rem; }
  .step-line { top: 15px; }

  .order-desc { font-size: 0.82rem; }
  .btn-continue { width: 100%; justify-content: center; text-align: center; }
}

@media (max-width: 480px) {
  .card-body { flex-direction: column; gap: 10px; }
  .card-right { align-items: flex-start; flex-direction: row; gap: 12px; align-items: center; }
  .stepper { gap: 0; }
}
</style>
