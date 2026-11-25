# Actividad: Diseño de la base de datos de «Multiverse»

## 1. Objetivo

Diseñar un modelo de datos para **Multiverse**, una aplicación que
registra personajes de universos ficticios (anime, películas,
videojuegos, cómics, etc.), sus poderes y su nivel de peligrosidad.

El modelo debe permitir consultar: - Qué personajes pertenecen a un
universo. - Qué poderes tiene un personaje. - Qué personajes poseen un
poder determinado. - Cuáles son los personajes más peligrosos.

## 2. Entidades identificadas

Se proponen cinco entidades: **Universo**, **Personaje**, **Poder**,
**NivelPeligrosidad** y **PersonajePoder**.

La entidad `PersonajePoder` resuelve la relación muchos a muchos entre
personajes y poderes.

## 3. Entidades, atributos y tipos de datos

### Universo

  -----------------------------------------------------------------------
  Atributo          Tipo de dato      Clave             Descripción
  ----------------- ----------------- ----------------- -----------------
  id_universo       INTEGER           PK                Identificador
                                                        único del
                                                        universo

  nombre            VARCHAR(100)      ---               Nombre del
                                                        universo

  tipo              VARCHAR(30)       ---               Tipo de universo:
                                                        anime, película,
                                                        videojuego,
                                                        cómic, etc.

  descripcion       TEXT              ---               Descripción
                                                        opcional del
                                                        universo
  -----------------------------------------------------------------------

### Personaje

  -----------------------------------------------------------------------
  Atributo          Tipo de dato      Clave             Descripción
  ----------------- ----------------- ----------------- -----------------
  id_personaje      INTEGER           PK                Identificador
                                                        único del
                                                        personaje

  nombre            VARCHAR(100)      ---               Nombre del
                                                        personaje

  alias             VARCHAR(100)      ---               Alias o nombre
                                                        alternativo;
                                                        puede quedar
                                                        vacío

  descripcion       TEXT              ---               Información
                                                        básica o
                                                        descripción

  id_universo       INTEGER           FK                Universo al que
                                                        pertenece

  id_nivel          INTEGER           FK                Nivel de
                                                        peligrosidad
                                                        asignado
  -----------------------------------------------------------------------

### Poder

  Atributo      Tipo de dato   Clave   Descripción
  ------------- -------------- ------- -------------------------------
  id_poder      INTEGER        PK      Identificador único del poder
  nombre        VARCHAR(100)   ---     Nombre del poder
  descripcion   TEXT           ---     Qué permite hacer el poder

### NivelPeligrosidad

  Atributo      Tipo de dato   Clave   Descripción
  ------------- -------------- ------- -----------------------------------------
  id_nivel      INTEGER        PK      Identificador del nivel
  nombre        VARCHAR(50)    ---     Nombre o categoría del nivel
  valor         INTEGER        ---     Valor numérico para ordenar los niveles
  descripcion   TEXT           ---     Descripción de la categoría

### PersonajePoder

  Atributo       Tipo de dato   Clave    Descripción
  -------------- -------------- -------- ------------------------------
  id_personaje   INTEGER        PK, FK   Personaje que posee el poder
  id_poder       INTEGER        PK, FK   Poder asignado al personaje

En `PersonajePoder`, la clave primaria es **compuesta** por
`id_personaje` e `id_poder`. Así se evita registrar dos veces la misma
asignación de un poder al mismo personaje.

## 4. Claves primarias y foráneas

-   `Universo.id_universo`: clave primaria.
-   `Personaje.id_personaje`: clave primaria.
-   `Poder.id_poder`: clave primaria.
-   `NivelPeligrosidad.id_nivel`: clave primaria.
-   `PersonajePoder`: clave primaria compuesta (`id_personaje`,
    `id_poder`).

Claves foráneas: - `Personaje.id_universo` referencia a
`Universo.id_universo`. - `Personaje.id_nivel` referencia a
`NivelPeligrosidad.id_nivel`. - `PersonajePoder.id_personaje` referencia
a `Personaje.id_personaje`. - `PersonajePoder.id_poder` referencia a
`Poder.id_poder`.

