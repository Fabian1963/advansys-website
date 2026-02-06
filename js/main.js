/**
 * AdvanSys IT - Main JavaScript
 * Version: 2.0
 * Updated: 2025
 */

(function () {
  'use strict';

  // ============================================
  // DOM Elements
  // ============================================
  const navbar = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // ============================================
  // Initialize AOS (Animate On Scroll)
  // ============================================
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        delay: 0,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      });
    }
  }

  // ============================================
  // Navbar Scroll Effect
  // ============================================
  function handleNavbarScroll() {
    if (!navbar) return;

    const scrollThreshold = 50;

    function updateNavbar() {
      if (window.scrollY > scrollThreshold) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Initial check
    updateNavbar();

    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateNavbar();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // Active Nav Link on Scroll
  // ============================================
  function handleActiveNavLinks() {
    if (!sections.length || !navLinks.length) return;

    function updateActiveLink() {
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateActiveLink();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // Smooth Scroll for Nav Links
  // ============================================
  function initSmoothScroll() {
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            const navbarCollapse = document.querySelector('.navbar-collapse');

            const scrollToTarget = () => {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };

            // Close mobile menu if open, then scroll after it finishes closing
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
              const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
              if (bsCollapse) {
                navbarCollapse.addEventListener('hidden.bs.collapse', function onHidden() {
                  navbarCollapse.removeEventListener('hidden.bs.collapse', onHidden);
                  scrollToTarget();
                });
                bsCollapse.hide();
              } else {
                scrollToTarget();
              }
            } else {
              scrollToTarget();
            }
          }
        }
      });
    });
  }

  // ============================================
  // Scroll Progress Indicator (Optional)
  // ============================================
  function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.width = '0%';
    document.body.prepend(progressBar);

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // Lazy Loading for Images
  // ============================================
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    } else {
      // Fallback with Intersection Observer
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => imageObserver.observe(img));
    }
  }

  // ============================================
  // Back to Top Button
  // ============================================
  function initBackToTop() {
    const backToTopBtn = document.querySelector('a[href="#page-top"]');

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // ============================================
  // Form Validation (if forms exist)
  // ============================================
  function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');

    forms.forEach(form => {
      form.addEventListener('submit', function (e) {
        if (!form.checkValidity()) {
          e.preventDefault();
          e.stopPropagation();
        }
        form.classList.add('was-validated');
      });
    });
  }

  // ============================================
  // Accessibility Improvements
  // ============================================
  function initAccessibility() {
    // Skip to content link focus handling
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }

    // Handle keyboard navigation for cards
    const interactiveCards = document.querySelectorAll('.service-card, .tech-card, .contact-card');
    interactiveCards.forEach(card => {
      const link = card.querySelector('a');
      if (link) {
        card.addEventListener('keypress', function (e) {
          if (e.key === 'Enter') {
            link.click();
          }
        });
      }
    });
  }

  // ============================================
  // Performance: Debounce Helper
  // ============================================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ============================================
  // Initialize Everything on DOM Ready
  // ============================================
  function init() {
    initAOS();
    handleNavbarScroll();
    handleActiveNavLinks();
    initSmoothScroll();
    initScrollProgress();
    initLazyLoading();
    initBackToTop();
    initFormValidation();
    initAccessibility();

    // Log initialization
    console.log('%c AdvanSys IT ', 'background: #0d9488; color: white; font-size: 14px; padding: 5px 10px; border-radius: 4px;');
    console.log('Website initialized successfully');
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
