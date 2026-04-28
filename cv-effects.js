// CV Reference Style Effects for Abyy Burger

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header_section');
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Typing Effect for Hero
function typeWriter(element, text, speed = 100) {
  let i = 0;
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Init typing on slider items
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.detail-box h1');
  sliders.forEach((h1, index) => {
    setTimeout(() => {
      typeWriter(h1, h1.textContent);
    }, index * 2000);
  });
});

// Intersection Observer for fade-ins
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply to sections
document.querySelectorAll('.offer_section, .food_section, .about_section, .book_section, .client_section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(50px)';
  section.style.transition = 'all 0.8s ease';
  observer.observe(section);
});

// Existing cart/chat functionality remains

