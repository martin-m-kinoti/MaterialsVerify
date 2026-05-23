<template>
  <div class="landing">

    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-inner">
        <div class="logo">
          <img src="/logo.png" alt="MaterialsVerify logo" class="logo-img" />
          <span class="logo-text">MaterialsVerify</span>
        </div>
        <div class="nav-actions">
          <router-link to="/login" class="btn-ghost">Sign In</router-link>
          <router-link to="/register" class="btn-primary">Get Started</router-link>
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-badge">Trusted by 1,200+ contractors in Kenya</div>
      <h1 class="hero-headline">
        Build with materials<br />you can <span class="highlight">trust</span>
      </h1>
      <p class="hero-sub">
        A platform to verify, buy, and report construction materials.
        Every product. Every supplier. Every batch authenticated.
      </p>

      <div class="verify-card">
        <p class="verify-label">Verify before you build</p>
        <div class="verify-steps">
          <div class="vstep">
            <div class="vstep-icon">🔍</div>
            <div class="vstep-text">
              <strong>Enter Batch ID</strong>
              <span>Scan QR or type the product serial number</span>
            </div>
          </div>
          <div class="vstep-divider"></div>
          <div class="vstep">
            <div class="vstep-icon">🏷️</div>
            <div class="vstep-text">
              <strong>Instant Lookup</strong>
              <span>Checked against KEBS certification records</span>
            </div>
          </div>
          <div class="vstep-divider"></div>
          <div class="vstep">
            <div class="vstep-icon">✅</div>
            <div class="vstep-text">
              <strong>Get Results</strong>
              <span>Verified, Pending, or Flagged status in seconds</span>
            </div>
          </div>
        </div>
        <div class="verify-input-row">
          <input type="text" placeholder="e.g. KE-2024-CMT-00482" class="verify-input" />
          <button class="btn-verify">Verify Now</button>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="how-it-works">
      <div class="section-header">
        <span class="section-tag">Process</span>
        <h2>How it works</h2>
        <p>Four simple steps between you and verified construction materials</p>
      </div>
      <div class="steps-grid">
        <div class="step-card" v-for="(step, i) in howItWorks" :key="i">
          <div class="step-number">0{{ i + 1 }}</div>
          <div class="step-icon">{{ step.icon }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.desc }}</p>
        </div>
      </div>
    </section>

    <!-- FEATURED MATERIALS -->
    <section class="featured">
      <div class="featured-header">
        <div>
          <span class="section-tag">Marketplace</span>
          <h2>Featured verified materials</h2>
        </div>
        <a href="/marketplace" class="view-all">View all <span>→</span></a>
      </div>
      <div class="materials-grid">
        <div class="material-card" v-for="(mat, i) in materials" :key="i">
          <div class="material-img">
            <div class="material-img-placeholder">{{ mat.emoji }}</div>
            <span :class="['mat-badge', mat.status === 'Verified' ? 'badge-green' : 'badge-amber']">
              {{ mat.status }}
            </span>
          </div>
          <div class="material-info">
            <p class="mat-category">{{ mat.category }}</p>
            <h4>{{ mat.name }}</h4>
            <p class="mat-supplier">{{ mat.supplier }}</p>
            <div class="mat-footer">
              <span class="mat-price">KES {{ mat.price }}</span>
              <button class="btn-outline-sm">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS STRIP -->
    <section class="stats-strip">
      <div class="stat" v-for="(s, i) in stats" :key="i">
        <span class="stat-num">{{ s.num }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-col">
          <div class="footer-logo">
            <span class="logo-icon">
              <img src="/logo.png" alt="MaterialsVerify logo" class="logo-img" />
            </span>
            <span class="logo-text">MaterialsVerify</span>
          </div>
          <p class="footer-tagline">Protecting Kenya's construction industry, one batch at a time.</p>
        </div>
        <div class="footer-col">
          <h5>Company</h5>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">How It Works</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Resources</h5>
          <ul>
            <li><a href="#">KEBS Standards</a></li>
            <li><a href="#">Supplier Portal</a></li>
            <li><a href="#">Developer API</a></li>
            <li><a href="#">Documentation</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Contact</h5>
          <ul>
            <li><a href="#">support@materialsverify.co.ke</a></li>
            <li><a href="#">+254 700 000 000</a></li>
            <li><a href="#">Nairobi, Kenya</a></li>
            <li><a href="#">Twitter / X</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 MaterialsVerify. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  data() {
    return {
      howItWorks: [
        {
          icon: '📋',
          title: 'Suppliers Register',
          desc: 'Licensed suppliers register products with official batch numbers, certifications, and KEBS marks on the platform.',
        },
        {
          icon: '🔐',
          title: 'Batch Verification',
          desc: 'Each product batch is assigned a unique QR code and serial number, verified against national standards.',
        },
        {
          icon: '🛒',
          title: 'Buy with Confidence',
          desc: 'Buyers browse the marketplace and purchase only from verified suppliers, with M-Pesa integrated at checkout.',
        },
        {
          icon: '🚩',
          title: 'Flag & Report',
          desc: 'Encountered substandard materials? Flag the supplier directly on the platform. Admins investigate and act.',
        },
      ],
      materials: [
        { emoji: '🧱', name: 'Bamburi Portland Cement 50kg', category: 'Cement', supplier: 'Bamburi Cement Ltd', price: '750', status: 'Verified' },
        { emoji: '🔩', name: 'Deformed Steel Bar Y12', category: 'Steel', supplier: 'Steel Makers EA', price: '1,200', status: 'Verified' },
        { emoji: '🪵', name: 'Roofing Timber 2×4 Treated', category: 'Timber', supplier: 'Kenya Timbers Ltd', price: '380', status: 'Verified' },
        { emoji: '🪨', name: 'Ballast Aggregate 20mm', category: 'Aggregates', supplier: 'Quarry Masters KE', price: '220', status: 'Pending' },
      ],
      stats: [
        { num: '14,500+', label: 'Materials Verified' },
        { num: '820+', label: 'Registered Suppliers' },
        { num: '3,200+', label: 'Active Buyers' },
        { num: '180+', label: 'Flags Resolved' },
      ],
    }
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.landing {
  font-family: 'DM Sans', sans-serif;
  color: #1a1a1a;
  background: #fff;
}

/* ── NAVBAR ───────────────────────────────────────── */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #f0f0f0;
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.logo-icon { font-size: 22px; color: #0f7a55; }
.logo-img { height: 32px; width: auto; display: block; border-radius: 50%; }
.logo-text {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: #0f2419;
  letter-spacing: -0.3px;
}
.nav-actions { display: flex; align-items: center; gap: 12px; }
.btn-ghost {
  padding: 8px 18px;
  border-radius: 8px;
  border: 1.5px solid #d4d4d4;
  background: transparent;
  color: #1a1a1a;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s;
}
.btn-ghost:hover { border-color: #0f7a55; color: #0f7a55; }
.btn-primary {
  padding: 8px 20px;
  border-radius: 8px;
  background: #0f7a55;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}
.btn-primary:hover { background: #0a5e40; }

/* ── HERO ─────────────────────────────────────────── */
.hero {
  max-width: 860px;
  margin: 0 auto;
  padding: 80px 2rem 60px;
  text-align: center;
}
.hero-badge {
  display: inline-block;
  background: #e8f7f1;
  color: #0a5e40;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 24px;
  letter-spacing: 0.3px;
  border: 1px solid #b6e8d4;
}
.hero-headline {
  font-family: 'Sora', sans-serif;
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  font-weight: 700;
  line-height: 1.15;
  color: #0f2419;
  letter-spacing: -1.5px;
  margin-bottom: 20px;
}
.highlight {
  color: #0f7a55;
  position: relative;
}
.highlight::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 0;
  width: 100%;
  height: 4px;
  background: #b6e8d4;
  border-radius: 2px;
  z-index: -1;
}
.hero-sub {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.7;
  max-width: 580px;
  margin: 0 auto 48px;
}

/* Verify Card */
.verify-card {
  background: #f8fdfb;
  border: 1.5px solid #c8ead9;
  border-radius: 18px;
  padding: 36px;
  text-align: left;
}
.verify-label {
  font-family: 'Sora', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #0f7a55;
  margin-bottom: 24px;
}
.verify-steps {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 8px;
}
.vstep {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  min-width: 200px;
}
.vstep-icon { font-size: 1.5rem; flex-shrink: 0; }
.vstep-text { display: flex; flex-direction: column; gap: 2px; }
.vstep-text strong { font-size: 0.95rem; font-weight: 600; color: #0f2419; }
.vstep-text span { font-size: 0.82rem; color: #777; line-height: 1.5; }
.vstep-divider {
  width: 32px;
  height: 1.5px;
  background: #c8ead9;
  flex-shrink: 0;
  margin-top: 14px;
}
.verify-input-row {
  display: flex;
  gap: 12px;
}
.verify-input {
  flex: 1;
  padding: 12px 18px;
  border: 1.5px solid #c8ead9;
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: border-color 0.2s;
  background: #fff;
  color: #1a1a1a;
}
.verify-input:focus { border-color: #0f7a55; }
.btn-verify {
  padding: 12px 28px;
  background: #0f7a55;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  transition: background 0.2s;
  white-space: nowrap;
}
.btn-verify:hover { background: #0a5e40; }

/* ── HOW IT WORKS ─────────────────────────────────── */
.how-it-works {
  background: #f8fdfb;
  padding: 90px 2rem;
  border-top: 1px solid #eaf5f0;
  border-bottom: 1px solid #eaf5f0;
}
.section-header {
  text-align: center;
  max-width: 560px;
  margin: 0 auto 56px;
}
.section-tag {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #0f7a55;
  margin-bottom: 10px;
}
.section-header h2 {
  font-family: 'Sora', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #0f2419;
  letter-spacing: -0.8px;
  margin-bottom: 12px;
}
.section-header p { color: #777; font-size: 1rem; }

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
}
.step-card {
  background: #fff;
  border: 1.5px solid #e0f0e8;
  border-radius: 16px;
  padding: 28px 24px;
  position: relative;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.step-card:hover {
  border-color: #0f7a55;
  box-shadow: 0 4px 20px rgba(15, 122, 85, 0.08);
}
.step-number {
  font-family: 'Sora', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #c8ead9;
  margin-bottom: 14px;
}
.step-icon { font-size: 1.8rem; margin-bottom: 14px; }
.step-card h3 {
  font-family: 'Sora', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #0f2419;
  margin-bottom: 10px;
}
.step-card p { font-size: 0.875rem; color: #777; line-height: 1.7; }

/* ── FEATURED MATERIALS ───────────────────────────── */
.featured {
  max-width: 1100px;
  margin: 0 auto;
  padding: 90px 2rem;
}
.featured-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 16px;
}
.featured-header h2 {
  font-family: 'Sora', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #0f2419;
  letter-spacing: -0.8px;
}
.view-all {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f7a55;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.2s;
}
.view-all:hover { gap: 10px; }

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px;
}
.material-card {
  border: 1.5px solid #ebebeb;
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #fff;
}
.material-card:hover {
  border-color: #0f7a55;
  box-shadow: 0 6px 24px rgba(0,0,0,0.07);
}
.material-img {
  background: #f5f5f5;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.material-img-placeholder { font-size: 3rem; }
.mat-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}
.badge-green { background: #e8f7f1; color: #0a5e40; border: 1px solid #b6e8d4; }
.badge-amber { background: #fff8e6; color: #8a5a00; border: 1px solid #f5d68a; }

.material-info { padding: 18px 18px 20px; }
.mat-category {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #0f7a55;
  margin-bottom: 6px;
}
.material-info h4 {
  font-family: 'Sora', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f2419;
  margin-bottom: 4px;
  line-height: 1.4;
}
.mat-supplier { font-size: 0.8rem; color: #999; margin-bottom: 14px; }
.mat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mat-price {
  font-family: 'Sora', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #0f2419;
}
.btn-outline-sm {
  padding: 6px 14px;
  border: 1.5px solid #0f7a55;
  border-radius: 8px;
  background: transparent;
  color: #0f7a55;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-outline-sm:hover { background: #0f7a55; color: #fff; }

/* ── STATS STRIP ──────────────────────────────────── */
.stats-strip {
  background: #0f2419;
  padding: 52px 2rem;
  display: flex;
  justify-content: center;
  gap: 0;
  flex-wrap: wrap;
}
.stat {
  flex: 1;
  min-width: 160px;
  max-width: 240px;
  text-align: center;
  padding: 0 24px;
  border-right: 1px solid rgba(255,255,255,0.1);
}
.stat:last-child { border-right: none; }
.stat-num {
  display: block;
  font-family: 'Sora', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #5de0a5;
  margin-bottom: 6px;
}
.stat-label {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.55);
}

/* ── FOOTER ───────────────────────────────────────── */
.footer {
  background: #0f2419;
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 60px 2rem 32px;
}
.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 48px;
}
.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
.footer-logo .logo-text { color: #fff; }
.footer-tagline {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.45);
  line-height: 1.7;
  max-width: 240px;
}
.footer-col h5 {
  font-family: 'Sora', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(255,255,255,0.35);
  margin-bottom: 16px;
}
.footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.footer-col a {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  transition: color 0.2s;
}
.footer-col a:hover { color: #5de0a5; }

.footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.footer-bottom p { font-size: 0.82rem; color: rgba(255,255,255,0.3); }
.footer-links { display: flex; gap: 20px; }
.footer-links a { font-size: 0.82rem; color: rgba(255,255,255,0.35); text-decoration: none; }
.footer-links a:hover { color: #5de0a5; }

/* ── RESPONSIVE ───────────────────────────────────── */
@media (max-width: 768px) {
  .verify-steps { flex-direction: column; }
  .vstep-divider { width: 1.5px; height: 20px; margin: 0 0 0 20px; }
  .verify-input-row { flex-direction: column; }
  .footer-inner { grid-template-columns: 1fr 1fr; }
  .stats-strip { gap: 20px; }
  .stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
  .stat:last-child { border-bottom: none; }
}

@media (max-width: 480px) {
  .footer-inner { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; text-align: center; }
}
</style>