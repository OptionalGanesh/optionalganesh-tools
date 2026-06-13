# Drum Practice OS

Herramienta personal de aprendizaje para batería: módulos breves, ejercicios, generador rítmico, metrónomo visual y registro de práctica.

## Uso

Abre `index.html` en el navegador.

## Qué contiene

- Vista corta por tema.
- Modos `Learn`, `Practice` y `Flow` para cambiar dificultad e intención.
- Ejercicios originales por nivel.
- Patrones de acentos en 16 pasos.
- Generador de frases rítmicas con BPM, densidad y compás.
- Metrónomo visual con click audible opcional.
- Registro local de práctica usando `localStorage`.

## Cómo añadir material propio

Puedes importar un JSON desde la app o editar `defaultModules` en `app.js`.

Formato recomendado:

```js
{
  "modules": [
    {
      "id": "pulse",
      "title": "Nombre del módulo",
      "kicker": "Categoría",
      "minutes": 25,
      "brief": "Resumen corto en tus palabras.",
      "focus": ["Idea clave 1", "Idea clave 2"],
      "exercises": [
        {
          "title": "Nombre",
          "goal": "Qué se entrena",
          "pattern": "X---X---X---X---",
          "tempo": "60-90 BPM",
          "length": "4 compases",
          "level": "Base",
          "steps": ["Paso 1", "Paso 2", "Paso 3"]
        }
      ]
    }
  ]
}
```

`X` significa golpe/acento y `-` silencio o nota suave.

## Sobre contenido de cursos

Esta app no copia cursos privados ni clona herramientas externas. Está pensada para transformar apuntes personales, observaciones propias y ejercicios originales en una práctica clara y usable.

## Flujo práctico con un curso comprado

1. Entra tú al curso.
2. Copia índices, nombres de lecciones, PDFs descargables, transcripciones disponibles o apuntes propios.
3. Pásame ese material aquí.
4. Yo lo convierto en JSON compacto para importarlo en la app.
5. Iteramos ejercicios, niveles, rutinas y generador.

## Fuentes públicas usadas como marco

- Percussive Arts Society: lista oficial de 40 rudimentos y práctica open-close-open.
- Vic Firth Education: organización pedagógica por familias/tier de rudimentos.
- Berklee Online: mapa curricular público de técnica, lectura, coordinación, groove, estilos y compases.
- JP Bouvet / Drum Channel: referencias públicas a RhythmBot, lectura rítmica, subsets, flow mode, fills, ghost notes, improvisación y web of intent.
- Drumeo / DrumLessons: referencias públicas de beats iniciales, coordinación, grooves, fills lineales, ghost notes y diseño de práctica.

La app usa esas fuentes como referencia de estructura, no como copia literal de sus cursos o ejercicios.
