/**
 * Pure functions exported for testing
 */

export function normalizeSearchText(text) {
  if (text == null) return '';
  return String(text)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function filterContacts(contacts, query) {
  if (!contacts || !Array.isArray(contacts)) return [];
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return contacts;

  return contacts.filter((c) => {
    const nameMatch = normalizeSearchText(c.name).includes(normalizedQuery);
    const deptMatch = normalizeSearchText(c.department).includes(normalizedQuery);
    return nameMatch || deptMatch;
  });
}

export function getContactById(contacts, id) {
  if (!contacts || !Array.isArray(contacts)) return null;
  return contacts.find((c) => String(c.id) === String(id)) || null;
}

export function getCharacterCount(text, maxChars) {
  if (text == null) return { count: 0, max: maxChars, isOver: false };
  const count = String(text).length;
  return {
    count,
    max: maxChars,
    isOver: count > maxChars,
  };
}

export function getResponsiveViewName(width) {
  if (width < 768) return 'mobile';
  if (width < 1200) return 'tablet';
  return 'desktop';
}

/**
 * DOM and App Logic
 */

// Demo Data
const demoContacts = [
  {
    id: 'c1',
    name: 'Camila Rojas',
    department: 'Diseño de Servicios',
    status: 'online',
    avatar: 'CR',
    email: 'crojas@demo.local',
    description: 'UX/UI & Service Design',
  },
  {
    id: 'c2',
    name: 'Diego Muñoz',
    department: 'Operaciones',
    status: 'busy',
    avatar: 'DM',
    email: 'dmunoz@demo.local',
    description: 'Coordinador General',
  },
  {
    id: 'c3',
    name: 'Valentina Soto',
    department: 'Riesgo',
    status: 'offline',
    avatar: 'VS',
    email: 'vsoto@demo.local',
    description: 'Análisis de Riesgo',
  },
  {
    id: 'c4',
    name: 'Matías Herrera',
    department: 'Tecnología',
    status: 'online',
    avatar: 'MH',
    email: 'mherrera@demo.local',
    description: 'Ingeniero de Software',
  },
  {
    id: 'c5',
    name: 'Canal Soporte Interno',
    department: 'Soporte',
    status: 'online',
    avatar: 'SI',
    email: 'soporte@demo.local',
    description: 'Atención a usuarios internos',
  },
];

let activeContactId = null;

// DOM Elements
let elContactsList, elSearchInput, elActiveContactHeader, elContextBody;
let elComposerInput, elBtnSend, elCharCount, elA11yAnnouncer;
let elDrawerOverlay, elContextPanel, elBtnToggleContext, elBtnCloseContext;
let elBtnBackToContacts;

function initDOM() {
  elContactsList = document.getElementById('contactsList');
  elSearchInput = document.getElementById('searchInput');
  elActiveContactHeader = document.getElementById('activeContactHeaderInfo');
  elContextBody = document.getElementById('contextBody');
  elComposerInput = document.getElementById('composerInput');
  elBtnSend = document.getElementById('btnSend');
  elCharCount = document.getElementById('charCount');
  elA11yAnnouncer = document.getElementById('a11y-announcer');

  elDrawerOverlay = document.getElementById('drawerOverlay');
  elContextPanel = document.getElementById('context-panel');
  elBtnToggleContext = document.getElementById('btnToggleContext');
  elBtnCloseContext = document.getElementById('btnCloseContext');
  elBtnBackToContacts = document.getElementById('btnBackToContacts');
}

function announce(msg) {
  if (elA11yAnnouncer) {
    elA11yAnnouncer.textContent = '';
    setTimeout(() => {
      elA11yAnnouncer.textContent = msg;
    }, 50);
  }
}

function renderContacts(query = '') {
  if (!elContactsList) return;
  const filtered = filterContacts(demoContacts, query);

  elContactsList.innerHTML = '';

  if (filtered.length === 0) {
    elContactsList.innerHTML = '<div class="empty-list-msg">No se encontraron resultados</div>';
    return;
  }

  filtered.forEach((contact) => {
    const isSelected = contact.id === activeContactId;

    const div = document.createElement('div');
    div.className = 'contact-item';
    div.setAttribute('role', 'option');
    div.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    div.dataset.id = contact.id;
    div.tabIndex = 0;

    div.innerHTML = `
      <div class="avatar ${contact.status}" aria-hidden="true">${contact.avatar}</div>
      <div class="contact-details">
        <span class="contact-name">${contact.name}</span>
        <span class="contact-dept">${contact.department}</span>
      </div>
    `;

    div.addEventListener('click', () => selectContact(contact.id));
    div.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectContact(contact.id);
      }
    });

    elContactsList.appendChild(div);
  });
}

