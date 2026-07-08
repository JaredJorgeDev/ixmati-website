const sections = document.querySelectorAll('.section, .closing');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

sections.forEach((section, index) => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(22px)';
  section.style.transition = `opacity 0.55s ease ${index * 0.04}s, transform 0.55s ease ${index * 0.04}s`;
  observer.observe(section);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.addEventListener('transitionend', (event) => {
  if (event.propertyName !== 'transform') return;

  const node = event.target;
  if (node.classList.contains('visible')) {
    node.style.transform = 'none';
  }
});

const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);
