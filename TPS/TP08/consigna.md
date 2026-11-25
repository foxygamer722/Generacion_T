# Actividad: Diseñá la base de datos de «Multiverse»

## El desafío: Multiverse

Una empresa quiere crear Multiverse, una aplicación para registrar personajes de universos ficticios: anime, películas, videojuegos, cómics, etc.

La aplicación debe permitir registrar personajes con su información básica y saber a qué universo pertenecen. También se quiere registrar qué poderes tienen los personajes y clasificarlos según su nivel de peligrosidad.

Un personaje puede tener varios poderes y un mismo poder puede aparecer en distintos personajes.

Además, la empresa quiere poder responder preguntas como:

- ¿Qué personajes pertenecen a este universo?
- ¿Qué poderes tiene este personaje?
- ¿Qué personajes tienen determinado poder?
- ¿Cuáles son los personajes más peligrosos?

## Su trabajo

Sin escribir SQL y sin preguntarle primero a la IA cómo hacerlo, diseñen el modelo de datos que permitiría construir esta aplicación.

Tienen que decidir:

1. **¿Qué entidades existen?**  
   No están dadas. Identifiquen ustedes qué cosas necesitan convertirse en entidades.

2. **¿Qué atributos necesita cada entidad?**  
   Piensen solamente en información que realmente necesite guardar el sistema.

3. **¿Qué tipo de dato tendría cada atributo?**  
   Por ejemplo: `TEXT`, `INTEGER`, `BOOLEAN`, `DATE`, etc.

## Relaciones y claves

1. **¿Cuál sería la Primary Key de cada entidad?**
2. **¿Cómo se relacionan las entidades?**  
   Identifiquen si las relaciones son:
   - 1:1
   - 1:N
   - N:M

## Revisen su modelo

Pregúntense:

- ¿Estamos repitiendo información?
- ¿Metimos varios valores dentro de un mismo campo?
- ¿Hay datos que deberían estar separados?
- ¿Podríamos responder las cuatro preguntas que pide el negocio con nuestro modelo?

**Importante:** Recién al terminar, realicen la revisión con IA.
