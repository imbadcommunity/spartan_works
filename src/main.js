// Add scroll event listener to change header background
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.style.backgroundColor = 'rgba(5, 5, 5, 0.95)';
    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
  } else {
    header.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
    header.style.boxShadow = 'none';
  }
});

// Professional scroll reveal animation using IntersectionObserver
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target); // Trigger only once
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  // Select all elements that have the reveal class or specific components
  const reveals = document.querySelectorAll('.reveal, .section, .modality-card, .pricing-card');
  
  reveals.forEach(el => {
    // Make sure they have the reveal class for CSS
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
    observer.observe(el);
  });
});
