document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (nav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    });
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
      });
    });
  }

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  const counters = document.querySelectorAll("[data-count]");

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = Number(counter.dataset.count);
        const suffix = counter.dataset.suffix || "";
        const duration = 1200;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const value = Math.floor(progress * target);

          counter.textContent = value + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        countObserver.unobserve(counter);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => {
    countObserver.observe(counter);
  });

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    if (!question) return;

    question.addEventListener("click", () => {
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("open");
        }
      });

      item.classList.toggle("open");
    });
  });

  const year = document.querySelector("#currentYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
});
