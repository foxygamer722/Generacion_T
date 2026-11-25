# Mini actividad – Refactoring + Tests Unitarios

## Proyecto elegido

**EstudIA — Organizador de Estudio**, desarrollado con HTML, CSS y JavaScript. Para esta actividad se trabajó sobre `script.js`, dentro del módulo `AlmacenEstudio`.

## 1. Análisis del código

En la funcionalidad de filtrado se detectaron estas oportunidades:

- **Duplicación:** `filtrarDashboard()` y `filtrarTemasDeMateria()` repetían las mismas condiciones para filtrar temas por texto, estado y favoritos.
- **Simplificación:** esas condiciones podían concentrarse en una función pequeña que se reutilizara desde ambos métodos.
- **Responsabilidades:** cada método de filtrado también debía decidir qué resultados devolver; separar la condición de coincidencia hace más clara esa responsabilidad.

### Mejora seleccionada

Extraer la lógica repetida a una función auxiliar llamada `temaCoincideConFiltros()` y usarla desde los dos métodos.

Se eligió esta única mejora porque reduce la duplicación y mantiene las mismas reglas de búsqueda. No se modificó el criterio de inclusión de materias en el dashboard ni el formato de los resultados.

## 2. Código antes del refactoring

En `filtrarDashboard()` la lógica estaba escrita directamente dentro del `filter()`:

```javascript
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
```

La misma lógica se repetía en `filtrarTemasDeMateria()`:

```javascript
function filtrarTemasDeMateria(materia, {
  texto = "", estado = "todos", soloFavoritos = false
}) {
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
```

## 3. Código después del refactoring

Se creó una única función para comprobar si un tema cumple los filtros:

```javascript
function temaCoincideConFiltros(tema, query, estado, soloFavoritos) {
  if (estado !== "todos" && tema.estado !== estado) return false;
  if (soloFavoritos && !tema.favorito) return false;
  if (!query) return true;

  const enTitulo = tema.titulo.toLowerCase().includes(query);
  const enDesc = tema.descripcion.toLowerCase().includes(query);
  return enTitulo || enDesc;
}
```

Ahora ambos métodos reutilizan la función:

```javascript
const temasCoincidentes = materia.temas.filter(tema =>
  temaCoincideConFiltros(tema, query, estado, soloFavoritos)
);

function filtrarTemasDeMateria(materia, {
  texto = "", estado = "todos", soloFavoritos = false
}) {
  const query = texto.trim().toLowerCase();
  return materia.temas.filter(tema =>
    temaCoincideConFiltros(tema, query, estado, soloFavoritos)
  );
}
```

## 4. Tests unitarios

Se utilizó el test runner incorporado de Node.js (`node:test`), sin instalar dependencias. Los tests cargan `script.js` en un contexto de prueba con un `localStorage` simulado y comprueban los métodos públicos del módulo.

Archivo: `tests/filtrado.test.js`

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function crearAlmacenDePrueba() {
  const valores = new Map();
  const contexto = {
    window: {
      localStorage: {
        getItem: clave => valores.has(clave) ? valores.get(clave) : null,
        setItem: (clave, valor) => valores.set(clave, String(valor)),
        removeItem: clave => valores.delete(clave)
      },
      matchMedia: () => ({ matches: false })
    },
    document: { addEventListener() {} },
    console,
    Date,
    Math,
    JSON
  };

  vm.createContext(contexto);
  const codigo = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
  vm.runInContext(codigo, contexto);
  const almacen = vm.runInContext('AlmacenEstudio', contexto);
  almacen.inicializar();

  const materia = almacen.crearMateria({
    nombre: 'Matemática', color: '#2563eb', fechaExamen: ''
  });
  const temaFavorito = almacen.crearTema(materia.id, {
    titulo: 'Funciones cuadráticas',
    descripcion: 'Parábolas y raíces',
    estado: 'pendiente',
    favorito: true
  });
  almacen.crearTema(materia.id, {
    titulo: 'Logaritmos',
    descripcion: 'Propiedades y cambio de base',
    estado: 'dominado',
    favorito: false
  });

  return { almacen, materia, temaFavorito };
}

test('caso correcto: busca por título y aplica estado/favorito', () => {
  const { almacen, materia, temaFavorito } = crearAlmacenDePrueba();
  const resultados = almacen.filtrarTemasDeMateria(materia, {
    texto: '  CUADRÁTICAS ', estado: 'pendiente', soloFavoritos: true
  });
  assert.deepEqual(Array.from(resultados, tema => tema.id), [temaFavorito.id]);
});

test('caso inválido: un estado que no existe no devuelve temas', () => {
  const { almacen, materia } = crearAlmacenDePrueba();
  const resultados = almacen.filtrarTemasDeMateria(materia, {
    texto: '', estado: 'estado_inexistente', soloFavoritos: false
  });
  assert.equal(resultados.length, 0);
});

test('caso límite: filtros vacíos en dashboard incluyen materias sin filtrar temas', () => {
  const { almacen, materia } = crearAlmacenDePrueba();
  const resultados = almacen.filtrarDashboard({
    texto: '', estado: 'todos', soloFavoritos: false
  });
  assert.equal(resultados.length, 1);
  assert.equal(resultados[0].materia.id, materia.id);
  assert.equal(resultados[0].temasCoincidentes.length, 0);
});
```

### ¿Qué valida cada test?

1. **Caso correcto:** busca texto sin distinguir mayúsculas/minúsculas ni espacios exteriores, y combina correctamente el estado con el filtro de favoritos.
2. **Caso inválido:** si se recibe un estado que no corresponde a ningún tema, no se devuelve ningún resultado.
3. **Caso límite:** con todos los filtros vacíos, el dashboard muestra la materia, pero deja `temasCoincidentes` vacío, que es el comportamiento original.

## 5. Ejecución y resultado

Comando ejecutado desde la carpeta del proyecto:

```bash
node --test tests/filtrado.test.js
```

Resultado:

```text
1..3
# tests 3
# suites 0
# pass 3
# fail 0
# cancelled 0
# skipped 0
# todo 0
```

También se ejecutó la comprobación de sintaxis:

```bash
node --check script.js
```

La comprobación terminó correctamente.

## Conclusión

Se eliminó la duplicación de la lógica de filtrado mediante una función auxiliar reutilizable. La mejora no cambia las reglas ni el resultado esperado de la funcionalidad. Los tres tests unitarios pasaron y la sintaxis del archivo JavaScript fue verificada.
