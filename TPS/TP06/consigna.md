# EstudIA - Organizador de estudio
 
## Problema

La aplicación está pensada para estudiantes que cursan varias materias al mismo tiempo y necesitan organizar mejor su estudio. Muchas veces la información queda repartida entre cuadernos, apuntes en PDF o incluso mensajes de WhatsApp con compañeros, lo que hace que sea fácil perder el control de qué temas ya se estudiaron, qué exámenes se acercan o qué tan preparado se está para cada materia. Con esta aplicación toda esa información estaría centralizada en un solo lugar, permitiendo ver rápidamente el estado de preparación de cada materia, organizar las prioridades según la fecha de los exámenes y llevar un registro del rendimiento a lo largo del tiempo. De esta forma se reduce la desorganización y resulta mucho más sencillo planificar el estudio antes de los exámenes.

## Funcionalidades
 
1. Crear una materia con nombre, color identificador y fecha de examen.
2. Agregar temas/unidades dentro de cada materia con un estado (pendiente, en progreso, dominado).
3. Editar o eliminar materias y temas existentes.
4. Buscar materias o temas por nombre o palabra clave.
5. Filtrar por estado de avance (pendiente / en progreso / dominado) o por proximidad de examen.
6. Marcar temas como favoritos para repasar antes del examen.
7. Ver un panel general (dashboard) con el porcentaje de avance por materia.
## Datos
 
Cada **tema** tendrá:
 
| Campo | Tipo |
|---|---|
| Título | Texto |
| Descripción | Texto |
| Materia asociada | Referencia/ID |
| Estado | Enum (pendiente / en progreso / dominado) |
| Fecha de creación | Fecha |
| Favorito | Booleano |
 
Cada **materia** tendrá:
 
| Campo | Tipo |
|---|---|
| Nombre | Texto |
| Color | Texto (hex) |
| Fecha de examen | Fecha |
| Temas asociados | Lista de temas |
 
## SPEC
 
**Objetivo:** Desarrollar una aplicación web simple que permita a un estudiante organizar sus materias y temas de estudio, con seguimiento de avance y priorización según fechas de examen.
 
**Usuario:** Estudiante individual.
 
**Funcionalidades:**
- Crear,leer,actualizar y borrar por completo de materias.
- Crear,leer,actualizar y borrar por completo de temas dentro de cada materia.
- Filtro por estado y por favoritos.
- Buscador de texto libre.
- Dashboard con porcentaje de avance por materia (calculado según cantidad de temas "dominados" sobre el total).
 
**Restricciones:**

- No requiere backend con base de datos externa, los datos se guardan en el navegador (localStorage).
- Debe funcionar completamente offline.
- Interfaz simple, sin necesidad de login.
- El código debe estar en un único archivo o en una estructura mínima fácil de entender para alguien que recién empieza a programar.
  
**Tecnología elegida:** HTML, CSS y JavaScript.
 
## Prompt profesional
 
```
Quiero que construyas una aplicación web llamada "EstudIA", un organizador de estudio
para estudiantes.
 
Tecnología: HTML, CSS y JavaScript. 
Todo en un único archivo HTML autocontenido. Los datos deben persistir en localStorage del navegador.
 
Funcionalidades que debe tener:
1. Crear, editar y eliminar materias (nombre, color, fecha de examen).
2. Dentro de cada materia, crear, editar y eliminar temas (título, descripción,
   estado: pendiente/en progreso/dominado, favorito).
3. Un buscador que filtre materias y temas por texto.
4. Filtros por estado de avance y por favoritos.
5. Un dashboard inicial que muestre cada materia con una barra de progreso
   calculada según el porcentaje de temas "dominados".
 
Cómo espero que sea el código:
- Código limpio, comentado y organizado en secciones claras (HTML, CSS, JS).
- Nombres de variables y funciones descriptivos, en español o inglés consistente.
- Sin dependencias externas.
- Que separe claramente la lógica de datos de la lógica de interfaz.
 
Restricciones importantes:
- No debe requerir servidor ni base de datos externa.
- Debe funcionar abriendo el archivo HTML directamente en el navegador.
- La interfaz debe ser simple y responsive (usable también desde el celular).
- Manejar casos donde localStorage esté vacío o corrupto, sin romper la app.
```
 
## Validación
Verificaria el código generado por la IA voy a probar que todo funcione bien. Voy a verificar que se puedan crear, editar y eliminar materias y temas, y que los cambios aparezcan correctamente en la aplicación. También voy a revisar que el código sea fácil de entender, con nombres claros en las funciones.

Además, voy a comprobar que la información se guarde correctamente en localStorage y que siga estando después de cerrar y volver a abrir el archivo. Por último, voy a ver si la aplicación es fácil de usar, para que cualquier persona pueda crear materias y temas sin tener que leer instrucciones.
