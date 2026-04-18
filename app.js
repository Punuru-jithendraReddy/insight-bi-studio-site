const state = {
  data: null,
  theme: "light",
  projectFilter: "All",
  revealObserver: null,
  metricObserver: null,
};

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  initializeTheme();
  bindEvents();
  loadSite();
});

function cacheElements() {
  [
    "site-header",
    "brand-mark",
    "brand-name",
    "brand-tagline",
    "nav-toggle",
    "nav-panel",
    "nav-links",
    "theme-toggle",
    "header-cta",
    "hero-eyebrow",
    "hero-title",
    "hero-description",
    "hero-primary",
    "hero-secondary",
    "proof-strip",
    "hero-metrics",
    "hero-image",
    "hero-owner",
    "hero-owner-role",
    "hero-availability",
    "hero-mini-grid",
    "about-eyebrow",
    "about-title",
    "about-description",
    "about-story-kicker",
    "about-story-title",
    "about-summary",
    "about-stats",
    "about-meta",
    "about-grid",
    "services-eyebrow",
    "services-title",
    "services-description",
    "services-grid",
    "focus-eyebrow",
    "focus-title",
    "focus-description",
    "domain-grid",
    "projects-eyebrow",
    "projects-title",
    "projects-description",
    "project-filters",
    "project-grid",
    "experience-eyebrow",
    "experience-title",
    "experience-description",
    "experience-list",
    "skills-eyebrow",
    "skills-title",
    "skills-description",
    "skill-list",
    "tool-grid",
    "process-eyebrow",
    "process-title",
    "process-description",
    "process-grid",
    "contact-eyebrow",
    "contact-title",
    "contact-description",
    "contact-methods",
    "contact-form-title",
    "contact-form-note",
    "contact-form",
    "interest-select",
    "budget-select",
    "timeline-select",
    "form-status",
    "footer-eyebrow",
    "footer-title",
    "footer-description",
    "footer-primary",
    "footer-secondary",
    "footer-brand-mark",
    "footer-brand-name",
    "footer-note",
    "footer-legal",
    "project-modal",
    "modal-close",
    "modal-media",
    "modal-category",
    "modal-title",
    "modal-details",
    "modal-problem",
    "modal-solution",
    "modal-impact",
    "modal-preview-link",
  ].forEach((id) => {
    elements[id] = document.getElementById(id);
  });
}

async function loadSite() {
  try {
    const response = await fetch("./data/company.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Unable to load JSON data. Status: ${response.status}`);
    }

    state.data = await response.json();
    hydratePage();
  } catch (error) {
    renderLoadError(error);
  }
}

function hydratePage() {
  const { meta, brand } = state.data;

  document.title = meta.title;
  updateMetaDescription(meta.description);

  renderBrand(brand);
  renderNavigation(state.data.navigation);
  renderHero();
  renderAbout();
  renderServices();
  renderProcess();
  renderFocusAreas();
  renderProjectFilters();
  renderProjects();
  renderExperience();
  renderSkills();
  renderContact();
  renderFooter();
  initializeRevealObserver();
  initializeSectionObserver();
  refreshRevealElements();
  updateHeaderState();
}

function renderBrand(brand) {
  text("brand-name", brand.companyName);
  text("brand-tagline", brand.tagline);
  text("footer-brand-name", brand.companyName);
  setBrandMark("brand-mark", brand.logoPath);
  setBrandMark("footer-brand-mark", brand.logoPath);

  if (elements["header-cta"]) {
    elements["header-cta"].setAttribute("href", "#contact");
    const label = elements["header-cta"].querySelector("[data-button-label]");
    if (label) {
      label.textContent = "Start project";
    }
  }
}

function renderNavigation(links) {
  elements["nav-links"].innerHTML = links
    .map(
      (link) => `
        <li>
          <a class="nav-link" href="${link.href}" data-nav-link="${link.href}">${link.label}</a>
        </li>
      `,
    )
    .join("");
}

