<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="IntraMessenger.Web.Default" %>

<!DOCTYPE html>
<html lang="es">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>IntraMessenger</title>
    <link href="Content/app/app.css" rel="stylesheet" />
    <meta name="theme-color" content="#0d1117" />
</head>
<body class="theme-dark shell-layout">
    <form id="form1" runat="server">
        <svg aria-hidden="true" style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <symbol id="icon-search" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l6 6m-11-4a7 7 0 110-14 7 7 0 010 14z" />
                </symbol>
                <symbol id="icon-menu" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </symbol>
                <symbol id="icon-back" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </symbol>
                <symbol id="icon-close" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </symbol>
                <symbol id="icon-info" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </symbol>
                <symbol id="icon-send" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </symbol>
                <symbol id="icon-attach" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </symbol>
                <symbol id="icon-emoji" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </symbol>
                <symbol id="icon-phone" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </symbol>
                <symbol id="icon-logo" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 6l10 7 10-7" />
                </symbol>
            </defs>
        </svg>

        <a href="#main-content" class="skip-link">Saltar al contenido</a>

        <div class="app-layout" id="appLayout">
            <!-- Left Panel: Contacts Navigation -->
            <nav id="nav-panel" class="panel nav-panel" aria-label="Contactos">
                <header class="nav-header">
                    <div class="product-identity">
                        <svg class="icon product-logo" aria-hidden="true" focusable="false"><use href="#icon-logo"></use></svg>
                        <div class="product-title-group">
                            <span class="product-title">IntraMessenger</span>
                            <span class="product-subtitle">Vista local</span>
                        </div>
                    </div>

                    <div class="user-profile">
                        <div class="avatar my-avatar" aria-hidden="true">US</div>
                        <div class="user-info">
                            <span class="user-name">Usuario Sesión</span>
                            <span class="user-status-text text-green">Conectado</span>
                        </div>
                    </div>
                    <div class="search-container">
                        <svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-search"></use></svg>
                        <input type="search" id="searchInput" class="search-input" placeholder="Buscar contacto o área..." aria-label="Buscar contactos" />
                    </div>
                </header>
                <div class="contacts-list" id="contactsList" role="listbox" aria-label="Lista de contactos">
                    <!-- Contacts injected by JS -->
                </div>
            </nav>

            <!-- Center Panel: Conversation -->
            <main id="main-content" class="panel main-panel" role="main" aria-label="Conversación">
                <header class="main-header">
                    <button type="button" id="btnBackToContacts" class="icon-btn btn-mobile-only" aria-label="Volver a contactos">
                        <svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-back"></use></svg>
                    </button>
                    <div class="active-contact-info" id="activeContactHeaderInfo">
                        <!-- Populated by JS -->
                        <div class="active-contact-placeholder">Selecciona un contacto</div>
                    </div>
                    <div class="main-actions">
                        <button type="button" class="icon-btn" aria-label="Llamar (demostración)">
                            <svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-phone"></use></svg>
                        </button>
                        <button type="button" id="btnToggleContext" class="icon-btn" aria-label="Ver detalles" aria-expanded="false" aria-controls="context-panel">
                            <svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-info"></use></svg>
                        </button>
                    </div>
                </header>

                <div class="conversation-area" id="conversationArea">
                    <div class="empty-state terminal-style">
                        <div class="terminal-header">sys.msg_channel_ready</div>
                        <div class="terminal-body">
                            <p>> Canal preparado.</p>
                            <p>> Los mensajes aparecerán aquí cuando se conecte el servicio.</p>
                            <p class="demo-notice">[VISTA LOCAL - SIN CONEXIÓN AL SERVIDOR]</p>
                        </div>
                    </div>
                </div>

                <div class="composer-area">
                    <div class="composer-toolbar">
                        <button type="button" class="icon-btn" aria-label="Adjuntar archivo (demostración)">
                            <svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-attach"></use></svg>
                        </button>
                        <button type="button" class="icon-btn" aria-label="Insertar emoji (demostración)">
                            <svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-emoji"></use></svg>
                        </button>
                    </div>
                    <div class="composer-input-container">
                        <textarea id="composerInput" class="composer-input" rows="1" maxlength="500" placeholder="Escribe un mensaje..." aria-label="Mensaje"></textarea>
                        <button type="button" id="btnSend" class="icon-btn btn-send" aria-label="Enviar mensaje" disabled>
                            <svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-send"></use></svg>
                        </button>
                    </div>
                    <div class="composer-footer">
                        <span id="charCount" class="char-count" aria-live="polite">0 / 500</span>
                        <span class="demo-badge">Datos de demostración</span>
                    </div>
                </div>
            </main>

            <!-- Right Panel: Context / Contact Info -->
            <!-- Using an overlay for tablet/mobile drawer mode -->
            <div id="drawerOverlay" class="drawer-overlay" aria-hidden="true"></div>

            <aside id="context-panel" class="panel context-panel" aria-label="Detalles del contacto" aria-hidden="false">
                <header class="context-header">
                    <h2>Detalles</h2>
                    <button type="button" id="btnCloseContext" class="icon-btn btn-close-drawer" aria-label="Cerrar detalles">
                        <svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-close"></use></svg>
                    </button>
                </header>
                <div class="context-body" id="contextBody">
                    <!-- Populated by JS -->
                    <div class="context-placeholder">No hay contacto seleccionado</div>
                </div>
            </aside>
        </div>

        <!-- Bottom Status Bar -->
        <footer class="status-bar" role="contentinfo">
            <div class="status-left">
                <span class="status-indicator"></span>
                <span>Modo seguro (Intranet)</span>
            </div>
            <div class="status-center">
                <span>Versión Visual P1-T04</span>
            </div>
            <div class="status-right">
                <asp:Label ID="lblStatus" runat="server" Text="Inicializando..."></asp:Label>
            </div>
        </footer>

        <!-- Aria Live Region for announcements -->
        <div id="a11y-announcer" class="visually-hidden" aria-live="assertive" role="alert"></div>

    </form>
    <script src="Scripts/dist/app.js"></script>
</body>
</html>