## 5. Relaciones entre entidades

  -----------------------------------------------------------------------
  Relación                Cardinalidad            Explicación
  ----------------------- ----------------------- -----------------------
  Universo --- Personaje  1:N                     Un universo puede tener
                                                  muchos personajes. Cada
                                                  personaje pertenece a
                                                  un universo en este
                                                  modelo.

  NivelPeligrosidad ---   1:N                     Un nivel puede estar
  Personaje                                       asignado a muchos
                                                  personajes. Cada
                                                  personaje tiene un
                                                  nivel de peligrosidad.

  Personaje --- Poder     N:M                     Un personaje puede
                                                  tener varios poderes y
                                                  un poder puede
                                                  pertenecer a varios
                                                  personajes.

  Personaje ---           1:N                     Un personaje puede
  PersonajePoder                                  aparecer en varias
                                                  asignaciones de
                                                  poderes.

  Poder ---               1:N                     Un poder puede aparecer
  PersonajePoder                                  en varias asignaciones
                                                  de personajes.
  -----------------------------------------------------------------------

## 6. Representación del modelo

``` mermaid
erDiagram
    UNIVERSO ||--o{ PERSONAJE : contiene
    NIVEL_PELIGROSIDAD ||--o{ PERSONAJE : clasifica
    PERSONAJE ||--o{ PERSONAJE_PODER : posee
    PODER ||--o{ PERSONAJE_PODER : asignado

    UNIVERSO {
        INTEGER id_universo PK
        VARCHAR nombre
        VARCHAR tipo
        TEXT descripcion
    }

    PERSONAJE {
        INTEGER id_personaje PK
        VARCHAR nombre
        VARCHAR alias
        TEXT descripcion
        INTEGER id_universo FK
        INTEGER id_nivel FK
    }

    NIVEL_PELIGROSIDAD {
        INTEGER id_nivel PK
        VARCHAR nombre
        INTEGER valor
        TEXT descripcion
    }

    PODER {
        INTEGER id_poder PK
        VARCHAR nombre
        TEXT descripcion
    }

    PERSONAJE_PODER {
        INTEGER id_personaje PK, FK
        INTEGER id_poder PK, FK
    }
```

## 7. ¿Cómo permite responder las preguntas del negocio?

  -----------------------------------------------------------------------
  Pregunta                            Cómo se obtiene la información
  ----------------------------------- -----------------------------------
  ¿Qué personajes pertenecen a este   Se buscan los personajes cuyo
  universo?                           `id_universo` coincide con el
                                      universo elegido.

  ¿Qué poderes tiene este personaje?  Se relaciona el personaje con
                                      `PersonajePoder` y luego con
                                      `Poder`.

  ¿Qué personajes tienen determinado  Se busca el poder en `Poder`, se
  poder?                              consultan sus asignaciones en
                                      `PersonajePoder` y se obtienen los
                                      personajes.

  ¿Cuáles son los personajes más      Se ordenan los personajes por el
  peligrosos?                         valor de su nivel de peligrosidad,
                                      de mayor a menor.
  -----------------------------------------------------------------------

## 8. Revisión del modelo

### ¿Estamos repitiendo información?

No se guarda el nombre del universo ni el nombre del nivel de
peligrosidad en cada personaje. Se guardan sus identificadores, y la
información descriptiva permanece en su entidad correspondiente.

### ¿Metimos varios valores dentro de un mismo campo?

No. Los poderes no se almacenan como una lista o texto separado por
comas dentro de `Personaje`. Cada asignación se representa con una fila
en `PersonajePoder`.

### ¿Hay datos que deberían estar separados?

Sí. Los universos, los poderes y los niveles de peligrosidad se
mantienen separados de los personajes porque son datos que pueden
reutilizarse.

### ¿Podríamos responder las cuatro preguntas del negocio?

Sí. Las relaciones y claves foráneas permiten recuperar personajes por
universo, poderes por personaje, personajes por poder y personajes
ordenados por peligrosidad.

## 9. Decisiones y supuestos

-   En este diseño, cada personaje pertenece a un solo universo. Si el
    negocio necesitara que un personaje aparezca en varios universos,
    habría que reemplazar esa relación 1:N por una relación N:M.
-   Cada personaje tiene un nivel de peligrosidad. Los niveles se
    guardan en una entidad separada para mantener categorías
    consistentes y poder ordenarlas mediante `valor`.
-   Se considera que el nombre del poder puede ser reutilizado por
    varios personajes; por eso `Poder` es una entidad independiente.
-   No se definieron valores concretos para los niveles de peligrosidad
    porque la consigna no especifica una escala. La empresa debería
    acordar las categorías y sus valores.

## Conclusión

El modelo propuesto organiza la información en entidades relacionadas,
evita duplicaciones y representa correctamente la relación N:M entre
personajes y poderes. Con las claves primarias y foráneas definidas, la
base de datos puede almacenar los datos requeridos y responder las
cuatro consultas planteadas por la empresa.
