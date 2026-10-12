/**
 * Manual y Guía de ZCode - Script Principal
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initSearch();
    initCodeCopy();
    initProgressTracking();
    initDiagnosticWizard();
    initMobileMenu();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    const savedTheme = localStorage.getItem('zcode_guide_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('zcode_guide_theme', newTheme);
            updateThemeUI(newTheme);
        });
    }

    function updateThemeUI(theme) {
        if (themeIcon && themeText) {
            if (theme === 'dark') {
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Modo Oscuro';
            } else {
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Modo Claro';
            }
        }
    }
}

/* ==========================================================================
   2. Navigation & SPA Routing via Hash
   ========================================================================== */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.doc-section');
    const currentCrumb = document.getElementById('current-crumb');

    function activateSection(targetId, updateHash = true) {
        if (!targetId) targetId = 'inicio';

        sections.forEach(sec => sec.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('active'));

        const targetSection = document.getElementById(targetId);
        const targetNavItem = document.querySelector(`.nav-item[data-target="${targetId}"]`);

        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (targetNavItem) {
                targetNavItem.classList.add('active');
                if (currentCrumb) {
                    currentCrumb.textContent = targetNavItem.querySelector('.nav-text')?.textContent || targetId;
                }
            }

            if (updateHash) {
                history.pushState(null, null, `#${targetId}`);
            }

            saveProgress(targetId);
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            activateSection(target);
            document.querySelector('.sidebar')?.classList.remove('mobile-open');
        });
    });

    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '');
        activateSection(hash || 'inicio', false);
    });

    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
        activateSection(initialHash, false);
    } else {
        activateSection('inicio', false);
    }
}

/* ==========================================================================
   3. Real-time Search Filter
   ========================================================================== */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const navGroups = document.querySelectorAll('.nav-group');
    const navItems = document.querySelectorAll('.nav-item');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        navItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const matches = text.includes(query);
            item.style.display = matches ? 'flex' : 'none';
        });

        navGroups.forEach(group => {
            const visibleChildren = group.querySelectorAll('.nav-item[style*="display: flex"], .nav-item:not([style*="display"])');
            const hasVisible = Array.from(visibleChildren).some(child => child.style.display !== 'none');
            group.style.display = hasVisible ? 'block' : 'none';
        });
    });
}

/* ==========================================================================
   4. Code Copy to Clipboard
   ========================================================================== */
function initCodeCopy() {
    const copyBtns = document.querySelectorAll('.copy-btn');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const wrapper = btn.closest('.code-wrapper');
            const codeBlock = wrapper ? wrapper.querySelector('code') : null;

            if (codeBlock) {
                try {
                    await navigator.clipboard.writeText(codeBlock.innerText);
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '✓ ¡Copiado!';
                    btn.style.backgroundColor = 'var(--accent-emerald)';
                    btn.style.color = '#fff';

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                    }, 2000);
                } catch (err) {
                    btn.textContent = '❌ Error';
                }
            }
        });
    });
}

/* ==========================================================================
   5. Reading Progress Tracking
   ========================================================================== */
const TOTAL_SECTIONS = 9;

function saveProgress(sectionId) {
    if (sectionId === 'inicio') return;

    let readSections = JSON.parse(localStorage.getItem('zcode_read_sections')) || [];
    if (!readSections.includes(sectionId)) {
        readSections.push(sectionId);
        localStorage.setItem('zcode_read_sections', JSON.stringify(readSections));
    }
    updateProgressUI(readSections);
}

function initProgressTracking() {
    const readSections = JSON.parse(localStorage.getItem('zcode_read_sections')) || [];
    updateProgressUI(readSections);

    const completionBtns = document.querySelectorAll('.completion-btn');
    completionBtns.forEach(btn => {
        const sectionId = btn.getAttribute('data-section');
        if (readSections.includes(sectionId)) {
            setBtnCompleted(btn);
        }

        btn.addEventListener('click', () => {
            let currentRead = JSON.parse(localStorage.getItem('zcode_read_sections')) || [];
            if (!currentRead.includes(sectionId)) {
                currentRead.push(sectionId);
                localStorage.setItem('zcode_read_sections', JSON.stringify(currentRead));
                setBtnCompleted(btn);
                updateProgressUI(currentRead);
            }
        });
    });
}

