const cursor = document.querySelector('.cursor-dot');
const trailLimit = 10;
const trailDots = [];
let currentPhraseIndex = 0;

function initHeroParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const particles = [];
  const particleCount = 80;

  const resizeCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles.length = 0;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < particleCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 180 + 40;
      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        angle,
        radius,
        speed: 0.002 + Math.random() * 0.001,
        drift: 0.008 + Math.random() * 0.004,
        alpha: 0.18 + Math.random() * 0.12,
      });
    }
  };

  const animate = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    particles.forEach((particle) => {
      particle.angle += particle.speed;
      particle.radius += particle.drift;

      if (particle.radius > 260) {
        particle.radius = 40 + Math.random() * 120;
        particle.angle = Math.random() * Math.PI * 2;
      }

      particle.x = centerX + Math.cos(particle.angle) * particle.radius;
      particle.y = centerY + Math.sin(particle.angle) * particle.radius;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(126, 184, 201, ${particle.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  };

  resizeCanvas();
  animate();
  window.addEventListener('resize', resizeCanvas);
}

function initGallery() {
  const canvas = document.getElementById('gallery-canvas');
  const slots = document.querySelectorAll('.photo-slot');
  if (!canvas || slots.length === 0) return;

  const context = canvas.getContext('2d');
  const particles = [];
  const particleCount = 60;
  let rotation = 0;

  const resizeCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles.length = 0;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    for (let i = 0; i < particleCount; i += 1) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 40 + i * 3.5;
      particles.push({
        angle,
        radius,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        alpha: 0.2,
      });
    }
  };

  const animate = () => {
    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    context.save();
    context.translate(centerX, centerY);
    context.rotate(rotation);
    context.translate(-centerX, -centerY);

    particles.forEach((particle) => {
      const x = centerX + Math.cos(particle.angle) * particle.radius;
      const y = centerY + Math.sin(particle.angle) * particle.radius;
      context.beginPath();
      context.arc(x, y, 2, 0, Math.PI * 2);
      context.fillStyle = `rgba(126, 184, 201, ${particle.alpha})`;
      context.fill();
    });
    context.restore();

    requestAnimationFrame(animate);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        window.setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 100);
      }
    });
  }, { threshold: 0.25 });

  slots.forEach((slot, index) => {
    slot.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(slot);
  });

  const onScroll = () => {
    rotation = window.scrollY * 0.0008;
  };

  resizeCanvas();
  animate();
  onScroll();
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('scroll', onScroll, { passive: true });
}

function updateNavState() {
  const path = window.location.pathname.split('/').pop();
  const currentPage = path === 'index.html' || path === '' ? 'home' : path.replace('.html', '');

  document.querySelectorAll('.nav-link').forEach((link) => {
    const page = link.getAttribute('data-page');
    const isActive = currentPage === page || (page === 'contact' && currentPage === 'about');
    link.classList.toggle('active', isActive);
  });
}

function updateYear() {
  document.querySelectorAll('#year').forEach((yearEl) => {
    yearEl.textContent = new Date().getFullYear();
  });
}

function handleCursorMove(event) {
  if (!cursor) return;
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;

  const trail = document.createElement('span');
  trail.className = 'cursor-trail';
  trail.style.left = `${event.clientX}px`;
  trail.style.top = `${event.clientY}px`;
  document.body.appendChild(trail);
  trailDots.push(trail);

  if (trailDots.length > trailLimit) {
    const removed = trailDots.shift();
    removed.style.opacity = '0';
    setTimeout(() => removed.remove(), 400);
  }

  requestAnimationFrame(() => {
    trail.style.opacity = '0';
    trail.style.transform = 'scale(1.4)';
  });
}

function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const phrases = [
    'diagnosing trust breakdowns in user journeys',
    'building products that feel as good as they work',
    'behavioral science applied to real product decisions.'
  ];

  const rotate = () => {
    target.classList.add('fade-out');
    window.setTimeout(() => {
      currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      target.textContent = phrases[currentPhraseIndex];
      target.classList.remove('fade-out');
    }, 400);
  };

  target.textContent = phrases[0];
  window.setInterval(rotate, 3000);
}

function initHeatmap() {
  if (!document.body.classList.contains('page-about')) return;

  const maxDots = 80;
  const dots = [];

  document.addEventListener('mousemove', (event) => {
    const dot = document.createElement('span');
    dot.className = 'heatmap-dot';
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
    document.body.appendChild(dot);
    dots.push(dot);

    if (dots.length > maxDots) {
      const removed = dots.shift();
      removed.remove();
    }

    requestAnimationFrame(() => {
      dot.style.opacity = '0';
    });
  });
}

function initProjects() {
  if (!document.body.classList.contains('page-projects')) return;

  const overlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalTag = overlay?.querySelector('.modal-tag');
  const modalDescription = document.getElementById('modalDescription');
  const modalLink = document.getElementById('modalLink');
  const hint = document.getElementById('hint');
  const folders = document.querySelectorAll('.folder');
  const clock = document.getElementById('clock');

  const updateTime = () => {
    if (clock) {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  updateTime();
  setInterval(updateTime, 1000);

  window.setTimeout(() => hint?.classList.add('is-hidden'), 3000);

  folders.forEach((folder) => {
    folder.addEventListener('dblclick', () => {
      const project = folder.dataset.project;
      const category = folder.dataset.category;
      const description = folder.dataset.description;
      const link = folder.dataset.link;

      if (modalTitle) modalTitle.textContent = project;
      if (modalTag) modalTag.textContent = category;
      if (modalDescription) modalDescription.textContent = description;
      if (modalLink) {
        modalLink.href = link;
      }
      if (overlay) overlay.hidden = false;
    });
  });

  overlay?.addEventListener('click', (event) => {
    if (event.target === overlay) {
      overlay.hidden = true;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      overlay.hidden = true;
    }
  });
}

updateNavState();
updateYear();
initTypewriter();
initHeroParticles();
initGallery();
initHeatmap();
initProjects();

window.addEventListener('mousemove', handleCursorMove);
window.addEventListener('mouseleave', () => {
  if (cursor) cursor.classList.add('is-hidden');
});
window.addEventListener('mouseenter', () => {
  if (cursor) cursor.classList.remove('is-hidden');
});
