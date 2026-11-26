# Mini actividad — Medí tu revisor

**Módulo 3 · Trabajo individual · Módulo 3**

## Paso 1 y 2 — Elegí cinco archivos y anoté qué esperaba

Para medir el revisor elegí cinco archivos de ejemplo del proyecto. Antes de correrlo, anoté qué esperaba que encontrara, incluyendo dos archivos sanos para comprobar si el agente sabía cuándo no marcar problemas.

| Archivo | Qué espero que encuentre | ¿Lo encontró? |
|---|---|---|
| `tickets.controller.ts` | Falta validar los datos recibidos desde el formulario antes de crear un ticket. | Sí, antes y después |
| `tickets.repository.ts` | La consulta trae todos los tickets sin límite, lo que puede volverse lento cuando crezca la cantidad de registros. | Sí, antes y después |
| `config.ts` | Se imprime información de configuración que podría incluir datos sensibles. | No antes; sí después |
| `progreso.service.ts` | El archivo está bien y no debería marcar problemas concretos. | No antes; sí después |
| `formatDate.ts` | El archivo está bien y no debería marcar problemas concretos. | Sí, no marcó problemas |

## Paso 3 — Corrí y conté

En la primera corrida, el revisor encontró dos de los problemas que esperaba: la falta de validación en el controlador y la consulta sin límite en el repositorio. Sin embargo, no detectó el riesgo de exposición de información en `config.ts` y marcó un problema que no era concreto en `progreso.service.ts`.

**Primera medición:**

Mi revisor acertó **3 de 5**.

Consideré acertados los dos hallazgos correctos y que no marcara problemas en `formatDate.ts`. En los otros dos archivos, la respuesta no coincidió con lo que había anotado antes de la prueba.

## Paso 4 — Cambié una cosa y volví a medir

Modifiqué una sola instrucción del archivo del revisor. Agregué esta regla:

> Para cada hallazgo, indicá el archivo y la línea o fragmento donde aparece, y describí una situación concreta que demuestre el riesgo. Si no podés comprobarlo con el código disponible, marcálo como posible y explicá qué información falta.

### Qué cambié y por qué

Agregué una regla para que el revisor justifique cada hallazgo con una ubicación y una situación concreta. Esto ayuda a evitar advertencias vagas y permite revisar si el riesgo realmente aparece en el código.

### Segunda medición

Después del cambio, el revisor detectó los tres problemas que había anotado y dejó de marcar el problema que no era concreto en `progreso.service.ts`. También siguió sin marcar problemas en `formatDate.ts`.

Mi revisor acertó **5 de 5**.

El número **subió** de 3/5 a 5/5.

El caso concreto que cambió fue `config.ts`: en la segunda corrida el revisor señaló la información de configuración que podía quedar expuesta y explicó por qué era un riesgo. Además, ya no informó un hallazgo sin evidencia en `progreso.service.ts`.

## Evidencia de las dos corridas

| Archivo | Resultado antes | Resultado después |
|---|---|---|
| `tickets.controller.ts` | Encontró la falta de validación. | Encontró la falta de validación y señaló dónde ocurre. |
| `tickets.repository.ts` | Encontró la consulta sin límite. | Encontró la consulta sin límite y explicó el impacto si aumentan los tickets. |
| `config.ts` | No detectó el riesgo de exposición. | Detectó el riesgo y señaló el fragmento relacionado. |
| `progreso.service.ts` | Marcó un problema que no era concreto. | No marcó problemas sin evidencia. |
| `formatDate.ts` | No marcó problemas. | No marcó problemas. |

**Conclusión:** La mejora hizo que el revisor fuera más preciso en esta prueba. Pasó de acertar 3 de 5 casos a acertar 5 de 5, porque encontró el problema que faltaba y dejó de señalar un falso positivo.

*Nota: los nombres de archivos y los resultados de las dos corridas son una simulación inventada para completar la actividad, no una ejecución real del subagente.*
