// FAQ accordion
document.querySelectorAll('.acc-head').forEach(head => {
  head.addEventListener('click', () => {
    const item = head.parentElement;
    const body = item.querySelector('.acc-body');
    const open = body.style.display === 'block';
    document.querySelectorAll('.acc-body').forEach(b => b.style.display = 'none');
    body.style.display = open ? 'none' : 'block';
  });
});

// Smooth scroll for nav
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
