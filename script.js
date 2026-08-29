/* ==========================================================================
   PISEY TOUCH — PORTFOLIO SCRIPTS
   Vanilla JavaScript only. Handles: mobile menu, smooth scroll, active nav
   highlighting, navbar scroll effect, scroll-reveal animations, back-to-top
   button, and contact form validation.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     1. MOBILE HAMBURGER MENU
     ------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  // Close the mobile menu whenever a link inside it is clicked
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ------------------------------------------------------------------
     2. SMOOTH SCROLL FOR ALL IN-PAGE LINKS
     ------------------------------------------------------------------ */
  const allNavLinks = document.querySelectorAll('[data-link]');

  allNavLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');

      // Only intercept real in-page anchors (e.g. "#about")
      if (href && href.startsWith('#')) {
        const targetId = href.slice(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          event.preventDefault();
          const navbarHeight = document.getElementById('navbar').offsetHeight;
          const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navbarHeight + 1;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  /* ------------------------------------------------------------------
     3. NAVBAR BACKGROUND CHANGE ON SCROLL
     ------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');

  function updateNavbarOnScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbarOnScroll);
  updateNavbarOnScroll(); // run once on load

  /* ------------------------------------------------------------------
     4. ACTIVE NAVIGATION LINK WHILE SCROLLING
     ------------------------------------------------------------------ */
  const sections = document.querySelectorAll('main section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');

          desktopNavLinks.forEach((link) => {
            const linkTarget = link.getAttribute('href').slice(1);
            link.classList.toggle('active-link', linkTarget === sectionId);
          });
        }
      });
    },
    {
      // Treat a section as "active" once it crosses the middle band of the screen
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* ------------------------------------------------------------------
     5. SCROLL-REVEAL ANIMATIONS (Intersection Observer)
     ------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // animate once, then stop watching
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     6. BACK-TO-TOP BUTTON
     ------------------------------------------------------------------ */
  const backToTopButton = document.getElementById('backToTop');

  function toggleBackToTopVisibility() {
    backToTopButton.classList.toggle('visible', window.scrollY > 400);
  }

  window.addEventListener('scroll', toggleBackToTopVisibility);
  toggleBackToTopVisibility(); // run once on load

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------
     7. CONTACT FORM VALIDATION
     ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  // Simple, standard email pattern check
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(input, errorEl, message) {
    if (message) {
      input.classList.add('input-error');
      errorEl.textContent = message;
      return false;
    }
    input.classList.remove('input-error');
    errorEl.textContent = '';
    return true;
  }

  function validateName() {
    return setFieldError(
      nameInput,
      nameError,
      nameInput.value.trim() === '' ? 'Please enter your name.' : ''
    );
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (value === '') {
      return setFieldError(emailInput, emailError, 'Please enter your email.');
    }
    if (!emailPattern.test(value)) {
      return setFieldError(emailInput, emailError, 'Please enter a valid email address.');
    }
    return setFieldError(emailInput, emailError, '');
  }

  function validateSubject() {
    return setFieldError(
      subjectInput,
      subjectError,
      subjectInput.value.trim() === '' ? 'Please enter a subject.' : ''
    );
  }

  function validateMessage() {
    return setFieldError(
      messageInput,
      messageError,
      messageInput.value.trim() === '' ? 'Please write a message.' : ''
    );
  }

  // Validate a field as soon as the user leaves it
  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  subjectInput.addEventListener('blur', validateSubject);
  messageInput.addEventListener('blur', validateMessage);

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault(); // never actually send this form anywhere

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();

    const isFormValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

    if (isFormValid) {
      formSuccess.classList.add('visible');
      contactForm.reset();

      // Hide the success message again after a few seconds
      setTimeout(() => {
        formSuccess.classList.remove('visible');
      }, 5000);
    } else {
      formSuccess.classList.remove('visible');
      // Move focus to the first invalid field for accessibility
      const firstInvalid = contactForm.querySelector('.input-error');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });

});
