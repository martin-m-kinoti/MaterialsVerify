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
          <router-link to="/register" class="btn-primary"
            >Get Started</router-link
          >
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-inner">
        <!-- Left: headline + CTAs -->
        <div class="hero-left">
          <div class="hero-badge">Trusted by 1,200+ contractors in Kenya</div>
          <h1 class="hero-headline">VERIFY BEFORE<br />YOU BUILD.</h1>
          <p class="hero-sub">
            A platform to verify, buy, and report construction materials. Every
            product. Every supplier. Every batch authenticated.
          </p>
          <div class="hero-actions">
            <router-link to="/marketplace" class="btn-primary btn-lg"
              >Browse Verified Materials</router-link
            >
            <a href="#how-it-works" class="btn-how">How it works →</a>
          </div>
        </div>

        <!-- Right: live stat cards -->
        <div class="hero-right">
          <div class="hero-stat-card" v-for="(s, i) in heroStats" :key="i">
            <span class="hstat-num" :class="s.color">{{ s.num }}</span>
            <span class="hstat-label">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="how-it-works" id="how-it-works">
      <div class="section-header">
        <span class="section-tag">Process</span>
        <h2>How it works</h2>
        <p>Four simple steps between you and verified construction materials</p>
      </div>
      <div class="steps-grid">
        <div class="step-card" v-for="(step, i) in howItWorks" :key="i">
          <div class="step-number">0{{ i + 1 }}</div>
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
            <img :src="mat.image" :alt="mat.name" class="material-img-photo" />
            <span
              :class="[
                'mat-badge',
                mat.status === 'Verified' ? 'badge-green' : 'badge-amber',
              ]"
            >
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
              <img
                src="/logo.png"
                alt="MaterialsVerify logo"
                class="logo-img"
              />
            </span>
            <span class="logo-text">MaterialsVerify</span>
          </div>
          <p class="footer-tagline">
            Protecting Kenya's construction industry, one batch at a time.
          </p>
        </div>
        <div class="footer-col">
          <h5>Company</h5>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Resources</h5>
          <ul>
            <li><a href="#">KEBS Standards</a></li>
            <li><a href="#">Documentation</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Contact</h5>
          <ul>
            <li>
              <a href="mailto:support@materialsverify.co.ke"
                >support@materialsverify.co.ke</a
              >
            </li>
            <li><a href="tel:+254700000000">+254 700 000 000</a></li>
            <li>
              <a href="https://maps.google.com/?q=Kiambu,+Kenya"
                >Kiambu, Kenya</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 MaterialsVerify. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
  data() {
    return {
      heroStats: [
        { num: "134", label: "Verified", color: "hstat-green" },
        { num: "38", label: "Flagged", color: "hstat-orange" },
        { num: "6", label: "Blacklisted", color: "hstat-red" },
      ],
      howItWorks: [
        {
          title: "Suppliers Register",
          desc: "Licensed suppliers register products with official batch numbers, certifications, and KEBS marks on the platform.",
        },
        {
          title: "Batch Verification",
          desc: "Each product batch is assigned a unique QR code and serial number, verified against national standards.",
        },
        {
          title: "Buy with Confidence",
          desc: "Buyers browse the marketplace and purchase only from verified suppliers, with M-Pesa integrated at checkout.",
        },
        {
          title: "Flag & Report",
          desc: "Encountered substandard materials? Flag the supplier directly on the platform. Admins investigate and act.",
        },
      ],
      materials: [
        {
          image: "./bamburi-cement.png",
          name: "Bamburi Portland Cement 50kg",
          category: "Cement",
          supplier: "Bamburi Cement Ltd",
          price: "750",
          status: "Verified",
        },
        {
          image: "./y12.jpeg",
          name: "Deformed Steel Bar Y12",
          category: "Steel",
          supplier: "Steel Makers EA",
          price: "1,200",
          status: "Verified",
        },
        {
          image: "./timber.jpeg",
          name: "Roofing Timber 2×4 Treated",
          category: "Timber",
          supplier: "Kenya Timbers Ltd",
          price: "380",
          status: "Verified",
        },
        {
          image: "./aggregate.jpeg",
          name: "Ballast Aggregate 20mm",
          category: "Aggregates",
          supplier: "Quarry Masters KE",
          price: "220",
          status: "Pending",
        },
      ],
      stats: [
        { num: "14,500+", label: "Materials Verified" },
        { num: "820+", label: "Registered Suppliers" },
        { num: "3,200+", label: "Active Buyers" },
        { num: "180+", label: "Flags Resolved" },
      ],
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.landing {
  font-family: "DM Sans", sans-serif;
  color: #1a1a1a;
  background: #fff;
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
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
.logo-icon {
  font-size: 22px;
  color: #0f7a55;
}
.logo-img {
  height: 32px;
  width: auto;
  display: block;
  border-radius: 50%;
}
.logo-text {
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: #0f2419;
  letter-spacing: -0.3px;
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
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
.btn-ghost:hover {
  border-color: #0f7a55;
  color: #0f7a55;
}
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
.btn-primary:hover {
  background: #0a5e40;
}

/* Hero */
.hero {
  padding: 90px 2rem 80px;
  border-bottom: 1px solid #eaf5f0;
}
.hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 64px;
}
.hero-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.hero-badge {
  display: inline-block;
  background: #e8f7f1;
  color: #0a5e40;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 28px;
  letter-spacing: 0.3px;
  border: 1px solid #b6e8d4;
}
.hero-headline {
  font-family: "Sora", sans-serif;
  font-size: clamp(2.6rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  color: #0f2419;
  letter-spacing: -2px;
  text-transform: uppercase;
  margin-bottom: 24px;
}
.hero-sub {
  font-size: 1.05rem;
  color: #555;
  line-height: 1.75;
  max-width: 480px;
  margin-bottom: 40px;
}
.hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.btn-lg {
  padding: 14px 28px;
  font-size: 0.95rem;
  border-radius: 10px;
}
.btn-how {
  padding: 14px 24px;
  border-radius: 10px;
  border: 1.5px solid #d4d4d4;
  background: transparent;
  color: #1a1a1a;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s;
  white-space: nowrap;
}
.btn-how:hover {
  border-color: #0f7a55;
  color: #0f7a55;
}

/* Hero stat cards */
.hero-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}
.hero-stat-card {
  background: #f8fdfb;
  border: 1.5px solid #c8ead9;
  border-radius: 14px;
  padding: 20px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 140px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.hero-stat-card:hover {
  border-color: #0f7a55;
  box-shadow: 0 4px 16px rgba(15, 122, 85, 0.1);
}
.hstat-num {
  font-family: "Sora", sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1;
}
.hstat-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #888;
  letter-spacing: 0.3px;
}
.hstat-green {
  color: #0f7a55;
}
.hstat-orange {
  color: #d97706;
}
.hstat-red {
  color: #dc2626;
}

/* How it works */
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
  font-family: "Sora", sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #0f2419;
  letter-spacing: -0.8px;
  margin-bottom: 12px;
}
.section-header p {
  color: #777;
  font-size: 1rem;
}

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
  font-family: "Sora", sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #c8ead9;
  margin-bottom: 14px;
}
.step-card h3 {
  font-family: "Sora", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #0f2419;
  margin-bottom: 10px;
}
.step-card p {
  font-size: 0.875rem;
  color: #777;
  line-height: 1.7;
}

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
  font-family: "Sora", sans-serif;
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
.view-all:hover {
  gap: 10px;
}

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
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07);
}
.material-img {
  background: #f5f5f5;
  height: 180px;
  position: relative;
  overflow: hidden;
}
.material-img-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
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
.badge-green {
  background: #e8f7f1;
  color: #0a5e40;
  border: 1px solid #b6e8d4;
}
.badge-amber {
  background: #fff8e6;
  color: #8a5a00;
  border: 1px solid #f5d68a;
}

