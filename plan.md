# Plan — Manual y Guía de ZCode (HTML5)

Proyecto web estático (HTML5 + CSS + JavaScript vanilla) que documenta **ZCode**: sus 5
recursos de extensión (MCP, Skills, Commands, Hooks, Plugins), las instrucciones
`AGENTS.md`, y un asistente interactivo de diagnóstico de configuración.

Todo el proyecto vive **dentro de esta carpeta** `manual-zcode-html5/`. Ningún archivo
del proyecto debe quedar suelto en el directorio padre.

## 🏗️ Arquitectura

- **Patrón**: SPA monolítica vanilla con enrutamiento por hash (`#sección`) y 9 doc-sections + wizard de diagnóstico.

## 🧠 Paradigma de Programación

- **Imperativo/Procedimental + Event-Driven**
- El router SPA, búsqueda, wizard de 3 pasos, copy-to-clipboard y progreso de lectura se implementan de forma **imperativa** con manipulación directa del DOM.
- La interacción es **event-driven** (hashchange, popstate, click, keydown).

---

## Estructura del proyecto

```
manual-zcode-html5/
├── index.html          # Página principal (SPA por secciones con hash routing)
├── css/
│   └── styles.css      # Sistema de diseño (dark/light, sidebar, callouts, pitfalls, wizard)
├── js/
│   └── app.js          # Navegación, búsqueda, progreso, copia de código, asistente
├── plan.md             # Este archivo
└── README.md           # Cómo abrir y navegar el manual
```

---

## Fuente del contenido

El contenido se basa en los skills oficiales del plugin `zcode-guide` (versión 0.1.0),
ubicados en:

```
~/.zcode/cli/plugins/cache/zcode-plugins-official/zcode-guide/0.1.0/skills/
├── zcode-configuration-guide/SKILL.md   # Mapa general: scopes, archivos, precedencia
├── diagnosing-mcp/SKILL.md              # MCP que no conecta / herramientas ausentes
├── diagnosing-skills/SKILL.md           # Skills no descubiertas / no disparan / sombreadas
├── diagnosing-commands/SKILL.md         # /command faltantes / sobrescritos / mal nombrados
├── diagnosing-hooks/SKILL.md            # Hooks que no disparan / bloquean sesión
└── diagnosing-plugins/SKILL.md          # Plugins no listados / instalación fallida
```

Esto garantiza que el manual documente comportamientos reales y verificados, no
supuestos: ubicaciones exactas de archivos, esquemas JSON, orden de precedencia y
pitfalls concretos (síntoma → causa → fix).

---

## Secciones del manual (9 doc-sections en index.html)

| # | id            | Título                              | Contenido clave                                                              |
|---|---------------|-------------------------------------|------------------------------------------------------------------------------|
| 01| `inicio`      | Inicio y Resumen                    | Qué es ZCode, los 5 recursos, cómo usar el manual, visión general            |
| 02| `conceptos`  | Conceptos y Scopes                   | User vs Workspace, archivos de config, orden de descubrimiento, precedencia  |
| 03| `mcp`         | Servidores MCP                       | Ubicaciones, esquema, auto-connect, pitfalls (14), workflow de localización  |
| 04| `skills`      | Skills                               | Descubrimiento, SKILL.md, triggering vs loading, pitfalls (12), workflow    |
| 05| `commands`    | Slash Commands                       | Discovery order, deduplicación, formato .md, pitfalls (12), workflow         |
| 06| `hooks`       | Hooks                                | 7 eventos, matchers, command vs process, pitfalls (12), workflow            |
| 07| `plugins`     | Plugins & Marketplaces                | Ciclo de vida, manifest, gestión en cliente, pitfalls (11), workflow         |
| 08| `agents`      | AGENTS.md & Instrucciones            | Scopes, merge order, migración, /init                                        |
| 09| `asistente`   | Asistente de Diagnóstico (Wizard)    | 3 pasos: síntoma → scope → sospecha → resultado con skill + fixes            |

Adicional: bloque de FAQ rápida (¿dónde vivo?, ¿user vs workspace?, ¿`${...}`?).

---

##_features de la UI (ya implementadas en css/js)