function renderHero() {
  const { hero, brand, metrics, proofStrip } = state.data;

  text("hero-eyebrow", hero.eyebrow);
  text("hero-title", hero.title);
  text("hero-description", hero.description);
  anchor("hero-primary", hero.primaryCta.label, hero.primaryCta.href);
  anchor("hero-secondary", hero.secondaryCta.label, hero.secondaryCta.href);
  setExternalLink("hero-secondary", hero.secondaryCta.href);
  text("hero-owner", brand.ownerName);
  text("hero-owner-role", brand.ownerRole);
  text("hero-availability", hero.availability);

  elements["hero-image"].src = brand.profileImage;
  elements["hero-image"].alt = `${brand.ownerName} portrait`;

  elements["proof-strip"].innerHTML = proofStrip
    .map((item) => `<span class="proof-chip">${item}</span>`)
    .join("");

  elements["hero-metrics"].innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric-card reveal">
          <span class="metric-value count-up" data-target="${metric.value}" data-suffix="${metric.suffix}">
            0${metric.suffix}
          </span>
          <span class="metric-label">${metric.label}</span>
        </article>
      `,
    )
    .join("");

  elements["hero-mini-grid"].innerHTML = hero.miniCards
    .map(
      (item) => `
        <article class="mini-card">
          <p class="card-kicker">${item.label}</p>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `,
    )
    .join("");
}

function renderAbout() {
  const { sections, brand, aboutCards, aboutStory, metrics } = state.data;

  renderHeading("about", sections.about);
  text("about-story-kicker", aboutStory.kicker);
  text("about-story-title", aboutStory.title);
  text("about-summary", brand.summary);

  elements["about-stats"].innerHTML = metrics
    .map(
      (metric) => `
        <article class="about-stat">
          <div class="about-stat-head">
            <span class="about-stat-kicker">${metric.eyebrow || "Delivery metric"}</span>
            <strong>${metric.value}${metric.suffix}</strong>
          </div>
          <span class="about-stat-label">${metric.label}</span>
          ${metric.detail ? `<p class="about-stat-note">${metric.detail}</p>` : ""}
        </article>
      `,
    )
    .join("");

  elements["about-meta"].innerHTML = [
    brand.ownerRole,
    brand.location,
    brand.email,
  ]
    .map((item) => `<span class="meta-chip">${item}</span>`)
    .join("");

  elements["about-grid"].innerHTML = aboutCards
    .map(
      (card) => `
        <article class="about-card reveal">
          <h3>${card.title}</h3>
          <p>${card.copy}</p>
        </article>
      `,
    )
    .join("");
}

function renderServices() {
  renderHeading("services", state.data.sections.services);

  elements["services-grid"].innerHTML = state.data.services
    .map(
      (service) => `
        <article class="service-card reveal">
          <div class="service-topline">
            <span class="service-metric">${service.metric}</span>
          </div>
          <h3>${service.title}</h3>
          <p>${service.summary}</p>
          <ul class="service-list">
            ${service.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
          </ul>
        </article>
      `,
    )
    .join("");
}

function renderFocusAreas() {
  renderHeading("focus", state.data.sections.focusAreas);

  elements["domain-grid"].innerHTML = state.data.focusAreas
    .map(
      (item) => `
        <article class="domain-card reveal">
          <span class="domain-label">${item.label}</span>
          <h3>${item.title}</h3>
          <p>${item.copy}</p>
        </article>
      `,
    )
    .join("");
}

function renderProjectFilters() {
  const categories = ["All", ...new Set(state.data.projects.map((project) => project.category))];

  elements["project-filters"].innerHTML = categories
    .map(
      (category) => `
        <button
          class="filter-chip ${category === state.projectFilter ? "is-active" : ""}"
          type="button"
          data-project-filter="${category}"
        >
          ${category}
        </button>
      `,
    )
    .join("");
}

function renderProjects() {
  renderHeading("projects", state.data.sections.projects);

  const projects = state.projectFilter === "All"
    ? state.data.projects
    : state.data.projects.filter((project) => project.category === state.projectFilter);

  if (!projects.length) {
    elements["project-grid"].innerHTML = '<div class="empty-state">No projects are available for this filter yet.</div>';
    return;
  }

  elements["project-grid"].innerHTML = projects
    .map((project) => {
      const sourceIndex = state.data.projects.findIndex((item) => item.title === project.title);

      return `
        <article class="project-card reveal">
          <div class="project-media">
            <img src="${project.image}" alt="${project.title}" loading="lazy" />
            <span class="project-badge">${project.category}</span>
          </div>

          <div class="project-copy">
            <div class="project-topline">
              <span class="project-chip">${project.featured ? "Featured build" : "Project"}</span>
              <span class="project-chip">${project.category}</span>
            </div>

            <h3>${project.title}</h3>
            <p>${project.shortSummary}</p>

            <div class="project-brief">
              <div class="brief-item">
                <span>Problem</span>
                <p>${project.problem}</p>
              </div>
              <div class="brief-item">
                <span>Impact</span>
                <p>${project.impact}</p>
              </div>
            </div>

            <button class="text-button" type="button" data-open-project="${sourceIndex}">
              View project details
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  refreshRevealElements();
}

function renderExperience() {
  renderHeading("experience", state.data.sections.experience);

  elements["experience-list"].innerHTML = state.data.experience
    .map(
      (item) => `
        <article class="timeline-card reveal">
          <span class="timeline-date">${item.date}</span>
          <h3>${item.role}</h3>
          <p class="timeline-company">${item.company}</p>
          <p class="timeline-summary">${item.summary}</p>
          <ul class="timeline-list">
            ${item.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
          </ul>
        </article>
      `,
    )
    .join("");
}

function renderSkills() {
  renderHeading("skills", state.data.sections.skills);

  elements["skill-list"].innerHTML = state.data.skills
    .map(
      (skill) => `
        <div class="skill-row">
          <div class="skill-head">
            <strong>${skill.name}</strong>
            <span>${skill.value}%</span>
          </div>
          <div class="skill-track">
            <div class="skill-fill" style="width:${skill.value}%"></div>
          </div>
        </div>
      `,
    )
    .join("");

  elements["tool-grid"].innerHTML = state.data.toolGroups
    .map(
      (group) => `
        <article class="tool-card">
          <h3>${group.title}</h3>
          <p>${group.description}</p>
          <ul class="tool-list">
            ${group.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `,
    )
    .join("");
}

function renderProcess() {
  renderHeading("process", state.data.sections.process);

  elements["process-grid"].innerHTML = state.data.process
    .map(
      (step) => `
        <article class="process-card reveal">
          <span class="process-step">${step.step}</span>
          <h3>${step.title}</h3>
          <p>${step.text}</p>
        </article>
      `,
    )
    .join("");
}

function renderContact() {
  const contactFormConfig = state.data.contact.form;

  renderHeading("contact", state.data.sections.contact);
  text("contact-form-title", contactFormConfig.title);
  text("contact-form-note", contactFormConfig.note);

  elements["contact-methods"].innerHTML = state.data.contact.methods
    .map(
      (method) => `
        <a class="contact-method-card" href="${method.href}" ${shouldOpenNewTab(method.href) ? 'target="_blank" rel="noopener"' : ""}>
          <h3>${method.label}</h3>
          <p>${method.value}</p>
        </a>
      `,
    )
    .join("");

  populateSelect(elements["interest-select"], contactFormConfig.projectTypes, "Choose a project type");
  populateSelect(elements["budget-select"], contactFormConfig.budgetRanges, "Choose a budget range");
  populateSelect(elements["timeline-select"], contactFormConfig.timelineOptions, "Choose a timeline");
  configureContactForm();
}

function renderFooter() {
  const { footer, brand } = state.data;

  text("footer-eyebrow", footer.eyebrow);
  text("footer-title", footer.title);
  text("footer-description", footer.description);
  anchor("footer-primary", footer.primaryCta.label, footer.primaryCta.href);
  anchor("footer-secondary", footer.secondaryCta.label, footer.secondaryCta.href);
  setExternalLink("footer-secondary", footer.secondaryCta.href);
  text("footer-note", footer.note.replace("{owner}", brand.ownerName));
  text("footer-legal", footer.legal);
}

function renderHeading(prefix, section) {
  text(`${prefix}-eyebrow`, section.eyebrow);
  text(`${prefix}-title`, section.title);
  text(`${prefix}-description`, section.description);
}

function openProjectModal(index) {
  const project = state.data.projects[index];

  if (!project) {
    return;
  }

  text("modal-category", project.category);
  text("modal-title", project.title);
  text("modal-details", project.details);
  text("modal-problem", project.problem);
  text("modal-solution", project.solution);
  text("modal-impact", project.impact);

  elements["modal-media"].innerHTML = renderProjectMedia(project);

  if (project.preview) {
    anchor("modal-preview-link", "Open project media", project.preview);
    setExternalLink("modal-preview-link", project.preview);
    elements["modal-preview-link"].style.display = "inline-flex";
  } else {
    elements["modal-preview-link"].style.display = "none";
  }

  elements["project-modal"].classList.add("is-open");
  elements["project-modal"].setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function renderProjectMedia(project) {
  if (!project.preview) {
    return `<img src="${project.image}" alt="${project.title}" />`;
  }

  if (/\.(mp4|webm)(\?|$)/i.test(project.preview)) {
    return `
      <video controls playsinline preload="metadata" poster="${project.image}">
        <source src="${project.preview}" />
      </video>
    `;
  }

  return `<img src="${project.preview}" alt="${project.title}" />`;
}

function closeProjectModal() {
  elements["project-modal"].classList.remove("is-open");
  elements["project-modal"].setAttribute("aria-hidden", "true");
  elements["modal-media"].innerHTML = "";
  document.body.classList.remove("modal-open");
}

function bindEvents() {
  window.addEventListener("scroll", updateHeaderState);

  elements["theme-toggle"].addEventListener("click", () => {
    setTheme(state.theme === "light" ? "dark" : "light");
  });

  elements["nav-toggle"].addEventListener("click", () => {
    const isOpen = elements["nav-panel"].classList.toggle("is-open");
    elements["nav-toggle"].setAttribute("aria-expanded", String(isOpen));
  });

  elements["contact-form"].addEventListener("submit", handleContactSubmit);
  elements["modal-close"].addEventListener("click", closeProjectModal);

  document.addEventListener("click", (event) => {
    const filterButton = event.target.closest("[data-project-filter]");
    const projectButton = event.target.closest("[data-open-project]");
    const closeModalTrigger = event.target.closest("[data-close-modal]");
    const navLink = event.target.closest(".nav-link");

    if (filterButton) {
      state.projectFilter = filterButton.dataset.projectFilter;
      renderProjectFilters();
      renderProjects();
    }

    if (projectButton) {
      openProjectModal(Number(projectButton.dataset.openProject));
    }

    if (closeModalTrigger) {
      closeProjectModal();
    }

    if (navLink && elements["nav-panel"].classList.contains("is-open")) {
      elements["nav-panel"].classList.remove("is-open");
      elements["nav-toggle"].setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProjectModal();
    }
  });
}

function handleContactSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const payload = Object.fromEntries(new FormData(form).entries());
  const requiredFields = ["name", "email", "company", "interest", "budget", "timeline", "message"];
  const submitButton = form.querySelector('button[type="submit"]');
  const contactFormConfig = state.data.contact.form;
  let isValid = true;

  requiredFields.forEach((fieldName) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    const hasValue = String(payload[fieldName] || "").trim().length > 0;
    field.classList.toggle("is-invalid", !hasValue);
    if (!hasValue) {
      isValid = false;
    }
  });

  if (!isValid) {
    setFormStatus("Please complete every field before sending the brief.", "error");
    return;
  }

  if (window.location.protocol === "file:") {
    setFormStatus("Open the site through a web server or hosted domain before sending the form.", "error");
    return;
  }

  if (String(payload._honey || "").trim()) {
    setFormStatus(contactFormConfig.errorMessage, "error");
    return;
  }

  const endpoint = getContactSubmissionEndpoint();

  if (!endpoint) {
    setFormStatus("The form email endpoint is missing. Add it in data/company.json before going live.", "error");
    return;
  }

  configureContactForm(payload);

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = contactFormConfig.submittingLabel || "Sending...";
  }

  setFormStatus(contactFormConfig.pendingMessage || "Sending your project brief...", "");
  HTMLFormElement.prototype.submit.call(form);
}

