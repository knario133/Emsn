# Seguridad

## Controles obligatorios

- HTTPS;
- Windows Authentication;
- autorización por conversación;
- CSRF para mutaciones;
- CSP estricta;
- sanitización de Markdown;
- rate limits;
- límites de payload;
- secretos fuera del repositorio;
- no cachear mensajes en el service worker;
- logs sin contenido de mensajes;
- auditoría de administración, archivos y zumbidos.

## Regla de archivos

El flujo P2P registra metadatos, no contenido. Cualquier fallback temporal requiere una decisión arquitectónica y controles adicionales.
