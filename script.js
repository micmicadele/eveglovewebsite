document.querySelectorAll('.acc-head').forEach(head => {
  head.addEventListener('click', () => {
    const body = head.parentElement.querySelector('.acc-body');
    const open = body.style.display === 'block';

    document.querySelectorAll('.acc-body').forEach(b => b.style.display = 'none');
    body.style.display = open ? 'none' : 'block';
  });
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const smoothScrollTo = (targetId) => {
    if (targetId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    if (targetId === "tutorial") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      const [page, hash] = href.split("#");
      const currentPage = window.location.pathname.split("/").pop() || "home.html";

      if (page === currentPage || (page === "" && currentPage === "home.html")) {
        e.preventDefault();
        smoothScrollTo(hash);
      }
    });
  });
});

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav ul li a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");

      const link = Array.from(navLinks).find((a) =>
        a.getAttribute("href")?.includes(`#${id}`)
      );

      if (entry.isIntersecting) {
        navLinks.forEach((a) => a.classList.remove("active"));
        if (link) link.classList.add("active");
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => observer.observe(section));

