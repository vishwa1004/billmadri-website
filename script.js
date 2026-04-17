const { websiteContent } = window;

const byId = (id) => document.getElementById(id);

const scrollToTarget = (id) => {
  byId(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const createTag = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (typeof text === 'string') element.textContent = text;
  return element;
};

const normalizeText = (value) => String(value || '').trim().replace(/\s+/g, ' ');

const isValidFullName = (value) => {
  const text = normalizeText(value);
  return text.length >= 2 && /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s.'-]{1,79}$/.test(text);
};

const normalizePhone = (value) => String(value || '').trim().replace(/[()\s-]/g, '');

const isValidPhoneNumber = (value) => {
  const phone = normalizePhone(value);
  return /^\+?[0-9]{10,15}$/.test(phone);
};

const setFormStatus = (statusEl, message, tone = '') => {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = `form-status${tone ? ` ${tone}` : ''}`;
};

const renderHeroStats = () => {
  const container = byId('hero-stats');
  if (!container) return;
  container.innerHTML = '';
  websiteContent.heroStats.forEach((stat) => {
    const card = createTag('div', 'stat-card');
    card.append(createTag('strong', '', stat.value));
    card.append(createTag('span', '', stat.label));
    container.append(card);
  });
};

const renderComparison = () => {
  const container = byId('compare-grid');
  if (!container) return;
  container.innerHTML = '';

  websiteContent.comparisons.forEach((group) => {
    const article = createTag('article', `compare-card compare-card--${group.tone} reveal-up`);
    article.append(createTag('h3', '', group.title));

    const list = createTag('div', 'compare-list');
    group.items.forEach((item) => list.append(createTag('div', 'compare-item', item)));
    article.append(list);
    container.append(article);
  });
};

const renderVisualFeatures = () => {
  const container = byId('visual-feature-grid');
  if (!container) return;
  container.innerHTML = '';

  websiteContent.visualFeatures.forEach((feature) => {
    const article = createTag('article', 'visual-feature-card reveal-up');
    const image = document.createElement('img');
    image.src = feature.image;
    image.alt = feature.title;
    article.append(image);

    const body = createTag('div', 'visual-feature-copy');
    body.append(createTag('h3', '', feature.title));
    body.append(createTag('p', '', feature.description));

    const chipRow = createTag('div', 'visual-chip-row');
    feature.chips.forEach((chip) => chipRow.append(createTag('span', 'visual-chip', chip)));
    body.append(chipRow);

    article.append(body);
    container.append(article);
  });
};

const renderModules = () => {
  const container = byId('module-grid');
  if (!container) return;
  container.innerHTML = '';
  websiteContent.modules.forEach((module) => {
    container.append(createTag('div', 'module-card reveal-up', module));
  });
};

const renderFreelancerProgram = () => {
  const grid = byId('freelancer-grid');
  const intro = byId('freelancer-intro');
  const steps = byId('freelancer-steps');
  if (!grid || !intro || !steps) return;

  grid.innerHTML = '';
  steps.innerHTML = '';
  intro.textContent = websiteContent.freelancerProgram.intro;

  websiteContent.freelancerProgram.tiers.forEach((tier) => {
    const card = createTag('article', `freelancer-card reveal-up${tier.featured ? ' freelancer-card--featured' : ''}`);
    card.append(createTag('h3', '', tier.range));
    card.append(createTag('p', 'rate', tier.rate));
    card.append(createTag('p', '', tier.note));
    grid.append(card);
  });

  websiteContent.freelancerProgram.steps.forEach((step, index) => {
    steps.append(createTag('li', '', step || `Step ${index + 1}`));
  });
};

const renderPricing = () => {
  const container = byId('pricing-grid');
  const select = byId('plan-interest');
  if (!container || !select) return;
  container.innerHTML = '';
  select.innerHTML = '';

  websiteContent.pricingPlans.forEach((plan) => {
    const card = createTag('article', `pricing-card reveal-up${plan.highlight ? ' pricing-card--highlight' : ''}`);
    if (plan.highlight) {
      card.append(createTag('span', 'pill', 'Most Popular'));
    }

    card.append(createTag('h3', '', plan.name));
    card.append(createTag('p', 'plan-description', plan.description));

    const priceRow = createTag('div', 'price-row');
    priceRow.innerHTML = `<span class="currency">Rs.</span><strong>${plan.price}</strong><span class="cadence">${plan.cadence}</span>`;
    card.append(priceRow);
    card.append(createTag('p', 'plan-note', plan.note));

    const list = createTag('ul', 'feature-list');
    plan.features.forEach((feature) => {
      const item = createTag('li', '', feature);
      list.append(item);
    });
    card.append(list);

    const button = createTag('button', plan.highlight ? 'primary-button' : 'ghost-button', plan.cta);
    button.type = 'button';
    button.addEventListener('click', () => {
      select.value = plan.name;
      scrollToTarget('demo-request');
    });
    card.append(button);
    container.append(card);
    const option = createTag('option', '', plan.name);
    option.value = plan.name;
    select.append(option);
  });

  const comparisonNote = byId('comparison-note');
  if (comparisonNote) {
    comparisonNote.textContent = websiteContent.comparisonNote;
  }
};

const renderContact = () => {
  const container = byId('contact-list');
  const footer = byId('footer-links');
  if (!container || !footer) return;
  container.innerHTML = '';
  footer.innerHTML = '';
  const items = [
    ['Sales Email', websiteContent.contact.email],
    ['Phone', websiteContent.contact.phone],
    ['Office', websiteContent.contact.address],
  ];

  items.forEach(([label, value]) => {
    const card = createTag('div', 'contact-card');
    card.append(createTag('p', 'contact-label', label));
    card.append(createTag('p', 'contact-value', value));
    container.append(card);
  });

  const supportLink = createTag('a', '', websiteContent.contact.supportEmail);
  supportLink.href = `mailto:${websiteContent.contact.supportEmail}`;
  footer.append(supportLink);
  footer.append(createTag('span', '', websiteContent.contact.phone));
};

const openFreelancerModal = () => {
  const modal = byId('freelancer-modal');
  if (!modal) return;
  const status = byId('freelancer-status');
  if (status) {
    status.textContent = '';
    status.className = 'form-status';
  }
  modal.hidden = false;
  modal.classList.add('is-open');
  const firstField = modal.querySelector('input, textarea, button');
  if (firstField instanceof HTMLElement) {
    firstField.focus();
  }
};

const closeFreelancerModal = () => {
  const modal = byId('freelancer-modal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.hidden = true;
};

const bindScrollButtons = () => {
  document.querySelectorAll('[data-scroll-target]').forEach((button) => {
    button.addEventListener('click', () => {
      scrollToTarget(button.getAttribute('data-scroll-target'));
    });
  });
};

const bindRevealAnimations = () => {
  const items = document.querySelectorAll('.reveal-up');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 50, 240)}ms`;
    observer.observe(item);
  });
};

const bindForm = () => {
  const form = byId('demo-form');
  const status = byId('form-status');
  const submitButton = byId('demo-submit');
  if (!form || !status || !submitButton) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting request...';
    status.textContent = '';
    status.className = 'form-status';

    const formData = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch(`${websiteContent.apiBaseUrl}/demo-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'We could not submit your request right now.');
      }

      form.reset();
      byId('plan-interest').value = 'Growth';
      status.textContent = data.message || 'Demo request received successfully.';
      status.classList.add('success');
    } catch (error) {
      status.textContent = error.message;
      status.classList.add('error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Request Demo';
    }
  });
};

