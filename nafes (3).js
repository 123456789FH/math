// ====== Gate: قفل الدخول لمدرسة محددة ======
// عدّلي SCHOOL_NAME و ACCESS_CODE كما ترغبين
(() => {
  const SCHOOL_NAME = "مدرسة [اسم المدرسة]";
  const ACCESS_CODE = "ASMATH-147";   // << غيّري رمز الوصول
  const KEY = "school_access_ok";
  const OPEN_PAGES = []; // أمثلة لصفحات عامة بدون قفل: ["index.html"]

  const path = location.pathname.split("/").pop() || "index.html";
  if (OPEN_PAGES.includes(path)) return;

  try {
    if (localStorage.getItem(KEY) === "1") return;
  } catch (_) {}

  if (typeof Swal === "undefined") return; // SweetAlert2 مطلوب للقفل

  Swal.fire({
    title: "دخول خاص",
    text: `هذا الموقع مخصّص لـ ${SCHOOL_NAME}. أدخلي رمز الوصول:`,
    input: "password",
    confirmButtonText: "دخول",
    allowOutsideClick: false,
    allowEscapeKey: false,
    inputAttributes: { autocapitalize: "off", autocorrect: "off" },
    preConfirm: (val) => {
      if (!val || val.trim() !== ACCESS_CODE) {
        Swal.showValidationMessage("رمز غير صحيح");
        return false;
      }
      return true;
    }
  }).then((res) => {
    if (res.isConfirmed) {
      try { localStorage.setItem(KEY, "1"); } catch (_){}
    } else {
      location.href = "about:blank";
    }
  });
})();

// ====== Progress bars updater ======
(() => {
  const bars = document.querySelectorAll('[data-progress-bar]');
  if (!bars.length) return;

  const fmt = new Intl.NumberFormat('ar-SA');

  bars.forEach(bar => {
    const total = Number(bar.dataset.total || 0);
    const done  = Number(bar.dataset.done  || 0);
    const percentOverride = bar.dataset.percent;
    let pct = 0;

    if (percentOverride !== undefined) {
      const n = Number(percentOverride);
      pct = isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
    } else {
      pct = total > 0 ? Math.round((done / total) * 100) : 0;
    }

    bar.style.width = pct + '%';

    const pctEl = bar.querySelector('[data-progress-percent]');
    if (pctEl) pctEl.textContent = pct + '%';

    // تحديث النصوص إن وُجدت
    const goalCard = bar.closest('.goal, .card');
    if (goalCard) {
      const doneEl  = goalCard.querySelector('[data-done-text]');
      const totalEl = goalCard.querySelector('[data-total-text]');
      if (doneEl)  doneEl.textContent  = fmt.format(done);
      if (totalEl) totalEl.textContent = fmt.format(total);
    }

    const container = bar.closest('.progress');
    if (container) container.setAttribute('aria-valuenow', String(pct));
  });
})();


// ====== Navbar labels patch (Arabic wording) ======
(() => {
  const selReg = 'a[href="coordinator-register.html"], a[href="./coordinator-register.html"]';
  const selLogin = 'a[href="coordinator-login.html"], a[href="./coordinator-login.html"]';
  document.querySelectorAll(selReg).forEach(a => {
    a.innerHTML = '<i class="fas fa-user-plus me-1"></i> تسجيل معلم/ـة';
  });
  document.querySelectorAll(selLogin).forEach(a => {
    a.innerHTML = '<i class="fas fa-user-tie me-1"></i> دخول المعلمين';
  });
})();
