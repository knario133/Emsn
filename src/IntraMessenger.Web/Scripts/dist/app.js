(() => {
  // frontend/src/js/app.js
  function normalizeSearchText(text) {
    if (text == null) return "";
    return String(text).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function filterContacts(contacts, query) {
    if (!contacts || !Array.isArray(contacts)) return [];
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return contacts;
    return contacts.filter((c) => {
      const nameMatch = normalizeSearchText(c.name).includes(normalizedQuery);
      const deptMatch = normalizeSearchText(c.department).includes(normalizedQuery);
      return nameMatch || deptMatch;
    });
  }
  function getContactById(contacts, id) {
    if (!contacts || !Array.isArray(contacts)) return null;
    return contacts.find((c) => String(c.id) === String(id)) || null;
  }
  function getCharacterCount(text, maxChars) {
    if (text == null) return { count: 0, max: maxChars, isOver: false, isValid: false };
    const str = String(text);
    const count = str.length;
    const isOnlySpaces = str.trim().length === 0;
    return {
      count,
      max: maxChars,
      isOver: count > maxChars,
      isValid: count > 0 && count <= maxChars && !isOnlySpaces
    };
  }
  function getResponsiveViewName(width) {
    if (width < 768) return "mobile";
    if (width < 1200) return "tablet";
    return "desktop";
  }
  function getFocusableContactId(filteredContacts, activeContactId2) {
    if (!filteredContacts || filteredContacts.length === 0) return null;
    const exists = filteredContacts.some((c) => String(c.id) === String(activeContactId2));
    if (exists && activeContactId2 != null) return String(activeContactId2);
    return String(filteredContacts[0].id);
  }
  function getContactRowSubtitle(statusLabel, preview) {
    const lbl = String(statusLabel || "").trim();
    const prv = String(preview || "").trim();
    if (lbl && prv) return `${lbl} · ${prv}`;
    if (lbl) return lbl;
    if (prv) return prv;
    return "";
  }
  function getUnreadLabel(count) {
    if (count == null || count <= 0) return null;
    return count === 1 ? "1 mensaje pendiente" : `${count} mensajes pendientes`;
  }
  var demoContacts = [
    {
      id: "c1",
      name: "Camila Rojas",
      department: "Diseño de Servicios",
      status: "online",
      statusLabel: "En línea",
      avatar: "CR",
      email: "crojas@demo.local",
      description: "UX/UI & Service Design",
      preview: "Revisemos el prototipo.",
      time: "10:30",
      unreadCount: 2
    },
    {
      id: "c2",
      name: "Diego Muñoz",
      department: "Operaciones",
      status: "busy",
      statusLabel: "Ocupado",
      avatar: "DM",
      email: "dmunoz@demo.local",
      description: "Coordinador General",
      preview: "Te llamo en 5 min.",
      time: "09:15",
      unreadCount: 0
    },
    {
      id: "c3",
      name: "Valentina Soto",
      department: "Riesgo",
      status: "offline",
      statusLabel: "Desconectado",
      avatar: "VS",
      email: "vsoto@demo.local",
      description: "Análisis de Riesgo",
      preview: "Documento aprobado.",
      time: "Ayer",
      unreadCount: 0
    },
    {
      id: "c4",
      name: "Matías Herrera",
      department: "Tecnología",
      status: "online",
      statusLabel: "En línea",
      avatar: "MH",
      email: "mherrera@demo.local",
      description: "Ingeniero de Software",
      preview: "Despliegue finalizado.",
      time: "Ayer",
      unreadCount: 0
    },
    {
      id: "c5",
      name: "Canal Soporte Interno",
      department: "Soporte",
      status: "online",
      statusLabel: "En línea",
      avatar: "SI",
      email: "soporte@demo.local",
      description: "Atención a usuarios internos",
      preview: "Ticket #429 resuelto.",
      time: "Lun",
      unreadCount: 0
    }
  ];
  var activeContactId = null;
  var elContactsList;
  var elSearchInput;
  var elActiveContactHeader;
  var elContextBody;
  var elComposerInput;
  var elBtnSend;
  var elCharCount;
  var elA11yAnnouncer;
  var elDrawerOverlay;
  var elContextPanel;
  var elBtnToggleContext;
  var elBtnCloseContext;
  var elBtnBackToContacts;
  var elNavPanel;
  var elMainPanel;
  function initDOM() {
    elContactsList = document.getElementById("contactsList");
    elSearchInput = document.getElementById("searchInput");
    elActiveContactHeader = document.getElementById("activeContactHeaderInfo");
    elContextBody = document.getElementById("contextBody");
    elComposerInput = document.getElementById("composerInput");
    elBtnSend = document.getElementById("btnSend");
    elCharCount = document.getElementById("charCount");
    elA11yAnnouncer = document.getElementById("a11y-announcer");
    elDrawerOverlay = document.getElementById("drawerOverlay");
    elContextPanel = document.getElementById("context-panel");
    elBtnToggleContext = document.getElementById("btnToggleContext");
    elBtnCloseContext = document.getElementById("btnCloseContext");
    elBtnBackToContacts = document.getElementById("btnBackToContacts");
    elNavPanel = document.getElementById("nav-panel");
    elMainPanel = document.getElementById("main-content");
  }
  function announce(msg) {
    if (elA11yAnnouncer) {
      elA11yAnnouncer.textContent = "";
      setTimeout(() => {
        elA11yAnnouncer.textContent = msg;
      }, 50);
    }
  }
  function renderContacts(query = "") {
    if (!elContactsList) return;
    const filtered = filterContacts(demoContacts, query);
    elContactsList.innerHTML = "";
    if (filtered.length === 0) {
      elContactsList.innerHTML = '<div class="empty-list-msg">No se encontraron resultados</div>';
      return;
    }
    const focusableId = getFocusableContactId(filtered, activeContactId);
    filtered.forEach((contact) => {
      const isSelected = String(contact.id) === String(activeContactId);
      const isFocusable = String(contact.id) === focusableId;
      const div = document.createElement("div");
      div.className = "contact-item";
      div.setAttribute("role", "option");
      div.setAttribute("aria-selected", isSelected ? "true" : "false");
      div.dataset.id = contact.id;
      div.tabIndex = isFocusable ? 0 : -1;
      const unreadLabel = getUnreadLabel(contact.unreadCount);
      const unreadHtml = unreadLabel ? `<span class="contact-item-unread" aria-label="${unreadLabel}">${contact.unreadCount}</span>` : "";
      const subtitle = getContactRowSubtitle(contact.statusLabel, contact.preview);
      div.innerHTML = `
      <div class="avatar ${contact.status}" aria-hidden="true">${contact.avatar}</div>
      <div class="contact-details">
        <div class="contact-item-header">
            <span class="contact-name">${contact.name}</span>
            <span class="contact-item-time">${contact.time || ""}</span>
        </div>
        <div class="contact-item-footer">
            <span class="contact-item-preview">${subtitle}</span>
            ${unreadHtml}
        </div>
      </div>
    `;
      div.addEventListener("click", () => selectContact(contact.id, false));
      elContactsList.appendChild(div);
    });
  }
  function renderActiveContact() {
    if (!elActiveContactHeader || !elContextBody) return;
    const contact = getContactById(demoContacts, activeContactId);
    if (!contact) {
      elActiveContactHeader.innerHTML = '<div class="active-contact-placeholder">Selecciona un contacto</div>';
      elContextBody.innerHTML = '<div class="context-placeholder">No hay contacto seleccionado</div>';
      return;
    }
    elActiveContactHeader.innerHTML = `
    <div class="avatar ${contact.status} active-contact-avatar" aria-hidden="true">${contact.avatar}</div>
    <div class="active-contact-text">
      <span class="active-contact-name">${contact.name}</span>
      <span class="active-contact-dept">${contact.statusLabel || ""} - ${contact.department}</span>
    </div>
  `;
    elContextBody.innerHTML = `
    <div class="demo-badge context-demo-badge">Datos de demostración</div>
    <div class="profile-card">
      <div class="avatar ${contact.status}" aria-hidden="true">${contact.avatar}</div>
      <div class="profile-name">${contact.name}</div>
      <div class="profile-dept">${contact.statusLabel || ""}</div>
    </div>

    <div class="profile-actions">
      <button type="button" class="btn-action">
        <svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-search"></use></svg>
        Buscar
      </button>
      <button type="button" class="btn-action">
        <svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-phone"></use></svg>
        Llamar
      </button>
    </div>

    <div class="profile-section">
      <h3>Información de Contacto</h3>
      <p class="text-dim">Departamento: ${contact.department}</p>
      <p class="text-dim">Email: ${contact.email}</p>
      <p class="text-dim">${contact.description}</p>
    </div>

    <div class="profile-section">
      <h3>Archivos Compartidos</h3>
      <p class="text-dim context-empty-msg">No hay archivos en la demostración</p>
    </div>
  `;
  }
  function syncResponsiveState() {
    const viewName = getResponsiveViewName(window.innerWidth);
    const isDrawerOpen = elContextPanel && elContextPanel.classList.contains("drawer-open");
    if (viewName === "desktop") {
      document.body.classList.remove("mobile-view-nav", "mobile-view-chat");
      if (elContextPanel) {
        elContextPanel.classList.remove("drawer-open");
        elContextPanel.setAttribute("aria-hidden", "false");
        elContextPanel.removeAttribute("inert");
      }
      if (elDrawerOverlay) {
        elDrawerOverlay.classList.remove("active");
        elDrawerOverlay.setAttribute("aria-hidden", "true");
      }
      if (elNavPanel) {
        elNavPanel.setAttribute("aria-hidden", "false");
        elNavPanel.removeAttribute("inert");
      }
      if (elMainPanel) {
        elMainPanel.setAttribute("aria-hidden", "false");
        elMainPanel.removeAttribute("inert");
      }
      if (elBtnToggleContext) {
        elBtnToggleContext.setAttribute("aria-expanded", "true");
        elBtnToggleContext.classList.remove("btn-active");
      }
    } else if (viewName === "tablet") {
      document.body.classList.remove("mobile-view-nav", "mobile-view-chat");
      if (elContextPanel && !isDrawerOpen) {
        elContextPanel.setAttribute("aria-hidden", "true");
        elContextPanel.setAttribute("inert", "true");
      }
      if (elBtnToggleContext && !isDrawerOpen) {
        elBtnToggleContext.setAttribute("aria-expanded", "false");
      }
      if (isDrawerOpen) {
        if (elNavPanel) elNavPanel.setAttribute("inert", "true");
        if (elMainPanel) elMainPanel.setAttribute("inert", "true");
      } else {
        if (elNavPanel) {
          elNavPanel.setAttribute("aria-hidden", "false");
          elNavPanel.removeAttribute("inert");
        }
        if (elMainPanel) {
          elMainPanel.setAttribute("aria-hidden", "false");
          elMainPanel.removeAttribute("inert");
        }
      }
    } else if (viewName === "mobile") {
      if (!document.body.classList.contains("mobile-view-nav") && !document.body.classList.contains("mobile-view-chat")) {
        document.body.classList.add("mobile-view-nav");
      }
      if (elContextPanel && !isDrawerOpen) {
        elContextPanel.setAttribute("aria-hidden", "true");
        elContextPanel.setAttribute("inert", "true");
      }
      if (elBtnToggleContext && !isDrawerOpen) {
        elBtnToggleContext.setAttribute("aria-expanded", "false");
      }
      if (isDrawerOpen) {
        if (elNavPanel) elNavPanel.setAttribute("inert", "true");
        if (elMainPanel) elMainPanel.setAttribute("inert", "true");
      } else {
        if (document.body.classList.contains("mobile-view-nav")) {
          if (elNavPanel) {
            elNavPanel.setAttribute("aria-hidden", "false");
            elNavPanel.removeAttribute("inert");
          }
          if (elMainPanel) {
            elMainPanel.setAttribute("aria-hidden", "true");
            elMainPanel.setAttribute("inert", "true");
          }
        } else {
          if (elNavPanel) {
            elNavPanel.setAttribute("aria-hidden", "true");
            elNavPanel.setAttribute("inert", "true");
          }
          if (elMainPanel) {
            elMainPanel.setAttribute("aria-hidden", "false");
            elMainPanel.removeAttribute("inert");
          }
        }
      }
    }
  }
  function selectContact(id, isKeyboard = false) {
    activeContactId = id;
    const query = elSearchInput ? elSearchInput.value : "";
    renderContacts(query);
    renderActiveContact();
    const viewName = getResponsiveViewName(window.innerWidth);
    if (viewName === "mobile") {
      document.body.classList.remove("mobile-view-nav");
      document.body.classList.add("mobile-view-chat");
      syncResponsiveState();
      if (isKeyboard && elBtnBackToContacts) {
        elBtnBackToContacts.focus();
      }
    } else {
      if (isKeyboard && elContactsList) {
        const newlySelected = elContactsList.querySelector(`.contact-item[data-id="${id}"]`);
        if (newlySelected) newlySelected.focus();
      }
    }
  }
  function setupComposer() {
    if (!elComposerInput || !elBtnSend || !elCharCount) return;
    const maxChars = 500;
    elComposerInput.addEventListener("input", () => {
      const { count, isValid, isOver } = getCharacterCount(elComposerInput.value, maxChars);
      elCharCount.textContent = `${count} / ${maxChars}`;
      if (isOver) {
        elCharCount.style.color = "var(--status-error)";
      } else {
        elCharCount.style.color = "var(--text-dim)";
      }
      elBtnSend.disabled = !isValid;
    });
    elBtnSend.addEventListener("click", () => {
      if (elComposerInput.value.trim() !== "") {
        elComposerInput.value = "";
        const { count } = getCharacterCount("", maxChars);
        elCharCount.textContent = `${count} / ${maxChars}`;
        elCharCount.style.color = "var(--text-dim)";
        elBtnSend.disabled = true;
        announce("Demostración visual: no se envió ningún mensaje.");
      }
    });
  }
  function toggleContextDrawer(forceState) {
    if (!elContextPanel || !elDrawerOverlay) return;
    const viewName = getResponsiveViewName(window.innerWidth);
    if (viewName === "desktop") return;
    const isOpen = elContextPanel.classList.contains("drawer-open");
    const newState = forceState !== void 0 ? forceState : !isOpen;
    if (newState) {
      elContextPanel.classList.add("drawer-open");
      elDrawerOverlay.classList.add("active");
      elDrawerOverlay.setAttribute("aria-hidden", "false");
      elContextPanel.setAttribute("aria-hidden", "false");
      elContextPanel.removeAttribute("inert");
      if (elBtnToggleContext) {
        elBtnToggleContext.setAttribute("aria-expanded", "true");
        elBtnToggleContext.classList.add("btn-active");
      }
      if (elNavPanel) elNavPanel.setAttribute("inert", "true");
      if (elMainPanel) elMainPanel.setAttribute("inert", "true");
      if (elBtnCloseContext) {
        elBtnCloseContext.focus();
      }
    } else {
      elContextPanel.classList.remove("drawer-open");
      elDrawerOverlay.classList.remove("active");
      elDrawerOverlay.setAttribute("aria-hidden", "true");
      elContextPanel.setAttribute("aria-hidden", "true");
      elContextPanel.setAttribute("inert", "true");
      syncResponsiveState();
      if (elBtnToggleContext) {
        elBtnToggleContext.setAttribute("aria-expanded", "false");
        elBtnToggleContext.classList.remove("btn-active");
        elBtnToggleContext.focus();
      }
    }
  }
  function setupListboxNavigation() {
    if (!elContactsList) return;
    elContactsList.addEventListener("keydown", (e) => {
      const items = Array.from(elContactsList.querySelectorAll(".contact-item"));
      if (items.length === 0) return;
      let currentIndex = items.findIndex((item) => item === document.activeElement);
      let newIndex = currentIndex;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          break;
        case "ArrowUp":
          e.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = items.length - 1;
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (currentIndex >= 0) {
            selectContact(items[currentIndex].dataset.id, true);
          }
          return;
        default:
          return;
      }
      if (newIndex >= 0 && newIndex !== currentIndex) {
        items.forEach((item) => item.tabIndex = -1);
        items[newIndex].tabIndex = 0;
        items[newIndex].focus();
      }
    });
  }
  function setupEvents() {
    if (elSearchInput) {
      elSearchInput.addEventListener("input", (e) => renderContacts(e.target.value));
    }
    if (elBtnToggleContext) {
      elBtnToggleContext.addEventListener("click", () => toggleContextDrawer());
    }
    if (elBtnCloseContext) {
      elBtnCloseContext.addEventListener("click", () => toggleContextDrawer(false));
    }
    if (elDrawerOverlay) {
      elDrawerOverlay.addEventListener("click", () => toggleContextDrawer(false));
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const isDrawerMode = getResponsiveViewName(window.innerWidth) !== "desktop";
        if (isDrawerMode && elContextPanel && elContextPanel.classList.contains("drawer-open")) {
          toggleContextDrawer(false);
        }
      }
    });
    if (elBtnBackToContacts) {
      elBtnBackToContacts.addEventListener("click", () => {
        document.body.classList.remove("mobile-view-chat");
        document.body.classList.add("mobile-view-nav");
        syncResponsiveState();
        if (elContactsList && activeContactId) {
          const selected = elContactsList.querySelector(
            `.contact-item[data-id="${activeContactId}"]`
          );
          if (selected) {
            selected.focus();
          } else {
            const anyFocusable = elContactsList.querySelector('.contact-item[tabindex="0"]');
            if (anyFocusable) anyFocusable.focus();
          }
        }
      });
    }
    setupListboxNavigation();
    window.addEventListener("resize", syncResponsiveState);
  }
  function initApp() {
    initDOM();
    setupComposer();
    setupEvents();
    const viewName = getResponsiveViewName(window.innerWidth);
    if (viewName === "desktop" && demoContacts.length > 0) {
      activeContactId = demoContacts[0].id;
    } else if (viewName === "tablet" && demoContacts.length > 0) {
      activeContactId = demoContacts[0].id;
    } else if (viewName === "mobile") {
      document.body.classList.add("mobile-view-nav");
    }
    syncResponsiveState();
    renderContacts();
    renderActiveContact();
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initApp);
    } else {
      initApp();
    }
  }
})();
