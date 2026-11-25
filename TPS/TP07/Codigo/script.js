"use strict";

    const AlmacenEstudio = (() => {
      const STORAGE_KEY = "estudia_data_v1";
      const THEME_STORAGE_KEY = "estudia_theme_v1";
      const ESTADOS_VALIDOS = ["pendiente", "en_progreso", "dominado"];
      const TEMAS_VALIDOS = ["light", "dark"];
      const COLORES_PREDEFINIDOS = [
        "#2563eb",
        "#7c3aed",
        "#059669",
        "#d97706",
        "#dc2626",
        "#0891b2",
        "#db2777",
        "#475569"
      ];

      let estadoInterno = {
        materias: []
      };
      let temaActual = "light";
      let almacenamientoDisponible = true;

      function generarId(prefijo = "id") {
        return `${prefijo}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      }

      function sanearTema(temaRaw) {
        if (!temaRaw || typeof temaRaw !== "object") return null;
        const titulo = typeof temaRaw.titulo === "string" ? temaRaw.titulo.trim() : "";
        if (!titulo) return null;

        return {
          id: typeof temaRaw.id === "string" && temaRaw.id ? temaRaw.id : generarId("tem"),
          titulo: titulo.slice(0, 120),
          descripcion: typeof temaRaw.descripcion === "string" ? temaRaw.descripcion.slice(0, 600) : "",
          estado: ESTADOS_VALIDOS.includes(temaRaw.estado) ? temaRaw.estado : "pendiente",
          favorito: Boolean(temaRaw.favorito)
        };
      }

      function sanearMateria(materiaRaw) {
        if (!materiaRaw || typeof materiaRaw !== "object") return null;
        const nombre = typeof materiaRaw.nombre === "string" ? materiaRaw.nombre.trim() : "";
        if (!nombre) return null;

        const colorValido = typeof materiaRaw.color === "string" && /^#[0-9A-Fa-f]{6}$/.test(materiaRaw.color)
          ? materiaRaw.color
          : COLORES_PREDEFINIDOS[0];

        const fechaValida = typeof materiaRaw.fechaExamen === "string" && /^\d{4}-\d{2}-\d{2}$/.test(materiaRaw.fechaExamen)
          ? materiaRaw.fechaExamen
          : "";

        const temasSaneados = Array.isArray(materiaRaw.temas)
          ? materiaRaw.temas.map(sanearTema).filter(Boolean)
          : [];

        return {
          id: typeof materiaRaw.id === "string" && materiaRaw.id ? materiaRaw.id : generarId("mat"),
          nombre: nombre.slice(0, 80),
          color: colorValido,
          fechaExamen: fechaValida,
          temas: temasSaneados
        };
      }

      function inicializarTema() {
        try {
          const temaGuardado = window.localStorage.getItem(THEME_STORAGE_KEY);
          if (TEMAS_VALIDOS.includes(temaGuardado)) {
            temaActual = temaGuardado;
            return temaActual;
          }
          if (temaGuardado !== null) {
            window.localStorage.removeItem(THEME_STORAGE_KEY);
          }
        } catch (_) {
          almacenamientoDisponible = false;
        }

        const prefiereOscuro = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        temaActual = prefiereOscuro ? "dark" : "light";
        return temaActual;
      }

      function obtenerTema() {
        return temaActual;
      }

      function establecerTema(nuevoTema) {
        if (!TEMAS_VALIDOS.includes(nuevoTema)) return temaActual;
        temaActual = nuevoTema;
        if (almacenamientoDisponible) {
          try {
            window.localStorage.setItem(THEME_STORAGE_KEY, temaActual);
          } catch (_) {
            almacenamientoDisponible = false;
          }
        }
        return temaActual;
      }

      function inicializar() {
        inicializarTema();
        try {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (!raw) {
            estadoInterno = { materias: [] };
            return { recuperadoDeError: false };
          }

          const parsed = JSON.parse(raw);
          if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.materias)) {
            throw new Error("Esquema JSON inválido en localStorage");
          }

          estadoInterno = {
            materias: parsed.materias.map(sanearMateria).filter(Boolean)
          };
          return { recuperadoDeError: false };
        } catch (error) {
          console.warn("EstudIA: Se detectaron datos corruptos o localStorage inaccesible. Reiniciando estado seguro.", error);
          estadoInterno = { materias: [] };
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(estadoInterno));
          } catch (_) {
            almacenamientoDisponible = false;
          }
          return {
            recuperadoDeError: true,
            mensaje: almacenamientoDisponible
              ? "Se restauró el almacenamiento porque los datos guardados estaban dañados."
              : "El almacenamiento local está deshabilitado; los cambios solo durarán esta sesión."
          };
        }
      }

      function guardar() {
        if (!almacenamientoDisponible) return false;
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(estadoInterno));
          return true;
        } catch (error) {
          console.error("EstudIA: Error al guardar en localStorage:", error);
          return false;
        }
      }

      function cargarDatosEjemplo() {
        const hoy = new Date();
        const sumarDias = (dias) => {
          const d = new Date(hoy);
          d.setDate(d.getDate() + dias);
          return d.toISOString().split("T")[0];
        };

        const ejemplos = [
          {
            id: generarId("mat"),
            nombre: "Algoritmos y Estructuras de Datos",
            color: "#2563eb",
            fechaExamen: sumarDias(5),
            temas: [
              {
                id: generarId("tem"),
                titulo: "Complejidad Temporal y Notación Big-O",
                descripcion: "Análisis de peor caso, caso promedio y teorema maestro para recurrencias.",
                estado: "dominado",
                favorito: true
              },
              {
                id: generarId("tem"),
                titulo: "Árboles Binarios de Búsqueda y AVL",
                descripcion: "Rotaciones simples y dobles, factor de equilibrio e inserción.",
                estado: "dominado",
                favorito: false
              },
              {
                id: generarId("tem"),
                titulo: "Grafos: Dijkstra y BFS/DFS",
                descripcion: "Repasar implementación con cola de prioridad y detección de ciclos.",
                estado: "en_progreso",
                favorito: true
              },
              {
                id: generarId("tem"),
                titulo: "Programación Dinámica",
                descripcion: "Resolver problemas clásicos: mochila 0/1 y subsecuencia común más larga.",
                estado: "pendiente",
                favorito: false
              }
            ]
          },
          {
            id: generarId("mat"),
            nombre: "Física II — Electromagnetismo",
            color: "#059669",
            fechaExamen: sumarDias(18),
            temas: [
              {
                id: generarId("tem"),
                titulo: "Ley de Gauss y Campo Eléctrico",
                descripcion: "Simetrías esféricas, cilíndricas y planas.",
                estado: "dominado",
                favorito: false
              },
              {
                id: generarId("tem"),
                titulo: "Circuitos de Corriente Continua y Leyes de Kirchhoff",
                descripcion: "Practicar mallas y carga/descarga de capacitores RC.",
                estado: "en_progreso",
                favorito: true
              },
              {
                id: generarId("tem"),
                titulo: "Inducción Electromagnética y Ley de Faraday",
                descripcion: "Flujo magnético variable y Ley de Lenz.",
                estado: "pendiente",
                favorito: false
              }
            ]
          },
          {
            id: generarId("mat"),
            nombre: "Historia Contemporánea",
            color: "#d97706",
            fechaExamen: "",
            temas: [
              {
                id: generarId("tem"),
                titulo: "Revolución Industrial y transformaciones sociales",
                descripcion: "Lectura obligatoria capítulos 1 al 4 de Hobsbawm.",
                estado: "dominado",
                favorito: false
              },
              {
                id: generarId("tem"),
                titulo: "Guerra Fría y descolonización",
                descripcion: "Conferencia de Bandung y crisis de los misiles.",
                estado: "dominado",
                favorito: true
              }
            ]
          }
        ];

        estadoInterno.materias = [...estadoInterno.materias, ...ejemplos];
        guardar();
      }

      function obtenerMaterias() {
        return estadoInterno.materias.map(m => ({
          ...m,
          temas: m.temas.map(t => ({ ...t }))
        }));
      }

      function obtenerMateriaPorId(materiaId) {
        const materia = estadoInterno.materias.find(m => m.id === materiaId);
        if (!materia) return null;
        return {
          ...materia,
          temas: materia.temas.map(t => ({ ...t }))
        };
      }

      function crearMateria({ nombre, color, fechaExamen }) {
        const nueva = sanearMateria({
          id: generarId("mat"),
          nombre,
          color,
          fechaExamen,
          temas: []
        });
        if (!nueva) return null;
        estadoInterno.materias.push(nueva);
        guardar();
        return nueva;
      }

      function actualizarMateria(materiaId, { nombre, color, fechaExamen }) {
        const indice = estadoInterno.materias.findIndex(m => m.id === materiaId);
        if (indice === -1) return null;

        const actual = estadoInterno.materias[indice];
        const actualizada = sanearMateria({
          ...actual,
          nombre: nombre !== undefined ? nombre : actual.nombre,
          color: color !== undefined ? color : actual.color,
          fechaExamen: fechaExamen !== undefined ? fechaExamen : actual.fechaExamen
        });

        if (!actualizada) return null;
        estadoInterno.materias[indice] = actualizada;
        guardar();
        return actualizada;
      }

      function eliminarMateria(materiaId) {
        const longitudInicial = estadoInterno.materias.length;
        estadoInterno.materias = estadoInterno.materias.filter(m => m.id !== materiaId);
        if (estadoInterno.materias.length !== longitudInicial) {
          guardar();
          return true;
        }
        return false;
      }

      function crearTema(materiaId, { titulo, descripcion, estado, favorito }) {
        const materia = estadoInterno.materias.find(m => m.id === materiaId);
        if (!materia) return null;

        const nuevoTema = sanearTema({
          id: generarId("tem"),
          titulo,
          descripcion,
          estado,
          favorito
        });
        if (!nuevoTema) return null;

        materia.temas.push(nuevoTema);
        guardar();
        return nuevoTema;
      }

      function actualizarTema(materiaId, temaId, cambios) {
        const materia = estadoInterno.materias.find(m => m.id === materiaId);
        if (!materia) return null;

        const indiceTema = materia.temas.findIndex(t => t.id === temaId);
        if (indiceTema === -1) return null;

        const temaActual = materia.temas[indiceTema];
        const temaActualizado = sanearTema({
          ...temaActual,
          ...cambios
        });
        if (!temaActualizado) return null;

        materia.temas[indiceTema] = temaActualizado;
        guardar();
        return temaActualizado;
      }

      function eliminarTema(materiaId, temaId) {
        const materia = estadoInterno.materias.find(m => m.id === materiaId);
        if (!materia) return false;

        const lenInicial = materia.temas.length;
        materia.temas = materia.temas.filter(t => t.id !== temaId);
        if (materia.temas.length !== lenInicial) {
          guardar();
          return true;
        }
        return false;
      }

      function calcularProgresoMateria(materia) {
        const total = materia.temas.length;
        const dominados = materia.temas.filter(t => t.estado === "dominado").length;
        const porcentaje = total === 0 ? 0 : Math.round((dominados / total) * 100);
        return { total, dominados, porcentaje };
      }

      function calcularResumenGlobal() {
        const materias = estadoInterno.materias;
        const totalMaterias = materias.length;
        let totalTemas = 0;
        let temasDominados = 0;
        let examenesProximos = 0;

        materias.forEach(m => {
          totalTemas += m.temas.length;
          temasDominados += m.temas.filter(t => t.estado === "dominado").length;
          const infoFecha = calcularDiasExamen(m.fechaExamen);
          if (infoFecha && infoFecha.diasRestantes >= 0 && infoFecha.diasRestantes <= 14) {
            examenesProximos++;
          }
        });

        const porcentajeGlobal = totalTemas === 0 ? 0 : Math.round((temasDominados / totalTemas) * 100);

        return {
          totalMaterias,
          totalTemas,
          temasDominados,
          porcentajeGlobal,
          examenesProximos
        };
      }

      function calcularDiasExamen(fechaISO) {
        if (!fechaISO) return null;
        const partes = fechaISO.split("-").map(Number);
        if (partes.length !== 3) return null;

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const examen = new Date(partes[0], partes[1] - 1, partes[2]);
        examen.setHours(0, 0, 0, 0);

        const diffMs = examen.getTime() - hoy.getTime();
        const diasRestantes = Math.round(diffMs / (1000 * 60 * 60 * 24));

        const fechaFormateada = examen.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
          year: "numeric"
        });

        return { diasRestantes, fechaFormateada };
      }

      function filtrarDashboard({ texto = "", estado = "todos", soloFavoritos = false }) {
        const query = texto.trim().toLowerCase();
        const hayFiltroTemas = estado !== "todos" || soloFavoritos;

        return estadoInterno.materias
          .map(materia => {
            const coincideNombreMateria = query && materia.nombre.toLowerCase().includes(query);

            const temasCoincidentes = materia.temas.filter(tema => {
              if (estado !== "todos" && tema.estado !== estado) return false;
              if (soloFavoritos && !tema.favorito) return false;
              if (query) {
                const enTitulo = tema.titulo.toLowerCase().includes(query);
                const enDesc = tema.descripcion.toLowerCase().includes(query);
                return enTitulo || enDesc;
              }
              return true;
            });

            let incluirMateria = false;
            if (!query && !hayFiltroTemas) {
              incluirMateria = true;
            } else if (query && !hayFiltroTemas) {
              incluirMateria = coincideNombreMateria || temasCoincidentes.length > 0;
            } else {
              incluirMateria = temasCoincidentes.length > 0;
            }

            return {
              materia,
              incluirMateria,
              temasCoincidentes: (query || hayFiltroTemas) ? temasCoincidentes : []
            };
          })
          .filter(item => item.incluirMateria);
      }

      function filtrarTemasDeMateria(materia, { texto = "", estado = "todos", soloFavoritos = false }) {
        const query = texto.trim().toLowerCase();
        return materia.temas.filter(tema => {
          if (estado !== "todos" && tema.estado !== estado) return false;
          if (soloFavoritos && !tema.favorito) return false;
          if (query) {
            const enTitulo = tema.titulo.toLowerCase().includes(query);
            const enDesc = tema.descripcion.toLowerCase().includes(query);
            return enTitulo || enDesc;
          }
          return true;
        });
      }

      return {
        COLORES_PREDEFINIDOS,
        inicializar,
        obtenerTema,
        establecerTema,
        cargarDatosEjemplo,
        obtenerMaterias,
        obtenerMateriaPorId,
        crearMateria,
        actualizarMateria,
        eliminarMateria,
        crearTema,
        actualizarTema,
        eliminarTema,
        calcularProgresoMateria,
        calcularResumenGlobal,
        calcularDiasExamen,
        filtrarDashboard,
        filtrarTemasDeMateria
      };
    })();

    const GestorInterfaz = (() => {
      const estadoVista = {
        vistaActual: "dashboard",
        materiaActivaId: null,
        filtroTexto: "",
        filtroEstado: "todos",
        filtroFavoritos: false,
        accionConfirmacionPendiente: null
      };

      const dom = {};

      function cachearDOM() {
        dom.btnLogoHome = document.getElementById("btn-logo-home");
        dom.btnToggleTheme = document.getElementById("btn-toggle-theme");
        dom.iconThemeMoon = document.getElementById("icon-theme-moon");
        dom.iconThemeSun = document.getElementById("icon-theme-sun");
        dom.labelThemeToggle = document.getElementById("label-theme-toggle");
        dom.btnLoadDemo = document.getElementById("btn-load-demo");
        dom.btnNewSubject = document.getElementById("btn-new-subject");

        dom.statTotalSubjects = document.getElementById("stat-total-subjects");
        dom.statUpcomingExams = document.getElementById("stat-upcoming-exams");
        dom.statTotalTopics = document.getElementById("stat-total-topics");
        dom.statMasteredTopics = document.getElementById("stat-mastered-topics");
        dom.statGlobalProgress = document.getElementById("stat-global-progress");

        dom.searchInput = document.getElementById("search-input");
        dom.btnClearSearch = document.getElementById("btn-clear-search");
        dom.statusFilterButtons = document.querySelectorAll("[data-filter-status]");
        dom.btnFilterFavorites = document.getElementById("btn-filter-favorites");
        dom.btnResetFilters = document.getElementById("btn-reset-filters");

        dom.viewDashboard = document.getElementById("view-dashboard");
        dom.dashboardHeading = document.getElementById("dashboard-heading");
        dom.subjectsGrid = document.getElementById("subjects-grid");

        dom.viewSubjectDetail = document.getElementById("view-subject-detail");
        dom.detailColorBar = document.getElementById("detail-color-bar");
        dom.btnBackDashboard = document.getElementById("btn-back-dashboard");
        dom.btnEditCurrentSubject = document.getElementById("btn-edit-current-subject");
        dom.btnNewTopic = document.getElementById("btn-new-topic");
        dom.detailSubjectName = document.getElementById("detail-subject-name");
        dom.detailExamBadge = document.getElementById("detail-exam-badge");
        dom.detailProgressCounts = document.getElementById("detail-progress-counts");
        dom.detailProgressPercent = document.getElementById("detail-progress-percent");
        dom.detailProgressBar = document.getElementById("detail-progress-bar");
        dom.topicsHeading = document.getElementById("topics-heading");
        dom.topicsList = document.getElementById("topics-list");

        dom.modalSubject = document.getElementById("modal-subject");
        dom.modalSubjectTitle = document.getElementById("modal-subject-title");
        dom.formSubject = document.getElementById("form-subject");
        dom.inputSubjectId = document.getElementById("subject-id");
        dom.inputSubjectName = document.getElementById("subject-name");
        dom.colorSwatches = document.getElementById("color-swatches");
        dom.inputSubjectColor = document.getElementById("subject-color");
        dom.inputSubjectExamDate = document.getElementById("subject-exam-date");

        dom.modalTopic = document.getElementById("modal-topic");
        dom.modalTopicTitle = document.getElementById("modal-topic-title");
        dom.formTopic = document.getElementById("form-topic");
        dom.inputTopicId = document.getElementById("topic-id");
        dom.inputTopicTitle = document.getElementById("topic-title");
        dom.inputTopicDescription = document.getElementById("topic-description");
        dom.inputTopicStatus = document.getElementById("topic-status");
        dom.inputTopicFavorite = document.getElementById("topic-favorite");

        dom.modalConfirm = document.getElementById("modal-confirm");
        dom.modalConfirmTitle = document.getElementById("modal-confirm-title");
        dom.modalConfirmMessage = document.getElementById("modal-confirm-message");
        dom.btnConfirmDelete = document.getElementById("btn-confirm-delete");

        dom.toastContainer = document.getElementById("toast-container");
      }

      function aplicarTemaVisual(tema) {
        const esOscuro = tema === "dark";
        if (esOscuro) {
          document.documentElement.setAttribute("data-theme", "dark");
        } else {
          document.documentElement.removeAttribute("data-theme");
        }

        dom.iconThemeMoon.classList.toggle("hidden", esOscuro);
        dom.iconThemeSun.classList.toggle("hidden", !esOscuro);

        const textoAccion = esOscuro ? "Modo claro" : "Modo oscuro";
        const ariaTexto = esOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
        dom.labelThemeToggle.textContent = textoAccion;
        dom.btnToggleTheme.setAttribute("aria-label", ariaTexto);
        dom.btnToggleTheme.setAttribute("title", ariaTexto);
      }

      function escaparHTML(texto) {
        const div = document.createElement("div");
        div.textContent = texto;
        return div.innerHTML;
      }

      function mostrarToast(mensaje, tipo = "info") {
        const toast = document.createElement("div");
        toast.className = `toast ${tipo === "warning" ? "warning" : ""}`;
        toast.textContent = mensaje;
        dom.toastContainer.appendChild(toast);

        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transform = "translateY(8px)";
          toast.style.transition = "all 0.2s ease";
          setTimeout(() => toast.remove(), 220);
        }, 3200);
      }

      function inicializarPaletaColores() {
        AlmacenEstudio.COLORES_PREDEFINIDOS.forEach(hex => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "color-swatch";
          btn.style.backgroundColor = hex;
          btn.dataset.color = hex;
          btn.setAttribute("aria-label", `Seleccionar color ${hex}`);
          btn.addEventListener("click", () => {
            seleccionarColorEnFormulario(hex);
          });
          dom.colorSwatches.insertBefore(btn, dom.inputSubjectColor);
        });

        dom.inputSubjectColor.addEventListener("input", (e) => {
          seleccionarColorEnFormulario(e.target.value);
        });
      }

      function seleccionarColorEnFormulario(hex) {
        const normalizado = hex.toLowerCase();
        dom.inputSubjectColor.value = normalizado;
        dom.colorSwatches.querySelectorAll(".color-swatch").forEach(swatch => {
          swatch.classList.toggle("selected", swatch.dataset.color.toLowerCase() === normalizado);
        });
      }

      function generarBadgeExamenHTML(fechaExamen) {
        const info = AlmacenEstudio.calcularDiasExamen(fechaExamen);
        if (!info) {
          return `<span class="exam-badge">Sin fecha de examen</span>`;
        }

        const { diasRestantes, fechaFormateada } = info;
        let claseExtra = "";
        let textoCuenta = "";

        if (diasRestantes < 0) {
          claseExtra = "passed";
          textoCuenta = `Pasado (${fechaFormateada})`;
        } else if (diasRestantes === 0) {
          claseExtra = "urgent";
          textoCuenta = `¡Examen hoy! (${fechaFormateada})`;
        } else if (diasRestantes === 1) {
          claseExtra = "urgent";
          textoCuenta = `Mañana (${fechaFormateada})`;
        } else if (diasRestantes <= 7) {
          claseExtra = "soon";
          textoCuenta = `En ${diasRestantes} días · ${fechaFormateada}`;
        } else {
          textoCuenta = `En ${diasRestantes} días · ${fechaFormateada}`;
        }

        return `<span class="exam-badge ${claseExtra}">📅 ${escaparHTML(textoCuenta)}</span>`;
      }

      function renderizarBarraSuperior() {
        const resumen = AlmacenEstudio.calcularResumenGlobal();
        dom.statTotalSubjects.textContent = resumen.totalMaterias;
        dom.statTotalTopics.textContent = resumen.totalTemas;
        dom.statMasteredTopics.textContent = `${resumen.temasDominados} dominados`;
        dom.statGlobalProgress.textContent = `${resumen.porcentajeGlobal}%`;

        if (resumen.examenesProximos > 0) {
          dom.statUpcomingExams.textContent = `${resumen.examenesProximos} examen(es) en ≤14 días`;
        } else {
          dom.statUpcomingExams.textContent = "Sin exámenes próximos";
        }

        dom.btnLoadDemo.classList.toggle("hidden", resumen.totalMaterias > 0);

        dom.btnClearSearch.classList.toggle("hidden", estadoVista.filtroTexto.length === 0);

        dom.statusFilterButtons.forEach(btn => {
          btn.classList.toggle("active", btn.dataset.filterStatus === estadoVista.filtroEstado);
        });

        dom.btnFilterFavorites.classList.toggle("fav-active", estadoVista.filtroFavoritos);
        dom.btnFilterFavorites.setAttribute("aria-pressed", String(estadoVista.filtroFavoritos));

        const hayFiltrosActivos =
          estadoVista.filtroTexto.trim() !== "" ||
          estadoVista.filtroEstado !== "todos" ||
          estadoVista.filtroFavoritos;

        dom.btnResetFilters.classList.toggle("hidden", !hayFiltrosActivos);
      }

      function renderizarDashboard() {
        dom.viewDashboard.classList.remove("hidden");
        dom.viewSubjectDetail.classList.add("hidden");

        const todasLasMaterias = AlmacenEstudio.obtenerMaterias();
        const resultados = AlmacenEstudio.filtrarDashboard({
          texto: estadoVista.filtroTexto,
          estado: estadoVista.filtroEstado,
          soloFavoritos: estadoVista.filtroFavoritos
        });

        const hayFiltros =
          estadoVista.filtroTexto.trim() !== "" ||
          estadoVista.filtroEstado !== "todos" ||
          estadoVista.filtroFavoritos;

        dom.dashboardHeading.textContent = hayFiltros
          ? `Resultados encontrados (${resultados.length})`
          : `Mis Materias (${todasLasMaterias.length})`;

        if (todasLasMaterias.length === 0) {
          dom.subjectsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
              <div class="empty-icon">📚</div>
              <h3>Tu espacio de estudio está listo</h3>
              <p>Crea tu primera materia para organizar tus temas, controlar tu progreso y preparar tus próximos exámenes.</p>
              <div class="empty-actions">
                <button type="button" class="btn btn-primary" data-action="empty-new-subject">+ Crear primera materia</button>
                <button type="button" class="btn btn-secondary" data-action="empty-load-demo">Cargar datos de ejemplo</button>
              </div>
            </div>
          `;
          return;
        }

        if (resultados.length === 0) {
          dom.subjectsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
              <div class="empty-icon">🔍</div>
              <h3>Sin coincidencias</h3>
              <p>No encontramos materias o temas que coincidan con tu búsqueda o los filtros aplicados.</p>
              <div class="empty-actions">
                <button type="button" class="btn btn-secondary" data-action="empty-reset-filters">Limpiar filtros</button>
              </div>
            </div>
          `;
          return;
        }

        dom.subjectsGrid.innerHTML = resultados.map(({ materia, temasCoincidentes }) => {
          const progreso = AlmacenEstudio.calcularProgresoMateria(materia);
          const badgeExamen = generarBadgeExamenHTML(materia.fechaExamen);

          let previewCoincidenciasHTML = "";
          if (hayFiltros && temasCoincidentes.length > 0) {
            const pills = temasCoincidentes
              .slice(0, 4)
              .map(t => `<span class="matched-topic-pill">${escaparHTML(t.titulo)}</span>`)
              .join("");
            const extra = temasCoincidentes.length > 4 ? ` <span>+${temasCoincidentes.length - 4} más</span>` : "";
            previewCoincidenciasHTML = `
              <div class="matched-topics-preview">
                <strong>Temas coincidentes (${temasCoincidentes.length}):</strong>
                ${pills}${extra}
              </div>
            `;
          }

          return `
            <article class="subject-card" data-open-subject="${escaparHTML(materia.id)}" tabindex="0" role="button" aria-label="Abrir materia ${escaparHTML(materia.nombre)}">
              <div class="subject-color-bar" style="background-color: ${escaparHTML(materia.color)};"></div>
              <div class="subject-card-body">
                <div class="subject-card-top">
                  <div class="subject-title-wrap">
                    <span class="subject-dot" style="background-color: ${escaparHTML(materia.color)};"></span>
                    <h3 class="subject-name">${escaparHTML(materia.nombre)}</h3>
                  </div>
                  <div class="subject-card-actions">
                    <button type="button" class="btn-icon" data-edit-subject="${escaparHTML(materia.id)}" title="Editar materia" aria-label="Editar ${escaparHTML(materia.nombre)}">
                      ✎
                    </button>
                    <button type="button" class="btn-icon danger" data-delete-subject="${escaparHTML(materia.id)}" title="Eliminar materia" aria-label="Eliminar ${escaparHTML(materia.nombre)}">
                      🗑
                    </button>
                  </div>
                </div>

                ${badgeExamen}

                <div class="progress-section">
                  <div class="progress-header">
                    <span class="progress-counts">${progreso.dominados}/${progreso.total} dominados</span>
                    <span class="progress-percent">${progreso.porcentaje}%</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" style="width: ${progreso.porcentaje}%; background-color: ${escaparHTML(materia.color)};"></div>
                  </div>
                </div>

                ${previewCoincidenciasHTML}
              </div>
            </article>
          `;
        }).join("");
      }

      function renderizarDetalleMateria() {
        const materia = AlmacenEstudio.obtenerMateriaPorId(estadoVista.materiaActivaId);
        if (!materia) {
          estadoVista.vistaActual = "dashboard";
          estadoVista.materiaActivaId = null;
          renderizarTodo();
          return;
        }

        dom.viewDashboard.classList.add("hidden");
        dom.viewSubjectDetail.classList.remove("hidden");

        const progreso = AlmacenEstudio.calcularProgresoMateria(materia);
        dom.detailColorBar.style.backgroundColor = materia.color;
        dom.detailSubjectName.innerHTML = `
          <span class="subject-dot" style="background-color: ${escaparHTML(materia.color)}; width: 0.9rem; height: 0.9rem;"></span>
          ${escaparHTML(materia.nombre)}
        `;

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = generarBadgeExamenHTML(materia.fechaExamen);
        dom.detailExamBadge.replaceWith(tempDiv.firstElementChild);
        dom.detailExamBadge = document.querySelector("#view-subject-detail .exam-badge");

        dom.detailProgressCounts.textContent = `${progreso.dominados}/${progreso.total} dominados`;
        dom.detailProgressPercent.textContent = `${progreso.porcentaje}%`;
        dom.detailProgressBar.style.width = `${progreso.porcentaje}%`;
        dom.detailProgressBar.style.backgroundColor = materia.color;

        const temasFiltrados = AlmacenEstudio.filtrarTemasDeMateria(materia, {
          texto: estadoVista.filtroTexto,
          estado: estadoVista.filtroEstado,
          soloFavoritos: estadoVista.filtroFavoritos
        });

        const hayFiltros =
          estadoVista.filtroTexto.trim() !== "" ||
          estadoVista.filtroEstado !== "todos" ||
          estadoVista.filtroFavoritos;

        dom.topicsHeading.textContent = hayFiltros
          ? `Temas filtrados (${temasFiltrados.length} de ${materia.temas.length})`
          : `Temas de estudio (${materia.temas.length})`;

        if (materia.temas.length === 0) {
          dom.topicsList.innerHTML = `
            <div class="empty-state">
              <div class="empty-icon">📝</div>
              <h3>Aún no hay temas en esta materia</h3>
              <p>Divide el programa de <strong>${escaparHTML(materia.nombre)}</strong> en temas manejables para hacer seguimiento de tu avance.</p>
              <div class="empty-actions">
                <button type="button" class="btn btn-primary" data-action="empty-new-topic">+ Agregar primer tema</button>
              </div>
            </div>
          `;
          return;
        }

        if (temasFiltrados.length === 0) {
          dom.topicsList.innerHTML = `
            <div class="empty-state">
              <div class="empty-icon">🔍</div>
              <h3>Ningún tema coincide con los filtros</h3>
              <p>Prueba cambiando el estado seleccionado, desactivando el filtro de favoritos o limpiando la búsqueda.</p>
              <div class="empty-actions">
                <button type="button" class="btn btn-secondary" data-action="empty-reset-filters">Limpiar filtros</button>
              </div>
            </div>
          `;
          return;
        }

        dom.topicsList.innerHTML = temasFiltrados.map(tema => {
          const descHTML = tema.descripcion
            ? `<p class="topic-desc">${escaparHTML(tema.descripcion)}</p>`
            : "";

          return `
            <div class="topic-card ${tema.estado === "dominado" ? "is-dominado" : ""}">
              <div class="topic-main">
                <button
                  type="button"
                  class="fav-btn ${tema.favorito ? "active" : ""}"
                  data-toggle-fav="${escaparHTML(tema.id)}"
                  title="${tema.favorito ? "Quitar de favoritos" : "Marcar como favorito"}"
                  aria-label="${tema.favorito ? "Quitar de favoritos" : "Marcar como favorito"}"
                  aria-pressed="${tema.favorito}"
                >
                  ${tema.favorito ? "★" : "☆"}
                </button>
                <div class="topic-content">
                  <h4 class="topic-title">${escaparHTML(tema.titulo)}</h4>
                  ${descHTML}
                </div>
              </div>

              <div class="topic-controls">
                <select
                  class="status-select ${escaparHTML(tema.estado)}"
                  data-change-status="${escaparHTML(tema.id)}"
                  aria-label="Cambiar estado de ${escaparHTML(tema.titulo)}"
                >
                  <option value="pendiente" ${tema.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
                  <option value="en_progreso" ${tema.estado === "en_progreso" ? "selected" : ""}>En progreso</option>
                  <option value="dominado" ${tema.estado === "dominado" ? "selected" : ""}>Dominado</option>
                </select>

                <button type="button" class="btn-icon" data-edit-topic="${escaparHTML(tema.id)}" title="Editar tema" aria-label="Editar tema ${escaparHTML(tema.titulo)}">
                  ✎
                </button>
                <button type="button" class="btn-icon danger" data-delete-topic="${escaparHTML(tema.id)}" title="Eliminar tema" aria-label="Eliminar tema ${escaparHTML(tema.titulo)}">
                  🗑
                </button>
              </div>
            </div>
          `;
        }).join("");
      }

      function renderizarTodo() {
        renderizarBarraSuperior();
        if (estadoVista.vistaActual === "detalle" && estadoVista.materiaActivaId) {
          renderizarDetalleMateria();
        } else {
          renderizarDashboard();
        }
      }

      function abrirModal(modalEl) {
        modalEl.classList.add("open");
        const primerInput = modalEl.querySelector("input:not([type='hidden']), textarea, select, button.btn-primary");
        if (primerInput) {
          setTimeout(() => primerInput.focus(), 30);
        }
      }

      function cerrarModal(modalEl) {
        modalEl.classList.remove("open");
      }

      function abrirModalMateria(materia = null) {
        dom.formSubject.reset();
        if (materia) {
          dom.modalSubjectTitle.textContent = "Editar Materia";
          dom.inputSubjectId.value = materia.id;
          dom.inputSubjectName.value = materia.nombre;
          seleccionarColorEnFormulario(materia.color);
          dom.inputSubjectExamDate.value = materia.fechaExamen || "";
        } else {
          dom.modalSubjectTitle.textContent = "Nueva Materia";
          dom.inputSubjectId.value = "";
          seleccionarColorEnFormulario(AlmacenEstudio.COLORES_PREDEFINIDOS[0]);
          dom.inputSubjectExamDate.value = "";
        }
        abrirModal(dom.modalSubject);
      }

      function abrirModalTema(tema = null) {
        dom.formTopic.reset();
        if (tema) {
          dom.modalTopicTitle.textContent = "Editar Tema";
          dom.inputTopicId.value = tema.id;
          dom.inputTopicTitle.value = tema.titulo;
          dom.inputTopicDescription.value = tema.descripcion || "";
          dom.inputTopicStatus.value = tema.estado;
          dom.inputTopicFavorite.checked = Boolean(tema.favorito);
        } else {
          dom.modalTopicTitle.textContent = "Nuevo Tema";
          dom.inputTopicId.value = "";
          dom.inputTopicStatus.value = "pendiente";
          dom.inputTopicFavorite.checked = false;
        }
        abrirModal(dom.modalTopic);
      }

      function solicitarConfirmacion({ titulo, mensaje, alConfirmar }) {
        dom.modalConfirmTitle.textContent = titulo;
        dom.modalConfirmMessage.textContent = mensaje;
        estadoVista.accionConfirmacionPendiente = alConfirmar;
        abrirModal(dom.modalConfirm);
      }

      function vincularEventos() {
        const irADashboard = () => {
          estadoVista.vistaActual = "dashboard";
          estadoVista.materiaActivaId = null;
          renderizarTodo();
        };

        dom.btnLogoHome.addEventListener("click", irADashboard);
        dom.btnLogoHome.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            irADashboard();
          }
        });
        dom.btnBackDashboard.addEventListener("click", irADashboard);

        dom.btnToggleTheme.addEventListener("click", () => {
          const temaSiguiente = AlmacenEstudio.obtenerTema() === "dark" ? "light" : "dark";
          const temaAplicado = AlmacenEstudio.establecerTema(temaSiguiente);
          aplicarTemaVisual(temaAplicado);
        });

        dom.btnNewSubject.addEventListener("click", () => abrirModalMateria());
        dom.btnLoadDemo.addEventListener("click", () => {
          AlmacenEstudio.cargarDatosEjemplo();
          mostrarToast("Se cargaron 3 materias de ejemplo.");
          renderizarTodo();
        });

        dom.searchInput.addEventListener("input", (e) => {
          estadoVista.filtroTexto = e.target.value;
          renderizarTodo();
        });

        dom.btnClearSearch.addEventListener("click", () => {
          estadoVista.filtroTexto = "";
          dom.searchInput.value = "";
          dom.searchInput.focus();
          renderizarTodo();
        });

        dom.statusFilterButtons.forEach(btn => {
          btn.addEventListener("click", () => {
            estadoVista.filtroEstado = btn.dataset.filterStatus;
            renderizarTodo();
          });
        });

        dom.btnFilterFavorites.addEventListener("click", () => {
          estadoVista.filtroFavoritos = !estadoVista.filtroFavoritos;
          renderizarTodo();
        });

        const limpiarTodosLosFiltros = () => {
          estadoVista.filtroTexto = "";
          estadoVista.filtroEstado = "todos";
          estadoVista.filtroFavoritos = false;
          dom.searchInput.value = "";
          renderizarTodo();
        };
        dom.btnResetFilters.addEventListener("click", limpiarTodosLosFiltros);

        dom.subjectsGrid.addEventListener("click", (e) => {
          const btnEditar = e.target.closest("[data-edit-subject]");
          if (btnEditar) {
            e.stopPropagation();
            const materia = AlmacenEstudio.obtenerMateriaPorId(btnEditar.dataset.editSubject);
            if (materia) abrirModalMateria(materia);
            return;
          }

          const btnEliminar = e.target.closest("[data-delete-subject]");
          if (btnEliminar) {
            e.stopPropagation();
            const materia = AlmacenEstudio.obtenerMateriaPorId(btnEliminar.dataset.deleteSubject);
            if (!materia) return;
            solicitarConfirmacion({
              titulo: "Eliminar materia",
              mensaje: `¿Seguro que deseas eliminar "${materia.nombre}" y sus ${materia.temas.length} tema(s)? Esta acción no se puede deshacer.`,
              alConfirmar: () => {
                AlmacenEstudio.eliminarMateria(materia.id);
                mostrarToast(`Materia "${materia.nombre}" eliminada.`);
                renderizarTodo();
              }
            });
            return;
          }

          const actionBtn = e.target.closest("[data-action]");
          if (actionBtn) {
            const accion = actionBtn.dataset.action;
            if (accion === "empty-new-subject") abrirModalMateria();
            if (accion === "empty-load-demo") {
              AlmacenEstudio.cargarDatosEjemplo();
              mostrarToast("Se cargaron 3 materias de ejemplo.");
              renderizarTodo();
            }
            if (accion === "empty-reset-filters") limpiarTodosLosFiltros();
            return;
          }

          const card = e.target.closest("[data-open-subject]");
          if (card) {
            estadoVista.materiaActivaId = card.dataset.openSubject;
            estadoVista.vistaActual = "detalle";
            renderizarTodo();
          }
        });

        dom.subjectsGrid.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            const card = e.target.closest("[data-open-subject]");
            if (card && e.target === card) {
              e.preventDefault();
              estadoVista.materiaActivaId = card.dataset.openSubject;
              estadoVista.vistaActual = "detalle";
              renderizarTodo();
            }
          }
        });

        dom.btnEditCurrentSubject.addEventListener("click", () => {
          const materia = AlmacenEstudio.obtenerMateriaPorId(estadoVista.materiaActivaId);
          if (materia) abrirModalMateria(materia);
        });

        dom.btnNewTopic.addEventListener("click", () => abrirModalTema());

        dom.topicsList.addEventListener("click", (e) => {
          const materiaId = estadoVista.materiaActivaId;
          if (!materiaId) return;

          const btnFav = e.target.closest("[data-toggle-fav]");
          if (btnFav) {
            const temaId = btnFav.dataset.toggleFav;
            const materia = AlmacenEstudio.obtenerMateriaPorId(materiaId);
            const tema = materia?.temas.find(t => t.id === temaId);
            if (tema) {
              AlmacenEstudio.actualizarTema(materiaId, temaId, { favorito: !tema.favorito });
              renderizarTodo();
            }
            return;
          }

          const btnEditarTema = e.target.closest("[data-edit-topic]");
          if (btnEditarTema) {
            const temaId = btnEditarTema.dataset.editTopic;
            const materia = AlmacenEstudio.obtenerMateriaPorId(materiaId);
            const tema = materia?.temas.find(t => t.id === temaId);
            if (tema) abrirModalTema(tema);
            return;
          }

          const btnEliminarTema = e.target.closest("[data-delete-topic]");
          if (btnEliminarTema) {
            const temaId = btnEliminarTema.dataset.deleteTopic;
            const materia = AlmacenEstudio.obtenerMateriaPorId(materiaId);
            const tema = materia?.temas.find(t => t.id === temaId);
            if (!tema) return;

            solicitarConfirmacion({
              titulo: "Eliminar tema",
              mensaje: `¿Deseas eliminar el tema "${tema.titulo}"?`,
              alConfirmar: () => {
                AlmacenEstudio.eliminarTema(materiaId, temaId);
                mostrarToast("Tema eliminado.");
                renderizarTodo();
              }
            });
            return;
          }

          const actionBtn = e.target.closest("[data-action]");
          if (actionBtn) {
            if (actionBtn.dataset.action === "empty-new-topic") abrirModalTema();
            if (actionBtn.dataset.action === "empty-reset-filters") limpiarTodosLosFiltros();
          }
        });

        dom.topicsList.addEventListener("change", (e) => {
          const selectEstado = e.target.closest("[data-change-status]");
          if (selectEstado && estadoVista.materiaActivaId) {
            const temaId = selectEstado.dataset.changeStatus;
            const nuevoEstado = selectEstado.value;
            AlmacenEstudio.actualizarTema(estadoVista.materiaActivaId, temaId, { estado: nuevoEstado });
            renderizarTodo();
          }
        });

        dom.formSubject.addEventListener("submit", (e) => {
          e.preventDefault();
          const id = dom.inputSubjectId.value;
          const datos = {
            nombre: dom.inputSubjectName.value.trim(),
            color: dom.inputSubjectColor.value,
            fechaExamen: dom.inputSubjectExamDate.value
          };

          if (!datos.nombre) return;

          if (id) {
            AlmacenEstudio.actualizarMateria(id, datos);
            mostrarToast("Materia actualizada.");
          } else {
            AlmacenEstudio.crearMateria(datos);
            mostrarToast("Materia creada correctamente.");
          }

          cerrarModal(dom.modalSubject);
          renderizarTodo();
        });

        dom.formTopic.addEventListener("submit", (e) => {
          e.preventDefault();
          const materiaId = estadoVista.materiaActivaId;
          if (!materiaId) return;

          const temaId = dom.inputTopicId.value;
          const datos = {
            titulo: dom.inputTopicTitle.value.trim(),
            descripcion: dom.inputTopicDescription.value.trim(),
            estado: dom.inputTopicStatus.value,
            favorito: dom.inputTopicFavorite.checked
          };

          if (!datos.titulo) return;

          if (temaId) {
            AlmacenEstudio.actualizarTema(materiaId, temaId, datos);
            mostrarToast("Tema actualizado.");
          } else {
            AlmacenEstudio.crearTema(materiaId, datos);
            mostrarToast("Tema agregado a la materia.");
          }

          cerrarModal(dom.modalTopic);
          renderizarTodo();
        });

        dom.btnConfirmDelete.addEventListener("click", () => {
          if (typeof estadoVista.accionConfirmacionPendiente === "function") {
            estadoVista.accionConfirmacionPendiente();
            estadoVista.accionConfirmacionPendiente = null;
          }
          cerrarModal(dom.modalConfirm);
        });

        document.querySelectorAll("[data-close-modal]").forEach(btn => {
          btn.addEventListener("click", () => {
            const modalId = btn.dataset.closeModal;
            const modalEl = document.getElementById(modalId);
            if (modalEl) cerrarModal(modalEl);
          });
        });

        [dom.modalSubject, dom.modalTopic, dom.modalConfirm].forEach(modal => {
          modal.addEventListener("click", (e) => {
            if (e.target === modal) cerrarModal(modal);
          });
        });

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            [dom.modalSubject, dom.modalTopic, dom.modalConfirm].forEach(cerrarModal);
          }
        });
      }

      function iniciar() {
        cachearDOM();
        inicializarPaletaColores();
        vincularEventos();

        const resultadoInit = AlmacenEstudio.inicializar();
        aplicarTemaVisual(AlmacenEstudio.obtenerTema());

        if (resultadoInit.recuperadoDeError && resultadoInit.mensaje) {
          mostrarToast(resultadoInit.mensaje, "warning");
        }

        renderizarTodo();
      }

      return { iniciar };
    })();

    document.addEventListener("DOMContentLoaded", GestorInterfaz.iniciar);