function setBtnCompleted(btn) {
    btn.classList.add('completed');
    btn.innerHTML = '✓ Sección Leída y Completada';
}

function updateProgressUI(readSections) {
    const valElem = document.getElementById('progress-val');
    const fillElem = document.getElementById('progress-fill');

    if (valElem && fillElem) {
        const percent = Math.min(Math.round((readSections.length / TOTAL_SECTIONS) * 100), 100);
        valElem.textContent = `${percent}%`;
        fillElem.style.width = `${percent}%`;
    }
}

/* ==========================================================================
   6. Interactive Diagnostic Wizard (ZCode "Doctor")
   ==========================================================================
   Pregunta el síntoma, el recurso afectado y la sospecha de causa.
   Devuelve el skill de diagnóstico a cargar + el archivo y campo a editar.
*/
function initDiagnosticWizard() {
    const wizardState = {
        symptom: null,    // tipo de problema
        scope: null,      // user vs workspace
        suspect: null     // pista de causa
    };

    let currentStep = 1;
    const totalSteps = 3;

    const stepDots = document.querySelectorAll('.step-dot');
    const wizardSteps = document.querySelectorAll('.wizard-step');

    document.querySelectorAll('.wizard-step .option-card').forEach(card => {
        card.addEventListener('click', () => {
            const step = card.closest('.wizard-step');
            const key = step.getAttribute('data-wizard-key');
            const val = card.getAttribute('data-value');

            step.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            wizardState[key] = val;

            const nextBtn = step.querySelector('.btn-next');
            if (nextBtn) nextBtn.disabled = false;
        });
    });

    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                goToStep(currentStep + 1);
            } else if (currentStep === totalSteps) {
                calculateAndShowResult();
            }
        });
    });

    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) goToStep(currentStep - 1);
        });
    });

    const resetBtn = document.getElementById('reset-wizard-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            Object.keys(wizardState).forEach(k => wizardState[k] = null);
            document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            document.querySelectorAll('.btn-next').forEach(b => b.disabled = true);

            const result = document.getElementById('wizard-result');
            if (result) result.style.display = 'none';
            goToStep(1);
        });
    }

    function goToStep(stepNum) {
        currentStep = stepNum;

        wizardSteps.forEach(s => s.classList.remove('active'));
        const activeStep = document.querySelector(`.wizard-step[data-step="${stepNum}"]`);
        if (activeStep) activeStep.classList.add('active');

        stepDots.forEach((dot, idx) => {
            const dStep = idx + 1;
            dot.classList.remove('active', 'completed');
            if (dStep === currentStep) {
                dot.classList.add('active');
                dot.textContent = dStep;
            } else if (dStep < currentStep) {
                dot.classList.add('completed');
                dot.textContent = '✓';
            } else {
                dot.textContent = dStep;
            }
        });
    }

    function calculateAndShowResult() {
        const { symptom, scope, suspect } = wizardState;

        // Resolver recurso + skill de diagnóstico a partir del síntoma
        let skill = '';
        let resource = '';
        let title = '';
        let rationale = '';
        let fixes = [];

        switch (symptom) {
            case 'mcp':
                skill = 'diagnosing-mcp';
                resource = 'MCP';
                title = 'Servidor MCP que no conecta o cuyas herramientas desaparecen';
                rationale = 'Casi siempre es HTTP que el campo malformado (command como array, environment vs env) o una clave desconocida que hace que el servidor sea descartado silenciosamente.';
                fixes.push('Abre <strong>Settings → MCP</strong> y lee el estado: <code>failed</code>, <code>disabled</code> o ausente.');
                fixes.push('Verifica JSON válido en <code>~/.zcode/cli/config.json</code> y <code><repo>/.zcode/config.json</code> → <code>mcp.servers</code>.');
                fixes.push('Asegúrate de que <code>command</code> sea un string y <code>args</code> un array (no el estilo OpenCode <code>command: ["npx", "..."]</code>).');
                fixes.push('Usa <code>env</code> (no <code>environment</code>) y <code>headers</code> (no <code>http_headers</code>). Una clave desconocida descarta el servidor.');
                if (suspect === 'template') {
                    fixes.push('Las variables <code>${...}</code> solo se expanden en servidores MCP de plugins; en archivos de configuración usa rutas absolutas.');
                }
                if (suspect === 'timeout') {
                    fixes.push('Sube <code>"timeoutMs": 60000</code> en esa entrada del servidor.');
                }
                break;

            case 'skill':
                skill = 'diagnosing-skills';
                resource = 'Skill';
                title = 'Una skill no se descubre, no dispara o está sombreada';
                rationale = 'Una skill "cargar" y una skill "disparar" son dos cosas distintas. Lo más común: una <code>description</code> débil o vacía, o una skill del mismo nombre con mayor precedencia que sombra la tuya.';
                fixes.push('Verifica en <strong>Settings → Skills</strong> y el menú <strong>/</strong> si aparece.');
                fixes.push('Revisa el orden de descubrimiento: user > workspace > plugin; <code>.zcode</code> antes que <code>.agents</code> dentro de cada nivel.');
                fixes.push('Confirma que <code>SKILL.md</code> tenga frontmatter con <code>name</code> y un <code>description</code> de menos de 1024 caracteres.');
                if (suspect === 'trigger') {
                    fixes.push('Carga el wording de disparo en los primeros ~250 caracteres de <code>description</code>; no hay keyword matcher, el modelo decide.');
                }
                break;

            case 'command':
                skill = 'diagnosing-commands';
                resource = 'Command';
                title = 'Un /command no aparece o ejecuta el contenido equivocado';
                rationale = 'El nombre del comando es el nombre del archivo .md, los subdirectorios se unen con <strong>dos puntos</strong> (no slash), y el primer match en orden de descubrimiento gana.';
                fixes.push('El nombre del archivo debe cumplir <code>^[a-z0-9][a-z0-9_:-]{0,63}$</code> (sin mayúsculas, espacios ni puntos).');
                fixes.push('Subdirectorios → <code>review/code.md</code> se invoca como <code>/review:code</code>, no <code>/review/code</code>.');
                fixes.push('Una <code>description</code> o un cuerpo no vacío son obligatorios; si no, el comando se descarta.');
                if (suspect === 'placeholder') {
                    fixes.push('Usa los tokens exactos <code>$ARGUMENTS</code> y <code>$1</code>/<code>$2</code>; <code>${ARGUMENTS}</code> no se reconoce.');
                }
                break;

            case 'hook':
                skill = 'diagnosing-hooks';
                resource = 'Hook';
                title = 'Un hook no se dispara o bloquea la sesión de golpe';
                rationale = 'Los hooks de archivo de configuración están deshabilitados por defecto; hay que poner <code>hooks.enabled: true</code>. Y el matcher区分 mayúsculas: <code>"bash"</code> no casa con <code>Bash</code>.';
                fixes.push('Confirma <code>"hooks": { "enabled": true, ... }</code> en el config (o que algún plugin aporte un hook; entonces el runner se activa solo).');
                fixes.push('Usa exactamente uno de los 7 eventos: SessionStart, UserPromptSubmit, PreToolUse, PermissionRequest, PostToolUse, PostToolUseFailure, Stop.');
                fixes.push('El matcher es una regex sensible a mayúsculas contra el nombre de herramienta (<code>Bash</code>, <code>Edit</code>...). Omítelo para casar todo.');
                if (suspect === 'timeout') {
                    fixes.push('Ojo con las unidades: <code>timeout</code> va en <strong>segundos</strong> (command) y <code>timeoutMs</code> en <strong>milisegundos</strong> (process). <code>timeout: 500</code> = 500 segundos.');
                }
                break;

            case 'plugin':
                skill = 'diagnosing-plugins';
                resource = 'Plugin';
                title = 'Un plugin no aparece o sus skills/commands no están disponibles';
                rationale = 'El subsistema vive en <strong>Settings → Plugin Management</strong>. Marketplace nunca añadido, plugin deshabilitado o una ruta de componente que escapa del root son las causas top.';
                fixes.push('Comprueba que <code>plugins.enabled</code> no sea <code>false</code> en <code>~/.zcode/cli/config.json</code>.');
                fixes.push('En el tab <strong>Installed</strong> confirma que está habilitado; abre la vista de detalle para ver componentes y warnings.');
                fixes.push('Si el clone falla con <code>RPC failed</code>/<code>timed out</code>, pon <code>ZCODE_HTTP_PROXY=http://host:port</code> (no se lee <code>http_proxy</code> suelto).');
                fixes.push('Una <code>userConfig</code> con <code>sensitive: true</code> no se puede introducir hoy en la UI: quítalo o usa una variable de entorno.');
                break;

            default:
                skill = 'zcode-configuration-guide';
                resource = 'General';
                title = 'Problema de configuración de ZCode';
                rationale = 'El skill de configuración es el mapa: te dice dónde vive cada recurso y cómo se resuelven conflictos.';
                fixes.push('Revisa el skill <strong>zcode-configuration-guide</strong> para ubicar el archivo y campo correcto.');
        }

        // Ajuste del scope
        let scopeNote = '';
        if (scope === 'user') {
            scopeNote = 'Para algo personal que aplique en todos los workspaces, edita el archivo de <strong>user scope</strong>.';
            if (resource === 'MCP' || resource === 'Hook' || resource === 'Plugin') {
                fixes.push('Archivo: <code>~/.zcode/cli/config.json</code> (key anidada <code>mcp.servers</code> / <code>hooks</code> / <code>plugins</code>).');
            } else {
                fixes.push('Directorio: <code>~/.zcode/skills/</code> o <code>~/.zcode/commands/</code>.');
            }
        } else if (scope === 'workspace') {
            scopeNote = 'Para algo versionado con el repo y compartido con el equipo, edita el <strong>workspace scope</strong>.';
            fixes.push('Archivo: <code><repo>/.zcode/config.json</code> (o <code>zcode.json</code>). Fallback de compatibilidad: <code><repo>/.agents/mcp.json</code> solo si el <code>.zcode</code> de ese scope no define MCP.');
        } else if (scope === 'shared') {
            scopeNote = 'Para skills compartidas entre Claude, Codex y Cursor, usa <code>~/.agents/skills/</code>; para sobreescribir solo dentro de ZCode, usa <code>.zcode/skills/</code>.';
        }

        // Llenar UI
        document.getElementById('rec-title').textContent = title;
        document.getElementById('rec-skill').textContent = skill;
        document.getElementById('rec-resource').textContent = resource;
        document.getElementById('rec-rationale').innerHTML = rationale + ' ' + scopeNote;

        const fixList = document.getElementById('rec-fix-list');
        fixList.innerHTML = '';
        // de-duplicar manteniendo orden
        const seen = new Set();
        fixes.forEach(f => {
            if (seen.has(f)) return;
            seen.add(f);
            const li = document.createElement('li');
            li.innerHTML = f;
            fixList.appendChild(li);
        });

        // Tags
        const tags = document.getElementById('rec-tags');
        tags.innerHTML = '';
        [`${resource}`, skill, scope ? `scope: ${scope}` : ''].filter(Boolean).forEach(t => {
            const span = document.createElement('span');
            span.className = 'rec-tag';
            span.textContent = t;
            tags.appendChild(span);
        });

        wizardSteps.forEach(s => s.classList.remove('active'));
        const resultCard = document.getElementById('wizard-result');
        if (resultCard) resultCard.style.display = 'block';
    }
}

/* ==========================================================================
   7. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle-btn');
    const sidebar = document.querySelector('.sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }
}
