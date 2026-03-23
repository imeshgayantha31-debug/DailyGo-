/* =============================================
   DailyGo+ — main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* --- NAVBAR SCROLL --- */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  /* --- MOBILE MENU --- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* --- SCROLL REVEAL --- */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.07 });
  reveals.forEach(el => observer.observe(el));

  /* --- STEP HOVER NUMBERS --- */
  document.querySelectorAll('.step-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.querySelector('.step-number').style.boxShadow = '0 0 24px rgba(0,196,167,0.35)';
    });
    item.addEventListener('mouseleave', () => {
      item.querySelector('.step-number').style.boxShadow = '';
    });
  });

  /* --- VEHICLE CHIP TOGGLE --- */
  document.querySelectorAll('.v-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      if (chip.classList.contains('active')) {
        chip.style.background = 'rgba(0,196,167,0.12)';
        chip.style.borderColor = 'var(--teal)';
        chip.style.color = 'var(--teal)';
      } else {
        chip.style.background = '';
        chip.style.borderColor = '';
        chip.style.color = '';
      }
    });
  });

  /* --- RADIO VEHICLE SELECTOR --- */
  document.querySelectorAll('.radio-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const name = opt.querySelector('input').name;
      document.querySelectorAll(`.radio-option input[name="${name}"]`).forEach(i => {
        i.closest('.radio-option').classList.remove('selected');
      });
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
    });
  });

  /* ==========================================
     DRIVER FORM — Multi-step logic
     ========================================== */
  const steps = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.fp-step');
  let currentStep = 0;

  function showStep(n) {
    steps.forEach((s, i) => s.classList.toggle('active', i === n));
    progressSteps.forEach((p, i) => {
      p.classList.remove('active', 'done');
      if (i === n) p.classList.add('active');
      if (i < n) p.classList.add('done');
    });
    currentStep = n;
  }

  function validateStep(n) {
    const step = steps[n];
    const required = step.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      const group = field.closest('.form-group');
      if (!field.value.trim()) {
        valid = false;
        field.classList.add('error');
        if (group) group.classList.add('has-error');
      } else {
        field.classList.remove('error');
        if (group) group.classList.remove('has-error');
      }
    });
    // Check radio groups
    const radioGroupNames = new Set();
    step.querySelectorAll('input[type="radio"][required]').forEach(r => radioGroupNames.add(r.name));
    radioGroupNames.forEach(name => {
      const checked = step.querySelector(`input[name="${name}"]:checked`);
      if (!checked) valid = false;
    });
    return valid;
  }

  document.querySelectorAll('.btn-form-next').forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep) && currentStep < steps.length - 1) {
        showStep(currentStep + 1);
      }
    });
  });

  document.querySelectorAll('.btn-form-back').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) showStep(currentStep - 1);
    });
  });

  const submitBtn = document.querySelector('.btn-form-submit');
  const formSuccess = document.querySelector('.form-success');
  const formBody = document.querySelector('.form-body');

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!validateStep(currentStep)) return;

      submitBtn.textContent = 'Submitting…';
      submitBtn.disabled = true;

      setTimeout(() => {
        if (formBody) formBody.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
      }, 1200);
    });
  }

  /* --- Input live validation reset --- */
  document.querySelectorAll('.form-group input, .form-group select').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const group = field.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });
  });

  /* ==========================================
     CONTACT FORM
     ========================================== */
  const contactSubmit = document.querySelector('.contact-submit');
  if (contactSubmit) {
    contactSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      const form = document.getElementById('contactForm');
      const name = form.querySelector('#cName');
      const email = form.querySelector('#cEmail');
      const msg = form.querySelector('#cMessage');
      let ok = true;
      [name, email, msg].forEach(f => {
        if (!f.value.trim()) { f.style.borderColor = '#E24B4A'; ok = false; }
        else f.style.borderColor = '';
      });
      if (!ok) return;

      contactSubmit.innerHTML = 'Sending…';
      contactSubmit.disabled = true;
      setTimeout(() => {
        contactSubmit.innerHTML = '✓ Message Sent!';
        contactSubmit.style.background = '#0D7B5A';
        form.reset();
        updateCharCount();
      }, 1000);
    });
  }

  /* --- Char counter --- */
  const msgArea = document.getElementById('cMessage');
  const charCount = document.querySelector('.char-count');
  function updateCharCount() {
    if (msgArea && charCount) charCount.textContent = (msgArea.value.length) + ' / 500';
  }
  if (msgArea) {
    msgArea.addEventListener('input', updateCharCount);
    msgArea.setAttribute('maxlength', '500');
    updateCharCount();
  }

  /* --- Smooth scroll for CTA buttons --- */
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* --- Init first step --- */
  showStep(0);

});
