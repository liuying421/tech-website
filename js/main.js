// ===== Navigation & SPA Routing =====
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('[data-page]');
const mobileMenu = document.querySelector('.mobile-menu');
const hamburger = document.querySelector('.hamburger');

function showPage(id) {
  pages.forEach(p => p.classList.remove('active'));
  navLinks.forEach(l => l.classList.remove('active'));
  const target = document.getElementById('page-' + id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll(`[data-page="${id}"]`).forEach(l => l.classList.add('active'));
  // close mobile menu
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (hamburger) hamburger.classList.remove('open');
  // trigger fade-in
  requestAnimationFrame(() => observeFadeIns());
}

// Attach click handlers
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    showPage(el.dataset.page);
  });
});

// Hamburger toggle
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

// ===== Scroll Animations =====
function observeFadeIns() {
  const els = document.querySelectorAll('.fade-in:not(.visible)');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ===== Navbar scroll effect =====
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) {
    nav.style.background = window.scrollY > 20
      ? 'rgba(5,13,31,0.97)'
      : 'rgba(5,13,31,0.85)';
  }
});

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('f-name').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const company = document.getElementById('f-company').value.trim();

    if (!name || !phone || !company) {
      showToast('请填写必填项', '姓名、电话和公司为必填信息', '⚠️');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast('电话格式错误', '请输入正确的11位手机号码', '⚠️');
      return;
    }

    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;

    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.style.display = 'block';
      showToast('提交成功！', '我们会在24小时内与您联系', '✅');
      submitBtn.textContent = '立即获取免费咨询';
      submitBtn.disabled = false;
    }, 1200);
  });
}

// Reset form when switching to contact page
document.querySelectorAll('[data-page="contact"]').forEach(el => {
  el.addEventListener('click', () => {
    if (contactForm && formSuccess) {
      contactForm.style.display = '';
      formSuccess.style.display = 'none';
      contactForm.reset();
    }
  });
});

// ===== Toast =====
function showToast(title, desc, icon = '✅') {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-text">
      <strong>${title}</strong>
      <span>${desc}</span>
    </div>
  `;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// Make showToast & showPage available globally
window.showPage = showPage;
window.showToast = showToast;

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
  observeFadeIns();
});