function renderActiveContact() {
  if (!elActiveContactHeader || !elContextBody) return;
  const contact = getContactById(demoContacts, activeContactId);

  if (!contact) {
    elActiveContactHeader.innerHTML =
      '<div class="active-contact-placeholder">Selecciona un contacto</div>';
    elContextBody.innerHTML = '<div class="context-placeholder">No hay contacto seleccionado</div>';
    return;
  }

  // Header
  elActiveContactHeader.innerHTML = `
    <div class="avatar ${contact.status}" style="width: 32px; height: 32px; font-size: 12px;">${contact.avatar}</div>
    <div style="display: flex; flex-direction: column;">
      <span style="font-weight: 600; font-size: 14px;">${contact.name}</span>
      <span style="font-size: 12px; color: var(--text-dim);">${contact.department}</span>
    </div>
  `;

  // Context Panel
  elContextBody.innerHTML = `
    <div class="profile-card">
      <div class="avatar ${contact.status}">${contact.avatar}</div>
      <div class="profile-name">${contact.name}</div>
      <div class="profile-dept">${contact.department}</div>
    </div>

    <div class="profile-actions">
      <button type="button" class="btn-action">
        <svg class="icon"><use href="#icon-search"></use></svg>
        Buscar
      </button>
      <button type="button" class="btn-action">
        <svg class="icon"><use href="#icon-phone"></use></svg>
        Llamar
      </button>
    </div>

    <div class="profile-section">
      <h3>Información de Contacto</h3>
      <p class="text-dim">Email: ${contact.email}</p>
      <p class="text-dim">${contact.description}</p>
    </div>

    <div class="profile-section">
      <h3>Archivos Compartidos</h3>
      <p class="text-dim" style="font-style: italic;">No hay archivos en la demostración</p>
    </div>
  `;
}

function selectContact(id) {
  activeContactId = id;
  const query = elSearchInput ? elSearchInput.value : '';
  renderContacts(query);
  renderActiveContact();

  const viewName = getResponsiveViewName(window.innerWidth);
  if (viewName === 'mobile') {
    document.body.classList.remove('mobile-view-nav');
    document.body.classList.add('mobile-view-chat');
  }
}

function setupComposer() {
  if (!elComposerInput || !elBtnSend || !elCharCount) return;
  const maxChars = 500;

  elComposerInput.addEventListener('input', () => {
    const { count, isOver } = getCharacterCount(elComposerInput.value, maxChars);
    elCharCount.textContent = `${count} / ${maxChars}`;
    if (isOver) {
      elCharCount.style.color = 'var(--status-error)';
      elBtnSend.disabled = true;
    } else {
      elCharCount.style.color = 'var(--text-dim)';
      elBtnSend.disabled = count === 0;
    }
  });

  elBtnSend.addEventListener('click', () => {
    if (elComposerInput.value.trim() !== '') {
      elComposerInput.value = '';
      const { count } = getCharacterCount('', maxChars);
      elCharCount.textContent = `${count} / ${maxChars}`;
      elBtnSend.disabled = true;
      announce('Demostración visual: no se envió ningún mensaje.');
    }
  });
}