function setFormStatus(message, type) {
  elements["form-status"].textContent = message;
  elements["form-status"].classList.remove("is-success", "is-error");

  if (type === "success") {
    elements["form-status"].classList.add("is-success");
    return;
  }

  if (type === "error") {
    elements["form-status"].classList.add("is-error");
  }
}

function populateSelect(select, options, placeholder) {
  select.innerHTML = [
    `<option value="" selected disabled>${placeholder}</option>`,
    ...options.map((option) => `<option value="${option}">${option}</option>`),
  ].join("");
}

function initializeTheme() {
  const storedTheme = window.localStorage.getItem("power-bi-studio-theme");
  setTheme(storedTheme || "light", false);
}

function setTheme(theme, persist = true) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  elements["theme-toggle"].dataset.mode = theme;
  elements["theme-toggle"].setAttribute("aria-pressed", String(theme === "dark"));
  elements["theme-toggle"].setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
  );

  if (persist) {
    window.localStorage.setItem("power-bi-studio-theme", theme);
  }
}

function initializeRevealObserver() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
    document.querySelectorAll(".count-up").forEach((counter) => animateCounter(counter));
    return;
  }

  state.revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        state.revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16 },
  );

  state.metricObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateCounter(entry.target);
        state.metricObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.65 },
  );

  refreshRevealElements();
}

