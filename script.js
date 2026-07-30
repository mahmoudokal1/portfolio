document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 20);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(Boolean(open)));
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
    });
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  const resultSlider = document.querySelector('[data-result-slider]');
  const resultSlides = Array.from(document.querySelectorAll('[data-result-slide]'));
  const resultDots = Array.from(document.querySelectorAll('[data-result-dot]'));
  const resultEyebrow = document.getElementById('resultEyebrow');
  const resultNote = document.getElementById('resultNote');
  const resultMetricNodes = [
    [document.getElementById('resultMetricOne'), document.getElementById('resultMetricOneLabel')],
    [document.getElementById('resultMetricTwo'), document.getElementById('resultMetricTwoLabel')],
    [document.getElementById('resultMetricThree'), document.getElementById('resultMetricThreeLabel')]
  ];

  const resultData = [
    {
      metrics: [
        { value: 35264, display: '35,264+', label: 'EGP sales' },
        { value: 63, display: '63', label: 'Orders' },
        { value: 1780, display: '1.78K', label: 'Sessions' }
      ],
      note: 'Achieved after restructuring the product-page experience around clearer value communication, stronger offer hierarchy, social proof and conversion-focused UI/UX.'
    },
    {
      metrics: [
        { value: 29024, display: '29,024+', label: 'EGP sales' },
        { value: 16, display: '16', label: 'Orders' },
        { value: 25, display: '2.5%', label: 'Conversion rate' }
      ],
      note: 'Two-week result after optimization: recorded after improving the product-page structure, offer clarity and conversion-focused customer journey.'
    }
  ];

  let activeResult = 0;
  let suppressResultClick = false;

  const renderResult = (nextIndex) => {
    if (!resultSlides.length) return;
    activeResult = (nextIndex + resultSlides.length) % resultSlides.length;

    resultSlides.forEach((slide, index) => {
      const isActive = index === activeResult;
      slide.classList.toggle('is-active', isActive);
      slide.classList.toggle('is-next', !isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    resultDots.forEach((dot, index) => {
      const isActive = index === activeResult;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });

    if (resultEyebrow) resultEyebrow.textContent = `Selected result · ${activeResult + 1} of ${resultSlides.length}`;
    if (resultNote) resultNote.textContent = resultData[activeResult].note;

    resultMetricNodes.forEach(([valueNode, labelNode], index) => {
      const metric = resultData[activeResult].metrics[index];
      if (valueNode) {
        valueNode.dataset.count = String(metric.value);
        valueNode.textContent = metric.display;
      }
      if (labelNode) labelNode.textContent = metric.label;
    });
  };

  resultSlider?.querySelector('.result-arrow-prev')?.addEventListener('click', () => renderResult(activeResult - 1));
  resultSlider?.querySelector('.result-arrow-next')?.addEventListener('click', () => renderResult(activeResult + 1));
  resultDots.forEach((dot) => dot.addEventListener('click', () => renderResult(Number(dot.dataset.resultDot || 0))));
  resultSlides.forEach((slide) => slide.addEventListener('click', () => {
    if (suppressResultClick) return;
    const index = Number(slide.dataset.index || 0);
    renderResult(index === activeResult ? activeResult + 1 : index);
  }));

  let pointerStartX = 0;
  let pointerDeltaX = 0;
  let pointerActive = false;

  resultSlider?.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button, a')) return;
    pointerActive = true;
    pointerStartX = event.clientX;
    pointerDeltaX = 0;
    resultSlider.classList.add('is-dragging');
    resultSlider.setPointerCapture?.(event.pointerId);
  });

  resultSlider?.addEventListener('pointermove', (event) => {
    if (!pointerActive) return;
    pointerDeltaX = event.clientX - pointerStartX;
    const activeSlide = resultSlides[activeResult];
    if (activeSlide) {
      const movement = Math.max(-70, Math.min(70, pointerDeltaX));
      activeSlide.style.transform = `translate3d(${movement}px, 0, 0) rotate(${movement / 75}deg)`;
    }
  });

  const finishResultDrag = () => {
    if (!pointerActive) return;
    pointerActive = false;
    resultSlider?.classList.remove('is-dragging');
    resultSlides.forEach((slide) => { slide.style.transform = ''; });
    if (Math.abs(pointerDeltaX) >= 42) {
      suppressResultClick = true;
      renderResult(activeResult + (pointerDeltaX < 0 ? 1 : -1));
      window.setTimeout(() => { suppressResultClick = false; }, 80);
    }
    pointerDeltaX = 0;
  };

  resultSlider?.addEventListener('pointerup', finishResultDrag);
  resultSlider?.addEventListener('pointercancel', finishResultDrag);
  resultSlider?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') renderResult(activeResult - 1);
    if (event.key === 'ArrowRight') renderResult(activeResult + 1);
  });

  renderResult(0);

  const formatCount = (value) => {
    if (value === 35264) return '35,264+';
    if (value === 29024) return '29,024+';
    if (value === 1780) return '1.78K';
    if (value === 25) return '2.5%';
    return String(value);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      const target = Number(node.dataset.count || 0);
      const duration = 1000;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = formatCount(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.unobserve(node);
    });
  }, { threshold: 0.65 });

  document.querySelectorAll('[data-count]').forEach((element) => {
    element.textContent = formatCount(Number(element.dataset.count || 0));
    counterObserver.observe(element);
  });
});
