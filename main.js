// ============================================
// FANG — Main JavaScript
// ============================================

(() => {
  'use strict';

  // ── Custom Cursor ──────────────────────────
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // ── Nav Scroll Effect ──────────────────────
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 60);

    // Hide nav on scroll down, show on scroll up
    if (scrollY > lastScroll && scrollY > 200) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    lastScroll = scrollY;
  });

  // ── Mobile Menu ────────────────────────────
  const burgerBtn  = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burgerBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Intersection Observer — Fade In ────────
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections
  document.querySelectorAll('.section, .editorial, .newsletter, .lookbook__item, .product-card, .category-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    fadeObserver.observe(el);
  });

  document.querySelectorAll('.visible, .section.visible').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });

  // Use MutationObserver to apply visible class
  const styleObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const el = mutation.target;
        if (el.classList.contains('visible')) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      }
    });
  });

  document.querySelectorAll('.section, .editorial, .newsletter, .lookbook__item, .product-card, .category-card').forEach(el => {
    styleObserver.observe(el, { attributes: true });
  });

  // ── Wishlist Interaction ───────────────────
  document.querySelectorAll('.product-card__wish').forEach(btn => {
    btn.addEventListener('click', () => {
      const isWished = btn.textContent === '♥';
      btn.textContent = isWished ? '♡' : '♥';
      btn.style.color  = isWished ? '' : '#c05040';
      
      // Mini animation
      btn.style.transform = 'scale(1.4)';
      setTimeout(() => { btn.style.transform = ''; }, 200);
    });
  });

  // ── Quick Add Button ───────────────────────
  document.querySelectorAll('.product-card__quick').forEach(btn => {
    btn.addEventListener('click', function() {
      const original = this.textContent;
      this.textContent = '✓ 已加入';
      this.style.background = '#1e1c1a';
      this.style.color = '#f5f0e8';
      
      // Update cart count
      const cartCount = document.querySelector('.nav__cart-count');
      if (cartCount) {
        const count = parseInt(cartCount.textContent) + 1;
        cartCount.textContent = count;
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(() => { cartCount.style.transform = ''; }, 200);
      }

      setTimeout(() => {
        this.textContent = original;
        this.style.background = '';
        this.style.color = '';
      }, 1800);
    });
  });

  // ── Color Dot Selection ────────────────────
  document.querySelectorAll('.product-card').forEach(card => {
    const dots = card.querySelectorAll('.color-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.style.outline = '');
        dot.style.outline = '2px solid #8b6c42';
        dot.style.outlineOffset = '2px';
      });
    });
  });

  // ── Newsletter Form ────────────────────────
  const newsletterForm = document.querySelector('.newsletter__form');
  if (newsletterForm) {
    const btn   = newsletterForm.querySelector('.btn');
    const input = newsletterForm.querySelector('input');
    
    btn.addEventListener('click', () => {
      if (!input.value || !input.value.includes('@')) {
        input.style.borderColor = '#c05040';
        input.placeholder = '請輸入有效的電子郵件';
        return;
      }
      btn.textContent = '✓ 已訂閱';
      input.value = '';
      input.placeholder = '感謝您的訂閱！';
      input.disabled = true;
      btn.disabled   = true;
      btn.style.background = '#8b6c42';
    });

    input.addEventListener('focus', () => {
      input.style.borderColor = '';
      input.placeholder = '您的電子郵件地址';
    });
  }

  // ── Parallax on Hero ──────────────────────
  const heroContent = document.querySelector('.hero__content');
  const heroImages  = document.querySelector('.hero__images');
  const heroCircle  = document.querySelector('.hero__circle');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
      if (heroImages)  heroImages.style.transform  = `translateY(calc(-50% + ${scrollY * 0.08}px))`;
      if (heroCircle)  heroCircle.style.transform  = `translateY(calc(-50% + ${scrollY * 0.05}px))`;
    }
  });

  // ── Staggered card animation on load ──────
  const cards = document.querySelectorAll('.product-card');
  cards.forEach((card, i) => {
    card.setAttribute('data-index', i % 4);
  });

  // ── Smooth reveal for visible elements ─────
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.product-card, .category-card, .lookbook__item').forEach(el => {
    io.observe(el);
  });

  // ── Ticker pause on hover ──────────────────
  const ticker = document.querySelector('.ticker__track');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => { ticker.style.animationPlayState = 'paused'; });
    ticker.addEventListener('mouseleave', () => { ticker.style.animationPlayState = 'running'; });
  }

  console.log('%cFANG · 時尚精品', 'font-family: serif; font-size: 20px; color: #8b6c42; font-style: italic;');
})();
