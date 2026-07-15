<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="IntraMessenger.Web.Default" %>

<!DOCTYPE html>
<html lang="es">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>IntraMessenger</title>
    <link href="Content/app/app.css" rel="stylesheet" />
    <meta name="theme-color" content="#111719" />
</head>
<body class="shell-layout">
    <form id="form1" runat="server">
        <svg class="svg-symbols" aria-hidden="true" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <symbol id="icon-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></symbol>
                <symbol id="icon-back" viewBox="0 0 24 24"><path d="m15 19-7-7 7-7"></path></symbol>
                <symbol id="icon-close" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6l12 12"></path></symbol>
                <symbol id="icon-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></symbol>
                <symbol id="icon-send" viewBox="0 0 24 24"><path d="m22 2-9 20-3-9-8-4 20-7Z"></path><path d="m22 2-12 11"></path></symbol>
                <symbol id="icon-attach" viewBox="0 0 24 24"><path d="m15 7-7 7a2 2 0 0 0 3 3l7-7a4 4 0 0 0-6-6l-7 7a6 6 0 0 0 9 9l6-6"></path></symbol>
                <symbol id="icon-emoji" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"></path></symbol>
                <symbol id="icon-phone" viewBox="0 0 24 24"><path d="M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4c0 1-1 2-2 2A16 16 0 0 1 3 5c0-1 1-2 2-2Z"></path></symbol>
                <symbol id="icon-logo" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="1"></rect><path d="m3 6 9 7 9-7"></path></symbol>
                <symbol id="icon-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></symbol>
                <symbol id="icon-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"></circle><path d="M3 20v-2c0-3 2-5 6-5s6 2 6 5v2M16 5a3 3 0 0 1 0 6M17 13c3 0 4 2 4 5v2"></path></symbol>
                <symbol id="icon-star" viewBox="0 0 24 24"><path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"></path></symbol>
                <symbol id="icon-star-filled" viewBox="0 0 24 24"><path class="icon-fill" d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"></path></symbol>
                <symbol id="icon-sliders" viewBox="0 0 24 24"><path d="M4 7h6M14 7h6M4 17h10M18 17h2M10 4v6M14 14v6"></path></symbol>
                <symbol id="icon-chevron" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"></path></symbol>
                <symbol id="icon-lock" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="1"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></symbol>
                <symbol id="icon-network" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="5"></rect><rect x="3" y="16" width="6" height="5"></rect><rect x="15" y="16" width="6" height="5"></rect><path d="M12 8v4M6 16v-4h12v4"></path></symbol>
                <symbol id="icon-folder" viewBox="0 0 24 24"><path d="M3 6h7l2 2h9v12H3V6Z"></path></symbol>
                <symbol id="icon-message" viewBox="0 0 24 24"><path d="M3 4h18v13H9l-5 4v-4H3V4Z"></path></symbol>
                <symbol id="icon-grid" viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6"></rect><rect x="14" y="4" width="6" height="6"></rect><rect x="4" y="14" width="6" height="6"></rect><rect x="14" y="14" width="6" height="6"></rect></symbol>
            </defs>
        </svg>

        <a href="#main-content" class="skip-link">Saltar al contenido</a>

        <div class="deck-shell">
            <header class="deck-masthead">
                <div class="deck-screw" aria-hidden="true"></div>
                <div class="deck-brand"><strong>IntraMessenger</strong><span>// Network Deck 86</span></div>
                <div class="deck-local-state"><span class="led led-green" aria-hidden="true"></span><span>Local</span></div>
                <button type="button" id="btnDeckMenu" class="deck-key masthead-key" aria-label="Estado del equipo" aria-describedby="deckMenuHint">
                    <svg class="icon" aria-hidden="true"><use href="#icon-grid"></use></svg>
                </button>
                <span id="deckMenuHint" class="visually-hidden">Muestra el estado local de demostración</span>
            </header>

            <div class="app-layout" id="appLayout">
                <nav id="nav-panel" class="panel nav-panel" aria-label="Contactos">
                    <div class="module-label"><span>Selector de canales</span><span>CH-01</span></div>
                    <div class="nav-header">
                        <div class="product-identity">
                            <svg class="icon product-logo" aria-hidden="true"><use href="#icon-logo"></use></svg>
                            <div class="product-title-group"><span class="product-title">IntraMessenger</span><span class="product-subtitle">Vista local</span></div>
                        </div>

                        <div class="user-profile glass-plate">
                            <div class="avatar my-avatar online" aria-hidden="true">US</div>
                            <div class="user-info"><span class="user-name">Usuario Sesión</span><span id="currentStatusText" class="user-status-text">En línea</span></div>
                            <button type="button" id="btnStatusMenu" class="compact-key" aria-label="Cambiar estado local" aria-expanded="false" aria-controls="statusMenu">
                                <span class="led led-green" aria-hidden="true"></span><span>Cambiar</span>
                            </button>
                            <div id="statusMenu" class="status-menu popover-panel" hidden>
                                <button type="button" data-status="online"><span class="led led-green"></span>En línea</button>
                                <button type="button" data-status="busy"><span class="led led-red"></span>Ocupado</button>
                                <button type="button" data-status="away"><span class="led led-amber"></span>Ausente</button>
                            </div>
                        </div>

                        <label class="search-container glass-plate" for="searchInput">
                            <svg class="icon" aria-hidden="true"><use href="#icon-search"></use></svg>
                            <input type="search" id="searchInput" class="search-input" placeholder="Buscar persona o canal..." aria-label="Buscar contactos" />
                            <span class="search-code" aria-hidden="true">SCAN</span>
                        </label>

                        <div class="filter-bank" role="group" aria-label="Filtrar contactos">
                            <button type="button" class="filter-key is-active" data-filter="recent" aria-pressed="true"><svg class="icon" aria-hidden="true"><use href="#icon-clock"></use></svg><span>Recientes</span></button>
                            <button type="button" class="filter-key" data-filter="team" aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#icon-users"></use></svg><span>Equipo</span></button>
                            <button type="button" class="filter-key" data-filter="favorites" aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#icon-star"></use></svg><span>Favoritos</span></button>
                        </div>
                    </div>

                    <div class="contacts-list" id="contactsList" role="listbox" aria-label="Lista de contactos"></div>
                    <button type="button" id="btnViewSettings" class="deck-key nav-settings"><svg class="icon" aria-hidden="true"><use href="#icon-sliders"></use></svg><span>Configuración de vista</span></button>
                </nav>

                <main id="main-content" class="panel main-panel" role="main" aria-label="Conversación">
                    <header class="main-header metal-plate">
                        <button type="button" id="btnBackToContacts" class="deck-key icon-only btn-mobile-only" aria-label="Volver a contactos"><svg class="icon" aria-hidden="true"><use href="#icon-back"></use></svg></button>
                        <div class="active-contact-info" id="activeContactHeaderInfo"><div class="active-contact-placeholder">Selecciona un contacto</div></div>
                        <div class="main-actions">
                            <button type="button" id="btnHeaderSearch" class="deck-key icon-only" aria-label="Buscar persona"><svg class="icon" aria-hidden="true"><use href="#icon-search"></use></svg></button>
                            <button type="button" id="btnDemoCall" class="deck-key call-key"><svg class="icon" aria-hidden="true"><use href="#icon-phone"></use></svg><span>Llamada demo</span></button>
                            <button type="button" id="btnToggleContext" class="deck-key icon-only" aria-label="Ver detalles" aria-expanded="false" aria-controls="context-panel"><svg class="icon" aria-hidden="true"><use href="#icon-info"></use></svg></button>
                        </div>
                    </header>

                    <section class="conversation-area" id="conversationArea" aria-labelledby="readyTitle">
                        <div class="conversation-glass">
                            <div class="ready-copy">
                                <span class="technical-kicker">CH-01 · Estado local</span>
                                <h1 id="readyTitle">Canal preparado</h1>
                                <p>Enlace local listo para iniciar</p>
                            </div>

                            <div class="presence-meter" aria-label="Medidor decorativo de presencia; no representa tráfico real">
                                <div class="meter-heading"><span>Medidor de presencia</span><span>No representa tráfico</span></div>
                                <div class="meter-display">
                                    <div class="meter-scale" aria-hidden="true"><span>-30</span><span>-20</span><span>-10</span><span>0</span><span>+3</span></div>
                                    <div class="meter-bars" aria-hidden="true">
                                        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                                    </div>
                                    <div class="link-display"><span>Enlace</span><strong>Local listo</strong></div>
                                </div>
                            </div>

                            <div class="ready-actions" aria-label="Acciones locales">
                                <button type="button" id="btnFindPerson" class="action-module"><svg class="icon" aria-hidden="true"><use href="#icon-search"></use></svg><strong>Buscar persona</strong><span>Encuentra contactos en la vista local</span></button>
                                <button type="button" id="btnOpenFavorites" class="action-module"><svg class="icon" aria-hidden="true"><use href="#icon-star"></use></svg><strong>Abrir favoritos</strong><span>Accede a tus canales guardados</span></button>
                                <button type="button" id="btnCreateDemo" class="action-module action-amber"><svg class="icon" aria-hidden="true"><use href="#icon-users"></use></svg><strong>Crear canal demo</strong><span>Simulación local sin servidor</span></button>
                            </div>
                        </div>
                    </section>

                    <div class="composer-area" aria-label="Compositor de demostración">
                        <div class="composer-controls">
                            <button type="button" id="btnAttach" class="deck-key composer-key"><svg class="icon" aria-hidden="true"><use href="#icon-attach"></use></svg><span>Adjuntar</span></button>
                            <div class="emoji-wrap">
                                <button type="button" id="btnEmoji" class="deck-key composer-key" aria-expanded="false" aria-controls="emojiPanel"><svg class="icon" aria-hidden="true"><use href="#icon-emoji"></use></svg><span>Emoji</span></button>
                                <div id="emojiPanel" class="emoji-panel popover-panel" hidden aria-label="Emojis de demostración">
                                    <button type="button" data-emoji="🙂" aria-label="Insertar sonrisa">🙂</button><button type="button" data-emoji="👍" aria-label="Insertar pulgar arriba">👍</button><button type="button" data-emoji="✅" aria-label="Insertar marca de verificación">✅</button><button type="button" data-emoji="👋" aria-label="Insertar saludo">👋</button>
                                </div>
                            </div>
                            <div class="composer-input-container glass-plate">
                                <textarea id="composerInput" class="composer-input" rows="1" maxlength="500" placeholder="Escribe un mensaje..." aria-label="Mensaje"></textarea>
                                <span id="charCount" class="char-count" aria-live="polite">0 / 500</span>
                            </div>
                            <button type="button" id="btnSend" class="deck-key btn-send" aria-label="Enviar mensaje simulado" disabled><svg class="icon" aria-hidden="true"><use href="#icon-send"></use></svg><span>Enviar</span></button>
                        </div>
                        <span class="demo-caption">Demostración local · no se enviarán datos</span>
                    </div>
                </main>

                <div id="drawerOverlay" class="drawer-overlay" aria-hidden="true"></div>

                <aside id="context-panel" class="panel context-panel" aria-label="Detalles del contacto" aria-hidden="false">
                    <header class="context-header module-label"><h2>Análisis de contacto</h2><button type="button" id="btnCloseContext" class="deck-key icon-only btn-close-drawer" aria-label="Cerrar detalles"><svg class="icon" aria-hidden="true"><use href="#icon-close"></use></svg></button></header>
                    <div class="context-body" id="contextBody"><div class="context-placeholder">No hay contacto seleccionado</div></div>
                </aside>
            </div>

            <nav class="mobile-deck-nav" aria-label="Vistas principales">
                <button type="button" id="btnMobileContacts" class="mobile-view-key is-active" aria-pressed="true"><svg class="icon" aria-hidden="true"><use href="#icon-users"></use></svg><span>Contactos</span></button>
                <button type="button" id="btnMobileChat" class="mobile-view-key" aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#icon-message"></use></svg><span>Conversación</span></button>
                <button type="button" id="btnMobileDetails" class="mobile-view-key" aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#icon-info"></use></svg><span>Detalles</span></button>
            </nav>

            <footer class="status-bar" role="contentinfo">
                <div class="rack-grille" aria-hidden="true"></div>
                <div class="status-module"><span class="status-label">Intranet segura</span><span class="status-value"><svg class="icon" aria-hidden="true"><use href="#icon-lock"></use></svg>Conexión local protegida</span></div>
                <div class="status-module status-version"><span class="status-label">P1-T04</span><strong>Network Deck 86</strong></div>
                <div class="status-module"><span class="status-label">Interfaz local</span><span class="status-value"><svg class="icon" aria-hidden="true"><use href="#icon-network"></use></svg><asp:Label ID="lblStatus" runat="server" Text="Inicializando..."></asp:Label></span></div>
                <div class="status-level" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
            </footer>
        </div>

        <div id="demoCallOverlay" class="modal-overlay" aria-hidden="true" hidden>
            <section class="demo-modal metal-plate" role="dialog" aria-modal="true" aria-labelledby="demoCallTitle">
                <div class="modal-leds" aria-hidden="true"><span class="led led-green"></span><span class="led led-amber"></span></div>
                <span class="technical-kicker">Demostración local</span>
                <h2 id="demoCallTitle">Módulo de llamada</h2>
                <p>La llamada no se iniciará. La comunicación en tiempo real no forma parte de P1‑T04.</p>
                <button type="button" id="btnCloseCall" class="deck-key primary-key">Cerrar módulo</button>
            </section>
        </div>

        <div id="toastPanel" class="local-toast" role="status" aria-live="polite" aria-atomic="true" hidden></div>
        <div id="a11y-announcer" class="visually-hidden" aria-live="assertive" role="alert"></div>
    </form>
    <script src="Scripts/dist/app.js"></script>
</body>
</html>
