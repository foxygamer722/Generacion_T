## Trabajo Practico – Diseñando un Equipo de Agentes IA

<br>

### 1. ¿Qué agentes crearias? y 2. ¿Cual seria la funcion de cada agente?
Para el proyecto de crear una aplicacion para gestionar turnos medicos online:
- **ORQUESTADOR:** Se encarga de definir los objetivos, dividir el desarrollo en tareas manejables y asignarlas para mantener el orden.
- **FRONTEND:** Se enfoca en construir la parte visual y tangible de la aplicacion, programando los componentes concretos para que el progreso se pueda ver y probar rápidamente.
- **BACKEND:** Se encarga de diseñar la base de datos y establecer la logica estricta del sistema, como verificar la disponibilidad de los horarios.
- **COMUNICACIONES:** Su trabajo es gestionar los avisos automatizados, procesando el envio de correos o mensajes para confirmar las reservas y mandar recordatorios.

<br>

### 3. ¿Cómo se comunicarían?
Se comunicarian funcionando de esta forma:
- **DISTRIBUCION:** cada agente recibe instrucciones directamente del Orquestador.
- **EJECUCIÓN:** cada agente trabaja de forma autonoma en su especialidad una vez que recibe la instruccion.
- **REPORTE:** al finalizar una tarea, cada agente le reporta sus avances al Orquestador.
- **INTEGRACIÓN:** el Orquestador integra todos los resultados obtenidos y gestiona las dependencias entre tareas antes de dar el trabajo por finalizado.
