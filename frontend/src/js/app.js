/**
 * Funciones puras exportadas para pruebas.
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
  if (!Array.isArray(contacts)) return [];
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return contacts;

  return contacts.filter((contact) => {
    const fields = [contact.name, contact.department, contact.statusLabel, contact.preview];
    return fields.some((field) => normalizeSearchText(field).includes(normalizedQuery));
  });
}

export function filterContactsByMode(contacts, mode, favoriteIds = []) {
  if (!Array.isArray(contacts)) return [];
  if (mode === 'favorites') {
    const favoriteSet = new Set(favoriteIds.map(String));
    return contacts.filter((contact) => favoriteSet.has(String(contact.id)));
  }
  if (mode === 'team') return contacts.filter((contact) => contact.kind !== 'channel');
  return contacts;
}

export function toggleFavoriteId(favoriteIds, contactId) {
  const values = Array.isArray(favoriteIds) ? favoriteIds.map(String) : [];
  const normalizedId = String(contactId);
  return values.includes(normalizedId)
    ? values.filter((id) => id !== normalizedId)
    : [...values, normalizedId];
}

export function getContactById(contacts, id) {
  if (!Array.isArray(contacts)) return null;
  return contacts.find((contact) => String(contact.id) === String(id)) || null;
}

export function getCharacterCount(text, maxChars) {
  if (text == null) return { count: 0, max: maxChars, isOver: false, isValid: false };
  const value = String(text);
  const count = value.length;
  const isOver = count > maxChars;
  return { count, max: maxChars, isOver, isValid: count > 0 && !isOver && value.trim().length > 0 };
}

export function getResponsiveViewName(width) {
  if (width < 768) return 'mobile';
  if (width < 1200) return 'tablet';
  return 'desktop';
}

export function getFocusableContactId(filteredContacts, activeContactId) {
  if (!Array.isArray(filteredContacts) || filteredContacts.length === 0) return null;
  const activeExists = filteredContacts.some(
    (contact) => String(contact.id) === String(activeContactId),
  );
  return activeExists && activeContactId != null
    ? String(activeContactId)
    : String(filteredContacts[0].id);
}

export function getContactRowSubtitle(statusLabel, preview) {
  const label = String(statusLabel || '').trim();
  const detail = String(preview || '').trim();
  if (label && detail) return `${label} · ${detail}`;
  return label || detail;
}

export function getUnreadLabel(count) {
  if (count == null || count <= 0) return null;
  return count === 1 ? '1 mensaje pendiente' : `${count} mensajes pendientes`;
}

const demoContacts = [
  {
    id: 'c1',
    kind: 'person',
    name: 'Camila Rojas',
    department: 'Diseño de Servicios',
    status: 'online',
    statusLabel: 'En línea',
    avatar: 'CR',
    email: 'crojas@demo.local',
    description: 'UX/UI & Service Design',
    preview: 'Revisemos el prototipo.',
    time: '10:30',
    unreadCount: 2,
  },
  {
    id: 'c2',
    kind: 'person',
    name: 'Diego Muñoz',
    department: 'Ingeniería de Plataforma',
    status: 'busy',
    statusLabel: 'Ocupado',
    avatar: 'DM',
    email: 'dmunoz@demo.local',
    description: 'Coordinación de plataforma',
    preview: 'Te llamo en 5 min.',
    time: '09:15',
    unreadCount: 0,
  },
  {
    id: 'c3',
    kind: 'person',
    name: 'Valentina Soto',
    department: 'Finanzas',
    status: 'offline',
    statusLabel: 'Desconectado',
    avatar: 'VS',
    email: 'vsoto@demo.local',
    description: 'Análisis financiero',
    preview: 'Documento aprobado.',
    time: 'Ayer',
    unreadCount: 0,
  },
  {
    id: 'c4',
    kind: 'person',
    name: 'Matías Herrera',
    department: 'Tecnología',
    status: 'online',
    statusLabel: 'En línea',
    avatar: 'MH',
    email: 'mherrera@demo.local',
    description: 'Ingeniería de software',
    preview: 'Despliegue finalizado.',
    time: 'Ayer',
    unreadCount: 0,
  },
  {
    id: 'c5',
    kind: 'channel',
    name: 'Canal Soporte Interno',
    department: 'Soporte',
    status: 'online',
    statusLabel: 'Canal',
    avatar: 'SI',
    email: 'soporte@demo.local',
    description: 'Atención a usuarios internos',
    preview: 'Ticket #429 resuelto.',
    time: 'Lun',
    unreadCount: 0,
  },
];

let activeContactId = 'c1';
let activeFilter = 'recent';
let favoriteIds = ['c1', 'c5'];
let userStatus = 'online';
let lastFocusedBeforeModal = null;
let toastTimer = null;

const elements = {};

function cacheDOM() {
  const ids = [
    'contactsList',
    'searchInput',
    'activeContactHeaderInfo',
    'contextBody',
    'composerInput',
    'btnSend',
    'charCount',
    'a11y-announcer',
    'drawerOverlay',
    'context-panel',
    'btnToggleContext',
    'btnCloseContext',
    'btnBackToContacts',
    'nav-panel',
    'main-content',
    'btnStatusMenu',
    'statusMenu',
    'currentStatusText',
    'btnEmoji',
    'emojiPanel',
    'btnAttach',
    'btnDemoCall',
    'demoCallOverlay',
    'btnCloseCall',
    'toastPanel',
    'btnFindPerson',
    'btnOpenFavorites',
    'btnCreateDemo',
    'btnHeaderSearch',
    'btnChannelMenu',
    'btnDeckMenu',
    'btnViewSettings',
    'btnMobileContacts',
    'btnMobileChat',
    'btnMobileDetails',
  ];
  ids.forEach((id) => {
    elements[id] = document.getElementById(id);
  });
  elements.deckShell = document.querySelector('.deck-shell');
  elements.filterKeys = Array.from(document.querySelectorAll('.filter-key'));
}

function announce(message, showToast = false) {
  if (elements['a11y-announcer']) {
    elements['a11y-announcer'].textContent = '';
    window.setTimeout(() => {
      elements['a11y-announcer'].textContent = message;
    }, 30);
  }
  if (showToast) showLocalToast(message);
}

function showLocalToast(message) {
  if (!elements.toastPanel) return;
  window.clearTimeout(toastTimer);
  elements.toastPanel.textContent = message;
  elements.toastPanel.hidden = false;
  toastTimer = window.setTimeout(() => {
    elements.toastPanel.hidden = true;
  }, 3600);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getVisibleContacts(query = '') {
  return filterContacts(filterContactsByMode(demoContacts, activeFilter, favoriteIds), query);
}

function renderContacts(query = '') {
  const list = elements.contactsList;
  if (!list) return;
  const visibleContacts = getVisibleContacts(query);
  list.replaceChildren();

  if (visibleContacts.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-list-msg';
    empty.textContent =
      activeFilter === 'favorites'
        ? 'No hay favoritos que coincidan con la búsqueda.'
        : 'No se encontraron contactos.';
    list.appendChild(empty);
    return;
  }

  const focusableId = getFocusableContactId(visibleContacts, activeContactId);
  visibleContacts.forEach((contact) => {
    const isSelected = String(contact.id) === String(activeContactId);
    const isFavorite = favoriteIds.includes(String(contact.id));
    const row = document.createElement('div');
    row.className = 'contact-item';
    row.dataset.id = contact.id;
    row.setAttribute('role', 'option');
    row.setAttribute('aria-selected', String(isSelected));
    row.setAttribute(
      'aria-label',
      `${contact.name}. ${getContactRowSubtitle(contact.statusLabel, contact.preview)}`,
    );
    row.tabIndex = String(contact.id) === focusableId ? 0 : -1;

    const unreadLabel = getUnreadLabel(contact.unreadCount);
    row.innerHTML = `
      <div class="avatar ${escapeHtml(contact.status)}" aria-hidden="true">${escapeHtml(contact.avatar)}</div>
      <div class="contact-details">
        <div class="contact-item-header"><span class="contact-name">${escapeHtml(contact.name)}</span><span class="contact-item-time">${escapeHtml(contact.time)}</span></div>
        <div class="contact-item-footer"><span class="contact-item-preview">${escapeHtml(getContactRowSubtitle(contact.statusLabel, contact.preview))}</span>${unreadLabel ? `<span class="contact-item-unread" aria-label="${escapeHtml(unreadLabel)}">${contact.unreadCount}</span>` : ''}</div>
      </div>
      <button type="button" class="favorite-key" data-favorite-id="${escapeHtml(contact.id)}" aria-label="${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}: ${escapeHtml(contact.name)}" aria-pressed="${String(isFavorite)}">
        <svg class="icon" aria-hidden="true"><use href="#${isFavorite ? 'icon-star-filled' : 'icon-star'}"></use></svg>
      </button>`;

    row.addEventListener('click', (event) => {
      if (!event.target.closest('.favorite-key')) selectContact(contact.id, false);
    });
    list.appendChild(row);
  });
}

function renderActiveContact() {
  const contact = getContactById(demoContacts, activeContactId);
  if (!contact || !elements.activeContactHeaderInfo || !elements.contextBody) return;

  elements.activeContactHeaderInfo.innerHTML = `
    <div class="avatar ${escapeHtml(contact.status)} active-contact-avatar" aria-hidden="true">${escapeHtml(contact.avatar)}</div>
    <div class="active-contact-text"><span class="active-contact-name">${escapeHtml(contact.name)}</span><span class="active-contact-dept"><strong>${escapeHtml(contact.statusLabel)}</strong> · ${escapeHtml(contact.department)}</span></div>
    <span class="channel-signal" aria-label="Enlace local preparado"><span class="led led-green" aria-hidden="true"></span><span>LOCAL</span></span>`;

  const isFavorite = favoriteIds.includes(String(contact.id));

  elements.contextBody.innerHTML = `
    <div class="profile-glass">
      <span class="demo-data-label">Datos de demostración</span>
      <div class="avatar ${escapeHtml(contact.status)}" aria-hidden="true">${escapeHtml(contact.avatar)}</div>
      <div class="profile-name">${escapeHtml(contact.name)}</div>
      <div class="profile-status">${escapeHtml(contact.statusLabel)}</div>
      <dl class="profile-data">
        <div><dt aria-label="Departamento">▣</dt><dd>${escapeHtml(contact.department)}</dd></div>
        <div><dt aria-label="Correo">✉</dt><dd>${escapeHtml(contact.email)}</dd></div>
        <div><dt aria-label="Especialidad">◇</dt><dd>${escapeHtml(contact.description)}</dd></div>
      </dl>
      <div class="profile-actions">
        <button type="button" id="btnContextSearch" class="btn-action"><svg class="icon" aria-hidden="true"><use href="#icon-search"></use></svg>Buscar</button>
        <button type="button" id="btnContextCall" class="btn-action"><svg class="icon" aria-hidden="true"><use href="#icon-phone"></use></svg>Llamar</button>
        <button type="button" id="btnContextFavorite" class="btn-action profile-favorite" data-favorite-id="${escapeHtml(contact.id)}" aria-pressed="${String(isFavorite)}"><svg class="icon" aria-hidden="true"><use href="#${isFavorite ? 'icon-star-filled' : 'icon-star'}"></use></svg>${isFavorite ? 'Quitar favorito' : 'Favorito'}</button>
      </div>
    </div>
    <section class="files-module" aria-labelledby="filesTitle"><h3 id="filesTitle">Archivos compartidos</h3><div class="empty-files"><svg class="icon" aria-hidden="true"><use href="#icon-folder"></use></svg><span>No hay archivos compartidos.<br />El flujo normal no almacena contenido.</span></div></section>`;
}

function setFilter(filterName, moveFocus = false) {
  activeFilter = filterName;
  elements.filterKeys.forEach((button) => {
    const active = button.dataset.filter === filterName;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
    if (active && moveFocus) button.focus();
  });
  renderContacts(elements.searchInput?.value || '');
  const label =
    filterName === 'favorites' ? 'Favoritos' : filterName === 'team' ? 'Equipo' : 'Recientes';
  announce(`Filtro ${label} activado.`);
}

function toggleFavorite(contactId) {
  const contact = getContactById(demoContacts, contactId);
  const wasFavorite = favoriteIds.includes(String(contactId));
  favoriteIds = toggleFavoriteId(favoriteIds, contactId);
  renderContacts(elements.searchInput?.value || '');
  renderActiveContact();
  announce(
    `${contact?.name || 'Contacto'} ${wasFavorite ? 'se quitó de' : 'se agregó a'} favoritos.`,
    true,
  );
}

function updateMobileViewButtons(viewName) {
  const contactsActive = viewName === 'contacts';
  elements.btnMobileContacts?.classList.toggle('is-active', contactsActive);
  elements.btnMobileContacts?.setAttribute('aria-pressed', String(contactsActive));
  elements.btnMobileChat?.classList.toggle('is-active', !contactsActive);
  elements.btnMobileChat?.setAttribute('aria-pressed', String(!contactsActive));
  elements.btnMobileDetails?.classList.remove('is-active');
  elements.btnMobileDetails?.setAttribute('aria-pressed', 'false');
}

function showMobileView(viewName, focusTarget = false) {
  document.body.classList.toggle('mobile-view-nav', viewName === 'contacts');
  document.body.classList.toggle('mobile-view-chat', viewName === 'chat');
  updateMobileViewButtons(viewName);
  syncResponsiveState();
  if (focusTarget) {
    if (viewName === 'contacts') {
      const selected = elements.contactsList?.querySelector('.contact-item[aria-selected="true"]');
      (selected || elements.searchInput)?.focus();
    } else {
      elements.btnBackToContacts?.focus();
    }
  }
}

function selectContact(id, fromKeyboard = false) {
  activeContactId = id;
  renderContacts(elements.searchInput?.value || '');
  renderActiveContact();
  if (getResponsiveViewName(window.innerWidth) === 'mobile') {
    showMobileView('chat', fromKeyboard);
  } else if (fromKeyboard) {
    elements.contactsList?.querySelector(`.contact-item[data-id="${id}"]`)?.focus();
  }
  announce(`Canal de ${getContactById(demoContacts, id)?.name || 'contacto'} seleccionado.`);
}

function syncResponsiveState() {
  const viewName = getResponsiveViewName(window.innerWidth);
  const context = elements['context-panel'];
  const drawerIsOpen = context?.classList.contains('drawer-open');

  if (viewName === 'desktop') {
    document.body.classList.remove('mobile-view-nav', 'mobile-view-chat');
    context?.classList.remove('drawer-open');
    context?.setAttribute('aria-hidden', 'false');
    context?.removeAttribute('inert');
    elements['nav-panel']?.removeAttribute('inert');
    elements['main-content']?.removeAttribute('inert');
    elements['nav-panel']?.setAttribute('aria-hidden', 'false');
    elements['main-content']?.setAttribute('aria-hidden', 'false');
    elements.drawerOverlay?.classList.remove('active');
    elements.drawerOverlay?.setAttribute('aria-hidden', 'true');
    elements.btnToggleContext?.setAttribute('aria-expanded', 'true');
    return;
  }

  if (viewName === 'mobile' && !document.body.classList.contains('mobile-view-chat')) {
    document.body.classList.add('mobile-view-nav');
  }

  if (!drawerIsOpen) {
    context?.setAttribute('aria-hidden', 'true');
    context?.setAttribute('inert', '');
    elements.btnToggleContext?.setAttribute('aria-expanded', 'false');
  }

  if (drawerIsOpen) {
    elements['nav-panel']?.setAttribute('inert', '');
    elements['main-content']?.setAttribute('inert', '');
    return;
  }

  if (viewName === 'tablet') {
    elements['nav-panel']?.removeAttribute('inert');
    elements['main-content']?.removeAttribute('inert');
    elements['nav-panel']?.setAttribute('aria-hidden', 'false');
    elements['main-content']?.setAttribute('aria-hidden', 'false');
  } else {
    const contactsVisible = document.body.classList.contains('mobile-view-nav');
    elements['nav-panel']?.toggleAttribute('inert', !contactsVisible);
    elements['main-content']?.toggleAttribute('inert', contactsVisible);
    elements['nav-panel']?.setAttribute('aria-hidden', String(!contactsVisible));
    elements['main-content']?.setAttribute('aria-hidden', String(contactsVisible));
    updateMobileViewButtons(contactsVisible ? 'contacts' : 'chat');
  }
}

function toggleContextDrawer(forceState) {
  if (getResponsiveViewName(window.innerWidth) === 'desktop') return;
  const context = elements['context-panel'];
  if (!context || !elements.drawerOverlay) return;
  const shouldOpen = forceState ?? !context.classList.contains('drawer-open');

  if (shouldOpen) {
    context.classList.add('drawer-open');
    context.removeAttribute('inert');
    context.setAttribute('aria-hidden', 'false');
    elements.drawerOverlay.classList.add('active');
    elements.drawerOverlay.setAttribute('aria-hidden', 'false');
    elements.btnToggleContext?.setAttribute('aria-expanded', 'true');
    elements['nav-panel']?.setAttribute('inert', '');
    elements['main-content']?.setAttribute('inert', '');
    elements.btnMobileDetails?.classList.add('is-active');
    elements.btnMobileDetails?.setAttribute('aria-pressed', 'true');
    elements.btnCloseContext?.focus();
  } else {
    context.classList.remove('drawer-open');
    elements.drawerOverlay.classList.remove('active');
    elements.drawerOverlay.setAttribute('aria-hidden', 'true');
    elements.btnToggleContext?.setAttribute('aria-expanded', 'false');
    context.setAttribute('aria-hidden', 'true');
    context.setAttribute('inert', '');
    syncResponsiveState();
    elements.btnToggleContext?.focus({ preventScroll: true });
  }
}

function openDemoCall() {
  if (!elements.demoCallOverlay || !elements.deckShell) return;
  lastFocusedBeforeModal = document.activeElement;
  elements.demoCallOverlay.hidden = false;
  elements.demoCallOverlay.setAttribute('aria-hidden', 'false');
  elements.deckShell.setAttribute('inert', '');
  elements.btnCloseCall?.focus();
  announce('Módulo local de llamada de demostración abierto.');
}

function closeDemoCall() {
  if (!elements.demoCallOverlay || !elements.deckShell) return;
  elements.demoCallOverlay.hidden = true;
  elements.demoCallOverlay.setAttribute('aria-hidden', 'true');
  elements.deckShell.removeAttribute('inert');
  lastFocusedBeforeModal?.focus?.({ preventScroll: true });
  announce('Módulo de llamada cerrado.');
}

function togglePopover(button, panel, forceState) {
  if (!button || !panel) return;
  const shouldOpen = forceState ?? panel.hidden;
  panel.hidden = !shouldOpen;
  button.setAttribute('aria-expanded', String(shouldOpen));
  if (shouldOpen) panel.querySelector('button')?.focus();
}

function closeTransientPanels(returnFocus = false) {
  if (elements.statusMenu && !elements.statusMenu.hidden) {
    elements.statusMenu.hidden = true;
    elements.btnStatusMenu?.setAttribute('aria-expanded', 'false');
    if (returnFocus) elements.btnStatusMenu?.focus();
    return true;
  }
  if (elements.emojiPanel && !elements.emojiPanel.hidden) {
    elements.emojiPanel.hidden = true;
    elements.btnEmoji?.setAttribute('aria-expanded', 'false');
    if (returnFocus) elements.btnEmoji?.focus();
    return true;
  }
  return false;
}

function setupComposer() {
  const input = elements.composerInput;
  const send = elements.btnSend;
  if (!input || !send || !elements.charCount) return;

  const update = () => {
    const state = getCharacterCount(input.value, 500);
    elements.charCount.textContent = `${state.count} / 500`;
    elements.charCount.style.color = state.isOver ? 'var(--status-error)' : 'var(--text-dim)';
    send.disabled = !state.isValid;
  };
  input.addEventListener('input', update);
  send.addEventListener('click', () => {
    if (!getCharacterCount(input.value, 500).isValid) return;
    input.value = '';
    update();
    announce('Envío simulado completado. No se transmitió ningún mensaje.', true);
    input.focus();
  });
}

function setupListboxNavigation() {
  elements.contactsList?.addEventListener('keydown', (event) => {
    const items = Array.from(elements.contactsList.querySelectorAll('.contact-item'));
    if (items.length === 0) return;
    const currentIndex = items.findIndex((item) => item === document.activeElement);
    let nextIndex = currentIndex;
    if (event.key === 'ArrowDown')
      nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    else if (event.key === 'ArrowUp')
      nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = items.length - 1;
    else if ((event.key === 'Enter' || event.key === ' ') && currentIndex >= 0) {
      event.preventDefault();
      selectContact(items[currentIndex].dataset.id, true);
      return;
    } else return;

    event.preventDefault();
    items.forEach((item) => {
      item.tabIndex = -1;
    });
    items[nextIndex].tabIndex = 0;
    items[nextIndex].focus();
  });
}

function setupEvents() {
  elements.searchInput?.addEventListener('input', (event) => renderContacts(event.target.value));
  elements.filterKeys.forEach((button) =>
    button.addEventListener('click', () => setFilter(button.dataset.filter)),
  );
  elements.contactsList?.addEventListener('click', (event) => {
    const favoriteButton = event.target.closest('.favorite-key');
    if (favoriteButton) {
      event.stopPropagation();
      toggleFavorite(favoriteButton.dataset.favoriteId);
    }
  });

  elements.btnStatusMenu?.addEventListener('click', () =>
    togglePopover(elements.btnStatusMenu, elements.statusMenu),
  );
  elements.statusMenu?.addEventListener('click', (event) => {
    const option = event.target.closest('[data-status]');
    if (!option) return;
    userStatus = option.dataset.status;
    const labels = { online: 'En línea', busy: 'Ocupado', away: 'Ausente' };
    elements.currentStatusText.textContent = labels[userStatus];
    const led = elements.btnStatusMenu.querySelector('.led');
    led.className = `led ${userStatus === 'online' ? 'led-green' : userStatus === 'busy' ? 'led-red' : 'led-amber'}`;
    togglePopover(elements.btnStatusMenu, elements.statusMenu, false);
    elements.btnStatusMenu.focus();
    announce(`Estado local cambiado a ${labels[userStatus]}.`, true);
  });

  elements.btnEmoji?.addEventListener('click', () =>
    togglePopover(elements.btnEmoji, elements.emojiPanel),
  );
  elements.emojiPanel?.addEventListener('click', (event) => {
    const option = event.target.closest('[data-emoji]');
    if (!option || !elements.composerInput) return;
    const input = elements.composerInput;
    input.value = `${input.value}${input.value ? ' ' : ''}${option.dataset.emoji}`;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    togglePopover(elements.btnEmoji, elements.emojiPanel, false);
    input.focus();
    announce('Emoji insertado en el compositor.');
  });

  elements.btnAttach?.addEventListener('click', () =>
    announce('Adjuntar es una demostración. No se seleccionó ni almacenó ningún archivo.', true),
  );
  elements.btnDemoCall?.addEventListener('click', openDemoCall);
  elements.btnCloseCall?.addEventListener('click', closeDemoCall);
  elements.demoCallOverlay?.addEventListener('click', (event) => {
    if (event.target === elements.demoCallOverlay) closeDemoCall();
  });
  elements.contextBody?.addEventListener('click', (event) => {
    if (event.target.closest('#btnContextSearch')) focusSearch();
    if (event.target.closest('#btnContextCall')) openDemoCall();
    const favoriteButton = event.target.closest('#btnContextFavorite');
    if (favoriteButton) toggleFavorite(favoriteButton.dataset.favoriteId);
  });

  elements.btnFindPerson?.addEventListener('click', focusSearch);
  elements.btnHeaderSearch?.addEventListener('click', focusSearch);
  elements.btnChannelMenu?.addEventListener('click', () =>
    announce('Canal local preparado. No existe conexión con un servicio de mensajería.', true),
  );
  elements.btnOpenFavorites?.addEventListener('click', () => {
    if (getResponsiveViewName(window.innerWidth) === 'mobile') showMobileView('contacts');
    setFilter('favorites', true);
  });
  elements.btnCreateDemo?.addEventListener('click', () =>
    announce('Canal de demostración preparado localmente. No se creó ninguna conversación.', true),
  );
  elements.btnDeckMenu?.addEventListener('click', () =>
    announce('Equipo local activo. Sin conexión a servicios de mensajería.', true),
  );
  elements.btnViewSettings?.addEventListener('click', () =>
    announce(
      `Vista ${activeFilter === 'recent' ? 'Recientes' : activeFilter === 'team' ? 'Equipo' : 'Favoritos'} activa.`,
      true,
    ),
  );

  elements.btnToggleContext?.addEventListener('click', () => toggleContextDrawer());
  elements.btnCloseContext?.addEventListener('click', () => toggleContextDrawer(false));
  elements.drawerOverlay?.addEventListener('click', () => toggleContextDrawer(false));
  elements.btnBackToContacts?.addEventListener('click', () => showMobileView('contacts', true));
  elements.btnMobileContacts?.addEventListener('click', () => showMobileView('contacts', true));
  elements.btnMobileChat?.addEventListener('click', () => showMobileView('chat', true));
  elements.btnMobileDetails?.addEventListener('click', () => toggleContextDrawer(true));

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (elements.demoCallOverlay && !elements.demoCallOverlay.hidden) closeDemoCall();
    else if (elements['context-panel']?.classList.contains('drawer-open'))
      toggleContextDrawer(false);
    else closeTransientPanels(true);
  });

  window.addEventListener('resize', syncResponsiveState);
  setupListboxNavigation();
}

function focusSearch() {
  if (getResponsiveViewName(window.innerWidth) === 'mobile') showMobileView('contacts');
  if (elements['context-panel']?.classList.contains('drawer-open')) toggleContextDrawer(false);
  elements.searchInput?.focus();
  announce('Búsqueda local preparada.');
}

function initApp() {
  cacheDOM();
  setupComposer();
  setupEvents();
  renderContacts();
  renderActiveContact();
  if (getResponsiveViewName(window.innerWidth) === 'mobile') {
    document.body.classList.add('mobile-view-nav');
  }
  syncResponsiveState();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp);
  else initApp();
}