function toggleContextDrawer(forceState) {
  if (!elContextPanel || !elDrawerOverlay) return;

  const isOpen = elContextPanel.classList.contains('drawer-open');
  const newState = forceState !== undefined ? forceState : !isOpen;

  if (newState) {
    elContextPanel.classList.add('drawer-open');
    elDrawerOverlay.classList.add('active');
    elDrawerOverlay.setAttribute('aria-hidden', 'false');
    elContextPanel.setAttribute('aria-hidden', 'false');
    if (elBtnToggleContext) {
      elBtnToggleContext.setAttribute('aria-expanded', 'true');
      elBtnToggleContext.classList.add('btn-active');
    }
  } else {
    elContextPanel.classList.remove('drawer-open');
    elDrawerOverlay.classList.remove('active');
    elDrawerOverlay.setAttribute('aria-hidden', 'true');
    // On desktop we shouldn't set aria-hidden to true, only on mobile/tablet drawer mode
    if (getResponsiveViewName(window.innerWidth) !== 'desktop') {
      elContextPanel.setAttribute('aria-hidden', 'true');
    }
    if (elBtnToggleContext) {
      elBtnToggleContext.setAttribute('aria-expanded', 'false');
      elBtnToggleContext.classList.remove('btn-active');
    }
  }
}

function setupEvents() {
  // Search
  if (elSearchInput) {
    elSearchInput.addEventListener('input', (e) => renderContacts(e.target.value));
  }

  // Drawer Toggles
  if (elBtnToggleContext) {
    elBtnToggleContext.addEventListener('click', () => toggleContextDrawer());
  }
  if (elBtnCloseContext) {
    elBtnCloseContext.addEventListener('click', () => toggleContextDrawer(false));
  }
  if (elDrawerOverlay) {
    elDrawerOverlay.addEventListener('click', () => toggleContextDrawer(false));
  }

  // Escape key for drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const isDrawerMode = getResponsiveViewName(window.innerWidth) !== 'desktop';
      if (isDrawerMode && elContextPanel && elContextPanel.classList.contains('drawer-open')) {
        toggleContextDrawer(false);
      }
    }
  });

  // Mobile Back Button
  if (elBtnBackToContacts) {
    elBtnBackToContacts.addEventListener('click', () => {
      document.body.classList.remove('mobile-view-chat');
      document.body.classList.add('mobile-view-nav');
    });
  }

  // Window Resize Handle
  window.addEventListener('resize', () => {
    const viewName = getResponsiveViewName(window.innerWidth);
    if (viewName === 'desktop') {
      // Clean up mobile states
      document.body.classList.remove('mobile-view-nav', 'mobile-view-chat');
      // Ensure right panel is not hidden if we resize up
      if (elContextPanel) elContextPanel.setAttribute('aria-hidden', 'false');
      if (elDrawerOverlay) elDrawerOverlay.classList.remove('active');
      if (elContextPanel) elContextPanel.classList.remove('drawer-open');
      if (elBtnToggleContext) elBtnToggleContext.classList.remove('btn-active');
    } else if (viewName === 'mobile') {
      if (
        !document.body.classList.contains('mobile-view-nav') &&
        !document.body.classList.contains('mobile-view-chat')
      ) {
        document.body.classList.add('mobile-view-nav'); // Default mobile view
      }
    }
  });
}

function initApp() {
  initDOM();
  setupComposer();
  setupEvents();

  // Initial state logic
  const viewName = getResponsiveViewName(window.innerWidth);

  if (viewName === 'desktop' && demoContacts.length > 0) {
    activeContactId = demoContacts[0].id;
  } else if (viewName === 'tablet' && demoContacts.length > 0) {
    activeContactId = demoContacts[0].id;
  } else if (viewName === 'mobile') {
    document.body.classList.add('mobile-view-nav');
  }

  renderContacts();
  renderActiveContact();
}

// Run when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