.material-info {
  padding: 18px 18px 20px;
}
.mat-category {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #0f7a55;
  margin-bottom: 6px;
}
.material-info h4 {
  font-family: "Sora", sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f2419;
  margin-bottom: 4px;
  line-height: 1.4;
}
.mat-supplier {
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 14px;
}
.mat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mat-price {
  font-family: "Sora", sans-serif;
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
.btn-outline-sm:hover {
  background: #0f7a55;
  color: #fff;
}

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
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}
.stat:last-child {
  border-right: none;
}
.stat-num {
  display: block;
  font-family: "Sora", sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #5de0a5;
  margin-bottom: 6px;
}
.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
}

/* Footer */
.footer {
  background: #0f2419;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
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
.footer-logo .logo-text {
  color: #fff;
}
.footer-tagline {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.7;
  max-width: 240px;
}
.footer-col h5 {
  font-family: "Sora", sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 16px;
}
.footer-col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-col a {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.2s;
}
.footer-col a:hover {
  color: #5de0a5;
}

.footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.footer-bottom p {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.3);
}
.footer-links {
  display: flex;
  gap: 20px;
}
.footer-links a {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.35);
  text-decoration: none;
}
.footer-links a:hover {
  color: #5de0a5;
}

/* ── RESPONSIVE ───────────────────────────────────── */
@media (max-width: 900px) {
  .hero-inner {
    flex-direction: column;
    gap: 48px;
  }
  .hero-right {
    flex-direction: row;
    align-self: stretch;
  }
  .hero-stat-card {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
  }
  .stats-strip {
    gap: 20px;
  }
  .stat {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 20px;
  }
  .stat:last-child {
    border-bottom: none;
  }
}

@media (max-width: 480px) {
  .hero-right {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .footer-inner {
    grid-template-columns: 1fr;
  }
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