const bindFreelancerModal = () => {
  document.querySelectorAll('[data-open-modal="freelancer-modal"]').forEach((button) => {
    button.addEventListener('click', openFreelancerModal);
  });

  document.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', closeFreelancerModal);
  });

  const modal = byId('freelancer-modal');
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeFreelancerModal();
      }
    });
  }

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeFreelancerModal();
    }
  });
};

const bindFreelancerForm = () => {
  const form = byId('freelancer-form');
  const status = byId('freelancer-status');
  const submitButton = byId('freelancer-submit');
  if (!form || !status || !submitButton) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(form).entries());
    const fullName = normalizeText(formData.fullName);
    const contactNumber = normalizeText(formData.contactNumber);
    const address = normalizeText(formData.address);

    const errors = [];
    if (!fullName) {
      errors.push('Full name is required.');
    } else if (!isValidFullName(fullName)) {
      errors.push('Enter a valid full name.');
    }
    if (!contactNumber) {
      errors.push('Contact number is required.');
    } else if (!isValidPhoneNumber(contactNumber)) {
      errors.push('Enter a valid contact number.');
    }
    if (!address) {
      errors.push('Address is required.');
    }

    if (errors.length) {
      setFormStatus(status, errors.join(' '), 'error');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting application...';
    setFormStatus(status, '', '');

    try {
      const response = await fetch(`${websiteContent.apiBaseUrl}/freelancer-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          contactNumber: normalizePhone(contactNumber),
          address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'We could not submit your application right now.');
      }

      form.reset();
      setFormStatus(status, data.message || 'Application received successfully.', 'success');
      setTimeout(() => {
        closeFreelancerModal();
      }, 1200);
    } catch (error) {
      setFormStatus(status, error.message, 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Application';
    }
  });
};

renderHeroStats();
renderComparison();
renderVisualFeatures();
renderModules();
renderFreelancerProgram();
renderPricing();
renderContact();
bindScrollButtons();
bindRevealAnimations();
bindForm();
bindFreelancerModal();
bindFreelancerForm();