- [x] Sidebar con buscador en vivo y barra de progreso de lectura
- [x] Navegación SPA con `#hash` y soporte back/forward (`popstate`)
- [x] Modo claro/oscuro persistente (`localStorage`)
- [x] Copia de bloques de código al portapapeles
- [x] Sección "marcar como leída" por sección → recalcula el % de progreso
- [x] Asistente interactivo ("Doctor de configuración ZCode") de 3 pasos
- [x] Componentes visuales especiales para este contenido:
  - `table.ref-table` — tablas de referencia (scopes, eventos, schemas)
  - `.pitfall-list` / `.pitfall` — bloques numerados síntoma→causa→fix
  - `.path-tree` — árbol de rutas de archivos con colores por scope
  - `.callout` (info/warning/success/danger) — avisos
- [x] Responsive: sidebar colapsable en móvil (< 992px)

---

## Estado actual

- [x] Carpeta del proyecto creada: `manual-zcode-html5/`
- [x] `css/styles.css` — completo (sistema de diseño + componentes especiales)
- [x] `js/app.js` — completo (navegación, búsqueda, progreso, copia, wizard)
- [x] `plan.md` — este archivo
- [x] `index.html` — completo (9 secciones con todo el contenido, wizard de diagnóstico)
- [x] `README.md` — completo (instrucciones de apertura, tabla de hashes, features)

### ✅ Implementación completada — 2026-07-27

1. **`index.html`** — implementado:
   - `<head>` con fonts Inter + Fira Code y `<link>` a `css/styles.css`
   - Sidebar con 9 `nav-item` agrupados en 4 grupos
   - 9 `doc-section` con contenido completo (tablas, pitfalls, árboles de rutas, callouts)
   - Wizard de diagnóstico con 3 `.wizard-step` y tarjeta de resultado
   - Estilos complementarios inline para elementos no cubiertos en el CSS original
2. **`README.md`** — implementado:
   - Instrucciones de apertura (doble clic + servidor local)
   - Tabla de hashes de navegación
   - Descripción de estructura y features

---

## Cómo abrirlo (sin build, sin dependencias)

Es HTML/CSS/JS 100% estático y sin dependencias. Cualquiera de estas vale:

```bash
# Opción A: doble clic en index.html (file://)
# Opción B: servidor estático desde la carpeta del proyecto
cd "C:/Users/IGD/Dropbox/Copias de seguridad/Codex/manual-zcode-html5"
python -m http.server 8000
# luego abre http://localhost:8000
```

Navegación: clics en el sidebar o vía URL con `#inicio`, `#mcp`, `#hooks`, etc.
El progreso y el tema se guardan en `localStorage`.

---

## Convenciones / decisiones de diseño

- **Idioma**: español (igual que el resto de manuales del workspace:
  `manual-frontend-html5`, `git-manual-html5`, etc.).
- **Diseño**: se reutiliza el sistema visual del `manual-frontend-html5` con estos
  retoques: brand con gradiente violeta→cian, nuevos componentes `.pitfall` y
  `.path-tree` para representar los flujos de diagnóstico y las rutas de archivos.
- **Sin frameworks ni bundlers**:诉求 vanilla, cero `node_modules`, cero build step.
- **Accesibilidad básica**: `lang="es"`, `aria-label` en el botón móvil, contraste
  suficiente en ambos temas.

---

## Próximos pasos sugeridos (post-entrega)

- Validación cruzada del contenido: releer cada sección contra el SKILL.md original
  para que no quede nada desactualizado.
- Capturas o diagramas del cliente ZCode (Settings → MCP, /, Skills, Plugin
  Management) cuando estén disponibles.
- Sección de “chuleta rápida” imprimible (una sola página con los 7 eventos de hook,
  el schema de mcp.servers, el orden de discovery, etc.).

---

## 🌐 Propósito de Visibilidad y Destino Remoto

- **Visibilidad**: Público (Open Source / Portafolio).
- **Plataforma Remota Asignada**: GitHub.
- **Plataforma de Despliegue CI/CD**: GitHub Pages / Cloudflare Pages.
- **Justificación**: Manual de referencia y diagnóstico interactivo para la herramienta de agentes ZCode y sus extensiones; idóneo para GitHub Pages.

---

## 📊 Estado Actual

🟢 **Completado** — Entregable funcional y verificado.
