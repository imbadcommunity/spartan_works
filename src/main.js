// ============================================
// SPARTAN WORKS — Main JavaScript
// ============================================

// --- Header Scroll Effect ---
const header = document.getElementById('header');

const handleScroll = () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleScroll, { passive: true });

// --- Mobile Menu ---
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

const toggleMenu = () => {
  const isOpen = mobileMenu.classList.contains('open');

  if (isOpen) {
    mobileMenu.classList.remove('open');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
  } else {
    mobileMenu.classList.add('open');
    menuToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

menuToggle.addEventListener('click', toggleMenu);

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// --- Scroll Reveal with IntersectionObserver ---
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('active');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  }
);

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
  // Observe all reveal elements
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => revealObserver.observe(el));

  // Trigger header check on load
  handleScroll();

  // Hero background subtle zoom-in on load
  const heroBg = document.querySelector('.hero__bg-img');
  if (heroBg) {
    setTimeout(() => {
      heroBg.style.transform = 'scale(1)';
    }, 100);
  }
});

// --- Smooth scroll for anchor links (fallback) ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// --- Active Nav Link on Scroll ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const activateNavLink = () => {
  const scrollY = window.pageYOffset + 120;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
};

window.addEventListener('scroll', activateNavLink, { passive: true });

// --- Product Carousel (native scroll) ---
const initCarousel = () => {
  const container = document.querySelector('.carousel__track-container');
  const prevBtn = document.querySelector('.carousel__btn--prev');
  const nextBtn = document.querySelector('.carousel__btn--next');

  if (!container) return;

  const getScrollAmount = () => {
    const slide = container.querySelector('.carousel__slide');
    if (!slide) return 300;
    return slide.offsetWidth + 20; // slide width + gap
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      container.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      container.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
  }
};

document.addEventListener('DOMContentLoaded', initCarousel);


