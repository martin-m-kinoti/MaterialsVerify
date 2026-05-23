<template>
  <app-layout title="Materials Catalogue">

    <!-- Search + filters -->
    <div class="search-row">
      <input v-model="search" type="text" class="search-input" placeholder="Search materials…" />
    </div>

    <div class="filter-row">
      <div class="filter-search-wrap">
        <button class="filter-clear" @click="search = ''" title="Clear search">×</button>
        <input v-model="search" type="text" class="filter-search" placeholder="Search materials" />
      </div>
      <select v-model="categoryFilter" class="filter-select">
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
      <select v-model="statusFilter" class="filter-select">
        <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <p class="results-count">{{ filteredMaterials.length }} material{{ filteredMaterials.length !== 1 ? 's' : '' }} found</p>

    <!-- Material cards grid -->
    <div class="materials-grid">
      <div class="mat-card" v-for="mat in filteredMaterials" :key="mat.id">
        <button class="card-dismiss" @click="removeMaterial(mat.id)" title="Remove">×</button>
        <div class="card-body">
          <div class="card-left">
            <p class="card-name">{{ mat.name }}</p>
            <p class="card-batch">{{ mat.batch }}</p>
            <p class="card-supplier">{{ mat.supplier }}</p>
            <span class="mat-badge" :class="`badge-${mat.statusType}`">{{ mat.status }}</span>
          </div>
          <div class="card-right">
            <p class="card-category">{{ mat.category }}</p>
            <p class="card-price">KES {{ mat.price }}</p>
            <button class="btn-order" @click="addToOrder(mat)">Add to Order</button>
          </div>
        </div>
      </div>
    </div>

  </app-layout>
</template>

<script>
import AppLayout from '@/components/AppLayout.vue'

export default {
  name: 'MaterialsPage',
  components: { AppLayout },
  data() {
    return {
      search: '',
      categoryFilter: 'All',
      statusFilter: 'All',
      categories: ['All', 'Cement', 'Steel', 'Timber', 'Aggregates', 'Masonry'],
      statuses: ['All', 'Verified', 'Pending', 'Flagged'],
      materials: [
        { id: 1, name: 'Bamburi Portland Cement 50kg', category: 'Cement',     supplier: 'Bamburi Cement Ltd',  price: '750',   status: 'Verified', statusType: 'green', batch: 'KE-2024-CMT-00482' },
        { id: 2, name: 'Deformed Steel Bar Y12',       category: 'Steel',      supplier: 'Steel Makers EA',     price: '1,200', status: 'Verified', statusType: 'green', batch: 'KE-2024-STL-00203' },
        { id: 3, name: 'Roofing Timber 2×4 Treated',  category: 'Timber',     supplier: 'Kenya Timbers Ltd',   price: '380',   status: 'Verified', statusType: 'green', batch: 'KE-2024-TMB-00091' },
        { id: 4, name: 'Ballast Aggregate 20mm',       category: 'Aggregates', supplier: 'Quarry Masters KE',   price: '220',   status: 'Pending',  statusType: 'amber', batch: 'KE-2024-AGG-00054' },
        { id: 5, name: 'Hollow Clay Bricks (100pcs)',  category: 'Masonry',    supplier: 'Brick Works KE',      price: '4,500', status: 'Verified', statusType: 'green', batch: 'KE-2024-MSN-00177' },
        { id: 6, name: 'Mild Steel Pipe 1.5"',         category: 'Steel',      supplier: 'Steel Makers EA',     price: '890',   status: 'Flagged',  statusType: 'red',   batch: 'KE-2024-STL-00198' },
      ],
      dismissed: [],
    }
  },
  computed: {
    filteredMaterials() {
      return this.materials.filter(m => {
        if (this.dismissed.includes(m.id)) return false
        const q = this.search.toLowerCase()
        if (q && !m.name.toLowerCase().includes(q) && !m.supplier.toLowerCase().includes(q)) return false
        if (this.categoryFilter !== 'All' && m.category !== this.categoryFilter) return false
        if (this.statusFilter !== 'All' && m.status !== this.statusFilter) return false
        return true
      })
    },
  },
  methods: {
    removeMaterial(id) {
      this.dismissed.push(id)
    },
    addToOrder(mat) {
      const cart = JSON.parse(localStorage.getItem('mv_cart') || '[]')
      if (!cart.find(c => c.id === mat.id)) {
        cart.push(mat)
        localStorage.setItem('mv_cart', JSON.stringify(cart))
      }
      this.$router.push('/orders')
    },
  },
}
</script>

<style scoped>
/* ── SEARCH & FILTERS ── */
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

.filter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.filter-search-wrap {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1.5px solid #e0ede8;
  border-radius: 10px;
  background: #f8fdfb;
  overflow: hidden;
  transition: border-color 0.2s;
}
.filter-search-wrap:focus-within { border-color: #0f7a55; }
.filter-clear {
  padding: 0 10px;
  height: 40px;
  background: transparent;
  border: none;
  font-size: 1.1rem;
  color: #999;
  cursor: pointer;
  line-height: 1;
  transition: color 0.15s;
}
.filter-clear:hover { color: #dc2626; }
.filter-search {
  padding: 10px 14px 10px 0;
  border: none;
  background: transparent;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  color: #1a1a1a;
  outline: none;
  width: 160px;
}
.filter-select {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #e0ede8;
  background: #f8fdfb;
  color: #555;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}
.filter-select:focus { border-color: #0f7a55; }

.results-count {
  font-size: 0.8rem;
  color: #aaa;
  font-weight: 500;
}

/* ── GRID ── */
.materials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.mat-card {
  background: #fff;
  border: 1.5px solid #e8f0ec;
  border-radius: 14px;
  padding: 18px 18px 18px 44px;
  position: relative;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.mat-card:hover {
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
.card-left { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }

.card-name {
  font-family: 'Sora', sans-serif;
  font-size: 0.92rem;
  font-weight: 600;
  color: #0f2419;
  line-height: 1.3;
}
.card-batch { font-size: 0.72rem; color: #aaa; font-family: 'Sora', sans-serif; letter-spacing: 0.3px; }
.card-supplier { font-size: 0.8rem; color: #777; }

.card-category { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #0f7a55; }
.card-price { font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 700; color: #0f2419; }

.mat-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  align-self: flex-start;
}
.badge-green { background: #e8f7f1; color: #0a5e40; border: 1px solid #b6e8d4; }
.badge-amber { background: #fff8e6; color: #8a5a00; border: 1px solid #f5d68a; }
.badge-red   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

.btn-order {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1.5px solid #0f7a55;
  background: transparent;
  color: #0f7a55;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}
.btn-order:hover { background: #0f7a55; color: #fff; }

@media (max-width: 860px) { .materials-grid { grid-template-columns: 1fr; } }
</style>
