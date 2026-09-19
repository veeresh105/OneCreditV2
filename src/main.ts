/**
 * One Credit Financial Solutions
 * Production-ready Vanilla TypeScript / JavaScript Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Element Selectors ---
  const modal = document.getElementById('consultation-modal') as HTMLElement | null;
  const modalForm = document.getElementById('consultation-form') as HTMLFormElement | null;
  const cancelModalBtn = document.getElementById('cancel-modal-btn') as HTMLButtonElement | null;
  const closeModalIconBtn = document.getElementById('close-modal-icon-btn') as HTMLButtonElement | null;
  const openModalBtns = document.querySelectorAll<HTMLElement>('[data-open-modal]');
  const loanCards = document.querySelectorAll<HTMLElement>('.loan-card');
  
  const loanTypeSelect = document.getElementById('modal-loan-type') as HTMLSelectElement | null;
  const loanAmountSelect = document.getElementById('modal-loan-amount') as HTMLSelectElement | null;
  const fullNameInput = document.getElementById('modal-full-name') as HTMLInputElement | null;
  const mobileInput = document.getElementById('modal-mobile') as HTMLInputElement | null;
  const cityInput = document.getElementById('modal-city') as HTMLInputElement | null;

  // Validation message containers
  const nameError = document.getElementById('name-error') as HTMLElement | null;
  const mobileError = document.getElementById('mobile-error') as HTMLElement | null;
  const loanTypeError = document.getElementById('loan-type-error') as HTMLElement | null;
  const amountError = document.getElementById('amount-error') as HTMLElement | null;

  // Mobile navigation
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle') as HTMLButtonElement | null;
  const mobileDrawer = document.getElementById('mobile-nav-drawer') as HTMLElement | null;
  const mobileBackdrop = document.getElementById('mobile-backdrop') as HTMLElement | null;
  const mobileCloseBtn = document.getElementById('mobile-close-btn') as HTMLButtonElement | null;
  const mobileNavLinks = document.querySelectorAll<HTMLElement>('.mobile-nav-link');

  // Policy modals
  const privacyModal = document.getElementById('privacy-modal') as HTMLElement | null;
  const termsModal = document.getElementById('terms-modal') as HTMLElement | null;
  const openPrivacyBtn = document.getElementById('open-privacy-btn') as HTMLElement | null;
  const openTermsBtn = document.getElementById('open-terms-btn') as HTMLElement | null;
  const closePrivacyBtn = document.getElementById('close-privacy-btn') as HTMLElement | null;
  const closeTermsBtn = document.getElementById('close-terms-btn') as HTMLElement | null;

  // FAQ Accordion items
  const faqToggles = document.querySelectorAll<HTMLButtonElement>('.faq-toggle');

  // --- Modal Open / Close Logic ---
  function openConsultationModal(preferredLoanType?: string) {
    if (!modal) return;
    
    // Reset previous validation errors
    clearFormErrors();

    // Auto-select loan type if triggered from a card
    if (preferredLoanType && loanTypeSelect) {
      loanTypeSelect.value = preferredLoanType;
    }

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Auto focus name input
    setTimeout(() => {
      fullNameInput?.focus();
    }, 150);
  }

  function closeConsultationModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function clearFormErrors() {
    if (nameError) nameError.textContent = '';
    if (mobileError) mobileError.textContent = '';
    if (loanTypeError) loanTypeError.textContent = '';
    if (amountError) amountError.textContent = '';

    fullNameInput?.classList.remove('border-red-500');
    mobileInput?.classList.remove('border-red-500');
    loanTypeSelect?.classList.remove('border-red-500');
    loanAmountSelect?.classList.remove('border-red-500');
  }

  // Bind Open Modal Buttons (e.g. Header CTA, Hero CTA, Contact Card CTA)
  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const loanType = btn.getAttribute('data-loan-type') || undefined;
      openConsultationModal(loanType);
      closeMobileMenu();
    });
  });

  // Bind Loan Cards (Requirements: clicking ANY loan card opens popup with auto-selected dropdown)
  loanCards.forEach((card) => {
    card.addEventListener('click', () => {
      const loanType = card.getAttribute('data-loan-name');
      if (loanType) {
        openConsultationModal(loanType);
      }
    });

    // Keyboard accessibility for card
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const loanType = card.getAttribute('data-loan-name');
        if (loanType) {
          openConsultationModal(loanType);
        }
      }
    });
  });

  // Close Modal Buttons
  cancelModalBtn?.addEventListener('click', closeConsultationModal);
  closeModalIconBtn?.addEventListener('click', closeConsultationModal);

  // Close when clicking modal backdrop outside content
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeConsultationModal();
    }
  });

  // --- Form Validation & WhatsApp Dispatch ---
  if (modalForm) {
    // Restrict mobile input to digits only & max 10
    mobileInput?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      target.value = target.value.replace(/\D/g, '').slice(0, 10);
      if (mobileError && target.value.length === 10) {
        mobileError.textContent = '';
        mobileInput.classList.remove('border-red-500');
      }
    });

    fullNameInput?.addEventListener('input', () => {
      if (nameError && (fullNameInput.value.trim().length >= 2)) {
        nameError.textContent = '';
        fullNameInput.classList.remove('border-red-500');
      }
    });

    loanTypeSelect?.addEventListener('change', () => {
      if (loanTypeError && loanTypeSelect.value) {
        loanTypeError.textContent = '';
        loanTypeSelect.classList.remove('border-red-500');
      }
    });

    loanAmountSelect?.addEventListener('change', () => {
      if (amountError && loanAmountSelect.value) {
        amountError.textContent = '';
        loanAmountSelect.classList.remove('border-red-500');
      }
    });

    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFormErrors();

      let isValid = true;

      const name = fullNameInput?.value.trim() || '';
      const mobile = mobileInput?.value.trim() || '';
      const loanType = loanTypeSelect?.value.trim() || '';
      const loanAmount = loanAmountSelect?.value.trim() || '';
      const city = cityInput?.value.trim() || 'Hyderabad';

      // Validate Name
      if (!name || name.length < 2) {
        if (nameError) nameError.textContent = 'Please enter your full name (minimum 2 letters).';
        fullNameInput?.classList.add('border-red-500');
        isValid = false;
      }

      // Validate Mobile (10 digits)
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobile) {
        if (mobileError) mobileError.textContent = 'Mobile number is required.';
        mobileInput?.classList.add('border-red-500');
        isValid = false;
      } else if (!mobileRegex.test(mobile)) {
        if (mobileError) mobileError.textContent = 'Please enter a valid 10-digit Indian mobile number.';
        mobileInput?.classList.add('border-red-500');
        isValid = false;
      }

      // Validate Loan Type
      if (!loanType) {
        if (loanTypeError) loanTypeError.textContent = 'Please select a loan type.';
        loanTypeSelect?.classList.add('border-red-500');
        isValid = false;
      }

      // Validate Loan Amount
      if (!loanAmount) {
        if (amountError) amountError.textContent = 'Please select an estimated loan amount.';
        loanAmountSelect?.classList.add('border-red-500');
        isValid = false;
      }

      if (!isValid) return;

      // Construct formatted WhatsApp message strictly as requested
      const message = 
`Hi One Credit Financial Solutions 👋

I would like to enquire about a loan.

*Customer Details*
• Name: ${name}
• Mobile: ${mobile}
• Loan Type: ${loanType}
• Loan Amount: ${loanAmount}
• City: ${city}

Kindly contact me. Thank you!`;

      const whatsappUrl = `https://wa.me/918500781418?text=${encodeURIComponent(message)}`;

      // Open WhatsApp in new tab / app
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Close modal and reset form
      closeConsultationModal();
      modalForm.reset();
      if (cityInput) cityInput.value = 'Hyderabad';
    });
  }

  // --- Mobile Navigation Drawer ---
  function openMobileMenu() {
    if (!mobileDrawer || !mobileBackdrop) return;
    mobileDrawer.classList.add('is-open');
    mobileBackdrop.classList.remove('hidden');
    mobileMenuToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileDrawer || !mobileBackdrop) return;
    mobileDrawer.classList.remove('is-open');
    mobileBackdrop.classList.add('hidden');
    mobileMenuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileMenuToggle?.addEventListener('click', () => {
    const isOpen = mobileDrawer?.classList.contains('is-open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileCloseBtn?.addEventListener('click', closeMobileMenu);
  mobileBackdrop?.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // --- Policy Modals (Privacy & Terms) ---
  openPrivacyBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (privacyModal) {
      privacyModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  });

  openTermsBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (termsModal) {
      termsModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  });

  closePrivacyBtn?.addEventListener('click', () => {
    privacyModal?.classList.remove('is-open');
    document.body.style.overflow = '';
  });

  closeTermsBtn?.addEventListener('click', () => {
    termsModal?.classList.remove('is-open');
    document.body.style.overflow = '';
  });

  privacyModal?.addEventListener('click', (e) => {
    if (e.target === privacyModal) {
      privacyModal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  termsModal?.addEventListener('click', (e) => {
    if (e.target === termsModal) {
      termsModal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  // --- Keyboard Shortcuts (Esc closes any open modal/drawer) ---
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal?.classList.contains('is-open')) {
        closeConsultationModal();
      }
      if (privacyModal?.classList.contains('is-open')) {
        privacyModal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
      if (termsModal?.classList.contains('is-open')) {
        termsModal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
      if (mobileDrawer?.classList.contains('is-open')) {
        closeMobileMenu();
      }
    }
  });

  // --- FAQ Accordion Logic ---
  faqToggles.forEach((button) => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const answerId = button.getAttribute('aria-controls');
      const answer = answerId ? document.getElementById(answerId) : null;
      const icon = button.querySelector('.faq-icon');

      // Close other open accordions
      faqToggles.forEach((otherBtn) => {
        if (otherBtn !== button) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherAnswerId = otherBtn.getAttribute('aria-controls');
          const otherAnswer = otherAnswerId ? document.getElementById(otherAnswerId) : null;
          const otherIcon = otherBtn.querySelector('.faq-icon');
          if (otherAnswer) otherAnswer.classList.add('hidden');
          if (otherIcon) otherIcon.classList.remove('rotate-180');
        }
      });

      // Toggle current
      if (isExpanded) {
        button.setAttribute('aria-expanded', 'false');
        answer?.classList.add('hidden');
        icon?.classList.remove('rotate-180');
      } else {
        button.setAttribute('aria-expanded', 'true');
        answer?.classList.remove('hidden');
        icon?.classList.add('rotate-180');
      }
    });
  });

  // --- Scroll-driven Fade-Up Animations ---
  const fadeElements = document.querySelectorAll('.fade-up-element');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback for older browsers
    fadeElements.forEach((el) => el.classList.add('in-view'));
  }
});
