<template>
  <admin-layout title="User Management">

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Search by name or email…"
          @input="fetchUsers"
        />
        <select v-model="filterRole" class="role-select" @change="fetchUsers">
          <option value="">All roles</option>
          <option value="buyer">Buyer</option>
          <option value="supplier">Supplier</option>
          <option value="inspector">Inspector</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button class="btn-add" @click="openCreate">+ Add User</button>
    </div>

    <!-- Alert messages -->
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>
    <div v-if="errorMsg"   class="alert alert-error">{{ errorMsg }}</div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="loading" class="loading-msg">Loading users…</div>
      <div v-else-if="users.length === 0" class="empty-msg">No users found.</div>
      <div v-else class="table-wrap">
        <table class="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>County</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td class="td-name">{{ user.firstName }} {{ user.lastName }}</td>
              <td class="td-email">{{ user.email }}</td>
              <td><span class="role-badge" :class="`role-${user.role}`">{{ user.role }}</span></td>
              <td>{{ user.county || '—' }}</td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td class="td-actions">
                <button class="btn-edit" @click="openEdit(user)">Edit</button>
                <button class="btn-del"  @click="promptDelete(user)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title">{{ editing ? 'Edit User' : 'Add User' }}</h2>
            <button class="modal-close" @click="closeModal">×</button>
          </div>

          <form class="modal-form" @submit.prevent="saveUser">
            <div class="form-row">
              <div class="form-group">
                <label>First Name <span class="req">*</span></label>
                <input v-model="form.firstName" type="text" required maxlength="50" />
              </div>
              <div class="form-group">
                <label>Last Name <span class="req">*</span></label>
                <input v-model="form.lastName" type="text" required maxlength="50" />
              </div>
            </div>

            <div class="form-group">
              <label>Email <span class="req">*</span></label>
              <input v-model="form.email" type="email" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Role <span class="req">*</span></label>
                <select v-model="form.role" required>
                  <option value="buyer">Buyer</option>
                  <option value="supplier">Supplier</option>
                  <option value="inspector">Inspector</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="form-group">
                <label>County</label>
                <select v-model="form.county">
                  <option value="">— Select county —</option>
                  <option v-for="c in counties" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>{{ editing ? 'New Password (leave blank to keep current)' : 'Password' }} <span v-if="!editing" class="req">*</span></label>
              <input
                v-model="form.password"
                type="password"
                :required="!editing"
                minlength="8"
                autocomplete="new-password"
              />
            </div>

            <div v-if="formError" class="form-error">{{ formError }}</div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn-save" :disabled="saving">
                {{ saving ? 'Saving…' : (editing ? 'Update User' : 'Create User') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Delete confirmation -->
    <transition name="modal">
      <div v-if="confirmTarget" class="modal-overlay" @click.self="confirmTarget = null">
        <div class="modal modal-sm">
          <div class="modal-header">
            <h2 class="modal-title">Delete User</h2>
            <button class="modal-close" @click="confirmTarget = null">×</button>
          </div>
          <p class="confirm-msg">
            Are you sure you want to delete
            <strong>{{ confirmTarget.firstName }} {{ confirmTarget.lastName }}</strong>?
            This action cannot be undone.
          </p>
          <div class="modal-footer">
            <button class="btn-cancel" @click="confirmTarget = null">Cancel</button>
            <button class="btn-del-confirm" :disabled="deleting" @click="deleteUser">
              {{ deleting ? 'Deleting…' : 'Yes, Delete' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

  </admin-layout>
</template>

<script>
import axios from 'axios';
import AdminLayout from '../components/AdminLayout.vue';

const API = 'http://localhost:9000';

const KENYA_COUNTIES = [
  'Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu',
  'Garissa','Homa Bay','Isiolo','Kajiado','Kakamega','Kericho',
  'Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale',
  'Laikipia','Lamu','Machakos','Makueni','Mandera','Marsabit',
  'Meru','Migori','Mombasa',"Murang'a",'Nairobi','Nakuru','Nandi',
  'Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya',
  'Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia',
  'Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot',
];

export default {
  name: 'AdminUsers',
  components: { AdminLayout },
  data() {
    return {
      users: [],
      loading: false,
      search: '',
      filterRole: '',
      showModal: false,
      editing: null,
      form: { firstName: '', lastName: '', email: '', county: '', role: 'buyer', password: '' },
      saving: false,
      formError: '',
      confirmTarget: null,
      deleting: false,
      successMsg: '',
      errorMsg: '',
      counties: KENYA_COUNTIES,
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      this.errorMsg = '';
      try {
        const params = {};
        if (this.search)     params.search = this.search;
        if (this.filterRole) params.role   = this.filterRole;
        const { data } = await axios.get(`${API}/api/admin/users`, { params, withCredentials: true });
        this.users = data;
      } catch (err) {
        this.errorMsg = (err.response && err.response.data && err.response.data.message) || 'Failed to load users.';
      } finally {
        this.loading = false;
      }
    },

    openCreate() {
      this.editing  = null;
      this.form     = { firstName: '', lastName: '', email: '', county: '', role: 'buyer', password: '' };
      this.formError = '';
      this.showModal = true;
    },

    openEdit(user) {
      this.editing  = user;
      this.form     = { firstName: user.firstName, lastName: user.lastName, email: user.email, county: user.county || '', role: user.role, password: '' };
      this.formError = '';
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
    },

    async saveUser() {
      this.saving    = true;
      this.formError = '';
      try {
        const payload = { ...this.form };
        if (!payload.password) delete payload.password;
        if (!payload.county)   delete payload.county;

        if (this.editing) {
          await axios.put(`${API}/api/admin/users/${this.editing._id}`, payload, { withCredentials: true });
          this.flash('User updated successfully.');
        } else {
          await axios.post(`${API}/api/admin/users`, payload, { withCredentials: true });
          this.flash('User created successfully.');
        }
        this.showModal = false;
        this.fetchUsers();
      } catch (err) {
        this.formError = (err.response && err.response.data && err.response.data.message) || 'Save failed.';
      } finally {
        this.saving = false;
      }
    },

    promptDelete(user) {
      this.confirmTarget = user;
    },

    async deleteUser() {
      this.deleting = true;
      try {
        await axios.delete(`${API}/api/admin/users/${this.confirmTarget._id}`, { withCredentials: true });
        this.flash('User deleted.');
        this.confirmTarget = null;
        this.fetchUsers();
      } catch (err) {
        this.errorMsg      = (err.response && err.response.data && err.response.data.message) || 'Delete failed.';
        this.confirmTarget = null;
      } finally {
        this.deleting = false;
      }
    },

    flash(msg) {
      this.successMsg = msg;
      setTimeout(() => { this.successMsg = ''; }, 3500);
    },

    formatDate(iso) {
      if (!iso) return '—';
      return new Date(iso).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' });
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  flex: 1;
}
.search-input {
  height: 38px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  outline: none;
  width: 240px;
  transition: border-color 0.15s;
}
.search-input:focus { border-color: #0f7a55; }
.role-select {
  height: 38px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  background: #fff;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;
}
.role-select:focus { border-color: #0f7a55; }
.btn-add {
  height: 38px;
  padding: 0 18px;
  background: #0f7a55;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}
.btn-add:hover { background: #0a6144; }

/* Alerts */
.alert {
  padding: 11px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: 'DM Sans', sans-serif;
}
.alert-success { background: #e6f7f1; color: #0f7a55; border: 1px solid #b2dfd1; }
.alert-error   { background: #fff5f5; color: #c0392b; border: 1px solid #f5c6cb; }

/* Table card */
.table-card {
  background: #fff;
  border: 1px solid #efefef;
  border-radius: 12px;
  overflow: hidden;
}
.loading-msg, .empty-msg {
  padding: 40px;
  text-align: center;
  color: #aaa;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
}
.table-wrap { overflow-x: auto; }
.users-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
}
.users-table th {
  background: #f8f8f8;
  padding: 12px 16px;
  text-align: left;
  font-family: 'Sora', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 1px solid #efefef;
  white-space: nowrap;
}
.users-table td {
  padding: 13px 16px;
  border-bottom: 1px solid #f5f5f5;
  color: #333;
}
.users-table tr:last-child td { border-bottom: none; }
.users-table tr:hover td { background: #fafafa; }

.td-name  { font-weight: 500; color: #0f2419; }
.td-email { color: #666; }

.role-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}
.role-buyer    { background: #e8f4fd; color: #1a73e8; }
.role-supplier { background: #fff3e0; color: #e67e22; }
.role-inspector{ background: #f3e5f5; color: #8e44ad; }
.role-admin    { background: #fde8e8; color: #c0392b; }

.td-actions { display: flex; gap: 8px; white-space: nowrap; }
.btn-edit, .btn-del {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid;
  transition: background 0.15s, color 0.15s;
}
.btn-edit { background: #fff; color: #0f7a55; border-color: #0f7a55; }
.btn-edit:hover { background: #0f7a55; color: #fff; }
.btn-del  { background: #fff; color: #c0392b; border-color: #c0392b; }
.btn-del:hover  { background: #c0392b; color: #fff; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.modal {
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  overflow: hidden;
}
.modal-sm { max-width: 400px; }
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.modal-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f2419;
}
.modal-close {
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #aaa;
  cursor: pointer;
  line-height: 1;
  padding: 0 2px;
  transition: color 0.15s;
}
.modal-close:hover { color: #333; }

/* Form */
.modal-form { padding: 20px 24px 0; }
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}
.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
  font-family: 'DM Sans', sans-serif;
}
.req { color: #c0392b; }
.form-group input,
.form-group select {
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  outline: none;
  background: #fff;
  transition: border-color 0.15s;
}
.form-group input:focus,
.form-group select:focus { border-color: #0f7a55; }
.form-error {
  color: #c0392b;
  font-size: 0.82rem;
  font-family: 'DM Sans', sans-serif;
  margin-bottom: 12px;
  padding: 10px 14px;
  background: #fff5f5;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px 20px;
}
.confirm-msg {
  padding: 16px 24px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  color: #555;
  line-height: 1.5;
}
.confirm-msg strong { color: #0f2419; }

.btn-cancel {
  padding: 9px 18px;
  background: #f0f0f0;
  color: #555;
  border: none;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-cancel:hover { background: #e0e0e0; }
.btn-save {
  padding: 9px 22px;
  background: #0f7a55;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-save:hover:not(:disabled) { background: #0a6144; }
.btn-save:disabled { opacity: 0.6; cursor: default; }
.btn-del-confirm {
  padding: 9px 22px;
  background: #c0392b;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-del-confirm:hover:not(:disabled) { background: #a93226; }
.btn-del-confirm:disabled { opacity: 0.6; cursor: default; }

/* Modal transitions */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter, .modal-leave-to { opacity: 0; }

/* Responsive */
@media (max-width: 600px) {
  .form-row { grid-template-columns: 1fr; }
  .search-input { width: 100%; }
  .toolbar { flex-direction: column; align-items: stretch; }
  .btn-add { width: 100%; }
}
</style>
