# Actividad — Diseñando el backend de mi aplicación

### 1- Analizar tu frontend actual e identificar.

#### Las funciones principales del frontend son:
- La gestión de materias: Creación de nuevas materias especificando nombre, color identificador y fecha de examen.

- La gestión de contenidos: Agregar temas dentro de cada materia, asignarles un estado visual, editarlos o eliminarlos.

- La búsqueda y filtrado: Barra de búsqueda por texto y filtros por estado de avance o por favoritos.

- La visualización de progreso: Vista general con indicadores visuales que muestran el avance global y por materia.

- La persistencia de datos: La aplicación guarda las materias y los temas en el `localStorage` del navegador, por lo que no necesita una base de datos externa.

#### Las entidades del sistema son:

#### Materia:
- id
- nombre
- color
- fechaExamen
- temas (lista de temas asociados)

#### Tema:
- id
- titulo
- descripcion
- estado (pendiente, en progreso o dominado)
- favorito (verdadero o falso)

#### 2- Separar responsabilidades y decidir qué pertenece al backend o frontend:

**Frontend:**
- Mostrar las materias, los temas y el panel de progreso.
- Permitir completar formularios para crear o editar materias y temas.
- Mostrar los filtros, el buscador y los mensajes de confirmación.
- Actualizar la interfaz cuando se realizan cambios.
- En la versión actual, guardar los datos en `localStorage`.

**Backend (si la aplicación se conectara a un servidor):**
- Recibir y validar los datos enviados desde el frontend.
- Crear, consultar, actualizar y eliminar materias y temas.
- Calcular el porcentaje de avance de cada materia.
- Devolver los datos en formato JSON.
- Guardar la información en una base de datos o en un sistema de almacenamiento del servidor.

En mi aplicación actual no hay un backend real, porque funciona directamente desde el navegador y guarda los datos localmente. Esta separación sería para una futura versión con servidor.

### 3- Diseñar los endpoints que necesita tu aplicación.

Para una futura versión con una API REST, propondría los siguientes endpoints:

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/materias` | Obtener todas las materias. |
| GET | `/api/materias/:id` | Obtener una materia y sus temas. |
| POST | `/api/materias` | Crear una materia. |
| PUT | `/api/materias/:id` | Actualizar una materia. |
| DELETE | `/api/materias/:id` | Eliminar una materia y sus temas asociados. |
| POST | `/api/materias/:id/temas` | Crear un tema dentro de una materia. |
| PUT | `/api/materias/:id/temas/:temaId` | Actualizar un tema. |
| DELETE | `/api/materias/:id/temas/:temaId` | Eliminar un tema. |
| GET | `/api/materias/:id/progreso` | Obtener el porcentaje de avance de una materia. |

Los endpoints recibirían o devolverían datos en formato JSON. Por ejemplo, para crear una materia se enviaría el nombre, el color y la fecha del examen.

### 4- Proponer una arquitectura para el backend antes de escribir código y justificar brevemente por qué la elegiste.

Elegiría una arquitectura por capas, usando Node.js y Express para crear la API.

- **Rutas:** Definen los endpoints y el método HTTP.
- **Controladores:** Reciben la solicitud y devuelven la respuesta al frontend.
- **Servicios:** Contienen la lógica de la aplicación, como calcular el progreso.
- **Repositorio:** Se encarga de obtener y guardar los datos.

La elegiría porque permite separar las responsabilidades y hace que el código sea más fácil de entender y modificar. Además, si en el futuro cambio el sistema de almacenamiento, podría modificar el repositorio sin tener que cambiar toda la lógica de la aplicación.

### 5- Cuestionar al menos una decisión propuesta por la IA.

Una decisión que cuestionaría es agregar un backend y una base de datos desde el principio. Para mi proyecto, la aplicación está pensada para un estudiante individual y tiene que funcionar sin conexión. Por eso, usar `localStorage` es más simple y cumple con lo que necesito.

Un backend podría ser útil si más adelante quisiera acceder a mis materias desde distintos dispositivos o compartir información. Pero por ahora agregaría complejidad y haría que la aplicación dependiera de un servidor, así que mantendría la versión actual sin backend.

### 6- Implementar una funcionalidad del backend respetando la arquitectura diseñada.

Como ejemplo, implementaría el endpoint que devuelve el progreso de una materia. El cálculo es el mismo que utiliza mi aplicación: se cuentan los temas dominados y se divide esa cantidad por el total de temas.

Ejemplo de implementación con Node.js y Express:

```js
function calcularProgresoMateria(materia) {
  const total = materia.temas.length;
  const dominados = materia.temas.filter(
    tema => tema.estado === "dominado"
  ).length;

  const porcentaje = total === 0
    ? 0
    : Math.round((dominados / total) * 100);

  return { total, dominados, porcentaje };
}

function obtenerProgreso(req, res) {
  const materia = materias.find(
    materia => materia.id === req.params.id
  );

  if (!materia) {
    return res.status(404).json({
      error: "No se encontró la materia."
    });
  }

  const progreso = calcularProgresoMateria(materia);

  res.json({
    materiaId: materia.id,
    nombre: materia.nombre,
    ...progreso
  });
}

app.get("/api/materias/:id/progreso", obtenerProgreso);
```

En este ejemplo, `materias` representa los datos que el repositorio le entrega al controlador y `app` es la aplicación de Express. En una implementación completa, esos datos se obtendrían desde el repositorio en lugar de estar guardados directamente en el archivo.

De esta manera, el backend calcula el progreso y devuelve el resultado en JSON, mientras que el frontend se encarga de mostrarlo en la pantalla.
