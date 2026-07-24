<template>
  <app-layout title="Place an Order">

    <!-- Step description -->
    <p class="order-desc">{{ stepDescriptions[currentStep] }}</p>

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

    <!-- ── STEP 0: SELECT MATERIALS ── -->
    <template v-if="currentStep === 0">
      <div class="section-bar">
        <span class="section-bar-label">Selected Materials</span>
        <span class="section-bar-count">{{ cart.length }} item{{ cart.length !== 1 ? 's' : '' }}</span>
      </div>

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

      <div class="step-footer">
        <button class="btn-continue" :disabled="!cart.length" @click="nextStep">
          Continue to Set Quantity →
        </button>
      </div>
    </template>

    <!-- ── STEP 1: SET QUANTITY ── -->
    <template v-if="currentStep === 1">
      <div class="section-bar">
        <span class="section-bar-label">Set Quantities</span>
        <span class="section-bar-count">{{ cart.length }} item{{ cart.length !== 1 ? 's' : '' }}</span>
      </div>

      <div class="qty-table-wrap">
        <table class="qty-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Supplier</th>
              <th>Unit Price (KES)</th>
              <th>Quantity</th>
              <th>Line Total (KES)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in cart" :key="item.id">
              <td>
                <p class="qt-name">{{ item.name }}</p>
                <p class="qt-batch">{{ item.batch }}</p>
              </td>
              <td class="qt-supplier">{{ item.supplier }}</td>
              <td class="qt-price">{{ item.price }}</td>
              <td>
                <input
                  class="qty-input"
                  type="number"
                  v-model.number="item.qty"
                  min="1"
                  @input="clampQty(i)"
                />
              </td>
              <td class="qt-total">{{ lineTotal(item) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="subtotal-label">Subtotal</td>
              <td class="subtotal-value">{{ orderTotal }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Mobile qty cards -->
      <div class="qty-cards-mobile">
        <div class="qty-card" v-for="(item, i) in cart" :key="'m'+item.id">
          <div class="qc-header">
            <p class="qt-name">{{ item.name }}</p>
            <p class="qt-batch">{{ item.batch }}</p>
          </div>
          <div class="qc-row">
            <span class="qc-label">Unit price</span>
            <span class="qc-value">KES {{ item.price }}</span>
          </div>
          <div class="qc-row">
            <span class="qc-label">Quantity</span>
            <input class="qty-input" type="number" v-model.number="item.qty" min="1" @input="clampQty(i)" />
          </div>
          <div class="qc-row">
            <span class="qc-label">Line total</span>
            <span class="qc-value qc-total">KES {{ lineTotal(item) }}</span>
          </div>
        </div>
        <div class="mobile-subtotal">
          <span>Subtotal</span>
          <span>KES {{ orderTotal }}</span>
        </div>
      </div>

      <div class="step-footer">
        <button class="btn-back" @click="prevStep">← Back</button>
        <button class="btn-continue" @click="nextStep">Continue to Delivery Details →</button>
      </div>
    </template>

    <!-- ── STEP 2: DELIVERY DETAILS ── -->
    <template v-if="currentStep === 2">
      <div class="section-bar">
        <span class="section-bar-label">Delivery Details</span>
        <span class="section-bar-count">All fields marked * are required</span>
      </div>

      <form class="delivery-form" @submit.prevent>
        <div class="form-grid">
          <div class="form-group">
            <label>Full Name *</label>
            <input v-model="delivery.name" type="text" placeholder="e.g. John Mwangi" />
          </div>
          <div class="form-group">
            <label>Phone Number *</label>
            <input v-model="delivery.phone" type="tel" placeholder="e.g. +254 712 345 678" />
          </div>
          <div class="form-group form-group--full">
            <label>Delivery Address *</label>
            <input v-model="delivery.address" type="text" placeholder="e.g. Plot 14, Industrial Area" />
          </div>
          <div class="form-group">
            <label>County *</label>
            <select v-model="delivery.county">
              <option value="">Select county…</option>
              <option v-for="c in counties" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Delivery Date *</label>
            <input v-model="delivery.date" type="date" :min="minDate" />
          </div>
          <div class="form-group form-group--full">
            <label>Additional Notes <span class="optional">(optional)</span></label>
            <textarea v-model="delivery.notes" rows="3" placeholder="Any special delivery instructions…"></textarea>
          </div>
        </div>
      </form>

      <div class="step-footer">
        <button class="btn-back" @click="prevStep">← Back</button>
        <button class="btn-continue" :disabled="!deliveryValid" @click="nextStep">
          Continue to Review →
        </button>
      </div>
    </template>

    <!-- ── STEP 3: REVIEW ── -->
    <template v-if="currentStep === 3">
      <div class="section-bar">
        <span class="section-bar-label">Order Summary</span>
        <span class="section-bar-count">Review before placing</span>
      </div>

      <!-- Items summary -->
      <div class="review-panel">
        <h3 class="review-panel-title">Materials &amp; Quantities</h3>
        <div class="review-table-wrap">
          <table class="review-table">
            <thead>
              <tr>
                <th>Material</th>
                <th>Supplier</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cart" :key="item.id">
                <td>
                  <p class="qt-name">{{ item.name }}</p>
                  <p class="qt-batch">{{ item.batch }}</p>
                </td>
                <td class="qt-supplier">{{ item.supplier }}</td>
                <td>{{ item.qty }}</td>
                <td>KES {{ item.price }}</td>
                <td class="qt-total">KES {{ lineTotal(item) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="review-total-row">
          <span>Grand Total</span>
          <span class="review-grand-total">KES {{ orderTotal }}</span>
        </div>
      </div>

      <!-- Delivery summary -->
      <div class="review-panel">
        <h3 class="review-panel-title">Delivery Details</h3>
        <div class="review-delivery-grid">
          <div class="rd-item">
            <span class="rd-label">Name</span>
            <span class="rd-value">{{ delivery.name }}</span>
          </div>
          <div class="rd-item">
            <span class="rd-label">Phone</span>
            <span class="rd-value">{{ delivery.phone }}</span>
          </div>
          <div class="rd-item rd-item--full">
            <span class="rd-label">Address</span>
            <span class="rd-value">{{ delivery.address }}</span>
          </div>
          <div class="rd-item">
            <span class="rd-label">County</span>
            <span class="rd-value">{{ delivery.county }}</span>
          </div>
          <div class="rd-item">
            <span class="rd-label">Delivery Date</span>
            <span class="rd-value">{{ formatDate(delivery.date) }}</span>
          </div>
          <div class="rd-item rd-item--full" v-if="delivery.notes">
            <span class="rd-label">Notes</span>
            <span class="rd-value">{{ delivery.notes }}</span>
          </div>
        </div>
      </div>

      <div class="step-footer">
        <button class="btn-back" @click="prevStep">← Back</button>
        <button class="btn-place" @click="placeOrder">Place Order</button>
      </div>
    </template>

    <!-- ── STEP 4: CONFIRMATION ── -->
    <template v-if="currentStep === 4">
      <div class="confirm-card">
        <div class="confirm-icon">
          <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="26" cy="26" r="25" stroke="#0f7a55" stroke-width="2" fill="#e8f7f1"/>
            <path d="M14 27L22 35L38 19" stroke="#0f7a55" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 class="confirm-title">Order Placed Successfully!</h2>
        <p class="confirm-sub">Your order has been received and is now being processed.</p>
        <div class="confirm-id-badge">{{ placedOrderId }}</div>
        <p class="confirm-note">
          Total amount: <strong>KES {{ placedTotal }}</strong> &nbsp;·&nbsp;
          Delivery to <strong>{{ delivery.county }}</strong> on <strong>{{ formatDate(delivery.date) }}</strong>
        </p>
        <div class="confirm-actions">
          <router-link to="/order-tracking" class="btn-track">Track Your Order →</router-link>
          <button class="btn-back" @click="startNewOrder">Browse More Materials</button>
        </div>
      </div>
    </template>

  </app-layout>
</template>

<script>
import AppLayout from '@/components/AppLayout.vue'
import axios from 'axios'

const API = 'https://backend-materials-verify.vercel.app'

export default {
  name: 'OrdersPage',
  components: { AppLayout },
  data() {
    return {
      currentStep: 0,
      steps: ['Select Materials', 'Set Quantity', 'Delivery Details', 'Review', 'Confirm'],
      stepDescriptions: [
        'Choose the materials you want to order from the catalogue.',
        'Set how many units of each material you need.',
        'Enter where and when you want the materials delivered.',
        'Review your order before placing it.',
        '',
      ],
      cart: [],
      delivery: {
        name: '', phone: '', address: '', county: '', date: '', notes: '',
      },
      placedOrderId: '',
      placedTotal: '',
      counties: [
        'Nairobi', 'Kiambu', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
        'Machakos', 'Thika', 'Nyeri', 'Meru', 'Kakamega', 'Kisii',
        'Garissa', 'Kitale', 'Malindi', 'Lamu', 'Other',
      ],
    }
  },
  computed: {
    deliveryValid() {
      const d = this.delivery
      return d.name && d.phone && d.address && d.county && d.date
    },
    orderTotal() {
      const total = this.cart.reduce((sum, item) => {
        return sum + this.parsePrice(item.price) * (item.qty || 1)
      }, 0)
      return total.toLocaleString('en-US')
    },
    minDate() {
      const d = new Date()
      d.setDate(d.getDate() + 1)
      return d.toISOString().split('T')[0]
    },
  },
  created() {
    const raw = localStorage.getItem('mv_cart')
    const items = raw ? JSON.parse(raw) : []
    this.cart = items.map(function(item) {
      return Object.assign({}, item, { qty: 1 })
    })
  },
  methods: {
    parsePrice(p) {
      return parseFloat(String(p).replace(/,/g, '')) || 0
    },
    lineTotal(item) {
      return (this.parsePrice(item.price) * (item.qty || 1)).toLocaleString('en-US')
    },
    clampQty(i) {
      if (!this.cart[i].qty || this.cart[i].qty < 1) {
        this.cart[i].qty = 1
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    removeFromCart(index) {
      this.cart.splice(index, 1)
      localStorage.setItem('mv_cart', JSON.stringify(this.cart))
    },
    prevStep() {
      if (this.currentStep > 0) this.currentStep--
    },
    nextStep() {
      if (this.currentStep < this.steps.length - 1) this.currentStep++
    },
    async placeOrder() {
      const ts = Date.now()
      const orderId  = 'ORD-' + String(ts).slice(-6)
      const batchId  = 'MTX-' + String(ts).slice(-9)
      const total    = this.orderTotal
      const matNames = this.cart.map(function(i) { return i.name }).join(', ')
      const qtyStr   = this.cart.map(function(i) { return i.qty + ' unit(s)' }).join(', ')
      const dateStr  = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

      const payload = {
        orderNo:  orderId,
        batch:    batchId,
        material: matNames.length > 60 ? matNames.slice(0, 57) + '…' : matNames,
        qty:      qtyStr,
        amount:   total,
        date:     dateStr,
        delivery: Object.assign({}, this.delivery),
        items:    this.cart.map(function(item) { return Object.assign({}, item) }),
      }

      try {
        const { data } = await axios.post(API + '/api/orders', payload, { withCredentials: true })
        localStorage.removeItem('mv_cart')
        this.placedOrderId = '#' + (data.orderNo || orderId)
        this.placedTotal   = total
        this.currentStep   = 4
      } catch (err) {
        const msg = (err.response && err.response.data && err.response.data.error) ? err.response.data.error : err.message
        alert('Failed to place order: ' + msg)
      }
    },
    startNewOrder() {
      this.cart = []
      this.delivery = { name: '', phone: '', address: '', county: '', date: '', notes: '' }
      this.currentStep = 0
      this.$router.push('/materials')
    },
  },
}
</script>

<style scoped>
/* order desc */
.order-desc {
  font-size: 0.875rem;
  color: #777;
  line-height: 1.6;
  max-width: 680px;
}

/* stepper */
.stepper { display: flex; align-items: flex-start; gap: 0; }
.step { display: flex; flex-direction: column; align-items: center; position: relative; flex: 1; }
.step-circle {
  width: 36px; height: 36px; border-radius: 50%;
  border: 2px solid #e0ede8; background: #fff;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Sora', sans-serif; font-size: 0.82rem; font-weight: 700;
  color: #bbb; transition: background 0.2s, border-color 0.2s, color 0.2s; z-index: 1;
}
.step--active .step-circle { background: #0f7a55; border-color: #0f7a55; color: #fff; }
.step--done   .step-circle { background: #e8f7f1; border-color: #0f7a55; color: #0f7a55; }
.step-label { margin-top: 8px; font-size: 0.72rem; font-weight: 600; color: #bbb; text-align: center; white-space: nowrap; }
.step--active .step-label, .step--done .step-label { color: #0f7a55; }
.step-line {
  position: absolute; top: 18px; left: 50%; width: 100%;
  height: 2px; background: #e0ede8; z-index: 0;
}
.step--done .step-line { background: #0f7a55; }

/* section bar */
.section-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px; background: #f8fdfb;
  border: 1.5px solid #e8f0ec; border-radius: 10px;
}
.section-bar-label { font-family: 'Sora', sans-serif; font-size: 0.82rem; font-weight: 600; color: #0f2419; }
.section-bar-count  { font-size: 0.78rem; color: #0f7a55; font-weight: 600; }

/* step footer */
.step-footer { display: flex; align-items: center; gap: 12px; padding-top: 4px; flex-wrap: wrap; }
.btn-continue {
  padding: 12px 28px; background: #0f7a55; color: #fff;
  border: none; border-radius: 10px;
  font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.btn-continue:hover:not(:disabled) { background: #0a5e40; }
.btn-continue:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-back {
  padding: 12px 22px; background: transparent;
  border: 1.5px solid #e0ede8; border-radius: 10px;
  color: #555; font-size: 0.88rem; font-weight: 500;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.btn-back:hover { border-color: #0f7a55; color: #0f7a55; }
.btn-place {
  padding: 12px 32px; background: #0f2419; color: #fff;
  border: none; border-radius: 10px;
  font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.btn-place:hover { background: #0f7a55; }

/* cart grid (step 0) */
.cart-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.cart-card {
  background: #fff; border: 1.5px solid #e8f0ec; border-radius: 14px;
  padding: 18px 18px 18px 44px; position: relative;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.cart-card:hover { border-color: #0f7a55; box-shadow: 0 4px 16px rgba(15,122,85,0.08); }
.card-dismiss {
  position: absolute; top: 14px; left: 14px;
  width: 22px; height: 22px; border-radius: 50%;
  border: 1.5px solid #ddd; background: transparent;
  color: #bbb; font-size: 1rem; line-height: 1; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: border-color 0.15s, color 0.15s;
}
.card-dismiss:hover { border-color: #dc2626; color: #dc2626; }
.card-body { display: flex; justify-content: space-between; gap: 12px; }
.card-left  { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
.card-name  { font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 600; color: #0f2419; line-height: 1.3; }
.card-batch { font-size: 0.72rem; color: #aaa; font-family: 'Sora', sans-serif; }
.card-supplier { font-size: 0.8rem; color: #777; }
.card-category { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #0f7a55; }
.card-price { font-family: 'Sora', sans-serif; font-size: 0.95rem; font-weight: 700; color: #0f2419; }
.mat-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.3px; }
.badge-green { background: #e8f7f1; color: #0a5e40; border: 1px solid #b6e8d4; }
.badge-amber { background: #fff8e6; color: #8a5a00; border: 1px solid #f5d68a; }
.badge-red   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

.empty-cart {
  display: flex; align-items: center; justify-content: center;
  padding: 48px; border: 1.5px dashed #c8ead9; border-radius: 14px;
  background: #f8fdfb; color: #aaa; font-size: 0.9rem;
}
.empty-cart a { color: #0f7a55; font-weight: 600; text-decoration: none; }
.empty-cart a:hover { text-decoration: underline; }

/* quantity table (step 1) */
.qty-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1.5px solid #e8f0ec; border-radius: 14px; overflow: hidden; }
.qty-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; min-width: 540px; }
.qty-table th {
  padding: 11px 16px; text-align: left;
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;
  color: #aaa; background: #fafafa; border-bottom: 1px solid #f0f0f0; white-space: nowrap;
}
.qty-table td { padding: 12px 16px; color: #444; border-bottom: 1px solid #f7f7f7; vertical-align: middle; }
.qty-table tbody tr:last-child td { border-bottom: none; }
.qty-table tbody tr:hover td { background: #f8fdfb; }
.qty-table tfoot td { padding: 12px 16px; background: #f8fdfb; font-weight: 700; }
.qt-name     { font-family: 'Sora', sans-serif; font-size: 0.84rem; font-weight: 600; color: #0f2419; }
.qt-batch    { font-size: 0.7rem; color: #bbb; margin-top: 2px; }
.qt-supplier { color: #777; font-size: 0.82rem; }
.qt-price    { font-family: 'Sora', sans-serif; font-weight: 600; color: #0f2419; white-space: nowrap; }
.qt-total    { font-family: 'Sora', sans-serif; font-weight: 700; color: #0f7a55; white-space: nowrap; }
.subtotal-label { text-align: right; font-size: 0.8rem; font-weight: 700; color: #0f2419; text-transform: uppercase; letter-spacing: 0.6px; }
.subtotal-value { font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 800; color: #0f7a55; white-space: nowrap; }
.qty-input {
  width: 80px; padding: 8px 10px; border-radius: 8px;
  border: 1.5px solid #e0ede8; font-size: 0.88rem;
  font-family: 'DM Sans', sans-serif; color: #1a1a1a;
  text-align: center; outline: none; transition: border-color 0.2s;
}
.qty-input:focus { border-color: #0f7a55; }

/* mobile qty cards (hidden on desktop) */
.qty-cards-mobile { display: none; }

/* delivery form (step 2) */
.delivery-form { background: #fff; border: 1.5px solid #e8f0ec; border-radius: 14px; padding: 24px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group--full { grid-column: 1 / -1; }
.form-group label { font-size: 0.8rem; font-weight: 600; color: #555; }
.optional { font-weight: 400; color: #bbb; }
.form-group input,
.form-group select,
.form-group textarea {
  padding: 11px 14px; border-radius: 10px;
  border: 1.5px solid #e0ede8; background: #f8fdfb;
  font-size: 0.88rem; font-family: 'DM Sans', sans-serif;
  color: #1a1a1a; outline: none; transition: border-color 0.2s;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus { border-color: #0f7a55; background: #fff; }
.form-group textarea { resize: vertical; min-height: 80px; }

/* review panels (step 3) */
.review-panel { background: #fff; border: 1.5px solid #e8f0ec; border-radius: 14px; overflow: hidden; }
.review-panel-title { font-family: 'Sora', sans-serif; font-size: 0.88rem; font-weight: 700; color: #0f2419; padding: 16px 20px 12px; border-bottom: 1px solid #f0f0f0; }
.review-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.review-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; min-width: 480px; }
.review-table th { padding: 10px 16px; text-align: left; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #aaa; background: #fafafa; border-bottom: 1px solid #f0f0f0; white-space: nowrap; }
.review-table td { padding: 12px 16px; color: #444; border-bottom: 1px solid #f7f7f7; vertical-align: middle; }
.review-table tbody tr:last-child td { border-bottom: none; }
.review-total-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; background: #f8fdfb; border-top: 1px solid #e8f0ec; font-weight: 700; font-size: 0.88rem; color: #0f2419; }
.review-grand-total { font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 800; color: #0f7a55; }

.review-delivery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 20px; padding: 16px 20px; }
.rd-item { display: flex; flex-direction: column; gap: 3px; }
.rd-item--full { grid-column: 1 / -1; }
.rd-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #bbb; }
.rd-value { font-size: 0.88rem; color: #333; font-weight: 500; }

/* confirmation card (step 4) */
.confirm-card {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 48px 24px;
  background: #fff; border: 1.5px solid #e8f0ec; border-radius: 20px;
  gap: 16px;
}
.confirm-icon svg { width: 64px; height: 64px; }
.confirm-title { font-family: 'Sora', sans-serif; font-size: 1.5rem; font-weight: 800; color: #0f2419; letter-spacing: -0.5px; }
.confirm-sub { font-size: 0.9rem; color: #777; max-width: 420px; line-height: 1.6; }
.confirm-id-badge { display: inline-block; padding: 6px 20px; background: #e8f7f1; color: #0a5e40; border: 1px solid #b6e8d4; border-radius: 20px; font-family: 'Sora', sans-serif; font-size: 0.88rem; font-weight: 700; }
.confirm-note { font-size: 0.84rem; color: #888; }
.confirm-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }
.btn-track { padding: 12px 28px; background: #0f7a55; color: #fff; border: none; border-radius: 10px; font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: background 0.2s; display: inline-block; }
.btn-track:hover { background: #0a5e40; }

/* responsive */
@media (max-width: 900px) {
  .cart-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .step-label { display: none; }
  .step-circle { width: 30px; height: 30px; font-size: 0.75rem; }
  .step-line { top: 15px; }
  .order-desc { font-size: 0.82rem; }
  .btn-continue { width: 100%; text-align: center; }
  .step-footer { flex-direction: column-reverse; align-items: stretch; }
  .btn-back { text-align: center; }
  .form-grid { grid-template-columns: 1fr; }
  /* swap qty table for cards */
  .qty-table-wrap { display: none; }
  .qty-cards-mobile { display: flex; flex-direction: column; gap: 12px; }
  .review-delivery-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .card-body { flex-direction: column; gap: 10px; }
  .card-right { flex-direction: row; gap: 12px; align-items: center; }
  .stepper { gap: 0; }
  .confirm-card { padding: 32px 16px; }
}

/* mobile qty card styles */
.qty-card { background: #fff; border: 1.5px solid #e8f0ec; border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.qc-header { display: flex; flex-direction: column; gap: 2px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0; }
.qc-row { display: flex; justify-content: space-between; align-items: center; }
.qc-label { font-size: 0.76rem; color: #aaa; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.qc-value { font-size: 0.88rem; color: #333; font-weight: 500; }
.qc-total { font-family: 'Sora', sans-serif; font-weight: 700; color: #0f7a55; }
.mobile-subtotal { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f8fdfb; border: 1.5px solid #e8f0ec; border-radius: 10px; font-family: 'Sora', sans-serif; font-weight: 700; color: #0f2419; font-size: 0.9rem; }
</style>
