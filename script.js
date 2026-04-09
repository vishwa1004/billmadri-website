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

renderHeroStats();
renderComparison();
renderVisualFeatures();
renderModules();
renderPricing();
renderContact();
bindScrollButtons();
bindRevealAnimations();
bindForm();
