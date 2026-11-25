# Actividad — Analizar antes de pedir

**Módulo 3 · Trabajo individual**

## 1. Analicé el código e identifiqué tres problemas

### 1. Se traen todos los tickets en cada consulta

La función ejecuta `SELECT * FROM Tickets FOR JSON PATH` cada vez que se hace un `GET /tickets`. Actualmente hay solo 5 tickets, pero cuando el sistema tenga cientos o miles, va a traer todos los registros aunque el usuario necesite ver una parte. Esto puede hacer que la respuesta tarde más y que se consuman más recursos, especialmente si se consulta muchas veces.

### 2. Se ejecuta un proceso externo cada vez que se consulta

Para consultar SQL Server, la función ejecuta `sqlcmd` mediante `execFile`. Aunque ahora funciona, cada pedido HTTP inicia un proceso externo nuevo. Si varias personas consultan los tickets al mismo tiempo o el sistema recibe muchas solicitudes, se van a crear muchos procesos y puede aumentar el tiempo de respuesta.

### 3. Los datos se devuelven sin un tipo específico ni validación de cada ticket

La función devuelve `unknown[]` y solamente verifica que el resultado de SQL Server sea un array. No comprueba que cada elemento tenga los campos esperados de un ticket. Por ejemplo, si la consulta devuelve un ticket sin título o con un dato incorrecto, la función lo acepta y el problema puede aparecer después, cuando el frontend intente mostrarlo o editarlo.

## 2. Prompt que le escribiría a la IA

Necesito mejorar la función `queryTicketRows()` del repositorio del backend. La función se ejecuta en cada `GET /tickets` y consulta los tickets de SQL Server usando `sqlcmd`. Actualmente la base tiene 5 tickets, la aplicación funciona y hay una sola persona usando el sistema, pero más adelante se van a poder crear y editar tickets desde un formulario.

Quiero que revises los tres problemas que identifiqué: la consulta trae todos los tickets cada vez, se inicia un proceso externo por cada pedido y los datos se manejan como `unknown[]` sin validar la estructura de cada ticket.

Proponé una solución manteniendo la consulta a SQL Server y el comportamiento actual de devolver una lista de tickets en JSON. Priorizá que el código quede preparado para crecer, pero sin agregar complejidad innecesaria para el tamaño actual del proyecto.

No cambies la configuración de conexión que se obtiene desde las variables de entorno, no expongas credenciales y no modifiques otras partes del sistema que no sean necesarias para esta función. No agregues funcionalidades nuevas como autenticación o permisos, porque no forman parte de este ejercicio.

Antes de escribir el código, explicá brevemente qué cambios harías y por qué. Después mostrá cómo quedaría la función y qué habría que modificar en el código que la utiliza, si corresponde.

## 3. Justificación del prompt

Escribí el contexto de la función y expliqué cómo se usa, porque la IA necesita saber que se ejecuta en cada `GET /tickets` y que actualmente la aplicación funciona con pocos datos. También agregué que más adelante se van a crear y editar tickets, ya que eso puede cambiar la forma en que conviene organizar la consulta.

Incluí los tres problemas con situaciones concretas, en vez de decir solamente que el código está desprolijo. De esa manera, la IA sabe qué aspectos tiene que analizar y qué situaciones debería evitar cuando el sistema crezca.

También puse límites: mantener la conexión mediante variables de entorno, conservar la respuesta en JSON y no modificar partes que no hacen falta. Decidí que no se agreguen autenticación ni permisos porque no son necesarios para resolver este ejercicio.

Por último, le pedí que explique primero los cambios y después muestre la implementación. Así puedo entender las decisiones antes de usar el código y revisar si la solución respeta lo que necesita mi aplicación.