function refreshRevealElements() {
  document.querySelectorAll(".reveal").forEach((element) => {
    if (!element.dataset.revealBound) {
      element.dataset.revealBound = "true";
      if (state.revealObserver) {
        state.revealObserver.observe(element);
      } else {
        element.classList.add("is-visible");
      }
    }

    if (element.getBoundingClientRect().top < window.innerHeight - 40) {
      element.classList.add("is-visible");
    }
  });

  document.querySelectorAll(".count-up").forEach((counter) => {
    if (!counter.dataset.countBound) {
      counter.dataset.countBound = "true";
      if (state.metricObserver) {
        state.metricObserver.observe(counter);
      } else {
        animateCounter(counter);
      }
    }
  });
}

function animateCounter(element) {
  if (element.dataset.animated) {
    return;
  }

  const target = Number(element.dataset.target || 0);
  const suffix = element.dataset.suffix || "";
  const duration = 1100;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    element.textContent = `${current}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(step);
      return;
    }

    element.textContent = `${target}${suffix}`;
    element.dataset.animated = "true";
  }

  window.requestAnimationFrame(step);
}

function initializeSectionObserver() {
  if (!("IntersectionObserver" in window) || !state.data) {
    return;
  }

  const sections = state.data.navigation
    .map((item) => document.getElementById(item.href.replace("#", "")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const activeHref = `#${entry.target.id}`;
        document.querySelectorAll("[data-nav-link]").forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === activeHref);
        });
      });
    },
    {
      rootMargin: "-38% 0px -45% 0px",
      threshold: 0.01,
    },
  );

  sections.forEach((section) => observer.observe(section));
}

