# Trabajo Práctico 3: Diseñando una Automatización con IA

## Caso 1 — StreamFlix: Recomendador Inteligente de Películas

Elegí el Caso 1: StreamFlix, el recomendador inteligente de películas para una plataforma de streaming.
Lo elegí porque es el caso donde la IA tiene el rol más claro ya que no solo responde consultas, sino que toma una decisión personalizada (qué mostrarle a cada usuario) de forma continua y silenciosa, en segundo plano, sin que el usuario tenga que pedir nada. Eso permite pensar bien el flujo de datos, la lógica de decisión y los puntos donde conviene o no automatizar del todo.

## Problema a resolver

Una plataforma de streaming tiene un catálogo enorme (miles de títulos) y los usuarios, en general, no saben qué mirar. Si la plataforma muestra el mismo catálogo genérico a todos, dos cosas salen mal:

- El usuario pierde tiempo buscando y se frustra.
- Si no encuentra algo atractivo rápido, abandona la sesión o directamente cancela la suscripción.

El problema de fondo es de **descubrimiento personalizado**: conectar a cada usuario con el contenido que probablemente le interese, antes de que decida irse.

## Las herramientas utilizadas

- Modelo de recomendación (motor de Machine Learning tipo filtrado colaborativo + content-based).
- Base de datos de eventos de usuario (historial, clics, tiempo visto, ratings).
- Sistema de notificaciones push / email (para avisar de nuevos títulos recomendados).
- Panel de moderación humana (dashboard donde un analista revisa casos marcados como problemáticos).
- API interna que conecta el motor de recomendación con la app (para actualizar el home en tiempo real).

---

## Explicación paso a paso

- Paso 1: El usuario abre StreamFlix. Este evento dispara el pedido de recomendaciones al motor de IA.

- Paso 2: El sistema junta el historial reciente de reproducción, calificaciones, porcentaje de series/películas completadas y señales de contexto como hora del día o dispositivo.

- Paso 3: La IA cruza esos datos con perfiles de usuarios similares y las características del catálogo (género, actores, duración, tono) y genera un ranking de títulos, priorizando los que tienen mayor probabilidad de ser vistos hasta el final.

- Paso 4: El home se actualiza con filas personalizadas. Si el usuario lleva varios días sin abrir la app, se puede disparar una notificación con una sugerencia puntual.

- Paso 5: Si muchos usuarios marcan "no me interesa" sobre las mismas recomendaciones, o hay quejas de contenido inapropiado sugerido a un perfil infantil, un moderador humano revisa el caso y puede ajustar reglas o excluir contenido.

---

## Los beneficios esperados

**Para el usuario**
- Encuentra contenido relevante más rápido, sin scrollear el catálogo entero.
- Descubre títulos que no hubiera buscado por su cuenta.

**Para la plataforma**
- Menor tasa de cancelación, porque el usuario percibe valor constante.
- Mayor tiempo de visualización por sesión.
- Mejor aprovechamiento del catálogo: se le da visibilidad a títulos menos populares que igual encajan con ciertos perfiles.

---

## Las posibles mejoras futuras

- Recomendaciones "de grupo" para cuentas compartidas o familiares (detectar quién está mirando).
- Explicabilidad: mostrarle al usuario por qué se le sugiere algo ("porque viste..."), lo que genera más confianza.
- Incorporar un asistente conversacional para pedidos en lenguaje natural: "quiero algo corto y liviano para ver hoy".
- Ajustar recomendaciones en tiempo real según la reacción inmediata (si abandona un título a los 2 minutos, modificarlo para la siguiente sugerencia).
- Detección automática de fatiga de recomendación (si el usuario ignora siempre las mismas categorías, diversificar).
