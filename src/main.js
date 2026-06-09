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

// --- Product Carousel ---
const initCarousel = () => {
  const trackContainer = document.querySelector('.carousel__track-container');
  const track = document.querySelector('.carousel__track');
  const slides = document.querySelectorAll('.carousel__slide');
  const prevBtn = document.querySelector('.carousel__btn--prev');
  const nextBtn = document.querySelector('.carousel__btn--next');
  const dotsContainer = document.querySelector('.carousel__dots');

  if (!track || !trackContainer || slides.length === 0) return;

  let currentPage = 0;
  let slidesPerView = 3;
  let autoPlayTimer;

  const getSlidesPerView = () => {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    return 3;
  };

  const setSlideSizes = () => {
    const containerWidth = trackContainer.offsetWidth;
    const slideWidth = containerWidth / slidesPerView;
    slides.forEach(slide => {
      slide.style.width = `${slideWidth}px`;
      slide.style.minWidth = `${slideWidth}px`;
      slide.style.padding = '0 8px';
    });
  };

  const getTotalPages = () => Math.ceil(slides.length / slidesPerView);

  const createDots = () => {
    dotsContainer.innerHTML = '';
    const totalPages = getTotalPages();
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel__dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Página ${i + 1}`);
      dot.addEventListener('click', () => goToPage(i));
      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = () => {
    const dots = document.querySelectorAll('.carousel__dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentPage);
    });
  };

  const goToPage = (page) => {
    const totalPages = getTotalPages();
    if (page < 0) page = totalPages - 1;
    if (page >= totalPages) page = 0;
    currentPage = page;

    const containerWidth = trackContainer.offsetWidth;
    const offset = currentPage * containerWidth;

    // Don't go past the end
    const maxOffset = track.scrollWidth - containerWidth;
    track.style.transform = `translateX(-${Math.min(offset, maxOffset)}px)`;
    updateDots();
  };

  const nextSlide = () => goToPage(currentPage + 1);
  const prevSlide = () => goToPage(currentPage - 1);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  };

  // Button events
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });

  // Touch/Swipe support for mobile
  let touchStartX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    startAutoPlay();
  }, { passive: true });

  // Pause on hover (desktop)
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
  }

  // Resize handler
  let resizeTimer;
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      slidesPerView = getSlidesPerView();
      setSlideSizes();
      createDots();
      goToPage(0);
    }, 150);
  };

  window.addEventListener('resize', handleResize);

  // Init
  slidesPerView = getSlidesPerView();
  setSlideSizes();
  createDots();
  startAutoPlay();
};

document.addEventListener('DOMContentLoaded', initCarousel);

