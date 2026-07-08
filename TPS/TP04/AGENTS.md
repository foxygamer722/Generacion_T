# AGENTS.md
 
## Proyecto
Blog personal estático hecho con Astro, con posts escritos en Markdown, sistema de tags y generación automática de RSS.
 
## Comandos principales
- `npm install` → instala las dependencias
- `npm run dev` → levanta el servidor local en modo desarrollo
- `npm run build` → genera el sitio estático final (carpeta `dist/`)
- `npm run preview` → sirve la build de producción localmente para probarla
- `npm run format` → formatea el código con Prettier

## Reglas de estilo de código
- Archivos de posts en Markdown, nombrados como `YYYY-MM-DD-titulo-del-post.md`
- Front matter obligatorio en cada post: `title`, `date`, `tags`, `description`
- Componentes de Astro: PascalCase (ej. `PostCard.astro`)
- Estilos con CSS puro.
- Indentación de 2 espacios en todo el proyecto
- Imágenes optimizadas y guardadas en `/public/images/`, nunca directamente en la raíz

## Qué puede hacer el agente
- Crear nuevos posts a partir de un tema o borrador que le pase
- Corregir errores de ortografía, gramática o links rotos
- Optimizar imágenes y ajustar su tamaño antes de subirlas
- Actualizar el archivo de tags o categorías cuando se agregan posts nuevos
- Mejorar el SEO básico (meta tags, descripciones, alt de imágenes)
- Correr build y preview para verificar que todo funcione antes de avisar que algo está listo

## Qué NO debe hacer sin permiso
- Publicar (hacer deploy) directamente sin confirmación previa
- Borrar posts existentes o cambiar sus fechas de publicación
- Modificar el diseño general del sitio (layout, paleta de colores, tipografías) sin consultar
- Agregar dependencias nuevas al proyecto sin avisar
- Cambiar la estructura de carpetas del proyecto
- Editar el archivo de configuración (`astro.config.mjs`) sin explicar el motivo
