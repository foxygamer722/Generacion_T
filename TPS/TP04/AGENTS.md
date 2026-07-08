# AGENTS.md

## Project
App web en React para gestión de tareas (to-do list) con posibilidad de crear, editar, completar y eliminar tareas. Conectada a una API REST simple para persistir los datos.

## Commands
- `npm install` → instala las dependencias del proyecto
- `npm run dev` → levanta el servidor de desarrollo
- `npm run build` → genera la build de producción
- `npm run test` → corre los tests
- `npm run lint` → chequea el estilo de código

## Code style
- Nombres claros y descriptivos (evitar abreviaturas raras)
- Componentes: PascalCase (ej. `TaskCard.jsx`)
- Variables y funciones: camelCase
- No usar `any` en TypeScript
- Componentes pequeños y con una sola responsabilidad
- Preferir funciones puras y evitar efectos secundarios innecesarios
- Comentar solo lo que no sea obvio (evitar comentarios redundantes)
- Mantener el mismo formato de indentación y comillas ya usado en el proyecto (Prettier/ESLint)

## Agent behavior

### Qué SÍ puede hacer el agente
- Leer y analizar el código existente para entender el contexto antes de modificar algo
- Crear nuevos componentes siguiendo la estructura y estilo ya definidos
- Corregir bugs menores y errores de sintaxis
- Escribir y actualizar tests
- Sugerir mejoras de performance o legibilidad
- Actualizar documentación (README, comentarios) cuando corresponda
- Ejecutar los comandos definidos arriba (install, dev, build, test, lint)

### Qué NO debe hacer sin permiso
- Modificar o eliminar archivos de configuración críticos (`.env`, `package.json`, `tsconfig.json`) sin avisar
- Instalar nuevas dependencias sin confirmar antes
- Hacer cambios en la base de datos o en datos de producción
- Subir cambios directamente a la rama `main`/`master` (siempre trabajar en una rama nueva y pedir revisión)
- Borrar archivos o carpetas sin confirmación explícita
- Cambiar la arquitectura general del proyecto sin discutirlo primero
- Exponer claves, tokens o credenciales en el código

## Notas adicionales
- Ante la duda, preguntar antes de asumir
- Priorizar cambios pequeños y revisables por sobre refactors grandes
- Explicar brevemente el motivo de cada cambio importante que se proponga
