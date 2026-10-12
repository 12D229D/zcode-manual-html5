# Manual y Guía de ZCode

Manual web interactivo (HTML5 + CSS + JS vanilla) que documenta los **5 recursos de extensión de ZCode**: MCP, Skills, Slash Commands, Hooks y Plugins. Incluye pitfalls reales, flujos de diagnóstico y un asistente interactivo de diagnóstico.

---

## Cómo abrir el manual

No requiere ninguna instalación, build ni dependencias. Elige cualquiera de estas opciones:

### Opción A — Doble clic (más sencilla)

Abre `index.html` directamente en tu navegador (Chrome, Firefox, Edge). Funciona con el protocolo `file://`.

### Opción B — Servidor local (recomendada para evitar restricciones CORS)

```bash
# Desde la carpeta del proyecto
cd "C:/Users/IGD/Dropbox/Copias de seguridad/Codex/manual-zcode-html5"

# Con Python 3
python -m http.server 8000

# Luego abre en el navegador:
# http://localhost:8000
```

Con Node.js:
```bash
npx serve .
```

---

## Estructura del proyecto

```
manual-zcode-html5/
├── index.html          # SPA principal con las 9 secciones de contenido
├── css/
│   └── styles.css      # Sistema de diseño (dark/light, sidebar, pitfalls, wizard)
├── js/
│   └── app.js          # Lógica de navegación, búsqueda, progreso, copy y wizard
├── plan.md             # Plan y bitácora del proyecto
└── README.md           # Este archivo
```

---

## Navegación

El manual usa **hash routing** (SPA). Puedes navegar:

- Haciendo clic en el **sidebar** izquierdo
- Directamente con la URL: `index.html#mcp`, `index.html#skills`, etc.
- Usando el **buscador** del sidebar para filtrar secciones

Los 9 hash disponibles son:

| Hash | Sección |
|------|---------|
| `#inicio` | Inicio y Resumen |
| `#conceptos` | Conceptos y Scopes |
| `#mcp` | Servidores MCP |
| `#skills` | Skills |
| `#commands` | Slash Commands |
| `#hooks` | Hooks |
| `#plugins` | Plugins & Marketplaces |
| `#agents` | AGENTS.md |
| `#asistente` | Asistente de Diagnóstico |

---

## Funcionalidades

| Feature | Descripción |
|---------|-------------|
| 🌙 Modo claro/oscuro | Persiste en `localStorage` |
| 🔍 Buscador en vivo | Filtra secciones del sidebar |
| 📊 Progreso de lectura | Barra de % basada en secciones marcadas como leídas |
| 📋 Copiar código | Botón en cada bloque de código |
| 🩺 Asistente de diagnóstico | Wizard de 3 pasos: síntoma → scope → sospecha → resultado |
| 📱 Responsive | Sidebar colapsable en móvil (< 992px) |

---

## Fuente del contenido

El contenido se basa en los skills del plugin oficial `zcode-guide` (v0.1.0), ubicados en:

```
~/.zcode/cli/plugins/cache/zcode-plugins-official/zcode-guide/0.1.0/skills/
```

Esto garantiza que el manual documente comportamientos reales, con ubicaciones exactas de archivos, esquemas JSON verificados y pitfalls concretos (síntoma → causa → fix).