function updateHeaderState() {
  elements["site-header"].classList.toggle("is-scrolled", window.scrollY > 18);
}

function renderLoadError(error) {
  const note = window.location.protocol === "file:"
    ? 'This JSON-driven site is being opened from <code>file://</code>, which blocks loading <code>data/company.json</code> in most browsers. Use <code>start-site.cmd</code> or run <code>powershell -ExecutionPolicy Bypass -File .\\serve.ps1</code>, then open <code>http://localhost:8080</code>.'
    : `Unable to load JSON data: ${error.message}`;

  document.querySelector("main").innerHTML = `
    <section class="section-shell">
      <div class="container">
        <div class="load-error">
          <strong>Unable to load the site data.</strong>
          <p>${note}</p>
        </div>
      </div>
    </section>
  `;
}

function getContactSubmissionEndpoint() {
  const configuredEndpoint = state.data?.contact?.form?.submitUrl;

  if (configuredEndpoint) {
    return configuredEndpoint.replace("/ajax/", "/");
  }

  const recipient = state.data?.brand?.email;
  return recipient ? `https://formsubmit.co/${recipient}` : "";
}

function configureContactForm(payload = {}) {
  const form = elements["contact-form"];
  const contactFormConfig = state.data.contact.form;
  const companyName = state.data.brand.companyName;

  form.setAttribute("method", "POST");
  form.setAttribute("action", getContactSubmissionEndpoint());
  form.setAttribute("accept-charset", "UTF-8");

  setHiddenFieldValue(form, "_subject", contactFormConfig.subject || `New project inquiry - ${companyName}`);
  setHiddenFieldValue(form, "_template", contactFormConfig.template || "table");
  setHiddenFieldValue(form, "_next", getThankYouPageUrl(contactFormConfig.thankYouPath || "thanks.html"));
  setHiddenFieldValue(form, "_url", window.location.href);
  setHiddenFieldValue(form, "_replyto", payload.email || form.querySelector('[name="email"]')?.value || "");
}

function setHiddenFieldValue(form, name, value) {
  const field = form.querySelector(`[name="${name}"]`);

  if (field) {
    field.value = value;
  }
}

function getThankYouPageUrl(pathname) {
  const normalizedPath = pathname.replace(/^\.?\//, "");
  const url = new URL(window.location.href);
  url.hash = "";
  url.search = "";
  url.pathname = url.pathname.replace(/[^/]*$/, normalizedPath);
  return url.toString();
}

function updateMetaDescription(description) {
  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    meta.setAttribute("content", description);
  }
}

function setBrandMark(id, logoPath) {
  if (!elements[id] || !logoPath) {
    return;
  }

  elements[id].style.backgroundImage = `url("${logoPath}")`;
}

function text(id, value) {
  if (elements[id]) {
    elements[id].textContent = value;
  }
}

function anchor(id, label, href) {
  if (!elements[id]) {
    return;
  }

  elements[id].textContent = label;
  elements[id].setAttribute("href", href);
}

function shouldOpenNewTab(href) {
  return /^https?:\/\//i.test(href);
}

function setExternalLink(id, href) {
  if (!elements[id]) {
    return;
  }

  if (shouldOpenNewTab(href)) {
    elements[id].setAttribute("target", "_blank");
    elements[id].setAttribute("rel", "noopener");
    return;
  }

  elements[id].removeAttribute("target");
  elements[id].removeAttribute("rel");
}
