'use strict';

// ─── Utilities ────────────────────────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function isoDate(d) {
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${dy}`;
}

function todayISO() { return isoDate(new Date()); }

function getMondayOf(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// ─── Block factory ────────────────────────────────────────────────────────
function mkBlock(data) {
  return {
    id: uid(),
    completed: false,
    completedBy: null,
    completedAt: null,
    purpose: '',           // why this session matters right now
    energyRequired: 'media', // baja | media | alta
    difficulty: 'fácil',    // fácil | medio | difícil
    startRitual: '',       // how to begin the session
    ...data,
  };
}

// ─── Exercise library ─────────────────────────────────────────────────────
function bScentSearch(advanced) {
  return mkBlock({
    type: 'activacion', tag: 'busqueda',
    title: advanced ? 'Búsqueda olfativa — nivel 2' : 'Búsqueda olfativa',
    purpose: 'El olfato activo baja la activación del sistema nervioso más que el movimiento físico.',
    energyRequired: 'media',
    difficulty: advanced ? 'medio' : 'fácil',
    startRitual: 'Cierra la mano sobre un premio, deja que lo huela, di "busca" una sola vez.',
    duration: advanced ? 10 : 8,
    steps: advanced ? [
      'Esconde premios en lugares más difíciles: encima de sillas, dentro de cajas abiertas, en otra habitación',
      'Di "busca" sin señalar la zona — solo el olfato',
      'No la guíes si se frustra; espera que resuelva sola',
      'Aumenta a 7–8 premios si los primeros van bien',
    ] : [
      'Esconde 3–5 premios en la habitación (detrás de patas de muebles, bajo alfombra)',
      'Di "busca" con calma y señala la zona general',
      'Deja que Shadow trabaje sola — no la guíes',
      'Marca con "¡sí!" suave cada hallazgo; premia en el suelo',
    ],
    finish: 'Di "terminado", retira premios restantes y siéntate a ignorarla 30 s',
    alarm: `Pon alarma ${advanced ? 10 : 8} min`,
    learns: 'Canal olfativo, control de impulsos, transición activo→calma',
  });
}

function bMasticado() {
  return mkBlock({
    type: 'calma', tag: 'masticado',
    title: 'Masticado legal',
    purpose: 'Dar a la mandíbula un objeto legal y satisfactorio reduce la presión sobre manos y ropa.',
    energyRequired: 'baja',
    difficulty: 'fácil',
    startRitual: 'Prepara el Kong o hueso. Colócalo en su colchoneta sin excitación.',
    duration: 15,
    steps: [
      'Prepara el Kong o hueso (relleno congelado si es posible)',
      'Dáselo en su colchoneta o rincón favorito',
      'Siéntate cerca sin interactuar',
      'Si deja el objeto y busca atención, señala el objeto sin hablar',
    ],
    finish: 'Recoge el objeto tras 10–15 min; di "terminado"',
    alarm: 'Pon alarma 15 min',
    learns: 'Que morder objetos legales es satisfactorio; autorregulación',
  });
}

function bCalmaMat() {
  return mkBlock({
    type: 'calma', tag: 'colchoneta',
    title: 'Trabajo en colchoneta',
    purpose: 'Construir un comportamiento base de asentamiento voluntario — no obediencia, sino elección.',
    energyRequired: 'baja',
    difficulty: 'medio',
    startRitual: 'Señala la colchoneta con el dedo una sola vez. Espera en silencio.',
    duration: 10,
    steps: [
      'Señala la colchoneta con el dedo y espera',
      'En cuanto Shadow la pise, marca "¡sí!" y tira el premio en la colchoneta',
      'Aumenta el tiempo antes de marcar (1 s → 3 s → 5 s)',
      'Si se levanta, señala la colchoneta de nuevo — sin repetir la cue',
    ],
    finish: '"Terminado" + aléjate; deja que ella decida salir sola',
    alarm: 'Pon alarma 10 min',
    learns: 'La colchoneta es lugar de calma elegida, no de castigo',
  });
}

function bCapturCalma() {
  return mkBlock({
    type: 'calma', tag: 'captura',
    title: 'Captura de calma',
    purpose: 'Reforzar la calma que surge sola enseña que el sistema nervioso puede regularse sin pedírselo.',
    energyRequired: 'baja',
    difficulty: 'fácil',
    startRitual: 'Siéntate en la habitación. Ignórala totalmente. Premios en el bolsillo.',
    duration: 10,
    steps: [
      'Siéntate en la habitación con Shadow suelta; ignórala totalmente',
      'Cuando baje el ritmo (se siente, olfatee despacio, bostece) → marca "¡sí!" muy suave',
      'Tira el premio al suelo lejos de ti — sin contacto ni llamada de atención',
      'Haz 5–8 capturas; para antes de que ella busque llamar tu atención',
    ],
    finish: 'Sal de la habitación silenciosamente — sin cue de terminado',
    alarm: 'Pon alarma 10 min',
    learns: 'Que estar tranquila produce cosas buenas sin pedirlo',
  });
}

function bNombreObjeto(nombre) {
  return mkBlock({
    type: 'nombre-objeto', tag: 'objeto',
    title: `Nombre: "${nombre}"`,
    purpose: 'Asociar palabras a objetos construye atención enfocada y es la base del retrieve y del sniff por nombre.',
    energyRequired: 'baja',
    difficulty: 'medio',
    startRitual: 'Elige UN objeto. Muéstralo, di su nombre una vez en voz normal. Sin emoción.',
    duration: 7,
    steps: [
      `Muestra el objeto (${nombre}) y di su nombre una vez en voz normal`,
      'Cuando Shadow lo toque o huela → marca "¡sí!" y premia',
      'Pon el objeto en el suelo; espera que lo investigue → marca al primer contacto',
      `Tras 4–5 éxitos, mezcla "${nombre}" con otro objeto ya conocido; nombra solo el nuevo`,
    ],
    finish: '"Terminado"; guarda el objeto fuera de su vista',
    alarm: 'Pon alarma 7 min',
    learns: `Asociar la palabra "${nombre}" a ese objeto específico`,
  });
}

function bTerminado() {
  return mkBlock({
    type: 'terminado', tag: 'offsw',
    title: 'Práctica de off-switch',
    purpose: 'Enseñar que la excitación tiene un final predecible y tranquilo — el apagado es una habilidad entrenable.',
    energyRequired: 'media',
    difficulty: 'difícil',
    startRitual: 'Inicia 30 s de juego activo. Para de golpe: cruza los brazos, mira al frente, cuerpo quieto.',
    duration: 10,
    steps: [
      'Inicia 30 s de juego activo (mueve juguete, excita la voz)',
      'Para de golpe: cruza los brazos, mira al frente, ignora todo contacto',
      'Cuando Shadow baje la activación (se siente, mire a otro lado) → marca y premia',
      'Repite 4–5 ciclos activo/calma; aumenta el tiempo de calma requerido en cada uno',
    ],
    finish: 'Último ciclo termina en calma; di "terminado" y sal de la zona de juego',
    alarm: 'Pon alarma 10 min',
    learns: '"Parar" es una señal clara, no un castigo — y la calma tiene recompensa',
  });
}

function bTug() {
  return mkBlock({
    type: 'activacion', tag: 'tug',
    title: 'Tug controlado',
    purpose: 'Canalizar el impulso de mordida a un objeto legal con el humano controlando inicio y fin.',
    energyRequired: 'alta',
    difficulty: 'medio',
    startRitual: 'Presenta el juguete de tug TÚ — Shadow no lo pide. Espera cuerpo en calma antes de iniciar.',
    duration: 8,
    steps: [
      'Inicia tú el juego presentando el juguete de tug — Shadow no lo pide',
      'Juega 10–15 s, luego congela (para de moverte, sostén firme)',
      'Cuando suelte → marca "¡sí!" + premio + "toma" para reiniciar',
      'Haz 5–6 ciclos; termina cuando ella todavía quiera más',
    ],
    finish: '"Terminado"; guarda el juguete de tug completamente fuera de su vista',
    alarm: 'Pon alarma 8 min',
    learns: 'El humano controla inicio y fin del juego; cómo calmarse entre ráfagas',
  });
}

function bTouch() {
  return mkBlock({
    type: 'calma', tag: 'touch',
    title: 'Touch — nariz a mano',
    purpose: 'Orientación voluntaria hacia el humano — base del recall y de las señales a distancia.',
    energyRequired: 'baja',
    difficulty: 'fácil',
    startRitual: 'Palma plana a la altura de su nariz. Quieta. No la llames, no la toques.',
    duration: 5,
    steps: [
      'Extiende la palma de la mano plana a la altura de su nariz',
      'Espera que Shadow la toque con la nariz — no la llames',
      'Al primer contacto: "¡sí!" inmediato + premio',
      'Repite 5 veces; aumenta la distancia gradualmente; cambia de mano',
    ],
    finish: '"Terminado"; retira la mano',
    alarm: 'Si muerde la mano: para. Espera calma. Reinicia con mano más alta o más lejos.',
    learns: 'Orientarse hacia el humano voluntariamente; base para recall y señales a distancia',
  });
}

function bEspera() {
  return mkBlock({
    type: 'calma', tag: 'espera',
    title: 'Espera — control de impulso',
    purpose: 'La frustración tolerable y el autocontrol ante un recurso deseado son habilidades que se construyen.',
    energyRequired: 'baja',
    difficulty: 'medio',
    startRitual: 'Colócate entre Shadow y el recurso antes de que exista. Sin decir nada todavía.',
    duration: 6,
    steps: [
      'Prepara el recurso (comida, juguete o puerta); bloquea el acceso con tu cuerpo',
      'Espera 2–3 segundos de quietud sin decir nada',
      'Di "ya" o "adelante" y permite el acceso',
      'Si se lanza antes: bloquea de nuevo sin drama, sin palabras',
      'Aumenta el tiempo gradualmente hasta 10 s esta semana',
    ],
    finish: 'Permiso claro con una sola señal; sin repetir',
    alarm: 'Si la frustración escala a mordiscos: reduce el criterio. Recompensa 1 segundo de pausa.',
    learns: 'Frustración tolerable; autocontrol antes de la recompensa',
  });
}

function bResetCorto() {
  return mkBlock({
    type: 'calma', tag: 'reset',
    title: 'Reset corto — separación breve',
    purpose: 'Terminar una interacción improductiva sin castigo y sin drama — el reset es una herramienta, no una sanción.',
    energyRequired: 'baja',
    difficulty: 'fácil',
    startRitual: '"Terminado" una sola vez en tono neutro. Sal o coloca una barrera baja.',
    duration: 3,
    steps: [
      'Di "terminado" una sola vez en tono neutro',
      'Sal de la habitación o coloca una barrera baja — sin drama, sin castigo',
      'Espera silencio o quietud — mínimo 20 segundos de calma real',
      'Regresa con calma; no celebres ni interactúes de inmediato',
      'Reanuda con algo de baja intensidad (olfato o colchoneta)',
    ],
    finish: 'Regresas cuando hay calma real, no antes',
    alarm: 'Si sigue llorando o rascando después de 3 min: espera más.',
    learns: 'La activación tiene un final; la calma abre la siguiente interacción',
  });
}

function bTraerObjeto(nombre) {
  return mkBlock({
    type: 'calma', tag: 'traer',
    title: `Mini misión — trae "${nombre || 'objeto'}"`,
    purpose: 'Cooperación coger→traer→soltar construye comunicación y es la base del retrieve.',
    energyRequired: 'baja',
    difficulty: 'medio',
    startRitual: `Elige el objeto conocido (${nombre || 'objeto'}). Lánzalo BAJO y CERCA — 1 metro.`,
    duration: 7,
    steps: [
      `Elige el objeto conocido (${nombre || 'objeto'}); lánzalo a 1 metro`,
      `Di "trae ${nombre || 'objeto'}" una sola vez`,
      'Cuando lo coge: baja al suelo, abre la mano — no le pidas que suelte todavía',
      'Di "suelta" solo cuando llega contigo; premio inmediato al soltar',
      'Repite 3–4 veces; para antes de que pierda interés',
    ],
    finish: '"Terminado"; guarda el objeto',
    alarm: 'Si coge y no viene: no persigas. Da la vuelta o aléjate — que te siga.',
    learns: 'Cooperación: coger → traer → soltar; base del retrieve',
  });
}

function bBuscarPersona() {
  return mkBlock({
    type: 'activacion', tag: 'buscarpers',
    title: 'Buscar persona en casa',
    purpose: 'Ejercicio mental usando olfato y vínculo — agota más que el ejercicio físico.',
    energyRequired: 'media',
    difficulty: 'medio',
    startRitual: 'Persona A sujeta a Shadow con suavidad. Persona B se esconde en lugar fácil primero.',
    duration: 8,
    steps: [
      'Persona A sujeta a Shadow con suavidad en la sala',
      'Persona B se esconde en otra habitación (empieza fácil: detrás de la puerta)',
      'Persona B llama: "Shadow, busca a [nombre]" — una sola vez',
      'Persona A suelta; Shadow va a buscar',
      'Al encontrarla: celebración tranquila + 1 trocito R4. Si la búsqueda fue difícil: jackpot de 3–5 trocitos R4, uno por uno',
      'Alterna quién se esconde; aumenta la dificultad gradualmente',
    ],
    finish: '"Terminado" con ambos presentes; descanso',
    alarm: 'Si se confunde: Persona B puede hacer ruidos suaves para guiar.',
    learns: 'Localizar humanos por nombre; vínculo; trabajo mental sin sobreactivación física',
  });
}

function bSignales(variante) {
  const variantes = {
    basico: {
      sub: '',
      steps: [
        'Trabaja en la sala en 3 series de 5 repeticiones',
        'Alterna "siéntate" y "échate" — no siempre el mismo orden',
        'Tasa de recompensa alta: premia cada respuesta correcta',
        'Si falla 2 veces seguidas, baja la dificultad o cambia de señal',
      ],
    },
    distancia: {
      sub: ' — a distancia',
      steps: [
        'Empieza a 1 m de Shadow y pide "siéntate"',
        'Aumenta gradualmente la distancia — hasta 3 m si responde bien',
        'Premia marcando "¡sí!" y acercándote a darle el premio (no llames)',
        'Practica "échate desde siéntate" sin cue intermedio',
      ],
    },
  };
  const v = variantes[variante] || variantes.basico;
  return mkBlock({
    type: 'activacion', tag: 'senales',
    title: `Señales básicas${v.sub}`,
    purpose: 'Respuesta rápida a señales básicas refuerza la orientación hacia el humano y la atención compartida.',
    energyRequired: 'media',
    difficulty: variante === 'distancia' ? 'medio' : 'fácil',
    startRitual: 'Trabaja en la sala con buena luz, sin distractores. Tres series de 5 repeticiones.',
    duration: 8,
    steps: v.steps,
    finish: '"Terminado"; deja al menos 1 minuto de silencio antes de la siguiente interacción',
    alarm: 'Si falla 2 veces seguidas: baja la dificultad o termina la sesión.',
    learns: 'Respuesta rápida a señales básicas; orientación hacia humano',
  });
}

function bExploracion() {
  return mkBlock({
    type: 'calma', tag: 'exploracion',
    title: 'Exploración olfativa (slow sniff)',
    purpose: 'Satisfacer la curiosidad a través del olfato, no del movimiento — el entorno se vuelve seguro y explorable.',
    energyRequired: 'baja',
    difficulty: 'fácil',
    startRitual: 'Esparce 5–8 objetos nuevos en el suelo antes de que entre. Da un paso atrás.',
    duration: 12,
    steps: [
      'Esparce 5–8 objetos nuevos en el suelo: cajas, telas, envases vacíos',
      'Deja que Shadow explore sin guiarla ni premiar — solo observa',
      'Si muerde algo que no debe → retira el objeto sin decir nada',
      'Si olfatea con calma más de 5 s un objeto → marca "¡sí!" suave + premia',
    ],
    finish: '"Terminado"; recoge los objetos',
    alarm: 'Pon alarma 12 min',
    learns: 'El entorno es seguro y explorable sin sobrestimulación; olfato como canal de calma',
  });
}

function b101Caja() {
  return mkBlock({
    type: 'activacion', tag: 'caja101',
    title: '101 cosas con una caja',
    purpose: 'Creatividad y confianza — Shadow descubre que sus propias decisiones generan recompensas.',
    energyRequired: 'media',
    difficulty: 'medio',
    startRitual: 'Coloca la caja en el suelo. Siéntate cerca. No des instrucciones. Espera.',
    duration: 10,
    steps: [
      'Pon una caja de cartón en el suelo y espera — no des instrucciones',
      'Marca y premia cualquier interacción (mirará, olfateará, pisará, moverá)',
      'Después de 3–4 repeticiones del mismo comportamiento, deja de premiar ese — espera algo nuevo',
      'Shadow descubre sola que sus acciones generan premios; no intervengas',
    ],
    finish: '"Terminado"; guarda la caja',
    alarm: 'Pon alarma 10 min',
    learns: 'Creatividad, confianza en sí misma, aprender a aprender',
  });
}

function bRelajacion() {
  return mkBlock({
    type: 'calma', tag: 'relajacion',
    title: 'Relajación guiada',
    purpose: 'Asociar al humano presente con relajación activa — no solo espera, sino descanso real compartido.',
    energyRequired: 'baja',
    difficulty: 'medio',
    startRitual: 'Pide "échate" en su colchoneta. Siéntate en el suelo cerca, voz muy baja.',
    duration: 12,
    steps: [
      'Pide "échate" en su colchoneta; siéntate en el suelo cerca',
      'Con voz muy baja y pausada, nombra lo que observas: "qué tranquila..."',
      'Cada 30 s que permanezca echada, deja caer un premio suavemente cerca',
      'Si se levanta: señala la colchoneta, no hables',
    ],
    finish: '"Terminado" susurrado; sal de la habitación',
    alarm: 'Pon alarma 12 min',
    learns: 'Echarse con el humano cerca se asocia a relajación activa, no solo espera',
  });
}

// ─── Exercise library data (for browser view) ─────────────────────────────
const EXERCISE_LIBRARY = [
  {
    key: 'tug', title: 'Tug controlado', subtitle: 'Muerde / Suelta', type: 'activacion', duration: '8 min',
    teaches: 'El humano controla inicio y fin del juego. Shadow aprende a morder solo objetos legales y a calmarse entre ráfagas.',
    when: 'Energía media-alta. Para canalizar el impulso de morder. NO si la mordida en manos/ropa está muy alta.',
    start: 'Presenta el juguete tú — Shadow no lo pide. Espera cuerpo calmado antes de iniciar.',
    steps: ['Juega 10–15 s, luego congela (para de moverte, sostén firme).', 'Cuando suelte: "¡sí!" + premio + "toma" para reiniciar.', 'Haz 5–6 ciclos; termina cuando todavía quiera más.'],
    finish: '"Terminado"; guarda el juguete completamente fuera de su vista.',
    alarm: 'Si muerde manos/ropa: paralízate completamente. Retira el juguete. Redirige a búsqueda olfativa o colchoneta.',
    mistakes: ['Seguir jugando después de morder manos.', 'Dejar el juguete a su alcance tras "terminado".', 'Terminar cuando ya está saturada.'],
  },
  {
    key: 'offsw', title: 'Terminado — off switch', subtitle: 'Apagar la activación', type: 'terminado', duration: '10 min',
    teaches: 'El juego tiene un final claro. La pausa no es castigo. La calma tiene recompensa.',
    when: 'Al final de cualquier juego activo. Cuando no puede parar sola. Si terminado está en "pobre" o "parcial".',
    start: 'Inicia 30 s de juego activo. Para de golpe: cruza los brazos, mira al frente.',
    steps: ['Congela completamente — ignora cualquier contacto.', 'Cuando baje la activación (se siente, mire a otro lado): marca y premia.', 'Repite 4–5 ciclos activo/calma; aumenta el tiempo de calma requerido.'],
    finish: 'Último ciclo termina en calma real. Di "terminado" y sal de la zona de juego.',
    alarm: 'Si sigue escalando: abandona el espacio 2 min. Regresa solo cuando esté tumbada o quieta.',
    mistakes: ['Repetir "terminado" varias veces.', 'Volver a jugar antes de calma real.', 'Subir el tono de voz.'],
  },
  {
    key: 'busqueda', title: 'Búsqueda olfativa', subtitle: 'Nivel 1 y 2', type: 'activacion', duration: '8–10 min',
    teaches: 'Canal olfativo, control de impulsos, transición activo→calma. El olfato regula el sistema nervioso mejor que el movimiento.',
    when: 'Después de tug o juego activo. Cuando está sobreactivada. Como alternativa a ejercicio físico durante la cuarentena.',
    start: 'Prepara 5–8 premios. Deja que huela tu mano cerrada. Di "busca" con calma.',
    steps: ['Nivel 1: esconde premios a la vista (patas de muebles, bajo alfombra).', 'Nivel 2: lugares más difíciles, otra habitación, sin señalar.', 'Silencio total durante la búsqueda.', 'Marca "¡sí!" suave cada hallazgo; premia en el suelo.'],
    finish: '"Terminado", retira premios restantes, siéntate a ignorarla 30 s.',
    alarm: 'Si pierde interés: simplifica. Si sigue sin interés, descansa — puede ser saturación sensorial.',
    mistakes: ['Hablar durante el olfateo.', 'Premios demasiado difíciles al principio.', 'Terminar antes de que ella decida parar.'],
  },
  {
    key: 'colchoneta', title: 'Manta de calma', subtitle: 'Lugar de descanso activo', type: 'calma', duration: '10 min',
    teaches: 'Ir a su lugar voluntariamente. El descanso tiene valor. Regulación del sistema nervioso.',
    when: 'Cuando está sobreactivada. Como entrenamiento base de calma. Antes de comida o actividad.',
    start: 'Señala la colchoneta con el dedo y espera. Nunca empujes ni la pongas físicamente.',
    steps: ['Premia cualquier contacto con la colchoneta.', 'Luego solo premia si está tumbada.', 'Aumenta el tiempo de quietud antes del premio (1 s → 3 s → 5 s).', 'Silencio total durante el ejercicio.'],
    finish: '"Terminado" + aléjate; deja que ella decida salir sola.',
    alarm: 'Si no puede quedarse quieta: reduce a 3 segundos. Si sigue — señal de sobreestimulación, pausa sin entrenamiento.',
    mistakes: ['Pedir "quieta" verbalmente antes de que lo entienda.', 'Recompensar cuando se mueve.', 'Entrenar cuando está muy activada.'],
  },
  {
    key: 'captura', title: 'Captura de calma', subtitle: 'Refuerzo del estado espontáneo', type: 'calma', duration: '10 min',
    teaches: 'La calma tiene valor sin pedirla. El sistema nervioso puede regularse solo.',
    when: 'Cuando se tumba espontáneamente. Durante tiempo libre. Después de actividad.',
    start: 'Siéntate en la habitación con Shadow suelta. Ignórala totalmente — ten premios listos.',
    steps: ['Cuando baje el ritmo (se siente, olfatee despacio, bostece): marca "¡sí!" muy suave.', 'Tira el premio al suelo lejos de ti — sin contacto.', 'Haz 5–8 capturas; para antes de que busque llamar tu atención.'],
    finish: 'Sal de la habitación silenciosamente — sin cue de terminado.',
    alarm: 'Si el premio la activa más: premia más lejos, sin contacto visual, premio más pequeño.',
    mistakes: ['Hablar al recompensar.', 'Acariciarla con energía.', 'Premiar cuando se levanta hacia ti.'],
  },
  {
    key: 'objeto', title: 'Nombre de objeto', subtitle: 'Vocabulario táctil', type: 'calma', duration: '7 min',
    teaches: 'Asociar palabras con objetos. Enfoque mental. Base para "trae" y "busca por nombre".',
    when: 'Sesiones tranquilas. No más de 1 objeto nuevo cada 3–4 días. Consolida antes de añadir otro.',
    start: 'Elige UN objeto. Nómbralo al dárselo. Nunca dos objetos nuevos a la vez.',
    steps: ['Muestra el objeto; di su nombre una vez.', 'Cuando lo toca: "¡sí!" + premio.', 'Pon en el suelo: espera que vaya → marca al primer contacto.', 'Tras 4–5 éxitos, mezcla con otro objeto ya conocido.'],
    finish: '"Terminado"; guarda el objeto fuera de su vista.',
    alarm: 'Si se frustra o pierde interés: demasiado rápido. Vuelve al objeto más simple.',
    mistakes: ['Dos objetos nuevos a la vez.', 'Cambiar los objetos cada día.', 'Recompensar si coge el objeto equivocado.'],
  },
  {
    key: 'touch', title: 'Touch — nariz a mano', subtitle: 'Orientación voluntaria', type: 'calma', duration: '5 min',
    teaches: 'Orientarse hacia el humano voluntariamente. Base para recall y señales a distancia.',
    when: 'Para redirigir la atención. Después de un reset. Como inicio de sesión de baja intensidad.',
    start: 'Extiende la palma plana a la altura de su nariz. Espera — no la llames, no la toques.',
    steps: ['Mano plana, inmóvil, a la altura de su nariz.', 'Cuando la toca con nariz: "¡sí!" inmediato + premio.', 'Repite 5 veces.', 'Añade distancia gradualmente; cambia de mano.'],
    finish: '"Terminado"; retira la mano.',
    alarm: 'Si muerde la mano: para. Espera calma. Reinicia con mano más alta o más lejos.',
    mistakes: ['Mover la mano hacia ella.', 'Recompensar si muerde.', 'Más de 6 repeticiones seguidas.'],
  },
  {
    key: 'espera', title: 'Espera — control de impulso', subtitle: 'Antes del recurso', type: 'calma', duration: '6 min',
    teaches: 'Frustración tolerable. Autocontrol antes de la recompensa.',
    when: 'Antes de comida. Antes de salir. Antes de iniciar el juego.',
    start: 'Bloquea el acceso con tu cuerpo. Sin decir nada. Espera.',
    steps: ['Bloquea el acceso.', 'Espera 2–3 segundos de quietud.', 'Di "ya" o "adelante" y permite.', 'Si se lanza antes: bloquea sin drama. Sin palabras.', 'Aumenta el tiempo gradualmente.'],
    finish: 'Permiso claro con una señal. Sin repetir.',
    alarm: 'Si la frustración escala a mordiscos: reduce el criterio. Recompensa 1 segundo de pausa.',
    mistakes: ['Decir "espera" muchas veces.', 'Dar permiso antes de quietud real.', 'Escalar el tiempo demasiado rápido.'],
  },
  {
    key: 'masticado', title: 'Masticado legal', subtitle: 'Kong o hueso', type: 'calma', duration: '15 min',
    teaches: 'Morder objetos legales es satisfactorio. Autorregulación. Mordida ≠ manos.',
    when: 'Alta necesidad de morder. Como alternativa a manos/ropa. Tiempo de calma supervisada.',
    start: 'Prepara Kong o hueso (relleno congelado si es posible). Dáselo en su colchoneta.',
    steps: ['Dáselo en su rincón o colchoneta favorita.', 'Siéntate cerca sin interactuar.', 'Si deja el objeto: señala sin hablar.', 'Supervisa para quitar trozos pequeños.'],
    finish: '"Terminado"; recoge el objeto tras el tiempo.',
    alarm: 'Si se sobreactiva y no puede quedarse con el objeto: retira. Ofrece búsqueda olfativa.',
    mistakes: ['Dejarla sola con materiales peligrosos.', 'Intervenir durante el masticado legal.', 'Usar como sustituto de entrenamiento real.'],
  },
  {
    key: 'caja101', title: '101 cosas con una caja', subtitle: 'Creatividad y confianza', type: 'activacion', duration: '10 min',
    teaches: 'Creatividad. Confianza en sí misma. Aprender a aprender. Canal de mordida a objeto legal.',
    when: 'Alta necesidad de morder. Como alternativa al tug si la mordida está alta.',
    start: 'Pon una caja de cartón en el suelo. Espera — no des instrucciones.',
    steps: ['Marca y premia cualquier interacción (mira, olfatea, pisa, muerde, mueve).', 'Tras 3–4 repeticiones del mismo comportamiento: deja de premiar ese — espera algo nuevo.', 'Nunca intervengas. Deja que resuelva sola.'],
    finish: '"Terminado"; guarda la caja.',
    alarm: 'Si se frustra y abandona: tira un premio dentro para despertar el interés.',
    mistakes: ['Guiar o señalar lo que debe hacer.', 'No retirar la caja al "terminado".'],
  },
  {
    key: 'reset', title: 'Reset corto', subtitle: 'Separación de regulación', type: 'calma', duration: '3 min',
    teaches: 'La activación tiene un final. La calma abre la siguiente interacción.',
    when: 'Cuando no puede parar. Después de morder ropa/manos. Cuando el entrenamiento no funciona.',
    start: 'Sin drama. Di "terminado" una vez. Sal del espacio o coloca una barrera.',
    steps: ['Di "terminado" en tono neutro.', 'Sal o coloca barrera baja.', 'Espera silencio o quietud — mínimo 20 s.', 'Regresa con calma; no celebres.', 'Reanuda con algo de baja intensidad.'],
    finish: 'Regresas cuando hay calma real.',
    alarm: 'Si sigue llorando o rascando después de 3 min: espera más.',
    mistakes: ['Volver antes de calma real.', 'Regañar antes de salir.', 'Usar la jaula como castigo.'],
  },
  {
    key: 'traer', title: 'Mini misión — traer objeto', subtitle: 'Base del retrieve', type: 'calma', duration: '7 min',
    teaches: 'Cooperación: coger → traer → soltar. Base del retrieve. Vínculo y comunicación.',
    when: 'Cuando ya conoce el nombre del objeto. Sesiones tranquilas.',
    start: 'Elige el objeto conocido. Lánzalo a 1 metro.',
    steps: ['Lanza el objeto a 1 m.', 'Di "trae [nombre]" una vez.', 'Cuando lo coge: baja al suelo, abre la mano.', 'Di "suelta" cuando llega; premio inmediato.', 'Repite 3–4 veces.'],
    finish: '"Terminado"; guarda el objeto.',
    alarm: 'Si coge y no viene: no persigas. Da la vuelta o huye ligeramente para que te siga.',
    mistakes: ['Perseguirla si no viene.', 'Recompensar si no suelta.', 'Más de 5 repeticiones.'],
  },
  {
    key: 'buscarpers', title: 'Buscar persona en casa', subtitle: 'Juego de vínculo', type: 'activacion', duration: '8 min',
    teaches: 'Localizar humanos por nombre. Vínculo. Trabajo mental sin sobreactivación física.',
    when: 'Con dos personas en casa. Cuando está medio activada.',
    start: 'Persona A sujeta a Shadow. Persona B se esconde (empieza fácil).',
    steps: ['Persona B llama: "Shadow, busca a [nombre]" — una vez.', 'Persona A suelta.', 'Al encontrarla: celebración tranquila + 1 trocito R4. Si fue difícil: jackpot de 3–5 trocitos R4, uno por uno.', 'Alterna quién se esconde.'],
    finish: '"Terminado" con ambos presentes; descanso.',
    alarm: 'Si se confunde: Persona B puede hacer ruidos suaves para guiar.',
    mistakes: ['Esconderse demasiado difícil al principio.', 'Llamar mientras busca.', 'No celebrar al encontrar.'],
  },
  {
    key: 'exploracion', title: 'Exploración olfativa', subtitle: 'Slow sniff', type: 'calma', duration: '12 min',
    teaches: 'El entorno es seguro y explorable. Olfato como canal de calma.',
    when: 'Como sesión de enriquecimiento. Después de actividad.',
    start: 'Esparce 5–8 objetos nuevos en el suelo. Deja que explore sin guiarla.',
    steps: ['Deja que explore sin premiar — solo observa.', 'Si muerde algo que no debe: retira el objeto sin decir nada.', 'Si olfatea con calma más de 5 s un objeto: "¡sí!" suave + premia.'],
    finish: '"Terminado"; recoge los objetos.',
    alarm: 'Si se sobreactiva: reduce a 2–3 objetos. Si sigue, retira todo y ofrece colchoneta.',
    mistakes: ['Intervenir demasiado.', 'Objetos que la exciten en exceso al principio.'],
  },
  {
    key: 'relajacion', title: 'Relajación guiada', subtitle: 'Echada con presencia', type: 'calma', duration: '12 min',
    teaches: 'Echarse con el humano cerca = relajación activa.',
    when: 'Al final del día. Después de una sesión activa.',
    start: 'Pide "échate" en su colchoneta. Siéntate en el suelo cerca.',
    steps: ['Con voz muy baja y pausada, nombra lo que observas: "qué tranquila…".', 'Cada 30 s que permanezca echada: deja caer un premio suavemente cerca.', 'Si se levanta: señala la colchoneta; no hables.'],
    finish: '"Terminado" susurrado; sal de la habitación.',
    alarm: 'Si no puede permanecer echada: reduce el tiempo. Premia 5 s de quietud.',
    mistakes: ['Voz demasiado alta o entusiasta.', 'Recompensar cuando se mueve.'],
  },
  {
    key: 'senales', title: 'Señales básicas', subtitle: 'Siéntate / Échate', type: 'activacion', duration: '8 min',
    teaches: 'Respuesta rápida a señales básicas. Orientación hacia humano.',
    when: 'Sesiones de entrenamiento básico.',
    start: 'Trabaja en la sala con buena iluminación. Sin distractores.',
    steps: ['3 series de 5 repeticiones; alterna "siéntate" y "échate".', 'Tasa de recompensa alta.', 'Si falla 2 veces: baja la dificultad.', 'Variante avanzada: a 1–3 m de distancia.'],
    finish: '"Terminado"; silencio 1 min.',
    alarm: 'Si se frustra repetidamente: termina la sesión.',
    mistakes: ['Repetir la señal si no responde.', 'Sesiones de más de 10 min.'],
  },
];

// ─── Outdoor routine library ──────────────────────────────────────────────
// A Malinois needs variety and regulation, not maximum intensity every day.
const OUTDOOR_ROUTINES = [
  {
    key: 'sanitaria', title: 'Salida sanitaria', subtitle: 'Pipí / caca sin convertirlo en fiesta',
    type: 'base', duration: '5–15 min', frequency: 'Al despertar · después de comer o jugar · antes de dormir',
    intensity: 'baja', rewardLevel: 1,
    purpose: 'Resolver la necesidad fisiológica con una rutina predecible. No toda salida tiene que cansarla.',
    condition: 'Si aún no tiene autorización veterinaria para pisar zonas públicas: usa el espacio seguro indicado por su veterinario.',
    start: 'Correa y tono neutro. Ve al mismo punto primero. Dale tiempo para olfatear.',
    steps: ['Espera sin meter prisa.', 'Cuando haga pipí o caca: marca suave + 1 trocito R2 si estás consolidando el hábito.', 'Después permite 2–5 min de olfato tranquilo si el contexto lo permite.', 'Vuelve a casa sin añadir juego intenso.'],
    finish: 'Entrada tranquila. Agua disponible. Sigue con el día.',
    stop: 'Si se acelera, tira o busca juego: reduce estímulo. Esta salida no es una sesión de descarga.',
  },
  {
    key: 'sniffwalk', title: 'Paseo olfativo', subtitle: 'Nariz libre · descompresión',
    type: 'calma', duration: '20–40 min adulta · adaptar si es cachorro', frequency: 'Diario',
    intensity: 'baja-media', rewardLevel: 1,
    purpose: 'La salida base. Explorar con la nariz regula mejor que intentar agotarla físicamente.',
    condition: 'Si es cachorro: prioriza bajo impacto, ritmo libre y descansos. Ajusta duración con su veterinario.',
    start: 'Arnés cómodo y correa larga donde sea seguro. Di "olfatea" una vez y baja tu ritmo.',
    steps: ['Deja que elija olores y pare cuanto necesite.', 'No la arrastres para completar una distancia.', 'Premia check-ins espontáneos con R2 si necesitas reforzarlos.', 'Incluye 2–3 min de observación tranquila sentada o de pie.'],
    finish: 'Últimos 3–5 min muy lentos. Entrada a casa sin juego activo.',
    stop: 'Jadeo excesivo, incapacidad para olfatear, tirones continuos o hipervigilancia: acorta y vuelve a una zona más fácil.',
  },
  {
    key: 'socialdist', title: 'Socialización tranquila', subtitle: 'Ver perros sin tener que saludarlos',
    type: 'social', duration: '10–20 min', frequency: '2–4 veces / semana',
    intensity: 'baja-media', rewardLevel: 3,
    purpose: 'Aprender neutralidad. Socializar no significa jugar con todos los perros.',
    condition: 'Evita parques caninos y perros desconocidos si no tiene la pauta veterinaria necesaria o si el entorno no es controlable.',
    start: 'Busca una distancia donde pueda ver al otro perro y todavía aceptar premio, olfatear o mirarte.',
    steps: ['Ve un perro a distancia: marca cualquier mirada tranquila o check-in contigo.', 'Premia con 1 trocito R3 y deja que vuelva a observar u olfatear.', 'No fuerces acercamientos frontales.', 'Acorta distancia solo si mantiene cuerpo suelto y puede desconectar.', 'Termina con 3–5 min de paseo olfativo.'],
    finish: 'Aléjate en curva. No esperes a que se sature.',
    stop: 'Cuerpo rígido, fijación visual, ladrido, embestida, esconderse o dejar de aceptar premio: aumenta distancia y termina.',
  },
  {
    key: 'parallel', title: 'Paseo paralelo con perro conocido', subtitle: 'Compañía sin presión',
    type: 'social', duration: '15–30 min', frequency: '1–2 veces / semana',
    intensity: 'media', rewardLevel: 3,
    purpose: 'Practicar convivencia con un perro estable sin obligarla a interactuar.',
    condition: 'Solo con un perro tranquilo, sano y compatible. Empieza con distancia. No saludo frontal con correas tensas.',
    start: 'Dos humanos. Caminad en la misma dirección con varios metros de separación.',
    steps: ['Empieza lejos: ambos perros pueden olfatear y caminar.', 'Reduce distancia gradualmente si los dos cuerpos siguen sueltos.', 'Premia check-ins y caminar sin fijación con 1 trocito R3.', 'Si ambos están cómodos, permite un saludo lateral breve de 2–3 s y vuelve a caminar.', 'No conviertas la sesión en juego libre por defecto.'],
    finish: 'Separación en curva + 5 min de olfato individual.',
    stop: 'Fijación, tensión de correa, persecución unilateral, monta o incapacidad de separarse: aumenta distancia o termina.',
  },
  {
    key: 'urbanwalk', title: 'Caminata urbana con check-ins', subtitle: 'Correa suelta · entorno real',
    type: 'habilidad', duration: '15–35 min', frequency: '3–5 veces / semana',
    intensity: 'media', rewardLevel: 3,
    purpose: 'Practicar caminar contigo sin perder el acceso a olfatear. La ciudad también es entrenamiento.',
    condition: 'Empieza en calles fáciles. Evita horas punta hasta que pueda responder y recuperar calma.',
    start: 'Arnés cómodo. Primer minuto lento. Premia dos o tres check-ins tempranos.',
    steps: ['Correa suelta: sigue caminando o permite olfatear.', 'Tensión constante: para o cambia de dirección sin tirón.', 'Cada check-in espontáneo: 1 trocito R3 al principio; luego alterna con acceso a olfatear.', 'Cruza la calle antes de que una distracción la lleve al límite.', 'Incluye pequeñas pausas de observación tranquila.'],
    finish: 'Últimos 3 min de olfato fácil cerca de casa.',
    stop: 'No puede aceptar comida, escanea sin parar o tarda mucho en recuperar: el entorno es demasiado difícil hoy.',
  },
  {
    key: 'fetch', title: 'Buscar pelota — estructurado', subtitle: 'Cobro corto · suelta · pausa',
    type: 'juego', duration: '5–8 min', frequency: '1–3 veces / semana',
    intensity: 'alta', rewardLevel: 3,
    purpose: 'Usar su impulso de persecución sin crear una máquina de lanzar pelota ni una escalada infinita.',
    condition: 'Superficie estable. Si es cachorro: rueda la pelota o lanza bajo y cerca; evita saltos, frenadas y giros repetidos.',
    start: 'Pelota guardada hasta empezar. Pide 1 segundo de pausa. Lanza bajo, no lejos.',
    steps: ['Haz 4–6 lanzamientos como máximo.', 'Al volver: "suelta" → 1 trocito R3 o segunda pelota → pausa breve.', 'Alterna un lanzamiento con 20–30 s de olfato o quietud.', 'Termina cuando todavía quiera continuar.', 'Después haz 5 min de paseo olfativo.'],
    finish: '"Terminado". Guarda la pelota fuera de su vista. Descompresión olfativa.',
    stop: 'No puede soltar, ignora agua, vocaliza, salta de forma descontrolada o no baja revoluciones: fin inmediato.',
  },
  {
    key: 'freerun', title: 'Carrera libre controlada', subtitle: 'Movimiento a su ritmo',
    type: 'fisico', duration: '10–20 min', frequency: '1–3 veces / semana',
    intensity: 'alta', rewardLevel: 4,
    purpose: 'Permitir aceleraciones naturales y exploración sin imponer un ritmo humano sostenido.',
    condition: 'Solo en zona cerrada segura o con línea larga hasta tener una llamada fiable. Evita calor y suelo abrasivo.',
    start: 'Primero 5 min de paseo olfativo. Comprueba el espacio. Suelta o usa línea larga.',
    steps: ['Deja que alterne carrera, olfato y pausa por sí misma.', 'Haz 1–2 llamadas fáciles durante la sesión.', 'Cada llamada excelente: 1 trocito R4. Una llegada especialmente rápida puede recibir jackpot.', 'No la persigas ni añadas pelota si ya está acelerada.', 'Agua y pausa antes de volver.'],
    finish: '5–10 min de olfato lento con correa antes de entrar.',
    stop: 'Pierde respuesta a la llamada, persigue bicicletas/animales, jadea en exceso o no hace pausas espontáneas: termina.',
  },
  {
    key: 'running', title: 'Correr contigo — intervalos', subtitle: 'Solo adulta + OK veterinario',
    type: 'fisico', duration: '20–40 min total al empezar', frequency: '1–3 veces / semana como máximo',
    intensity: 'alta', rewardLevel: 1, conditionBadge: 'SOLO ADULTA + OK VET',
    purpose: 'Construir capacidad aeróbica gradualmente. No usar la carrera como único canal de bienestar.',
    condition: 'Solo cuando esté completamente desarrollada y su veterinario haya dado el visto bueno. No hacer jogging impuesto con un cachorro.',
    start: 'Baño primero. Arnés adecuado. Deja al menos 2 h después de comer. Elige tierra o hierba y una hora fresca.',
    steps: ['Empieza con 5 min caminando.', 'Alterna 1 min trote + 2 min caminata durante 15–20 min.', 'Deja pausas para olfatear y beber.', 'Aumenta volumen gradualmente, no distancia y velocidad a la vez.', 'Termina con 5–10 min caminando lento.'],
    finish: 'Agua, sombra y reposo. Revisa almohadillas.',
    stop: 'Se queda atrás, cambia la pisada, jadea de forma excesiva, se descoordina o intenta parar: detén la carrera.',
  },
  {
    key: 'beach', title: 'Playa', subtitle: 'Olfato · arena · agua sin forzar',
    type: 'entorno', duration: '20–45 min', frequency: 'Ocasional',
    intensity: 'media', rewardLevel: 2,
    purpose: 'Explorar una superficie y un entorno ricos sin convertir la visita en carrera continua.',
    condition: 'Comprueba normativa local, temperatura de la arena, oleaje y acceso a sombra. Línea larga hasta recall fiable.',
    start: 'Primero paseo lento por arena firme. Lleva agua dulce y cuenco.',
    steps: ['Deja que explore la orilla a su ritmo.', 'No la obligues a entrar al agua ni a nadar.', 'Evita que beba agua de mar.', 'Si juegas con pelota: 3–4 lanzamientos bajos como máximo.', 'Intercala sombra, agua dulce y pausas.'],
    finish: 'Enjuaga con agua dulce si se ha mojado. Revisa almohadillas y orejas.',
    stop: 'Jadeo excesivo, arena muy caliente, bebe agua de mar repetidamente, oleaje fuerte o no puede regularse: termina.',
  },
  {
    key: 'mountain', title: 'Montaña / sendero', subtitle: 'Exploración larga · desnivel gradual',
    type: 'entorno', duration: '45–120 min adulta · ruta corta si cachorro', frequency: '1 vez / semana o quincenal',
    intensity: 'media-alta', rewardLevel: 2,
    purpose: 'Combinar vínculo, olfato, propiocepción y resistencia sin buscar rendimiento máximo.',
    condition: 'Si es cachorro: terreno fácil, ruta corta y ritmo libre. Para rutas largas o desnivel sostenido: madurez física y OK veterinario.',
    start: 'Ruta conocida o sencilla. Arnés, correa o línea larga, agua, cuenco y premios. Revisa clima.',
    steps: ['Empieza lento durante 10 min.', 'Deja pausas de olfato frecuentes.', 'Descansa antes de que lo pida.', 'Línea larga si hay fauna, ciclistas o recall imperfecto.', 'Revisa almohadillas y energía a mitad de ruta.'],
    finish: 'Últimos 10 min lentos. Agua. Revisión de almohadillas y cuerpo al llegar.',
    stop: 'Calor, cojera, tropiezos, persecución de fauna, jadeo intenso o dificultad para recuperar: da la vuelta.',
  },
];

// ─── Weekly objectives ────────────────────────────────────────────────────
// Edit these to change the weekly focus text shown on the HOY dashboard.
// Keys match correctionGoal in settings.
const WEEKLY_OBJECTIVES = {
  biting:         { title: 'Inhibición de mordida', focus: 'Reducir frecuencia e intensidad de mordiscos en manos y ropa', tip: 'Outlets legales antes de escalar · congela al primer contacto con piel · redirige siempre a objeto.' },
  overexcitement: { title: 'Reducir sobreestimulación', focus: 'Bajar la activación nocturna antes de dormir', tip: 'Sin tug ni juego activo después de las 19h · sniff y colchoneta como cierre de día.' },
  jumping:        { title: 'Cuatro patas en el suelo', focus: 'Quitar toda recompensa al salto — en saludos y en excitación', tip: 'Giro de espalda en cada salto · premio inmediato al primer momento con cuatro patas.' },
  recall:         { title: 'Llamada interior fiable', focus: 'Shadow viene siempre, sin excepciones', tip: 'Nunca uses su nombre antes de algo malo · R4 en cada llegada · jackpot de 3–5 trocitos solo en las 2 mejores · practica solo dentro de casa.' },
  calming:        { title: 'Calma en colchoneta', focus: 'Asentamiento voluntario y sostenido en su lugar', tip: 'Dos sesiones diarias en colchoneta · captura el estado espontáneo · amplía el tiempo gradualmente.' },
  frustration:    { title: 'Confianza en separaciones', focus: 'Tiempo solo sin angustia ni vocalización', tip: 'Empieza con 3 minutos · regresa antes de que vocalice · construye gradualmente semana a semana.' },
};

// ─── Escalation protocol ──────────────────────────────────────────────────
// Edit ESCALATION_STEPS to update the de-escalation protocol shown on the button.
const ESCALATION_STEPS = [
  { action: 'Para el juego físico — completamente', detail: 'Congela. Sin persecución, sin forcejeo, sin voz.' },
  { action: 'Baja tu voz y tu movimiento', detail: 'Tono neutro o silencio total. Cuerpo quieto. Sin contacto visual intenso.' },
  { action: 'Retira el acceso con calma', detail: 'Sal tú de la zona o bloquea el espacio. Sin drama ni castigo.' },
  { action: 'Redirige a olfato, masticado o colchoneta', detail: 'Búsqueda olfativa, Kong, hueso o señala la colchoneta — una sola vez.' },
  { action: 'Termina la sesión', detail: '"Terminado" una sola vez en tono neutro. No vuelvas a juego activo hoy.' },
  { action: 'Anota el detonante después', detail: '¿Qué ocurrió justo antes? ¿Hora del día? ¿Duración de la sesión? Registra en el diario.' },
];

// ─── Behavior selector plans ──────────────────────────────────────────────
// Edit BEHAVIOR_PLANS to update the daily plan shown for each behavior topic.
// Each key matches a button in the PLAN view.
// Sessions require: slot, title, duration, purpose, energyRequired, difficulty,
//   startRitual, steps[], endRitual, warningSign, successLooks
const BEHAVIOR_PLANS = {

  // ── Mordida ──────────────────────────────────────────────────────────────
  mordida: {
    label: 'Mordida',
    sub: 'manos / ropa',
    purpose: 'Reducir frecuencia e intensidad. Redirigir el impulso de mandíbula a objetos legales. El objetivo no es suprimir el juego de mordida — es canalizarlo.',
    sessions: [
      {
        slot: 'Mañana',
        title: 'Masticado legal — carga el Kong',
        duration: 15,
        purpose: 'Dar a la mandíbula un outlet legal antes de que empiece la interacción del día.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Prepara el Kong o hueso la noche anterior (congelado es mejor). Colócalo en su colchoneta sin excitación.',
        steps: [
          'Coloca el Kong en su colchoneta antes de que se acerque.',
          'Señala la colchoneta una vez. Sin hablar más.',
          'Siéntate cerca sin hacer contacto visual.',
          'Si deja el Kong y busca tus manos: señala el objeto sin hablar.',
          '"Terminado" tras 15 min. Recoge el Kong con calma.',
        ],
        endRitual: 'Recoge el Kong. 30 segundos sin interacción. Luego retoma el día con normalidad.',
        warningSign: 'Deja el Kong y empieza a morderte inmediatamente — redirige una vez al Kong. Si no funciona, ofrece búsqueda olfativa.',
        successLooks: 'Mastica durante 10+ minutos sin buscar tus manos ni ropa.',
      },
      {
        slot: 'Tarde',
        title: 'Tug controlado + terminado',
        duration: 8,
        purpose: 'Canal de mordida legal con el humano en control. Practicar el off-switch: inicio y fin claros.',
        energyRequired: 'alta',
        difficulty: 'medio',
        startRitual: 'Produce el juguete de tug TÚ. Shadow no lo pide. Espera cuerpo sin saltos antes de iniciar.',
        steps: [
          'Presenta el juguete con calma. Espera cuerpo relajado antes de que lo coja.',
          'Juega 10–15 segundos. Luego: congela — para completamente, sostén firme.',
          'Espera que suelte. Al soltar: "¡sí!" + premio.',
          'Di "toma" para reiniciar. Repite 5–6 ciclos.',
          'Termina un ciclo antes de que ella quiera parar.',
        ],
        endRitual: '"Terminado" una vez. Juguete completamente fuera de su vista. 2 min de búsqueda olfativa.',
        warningSign: 'Dientes en tu mano o brazo — congela completamente, sin palabras, retira el juguete 30 seg.',
        successLooks: 'Suelta en al menos 3 de 5 ciclos. Sin contacto piel durante el juego.',
      },
      {
        slot: 'Noche',
        title: 'Captura de calma — cierre de día',
        duration: 10,
        purpose: 'Reforzar el estado tranquilo que aparece solo. Cerrar el día con calma, no con supresión.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Siéntate en la habitación. 5–8 premios en el bolsillo. Sin contacto visual con Shadow.',
        steps: [
          'Ignórala completamente. Observa en silencio.',
          'Cuando baje el ritmo (se tumbe, olfatee despacio, bostece): "¡sí!" muy suave.',
          'Tira el premio cerca de ella — sin contacto directo.',
          '5–8 capturas. Para antes de que empiece a "actuar" para conseguir el premio.',
        ],
        endRitual: 'Sal de la habitación en silencio. Sin cue de terminado.',
        warningSign: 'Empieza a buscarte activamente para conseguir el premio — bajaste el criterio demasiado. Espera más calma.',
        successLooks: 'Se tumba espontáneamente al menos una vez durante la sesión.',
      },
    ],
  },

  // ── Saltos ────────────────────────────────────────────────────────────────
  saltos: {
    label: 'Saltos',
    sub: 'en saludos',
    purpose: 'Quitar toda recompensa al salto. Construir un default de cuatro patas en el suelo ante la excitación.',
    sessions: [
      {
        slot: 'Mañana',
        title: 'Espera antes de cada saludo',
        duration: 5,
        purpose: 'Practicar el momento de impulso antes de la primera interacción del día.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'No te acerques tú primero. Espera a que venga. Cuando viene: para completamente.',
        steps: [
          'Cuando se acerque: para, brazos pegados al cuerpo.',
          'En el instante en que las cuatro patas están en el suelo: agáchate y saluda con calma.',
          'Si salta: gira de espalda. Espera cuatro patas. Inténtalo de nuevo.',
          'Este ejercicio es cada saludo matutino — la consistencia es todo.',
        ],
        endRitual: 'Saludo tranquilo de 2 segundos. Luego aléjate y retoma la mañana.',
        warningSign: 'Escala a giros o vocalización — estás siendo demasiado excitante. Entra a otra habitación, vuelve en 2 minutos.',
        successLooks: 'Las cuatro patas permanecen en el suelo durante el saludo completo.',
      },
      {
        slot: 'Tarde',
        title: 'Práctica de umbrales — entradas',
        duration: 10,
        purpose: 'Entrenar el saludo en la puerta de forma sistemática hasta que el salto pierda todo valor.',
        energyRequired: 'media',
        difficulty: 'medio',
        startRitual: 'Entra a la casa o habitación y para inmediatamente. Sin hablar. Sin contacto visual.',
        steps: [
          'Entra y congela. Ignora saltos, vocalizaciones, giros.',
          'En el segundo que las cuatro patas tocan el suelo: marcador suave + agáchate.',
          'Si vuelve a saltar durante el saludo: levántate, repite.',
          '3–4 entradas por sesión. 2 minutos entre cada una.',
        ],
        endRitual: 'Tras el último saludo tranquilo: un premio y aléjate.',
        warningSign: 'Sigue saltando tras 4 repeticiones — está demasiado activada. Dale un Kong y prueba en 30 min.',
        successLooks: 'Al menos un saludo completo con cuatro patas en el suelo de principio a fin.',
      },
      {
        slot: 'Noche',
        title: 'Colchoneta como comportamiento alternativo al salto',
        duration: 10,
        purpose: 'Darle un comportamiento claro y premiado que reemplaza el salto: ir a su sitio.',
        energyRequired: 'baja',
        difficulty: 'medio',
        startRitual: 'Coloca la colchoneta cerca del punto de saludo habitual. Señálala una vez.',
        steps: [
          'Señala la colchoneta. Cuando pise: "¡sí!" + premio en la colchoneta.',
          'Construye duración: 3 seg → 5 → 8 antes de premiar.',
          'Acércate mientras está en la colchoneta — que permanezca.',
          '6–8 repeticiones totales.',
        ],
        endRitual: '"Terminado" + aléjate. Que salga sola.',
        warningSign: 'Deja la colchoneta cada vez que te acercas — ve demasiado rápido. Premia solo por estar sin que te acerques.',
        successLooks: 'Aguanta en la colchoneta mientras te acercas al menos dos veces.',
      },
    ],
  },

  // ── Sofá ──────────────────────────────────────────────────────────────────
  sofa: {
    label: 'Sofá',
    sub: 'subir / bajar',
    purpose: 'Reglas claras y consistentes sobre el mueble. Construir un cue "baja" confiable sin conflicto.',
    sessions: [
      {
        slot: 'Mañana',
        title: 'Cue "baja" — práctica de baja activación',
        duration: 6,
        purpose: 'Enseñar "baja" como señal que predice un premio, no una corrección.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Ella está en el sofá o la invitas a subir (si está permitido). Premio en la mano.',
        steps: [
          'Con premio en mano, di "baja" una vez con calma.',
          'Si necesitas: usa el premio para guiar hacia el suelo.',
          'Al tocar las cuatro patas el suelo: "¡sí!" + premio.',
          'Repite 4–5 veces. Para antes de que se aburra.',
        ],
        endRitual: 'Último rep: baja, premio, no la reinvitas. Fin de sesión.',
        warningSign: 'Gruñe o amenaza al bajar — no la presiones. Lanza el premio al suelo sin acercarte.',
        successLooks: 'Baja con la señal (sin necesitar el lure) al menos dos veces.',
      },
      {
        slot: 'Tarde',
        title: 'Gestión de acceso — espera para subir',
        duration: 8,
        purpose: 'El acceso al sofá se gana con calma — no es automático.',
        energyRequired: 'baja',
        difficulty: 'medio',
        startRitual: 'Bloquea el sofá con tu cuerpo cuando se acerca en carrera.',
        steps: [
          'Cuando se acerque al sofá: para sin decir nada, interponte.',
          'Espera un siéntate o parada calmada.',
          'Si está tranquila: di "sube" y permite.',
          'Si sube sin esperar: ninguna reacción, bloquea de nuevo. Espera 30 seg.',
        ],
        endRitual: 'Practica "baja" una vez antes de terminar — baja, premio, fin.',
        warningSign: 'Gruñe cuando te acercas mientras está en el sofá — consulta a un profesional. No la retires físicamente.',
        successLooks: 'Espera al menos una vez la invitación antes de subir.',
      },
      {
        slot: 'Noche',
        title: 'Colchoneta como alternativa al sofá',
        duration: 10,
        purpose: 'Un lugar cómodo y aprobado que ella quiera usar — alternativa real, no prohibición vacía.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Coloca la colchoneta cerca del sofá. Pon un premio encima antes de que llegue.',
        steps: [
          'Ella descubre el premio — no señales, no llames.',
          'Al pisar para coger el premio: "¡sí!" en voz baja.',
          'Añade otro premio. Repite 4–5 veces.',
          'Construye duración: premio cada 20 seg que permanezca.',
        ],
        endRitual: '"Terminado" suave. Aléjate. Deja la colchoneta en su sitio toda la noche.',
        warningSign: 'Ignora completamente la colchoneta — no es cómoda. Añade una manta suya o algo con tu olor.',
        successLooks: 'Vuelve a la colchoneta por su cuenta al menos una vez sin ser llamada.',
      },
    ],
  },

  // ── Sigue a todas partes ──────────────────────────────────────────────────
  sigue: {
    label: 'Sigue a todas partes',
    sub: 'velcro / dependencia',
    purpose: 'Construir confianza estando sola en una habitación. No ignorarla — enseñarle que la distancia es segura.',
    sessions: [
      {
        slot: 'Mañana',
        title: 'Separaciones breves en la misma habitación',
        duration: 8,
        purpose: 'Enseñar que tu movimiento es normal — no señal de abandono.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Shadow está asentada en su colchoneta o en el suelo. Dale algo para masticar o un scatter feed.',
        steps: [
          'Camina al otro extremo de la habitación. Pausa 10 segundos.',
          'Regresa antes de que se levante — dale un premio por haber quedado.',
          'Aumenta distancia y tiempo gradualmente (hasta 30 seg hoy).',
          'Ni salidas ni llegadas dramáticas.',
        ],
        endRitual: 'Regresa, un premio, siéntate. Retoma el día con normalidad.',
        warningSign: 'Abandona el masticado y empieza a pasearse — está demasiado activada. Solo practica cuando ya esté calmada.',
        successLooks: 'Permanece con el Kong o en su sitio 20 segundos mientras estás al otro lado de la habitación.',
      },
      {
        slot: 'Tarde',
        title: 'Paso fuera de vista',
        duration: 8,
        purpose: 'Construir que estar fuera de la vista no significa estar ausente.',
        energyRequired: 'baja',
        difficulty: 'medio',
        startRitual: 'Prepara un Kong cargado. Dáselo. Sal de la habitación 10 segundos.',
        steps: [
          'Dáselo, camina calmamente hasta la puerta.',
          'Sal de la vista 10 segundos. Regresa antes de que vocalice.',
          'Si vocaliza: espera 3 segundos de silencio antes de entrar.',
          'Escala: 30 seg → 1 min → 3 min en días sucesivos.',
        ],
        endRitual: 'Regresa con calma. Sin celebración. Recoge el Kong.',
        warningSign: 'Vocaliza antes de los 10 segundos — tu línea base es demasiado larga. Vuelve a separaciones en la misma habitación.',
        successLooks: 'Al menos 30 segundos de calma e independencia mientras estás fuera de la vista.',
      },
      {
        slot: 'Noche',
        title: 'Captura de distancia voluntaria',
        duration: 10,
        purpose: 'Reforzar los momentos en que elige estar en un sitio diferente al tuyo.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Siéntate en una habitación. Premios accesibles. Si está en otro sitio o a distancia: récompensalo.',
        steps: [
          'Cuando Shadow no esté activamente siguiéndote: marca suave + ve a darle el premio donde está.',
          'Ve tú a ella — no la llames a ti.',
          'Sin contacto visual mientras está a distancia.',
          '8–10 capturas durante la tarde.',
        ],
        endRitual: 'Al final del día: dispersa 3–4 premios en su zona de descanso.',
        warningSign: 'Pegada a tu lado toda la tarde — puede necesitar más ejercicio físico primero. Prueba paseo olfativo o Kong.',
        successLooks: 'Se asienta en otra habitación por voluntad propia durante más de 2 minutos.',
      },
    ],
  },

  // ── Separación ────────────────────────────────────────────────────────────
  separacion: {
    label: 'Separación',
    sub: 'confianza en soledad',
    purpose: 'Construir tolerancia al tiempo solo. No forzar distancia — crear asociación positiva con estar sola.',
    sessions: [
      {
        slot: 'Mañana',
        title: 'Ritual de salida sin drama',
        duration: 5,
        purpose: 'Una rutina de salida predecible y de baja activación que no señale ansiedad.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Dale el Kong cargado 5 minutos antes de salir. Sin anuncios, sin despedidas.',
        steps: [
          'Dale el Kong. Di nada sobre salir.',
          'Prepárate para salir (llaves, abrigo) de forma calmada — sin drama.',
          'Sale sin decir adiós ni mirar atrás.',
          'Regresa en 3–5 minutos. No la saludes inmediatamente.',
          'Espera calma real antes de reconocerla.',
        ],
        endRitual: 'Cuando esté calmada: saludo breve y tranquilo. Recoge el Kong.',
        warningSign: 'Está angustiada antes de que salgas — las señales pre-salida (llaves, abrigo) son detonantes. Desensibilízalos por separado.',
        successLooks: 'Sigue masticando o descansando cuando regresas.',
      },
      {
        slot: 'Tarde',
        title: 'Sesiones cortas de tiempo solo estructuradas',
        duration: 10,
        purpose: 'Practicar estar detrás de una puerta cerrada — construir duración gradualmente.',
        energyRequired: 'baja',
        difficulty: 'medio',
        startRitual: 'Tras un paseo olfativo o actividad (no agotada ni sobreactivada). Dale el Kong en su espacio.',
        steps: [
          'Asiéntala con el Kong en su zona.',
          'Cierra la puerta o barrera. Empieza con 5 minutos.',
          'Regresa antes de que vocalice. Si ya vocaliza: espera 3 segundos de silencio antes de entrar.',
          'Construye: 10 → 20 → 30 min en días sucesivos.',
        ],
        endRitual: 'Regresa con calma. Si está tranquila: premio. Recoge el Kong. Fin.',
        warningSign: 'Vocalización, arañazos en la puerta o destrucción antes de 5 min — la sesión es demasiado larga. Vuelve a 2 min y reconstruye.',
        successLooks: 'Está tumbada o masticando cuando regresas.',
      },
      {
        slot: 'Noche',
        title: 'Rutina de zona de sueño',
        duration: 8,
        purpose: 'Cerrar el día con una secuencia predecible y tranquila que pueda anticipar y la lleve al descanso.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Misma hora cada noche. Misma secuencia: scatter feed o Kong → colchoneta/jaula → luz baja.',
        steps: [
          'Dáselo el masticado en su zona de sueño.',
          'Siéntate cerca 5 minutos. Voz baja, sin juego.',
          'Sal de la habitación cuando ya esté asentada — no cuando esté activa.',
          'Si te sigue: devuélvela suavemente y dale el masticado de nuevo.',
        ],
        endRitual: 'Una vez asentada, sal en silencio. Sin re-entradas salvo necesidad real.',
        warningSign: 'No puede asentarse más de 2 minutos — puede que le falte un outlet físico en el día. Añade paseo olfativo a media tarde.',
        successLooks: 'Se asienta en su zona en 10 minutos desde el inicio del ritual.',
      },
    ],
  },

  // ── Jaula / descanso ──────────────────────────────────────────────────────
  jaula: {
    label: 'Jaula / descanso',
    sub: 'zona de calma',
    purpose: 'Hacer de la jaula un lugar que Shadow elige porque es cómodo y predice cosas buenas — nunca un castigo.',
    sessions: [
      {
        slot: 'Mañana',
        title: 'Entrada voluntaria — sin puerta',
        duration: 8,
        purpose: 'Construir asociación positiva con entrar a la jaula por decisión propia.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Deja la puerta abierta. Pon un premio justo en el umbral.',
        steps: [
          'Premio en el umbral. Espera.',
          'Cuando entre y salga: pon otro premio más adentro.',
          'Repite hasta que entre completamente por voluntad propia.',
          'Marca y premia cada entrada. Nunca la empujes.',
          'Para antes de que muestre cualquier hesitación.',
        ],
        endRitual: 'Premio dentro, sale sola, sesión terminada. Sin cerrar la puerta hoy.',
        warningSign: 'Se detiene o retrocede — fuiste demasiado rápido. Vuelve a premios en el umbral.',
        successLooks: 'Entra a la jaula completamente al menos 3 veces por voluntad propia.',
      },
      {
        slot: 'Tarde',
        title: 'Construcción de duración — puerta cerrada brevemente',
        duration: 10,
        purpose: 'Añadir la puerta cerrada como evento neutro, no estresante.',
        energyRequired: 'baja',
        difficulty: 'medio',
        startRitual: 'Entró voluntariamente. Dale el Kong o scatter de premios dentro.',
        steps: [
          'Una vez dentro y asentada con el Kong: cierra la puerta suavemente.',
          'Espera 30 segundos. Abre antes de que intente salir.',
          'Escala: 1 min → 3 min → 5 min en sesiones sucesivas.',
          'Premia a través de los barrotes mientras está dentro.',
        ],
        endRitual: 'Abre. Que salga sola. Termina la sesión con calma.',
        warningSign: 'Raspa la puerta o vocaliza — abre inmediatamente. La duración es excesiva. Reduce.',
        successLooks: 'Descansa en la jaula con la puerta cerrada durante 3+ minutos sin signos de estrés.',
      },
      {
        slot: 'Noche',
        title: 'Jaula como zona de sueño',
        duration: 8,
        purpose: 'Asociar la jaula con el fin del día y el descanso reparador.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Misma secuencia de cierre cada noche. Jaula en zona de dormir, no aislada.',
        steps: [
          'Kong cargado en la jaula.',
          'Que entre voluntariamente. Cierra cuando esté asentada.',
          'Cubre la jaula con una manta: reducción de estímulos.',
          'Sin interacción después del cierre — silencio.',
        ],
        endRitual: 'Ningún ritual — duerme. Abre tranquilamente por la mañana antes de que despierte del todo.',
        warningSign: 'Vocalización prolongada (más de 5 min) — no está preparada para la jaula nocturna. Deja la puerta abierta y trabaja la duración diurna.',
        successLooks: 'Se asienta y duerme toda la noche, o despierta solo una vez.',
      },
    ],
  },

  // ── Traílla ───────────────────────────────────────────────────────────────
  trailla: {
    label: 'Traílla',
    sub: 'preparación',
    purpose: 'Asociación positiva con arnés y correa. Mecánica de paseo sin tensión antes de salir al exterior.',
    sessions: [
      {
        slot: 'Mañana',
        title: 'Desensibilización al arnés',
        duration: 6,
        purpose: 'El arnés predice premios, no restricción.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Arnés en el suelo cerca. Deja que lo huela sin decir nada.',
        steps: [
          'Toca el arnés: premio. Levántalo: premio. Acércalo a ella: premio.',
          'Toca su cuerpo con él (sin poner todavía): premio.',
          'Pásalo por la cabeza una vez: jackpot de 3–5 trocitos R3, uno por uno; retira inmediatamente.',
          'Cada vez que entra y sale: premio. Sesiones de menos de 5 min.',
        ],
        endRitual: 'Guarda el arnés. Premio. Fin.',
        warningSign: 'Se congela o muerde el arnés agresivamente — ve más despacio. Solo tocar → premio hoy.',
        successLooks: 'Se acerca al arnés voluntariamente cuando lo coges.',
      },
      {
        slot: 'Tarde',
        title: 'Correa sin tensión — interior',
        duration: 8,
        purpose: 'Mecánica de paseo sin tirar en un entorno sin distracciones.',
        energyRequired: 'media',
        difficulty: 'medio',
        startRitual: 'Engancha la correa. Un premio. Da 3 pasos. Otro premio.',
        steps: [
          'Camina a tu ritmo normal. Correa suelta = premio cada 3–4 pasos.',
          'En el momento en que tire: para completamente. Espera que libere la tensión.',
          'Cuando libere: premio y continúa.',
          'Cambia de dirección frecuentemente — mantén su atención en ti.',
        ],
        endRitual: '"Terminado". Retira la correa. 30 seg de calma antes de liberarla.',
        warningSign: 'Tira y gira constantemente — demasiada energía. Haz scatter feed 5 min antes.',
        successLooks: 'Al menos 10 pasos consecutivos con correa suelta.',
      },
      {
        slot: 'Noche',
        title: 'Paseo olfativo — correa suelta exterior',
        duration: 15,
        purpose: 'Dejar que lidere con su nariz. El paseo es suyo — la correa es solo seguridad.',
        energyRequired: 'media',
        difficulty: 'fácil',
        startRitual: 'Di "olfatea" o similar una vez al salir. Luego síguele la nariz.',
        steps: [
          'Deja que elija dirección y ritmo.',
          'Para cuando pare a olfatear. Espera que termine.',
          'Sin tirarla de los olores. El olfateo ES el ejercicio.',
          'Premio ocasional cuando se gire a mirarte.',
        ],
        endRitual: '"Terminado" en la puerta. Retira el arnés dentro. Breve calma antes de comer si toca.',
        warningSign: 'Lunges hacia otros perros o personas — cruza la calle proactivamente. No dejes que ocurra.',
        successLooks: 'Olfatea extensamente y se gira a mirarte 3+ veces sin que la llames.',
      },
    ],
  },

  // ── Llamada ────────────────────────────────────────────────────────────────
  llamada: {
    label: 'Llamada',
    sub: 'recall interior',
    purpose: 'Construir un recall fiable: Shadow viene cuando la llamas, siempre, porque venir a ti es lo mejor que le puede pasar.',
    sessions: [
      {
        slot: 'Mañana',
        title: 'Llamada con sujeción — interior',
        duration: 8,
        purpose: 'Construir el impulso de venir usando anticipación y recompensa de alto valor.',
        energyRequired: 'media',
        difficulty: 'fácil',
        startRitual: 'Prepara trocitos R4 de 0,5–1 cm (pollo cocido; jamón solo ocasional). Que alguien sujete a Shadow suavemente.',
        steps: [
          'Muéstrale el premio. Luego aléjate 3–4 m sin llamarla todavía.',
          'Una vez alejado: di su nombre una vez + "ven".',
          'La persona que la sujeta la suelta inmediatamente.',
          'Al llegar: gran celebración + 1 trocito R4 + juego. En las 2 mejores llegadas: jackpot de 3–5 trocitos R4, uno por uno.',
          'Repite 3–4 veces. Siempre termina con fiesta.',
        ],
        endRitual: 'Última llamada = jackpot de 3–5 trocitos R4, uno por uno. Máximo 2 jackpots en la sesión. Luego para.',
        warningSign: 'Llega pero no viene hasta el final — no eres suficientemente atractivo. Mejora el premio o añade juego.',
        successLooks: 'Corre hacia ti a toda velocidad al menos dos veces.',
      },
      {
        slot: 'Tarde',
        title: 'Respuesta al nombre — por la casa',
        duration: 8,
        purpose: 'El nombre de Shadow siempre predice algo bueno — sin excepciones.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Llámala desde otra habitación en un momento aleatorio, no de comida.',
        steps: [
          'Di su nombre una vez. Espera.',
          'Si viene: 1 trocito R4 + afecto. Si responde de inmediato desde otra habitación: jackpot de 3–5 trocitos R4, uno por uno.',
          'Si no viene en 5 seg: ve a ella, dale el premio igual — sin castigo por no responder.',
          'Practica 4–5 veces durante la tarde en momentos imprevisibles.',
          'Nunca uses su nombre antes de algo que le disguste (baño, cortar uñas).',
        ],
        endRitual: 'Sin terminado formal — es una práctica de estilo de vida.',
        warningSign: 'Empieza a ignorar su nombre — lo estás usando demasiado sin buenos resultados. Pausa 2 días y reinicia con premios mejores.',
        successLooks: 'Se gira hacia ti inmediatamente al oír su nombre, incluso desde otra habitación.',
      },
      {
        slot: 'Noche',
        title: 'Escondite y búsqueda — recall por la casa',
        duration: 8,
        purpose: 'Hacer que venir a ti sea divertido, no obligatorio.',
        energyRequired: 'media',
        difficulty: 'medio',
        startRitual: 'Deja que pierda tu rastro. Escóndete en un sitio fácil.',
        steps: [
          'Escóndete detrás de una puerta o en otra habitación.',
          'Espera 10 segundos. Di su nombre + "¿dónde estoy?"',
          'Cuando te encuentre: fiesta + 1 trocito R4.',
          'Aumenta dificultad: habitaciones distintas, voz más baja.',
          '4–5 rondas.',
        ],
        endRitual: 'Última ronda = jackpot de 3–5 trocitos R4, uno por uno. Luego colchoneta para cerrar.',
        warningSign: 'No puede encontrarte y empieza a angustiarse — hazte más fácil. Haz pequeños ruidos para ayudarla.',
        successLooks: 'Te busca activamente y llega con entusiasmo.',
      },
    ],
  },

  // ── Control de impulso ────────────────────────────────────────────────────
  impulso: {
    label: 'Impulso',
    sub: 'autocontrol',
    purpose: 'Construir la capacidad de hacer una pausa antes de actuar. El autocontrol es la base de toda regulación, no obediencia sino autogobierno.',
    sessions: [
      {
        slot: 'Mañana',
        title: 'Espera antes de cada recurso',
        duration: 6,
        purpose: 'Practicar la pausa antes de la comida, las puertas y los juguetes — cada mañana.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Antes de poner el bol: sostenlo. Antes de abrir la puerta: para. Antes del Kong: espera.',
        steps: [
          'Sostén el bol a su altura. Saltará, empujará.',
          'Espera en silencio. En el momento en que para o se sienta: "ya" + bol al suelo.',
          'Si se lanza antes de "ya": levanta el bol, empieza de nuevo.',
          'Aplica esto en cada comida — sin comidas gratis esta semana.',
        ],
        endRitual: '"Ya" una vez. Come. Fin.',
        warningSign: 'Escala a ladrar o saltar tras 3 repeticiones — demasiado hambre o activación. Da la comida tras 1 segundo de quietud.',
        successLooks: 'Espera con las cuatro patas en el suelo 3+ segundos antes del cue.',
      },
      {
        slot: 'Tarde',
        title: 'Déjalo — fundamentos',
        duration: 8,
        purpose: 'Construir autocontrol ante objetos en el suelo o en tu mano.',
        energyRequired: 'baja',
        difficulty: 'medio',
        startRitual: 'Dos tipos de premios: bajo valor (suelo) y alto valor (bolsillo).',
        steps: [
          'Premio bajo valor en puño cerrado. Preséntalo.',
          'Lamerá, empujará. Ignora todo.',
          'En el momento en que se aleja o mira tu cara: "¡sí!" + premio de la OTRA mano.',
          'Escala: premio en el suelo, cubierto con el pie. Se aleja = premio del bolsillo.',
          '5–8 repeticiones. Termina en éxito.',
        ],
        endRitual: '"Terminado". Recoge todos los premios del suelo.',
        warningSign: 'Agarra el premio del suelo antes de que puedas cubrirlo — usa el pie más rápido o un premio menos atractivo.',
        successLooks: 'Mira a tu cara (check-in) en lugar de intentar conseguir el premio al menos 3 veces.',
      },
      {
        slot: 'Noche',
        title: 'Aguante en colchoneta con distracciones',
        duration: 10,
        purpose: 'Practicar quedarse quieta mientras ocurren cosas interesantes a su alrededor.',
        energyRequired: 'baja',
        difficulty: 'difícil',
        startRitual: 'Está en la colchoneta. Premio por estar ahí.',
        steps: [
          'En la colchoneta: premia cada 5 seg el primer minuto.',
          'Añade distracciones suaves: pasa cerca, deja caer algo, tose.',
          'Si aguanta: "¡sí!" + premio.',
          'Si se mueve: tono neutro, señala la colchoneta, espera que vuelva.',
          'Objetivo hoy: 30 seg de calma en colchoneta con movimiento tuyo normal.',
        ],
        endRitual: '"Terminado". Sale. 30 seg de pausa. Luego tiempo libre.',
        warningSign: 'Deja la colchoneta cada vez que te mueves — reduce la distracción. Quédate sentado y solo cambia tu peso.',
        successLooks: 'Aguanta 30 segundos consecutivos con al menos una distracción suave.',
      },
    ],
  },

  // ── Enriquecimiento ───────────────────────────────────────────────────────
  enriquecimiento: {
    label: 'Enriquecimiento',
    sub: 'mente activa',
    purpose: 'El ejercicio mental cansa y regula más que el físico. Reduce la ansiedad, redirige el drive y construye confianza.',
    sessions: [
      {
        slot: 'Mañana',
        title: 'Desayuno esparcido — olfato desde el primer momento',
        duration: 10,
        purpose: 'Usar la comida del desayuno completo como ejercicio olfativo. Sin bol.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Esparce el pienso o premios en el jardín, mat olfativo o suelo de cocina antes de soltarla.',
        steps: [
          'Dispersa la comida sobre una superficie amplia antes de liberarla.',
          '"Busca" una vez y deja que salga.',
          'Observa sin interactuar.',
          'Deja que termine completamente — sin prisas.',
        ],
        endRitual: '"Terminado" cuando el área está limpia. Naturalmente más calmada por el olfateo.',
        warningSign: 'No le interesa — puede que no tenga suficiente hambre o el área es demasiado fácil. Usa comida de mayor valor.',
        successLooks: 'Olfatea continuamente durante los 10 minutos completos sin vocalizar ni buscarte.',
      },
      {
        slot: 'Tarde',
        title: 'Enriquecimiento de resolución de problemas',
        duration: 12,
        purpose: 'Desafiar su mente con una tarea que tiene que resolver sola.',
        energyRequired: 'media',
        difficulty: 'medio',
        startRitual: 'Prepara el enriquecimiento (pirámide Kong, molde muffin con tapas, puzzle) antes de que entre al espacio.',
        steps: [
          'Deja que entre y lo descubra sola.',
          'No la ayudes ni la guíes.',
          'Si lo abandona y se acerca a ti: ignórala, señala el puzzle.',
          'Permite la frustración — trabajarla es el objetivo.',
        ],
        endRitual: '"Terminado" cuando se aleja satisfecha. Recoge.',
        warningSign: 'Lo abandona en 2 minutos — es demasiado difícil. Abre uno de los compartimentos para reiniciar el interés.',
        successLooks: 'Trabaja el puzzle 8+ minutos sin buscar atención externa.',
      },
      {
        slot: 'Noche',
        title: 'Paseo olfativo nocturno — nariz libre',
        duration: 15,
        purpose: 'Explorar el barrio a su ritmo, con su nariz. Cada olor cuenta.',
        energyRequired: 'media',
        difficulty: 'fácil',
        startRitual: 'Arnés con calma. Salida sin excitación.',
        steps: [
          'Sigue la dirección de su nariz.',
          'Para cuando pare. Empieza cuando empiece.',
          'Sin teléfono — obsérvala.',
          'Premio ocasional cuando te mire, sin llamarla.',
        ],
        endRitual: 'Regresa a casa. Retira el arnés. Breve asentamiento antes de comer si toca.',
        warningSign: 'Reactiva o sobreactivada en el paseo — el entorno es demasiado estimulante esta noche. Reemplaza por scatter feed interior.',
        successLooks: 'Completa el paseo visiblemente más calmada que al empezar.',
      },
    ],
  },

  // ── Calma post-juego ──────────────────────────────────────────────────────
  calma_post: {
    label: 'Calma post-juego',
    sub: 'transición a calma',
    purpose: 'Enseñar a Shadow a transitar de alta activación a calma de forma predecible. El off-switch es una habilidad entrenable.',
    sessions: [
      {
        slot: 'Mañana',
        title: 'Off-switch — juego corto + settle en colchoneta',
        duration: 10,
        purpose: 'Practicar la transición juego → calma antes de que el día acumule presión.',
        energyRequired: 'media',
        difficulty: 'medio',
        startRitual: '2 minutos de tug o persecución. Luego: para en seco.',
        steps: [
          '2 min de juego. Luego: congela, brazos cruzados, mirada al frente.',
          'Espera cualquier señal de calma (sentarse, parar, mirar a otro lado).',
          'Marca suave + dirige a la colchoneta.',
          'En la colchoneta: premio cada 10 seg durante 2 min.',
          'Repite 2–3 ciclos: juego → parada → colchoneta.',
        ],
        endRitual: 'Último ciclo termina en colchoneta con Kong. Tú te alejas.',
        warningSign: 'Escala tras el congele (ladra, salta, muerde) — tu juego fue demasiado intenso. Reduce a 30 seg de juego.',
        successLooks: 'Transita a la colchoneta en menos de 60 seg tras parar el juego, al menos una vez.',
      },
      {
        slot: 'Tarde',
        title: 'Búsqueda olfativa como descompresión post-actividad',
        duration: 10,
        purpose: 'Usar el sistema olfativo para bajar la activación después del ejercicio físico.',
        energyRequired: 'media',
        difficulty: 'fácil',
        startRitual: 'Tras juego exterior o paseo: dispersa 8–10 premios por la habitación antes de soltarla.',
        steps: [
          'Suéltala en la habitación con los premios dispersos.',
          '"Busca" una vez.',
          'Observa — sin guiarla, sin hablar.',
          'Después de encontrarlos todos: déjala que se asiente sola.',
        ],
        endRitual: 'Se asienta sola. Sin terminado formal.',
        warningSign: 'No puede concentrarse en el scatter por estar demasiado activada — espera 5 minutos más antes de intentarlo.',
        successLooks: 'Pasa de movimiento activo a nariz pegada al suelo en menos de 3 minutos.',
      },
      {
        slot: 'Noche',
        title: 'Captura de calma post-actividad vespertina',
        duration: 10,
        purpose: 'Cerrar el día reforzando el estado tranquilo en que aterrice.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Siéntate en la habitación tras la última actividad. Luz baja, sin teléfono, sin ruido.',
        steps: [
          'Siéntate en silencio. Observa.',
          'Cualquier señal de asentamiento (tumbarse, olfato lento, bostezo): "¡sí!" suave + premio cerca.',
          '6–8 capturas. Para antes de que empiece a "actuar".',
        ],
        endRitual: 'Sal de la habitación cuando esté asentada. Sin palabras.',
        warningSign: 'No puede asentarse porque todavía tiene energía — la actividad vespertina no fue suficiente. Añade 5 min de scatter feed.',
        successLooks: 'Se tumba espontáneamente en los 10 minutos de sesión.',
      },
    ],
  },

  // ── Rutina de sueño ────────────────────────────────────────────────────────
  sueno: {
    label: 'Rutina de sueño',
    sub: 'cierre de día',
    purpose: 'Establecer una secuencia de cierre consistente y predecible que ayude al sistema nervioso a prepararse para el descanso.',
    sessions: [
      {
        slot: 'Tarde',
        title: 'Tope de energía nocturno — sin juego activo después de las 19h',
        duration: 0,
        purpose: 'Reducir la activación vespertina para que el ritual de sueño realmente funcione.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Después de las 19h: solo olfato, colchoneta o paseo lento. Sin tug, sin persecución.',
        steps: [
          'Reemplaza el tug o la persecución vespertina por scatter feed o mat olfativo.',
          'Baja tu propio volumen y nivel de energía después de las 19h.',
          'Reduce la iluminación de la habitación gradualmente.',
          'Sin pantallas con sonidos bruscos cerca de su zona de descanso.',
        ],
        endRitual: 'Ajuste de estilo de vida — no es una sesión cronometrada.',
        warningSign: 'Sigue muy activada a las 20h — su actividad total diaria puede ser insuficiente. Añade paseo olfativo a media tarde.',
        successLooks: 'Visiblemente más tranquila a las 19h sin que tengas que gestionarla activamente.',
      },
      {
        slot: 'Noche',
        title: 'Ritual de cierre de día',
        duration: 10,
        purpose: 'La misma secuencia cada noche se convierte en señal de sueño por sí sola.',
        energyRequired: 'baja',
        difficulty: 'fácil',
        startRitual: 'Misma hora cada noche. Comienza la secuencia.',
        steps: [
          'Última salida al baño (exterior o bandeja). Calma, energía baja.',
          'Regreso: Kong cargado o masticado en su zona de sueño.',
          'Siéntate cerca 5 min. Luz baja o apagada. Sin hablar.',
          'Cuando se asienta: sal en silencio.',
          'Sin re-entradas por búsqueda de atención.',
        ],
        endRitual: 'Tú te vas. Ella duerme. Sin re-entradas salvo necesidad real.',
        warningSign: 'No puede asentarse en 15 min — tuvo demasiada estimulación tarde. Adelanta el tope de energía.',
        successLooks: 'Dormida en 15 minutos desde el inicio del ritual.',
      },
    ],
  },
};

// ─── Plan generator ───────────────────────────────────────────────────────
function generateWeek(settings) {
  const {
    bitingLevel = 'medio',
    terminadoLevel = 'parcial',
    calmScore = 3,
    currentObject = 'pelota',
    newObjectReady = false,
    nextObject = '',
    correctionGoal = 'biting',
    teachingGoal = 'legalBiting',
    energyLevel = 'medium',
  } = settings;

  const highBiting    = bitingLevel === 'alto';
  const poorTerminado = terminadoLevel !== 'bueno';
  const lowCalm       = calmScore < 3;
  const lowEnergy     = energyLevel === 'low';
  const objectName    = newObjectReady && nextObject ? nextObject : currentObject;

  // Object naming days spread across the week
  const objDays = newObjectReady ? [1, 4] : [1, 3, 5];

  // Stamp a slot label onto a block
  function slot(block, label) { return { ...block, slot: label }; }

  // Always produces exactly 3 blocks: Mañana · Tarde · Noche
  function buildDay(i) {
    const includeObj = objDays.includes(i);

    // ── MAÑANA: cognitive / moderate ──────────────────────────────────────
    const morningPool = [
      bScentSearch(false),   // Lun
      bTouch(),              // Mar
      bEspera(),             // Mié
      bExploracion(),        // Jue
      bScentSearch(true),    // Vie
      bTouch(),              // Sáb
      bScentSearch(false),   // Dom
    ];

    let morning = morningPool[i];

    if (teachingGoal === 'touch')    morning = bTouch();
    if (teachingGoal === 'espera')   morning = bEspera();
    if (teachingGoal === 'scentWork') morning = bScentSearch(i > 3);
    if (correctionGoal === 'recall' && i % 2 === 0) morning = bTouch();

    // ── TARDE: activation / main teaching ────────────────────────────────
    let afternoon;

    if (includeObj) {
      // Object naming days always get nombre-objeto in tarde
      afternoon = bNombreObjeto(objectName);
    } else if (highBiting) {
      afternoon = i % 2 === 0 ? b101Caja() : bMasticado();
    } else if (lowEnergy) {
      afternoon = i % 2 === 0 ? bExploracion() : bCalmaMat();
    } else {
      afternoon = i % 2 === 0 ? bTug() : bSignales(i > 2 ? 'distancia' : 'basico');
    }

    // Teaching goal overrides for tarde
    if (!includeObj) {
      if (teachingGoal === 'legalBiting' && !highBiting) afternoon = i % 2 === 0 ? bTug() : b101Caja();
      if (teachingGoal === 'calmMat')    afternoon = bCalmaMat();
      if (teachingGoal === 'gameOver')   afternoon = bTerminado();
      if (teachingGoal === 'bringObject' && i >= 3) afternoon = bTraerObjeto(objectName);
      if (teachingGoal === 'objectNames') afternoon = bNombreObjeto(objectName);
    }

    // Correction goal overrides for tarde
    if (correctionGoal === 'recall'  && i % 3 === 2) afternoon = bBuscarPersona();
    if (correctionGoal === 'jumping' && i % 2 === 1) afternoon = bEspera();
    if (correctionGoal === 'biting'  && highBiting)  afternoon = b101Caja();

    // ── NOCHE: calm / wind-down ───────────────────────────────────────────
    const nightPool = [
      bCapturCalma(),   // Lun
      bCalmaMat(),      // Mar
      bRelajacion(),    // Mié
      bCapturCalma(),   // Jue
      bCalmaMat(),      // Vie
      bRelajacion(),    // Sáb
      bCapturCalma(),   // Dom
    ];

    let night = nightPool[i];

    if (poorTerminado && (i === 2 || i === 5)) night = bTerminado();
    if (lowCalm) night = bRelajacion();
    if (correctionGoal === 'calming') night = bCalmaMat();

    return [
      slot(morning,   'Mañana'),
      slot(afternoon, 'Tarde'),
      slot(night,     'Noche'),
    ];
  }

  const monday = getMondayOf(new Date());
  const days = DAY_NAMES.map((dayName, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { date: isoDate(d), dayName, blocks: buildDay(i) };
  });

  return {
    weekOf: isoDate(monday),
    days,
    objective: WEEKLY_OBJECTIVES[settings.correctionGoal] || WEEKLY_OBJECTIVES.biting,
    settings: { ...settings },
    generatedAt: new Date().toISOString(),
  };
}

// ─── State ────────────────────────────────────────────────────────────────
let state = {
  view: 'hoy',
  week: null,
  logs: {},            // keyed by block id
  selectedBehavior: null, // active selection in PLAN view
  settings: {
    bitingLevel: 'medio',
    terminadoLevel: 'parcial',
    calmScore: 3,
    currentObject: 'pelota',
    newObjectReady: false,
    nextObject: '',
    correctionGoal: 'biting',
    teachingGoal: 'legalBiting',
    energyLevel: 'medium',
  },
};

// ─── Persistence ──────────────────────────────────────────────────────────
function saveState() {
  try { localStorage.setItem('shadow_os_v2', JSON.stringify(state)); }
  catch (e) { console.error('Save failed:', e); }
}

function loadState() {
  try {
    const raw = localStorage.getItem('shadow_os_v2');
    if (!raw) return;
    const saved = JSON.parse(raw);
    state.view             = saved.view             || 'hoy';
    state.week             = saved.week             || null;
    state.logs             = saved.logs             || {};
    state.selectedBehavior = saved.selectedBehavior || null;
    state.settings         = { ...state.settings, ...(saved.settings || {}) };
  } catch (e) { console.error('Load failed:', e); }
}

// ─── Export / Import ──────────────────────────────────────────────────────
function exportJSON() {
  const data = {
    version: 2,
    exportedAt: new Date().toISOString(),
    week: state.week,
    logs: state.logs,
    settings: state.settings,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shadow-os-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function validateImport(data) {
  const errs = [];
  if (!data || typeof data !== 'object') { errs.push('El archivo no contiene un objeto JSON válido'); return errs; }
  if (typeof data.version !== 'number')  errs.push('Falta campo "version" (number)');
  if (data.week != null) {
    if (typeof data.week !== 'object')     errs.push('"week" debe ser un objeto');
    else {
      if (!data.week.weekOf)               errs.push('"week.weekOf" requerido (fecha ISO)');
      if (!Array.isArray(data.week.days))  errs.push('"week.days" debe ser un array');
      else {
        data.week.days.forEach((day, i) => {
          if (!day.date)                   errs.push(`day[${i}]: falta "date"`);
          if (!Array.isArray(day.blocks))  errs.push(`day[${i}]: "blocks" debe ser array`);
        });
      }
    }
  }
  if (data.logs != null && typeof data.logs !== 'object') errs.push('"logs" debe ser un objeto');
  return errs;
}

function normalizeWeek(week) {
  if (!week) return null;
  if (!Array.isArray(week.days)) week.days = [];
  week.days = week.days.map(day => ({
    date:    day.date    || '',
    dayName: day.dayName || '',
    blocks: Array.isArray(day.blocks) ? day.blocks.map(b => ({
      id:          b.id          || uid(),
      type:        b.type        || 'activacion',
      tag:         b.tag         || '',
      title:       b.title       || 'Sin título',
      duration:    b.duration    || 10,
      steps:       Array.isArray(b.steps) ? b.steps : [],
      finish:      b.finish      || '',
      alarm:       b.alarm       || '',
      learns:      b.learns      || '',
      completed:   Boolean(b.completed),
      completedBy: b.completedBy || null,
      completedAt: b.completedAt || null,
    })) : [],
  }));
  return week;
}

function importJSON(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    let data;
    try { data = JSON.parse(e.target.result); }
    catch (_) { showNotice('Error: archivo JSON inválido — no se pudo parsear', 'error'); return; }

    const errs = validateImport(data);
    if (errs.length) { showNotice('Errores en el archivo:\n' + errs.join('\n'), 'error'); return; }

    if (data.week)     state.week     = normalizeWeek(data.week);
    if (data.logs)     state.logs     = { ...state.logs, ...data.logs };
    if (data.settings) state.settings = { ...state.settings, ...data.settings };

    saveState();
    render();
    showNotice('Datos importados correctamente');
  };
  reader.readAsText(file);
}

// ─── Insights ─────────────────────────────────────────────────────────────
const TAG_LABELS = {
  busqueda:   'Búsqueda olfativa',
  masticado:  'Masticado legal',
  colchoneta: 'Colchoneta',
  captura:    'Captura de calma',
  objeto:     'Nombre objeto',
  offsw:      'Off-switch',
  tug:        'Tug',
  senales:    'Señales básicas',
  exploracion:'Exploración olfativa',
  caja101:    '101 cosas',
  relajacion: 'Relajación',
  touch:      'Touch',
  espera:     'Espera',
  reset:      'Reset corto',
  traer:      'Traer objeto',
  buscarpers: 'Buscar persona',
};
function tagLabel(tag) { return TAG_LABELS[tag] || tag; }

function computeInsights() {
  if (!state.week) return null;
  const allBlocks = state.week.days.flatMap(d => d.blocks);
  const logValues = Object.values(state.logs);

  const totalBlocks    = allBlocks.length;
  const completedCount = allBlocks.filter(b => b.completed).length;
  if (completedCount === 0) return { totalBlocks, completedCount, empty: true };

  // Tag completion counts
  const tagCounts = {};
  allBlocks.filter(b => b.completed).forEach(b => {
    tagCounts[b.tag] = (tagCounts[b.tag] || 0) + 1;
  });

  // Calm score by day
  const calmByDay = {};
  logValues.forEach(l => {
    if (l.calmScore && l.date) {
      (calmByDay[l.date] = calmByDay[l.date] || []).push(l.calmScore);
    }
  });
  const calmTrend = Object.entries(calmByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, scores]) => ({
      date,
      avg: scores.reduce((s, v) => s + v, 0) / scores.length,
    }));

  // Biting incidents by day
  const bitingByDay = {};
  logValues.forEach(l => {
    if (l.bitingIncidents != null && l.date) {
      bitingByDay[l.date] = (bitingByDay[l.date] || 0) + l.bitingIncidents;
    }
  });
  const bitingVals = Object.values(bitingByDay);
  let bitingTrend = 'sin datos';
  if (bitingVals.length >= 2) {
    const last = bitingVals[bitingVals.length - 1];
    const prev = bitingVals[bitingVals.length - 2];
    bitingTrend = last > prev ? 'subiendo' : last < prev ? 'bajando' : 'estable';
  }

  // Terminado rate
  const tLogs = logValues.filter(l => l.terminadoWorked != null);
  const terminadoRate = tLogs.length > 0
    ? tLogs.filter(l => l.terminadoWorked).length / tLogs.length
    : null;

  // Calm score by exercise tag
  const tagCalm = {};
  logValues.forEach(l => {
    if (l.tag && l.calmScore) {
      (tagCalm[l.tag] = tagCalm[l.tag] || []).push(l.calmScore);
    }
  });
  const tagCalmAvg = Object.entries(tagCalm)
    .filter(([, sc]) => sc.length >= 2)
    .map(([tag, sc]) => ({ tag, avg: sc.reduce((s, v) => s + v, 0) / sc.length, count: sc.length }))
    .sort((a, b) => b.avg - a.avg);

  // Suggestions
  const suggestions = [];
  const avgCalm = calmTrend.length
    ? calmTrend.reduce((s, d) => s + d.avg, 0) / calmTrend.length
    : null;

  if (avgCalm !== null && avgCalm < 3)
    suggestions.push('Calma baja esta semana → aumentar captura de calma y colchoneta la próxima');
  if (terminadoRate !== null && terminadoRate < 0.5)
    suggestions.push('Terminado funcionó menos del 50% → añadir más práctica de off-switch');
  if (bitingTrend === 'subiendo')
    suggestions.push('Mordida subiendo → reducir tug, añadir búsqueda olfativa y masticado legal');
  if (bitingTrend === 'bajando')
    suggestions.push('Mordida bajando — mantener la dinámica actual');
  if (tagCalmAvg.length > 0)
    suggestions.push(`"${tagLabel(tagCalmAvg[0].tag)}" correlaciona con los mejores niveles de calma`);
  if (avgCalm !== null && avgCalm >= 4)
    suggestions.push('Calma consistentemente alta — considera aumentar dificultad de ejercicios');

  return { totalBlocks, completedCount, tagCounts, calmTrend, bitingByDay, bitingTrend, terminadoRate, tagCalmAvg, suggestions };
}

// ─── Notice toast ─────────────────────────────────────────────────────────
function showNotice(msg, type) {
  const el = document.getElementById('notice');
  if (!el) return;
  el.textContent = msg;
  el.className = 'notice' + (type ? ' ' + type : '');
  el.style.display = 'block';
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.style.display = 'none'; }, 4500);
}

// ─── Navigation ───────────────────────────────────────────────────────────
function setView(v) { state.view = v; render(); window.scrollTo(0, 0); }

// ─── Render helpers ───────────────────────────────────────────────────────
function blockTypeBadge(type) {
  const map = { activacion: ['ACTIVACIÓN','badge-act'], calma: ['CALMA','badge-calm'], 'nombre-objeto': ['OBJETO','badge-obj'], terminado: ['TERMINADO','badge-term'] };
  const [label, cls] = map[type] || [type.toUpperCase(), ''];
  return `<span class="badge ${cls}">${label}</span>`;
}

const SLOT_CLS = { 'Mañana': 'slot-morning', 'Tarde': 'slot-afternoon', 'Noche': 'slot-night' };

const ENERGY_CLS  = { baja: 'energy-baja', media: 'energy-media', alta: 'energy-alta' };
const ENERGY_LABEL= { baja: 'energía baja', media: 'energía media', alta: 'energía alta' };
const DIFF_CLS    = { 'fácil': 'diff-fácil', 'medio': 'diff-medio', 'difícil': 'diff-difícil' };

const REWARD_LEVELS = {
  4: {
    label: 'excepcional',
    short: 'pollo / jamón',
    detail: '1 trocito de pollo cocido o jamón del tamaño de un guisante pequeño (0,5–1 cm). Jamón solo ocasional.',
  },
  3: {
    label: 'entrenamiento',
    short: 'chuche perro',
    detail: '1 trocito de chuche para perro, preferiblemente blanda, del tamaño de un guisante pequeño (0,5–1 cm).',
  },
  2: {
    label: 'cotidiana',
    short: 'pienso',
    detail: '1 croqueta de pienso. Si es grande, pártela: máximo el tamaño de un guisante pequeño (0,5–1 cm).',
  },
  1: {
    label: 'social / contextual',
    short: 'afecto / acceso',
    detail: 'Un "sí" suave, caricia breve solo si la busca, o acceso a algo que quiere: olfatear, volver al juego o recibir el Kong.',
  },
};

const REWARD_LEVEL_BY_KEY = {
  busqueda: 2,
  masticado: 1,
  colchoneta: 2,
  captura: 2,
  objeto: 3,
  offsw: 3,
  tug: 3,
  senales: 3,
  exploracion: 2,
  caja101: 2,
  relajacion: 2,
  touch: 2,
  espera: 2,
  reset: 1,
  traer: 3,
  buscarpers: 4,
};

const PLAN_REWARD_LEVELS = {
  mordida:        [1, 3, 2],
  saltos:         [1, 2, 2],
  sofa:           [3, 1, 2],
  sigue:          [2, 2, 2],
  separacion:     [1, 2, 1],
  jaula:          [2, 2, 1],
  trailla:        [3, 3, 1],
  llamada:        [4, 4, 4],
  impulso:        [1, 3, 3],
  enriquecimiento:[2, 2, 1],
  calma_post:     [2, 2, 2],
  sueno:          [1, 1],
};

function rewardLevelFor(item) {
  const explicit = item && item.rewardLevel;
  if (explicit && REWARD_LEVELS[explicit]) return explicit;
  const key = item && (item.rewardKey || item.tag || item.key);
  if (key && REWARD_LEVEL_BY_KEY[key]) return REWARD_LEVEL_BY_KEY[key];
  return item && item.difficulty === 'difícil' ? 3 : item && item.difficulty === 'medio' ? 3 : 2;
}

function rewardLevelForPlan(behaviorKey, sessionIndex, session) {
  const configured = PLAN_REWARD_LEVELS[behaviorKey];
  return configured && configured[sessionIndex] ? configured[sessionIndex] : rewardLevelFor(session);
}

function renderRewardBadge(level) {
  const reward = REWARD_LEVELS[level];
  return reward ? `<span class="reward-badge reward-${level}">R${level} · ${reward.label}</span>` : '';
}

function renderRewardRecommendation(level) {
  const reward = REWARD_LEVELS[level];
  return reward
    ? `<span class="reward-recommendation"><strong>R${level} · ${reward.label}.</strong> ${reward.detail}</span>`
    : '';
}

function renderRewardGuide() {
  return `<details class="reward-guide">
    <summary>Escala de recompensas · qué significa cada premio</summary>
    <div class="reward-guide-body">
      <div class="reward-rule"><strong>Regla de tamaño:</strong> cuando un ejercicio dice "premio", da un solo trocito. Máximo tamaño de un guisante pequeño: aprox. 0,5–1 cm. Si la chuche es grande, córtala antes.</div>
      <div class="reward-scale">
        ${[4, 3, 2, 1].map(level => {
          const reward = REWARD_LEVELS[level];
          return `<div class="reward-scale-row">
            ${renderRewardBadge(level)}
            <span>${reward.detail}</span>
          </div>`;
        }).join('')}
      </div>
      <div class="reward-jackpot"><strong>Jackpot:</strong> 3–5 trocitos del nivel indicado, uno por uno durante 3–5 segundos. Úsalo para una llegada perfecta o un salto real de dificultad. Máximo 2 jackpots por sesión.</div>
      <div class="reward-context">El valor real lo decide Shadow. Olfatear, volver al juego o recibir el Kong también pueden funcionar como recompensa.</div>
    </div>
  </details>`;
}

function renderBlock(block, dayDate, expanded) {
  const log     = state.logs[block.id];
  const done    = block.completed;
  const exp     = expanded ? ' open' : '';
  const slotCls = SLOT_CLS[block.slot] || '';
  const eCls    = ENERGY_CLS[block.energyRequired]  || '';
  const dCls    = DIFF_CLS[block.difficulty]         || '';
  const rewardLevel = rewardLevelFor(block);

  const logSummary = log ? `
    <div>Calma: ${'★'.repeat(log.calmScore || 0)}${'☆'.repeat(5 - (log.calmScore || 0))}</div>
    ${log.energyLevel != null ? `<div>Activación: ${'◆'.repeat(log.energyLevel)}${'◇'.repeat(5 - log.energyLevel)}</div>` : ''}
    <div>Mordida: ${log.bitingIncidents != null ? log.bitingIncidents + ' incidentes' : '—'}</div>
    <div>Terminado: ${log.terminadoWorked === true ? '✓ funcionó bien' : log.terminadoWorked === false ? '✗ practicar más' : '—'}</div>
    ${log.calmRecovery ? `<div>Recuperación: ${log.calmRecovery}</div>` : ''}
    ${log.notes ? `<div class="log-notes">${escHtml(log.notes)}</div>` : ''}
  ` : '';

  return `<div class="block${done ? ' block-done' : ''}" data-id="${block.id}">
    <div class="block-header">
      ${block.slot ? `<span class="slot-label ${slotCls}">${block.slot}</span>` : blockTypeBadge(block.type)}
      ${block.energyRequired ? `<span class="energy-badge ${eCls}">${ENERGY_LABEL[block.energyRequired] || block.energyRequired}</span>` : ''}
      ${block.difficulty ? `<span class="diff-badge ${dCls}">${block.difficulty}</span>` : ''}
      ${renderRewardBadge(rewardLevel)}
      <span class="block-duration">${block.duration} min</span>
      ${done ? `<span class="block-by">✓ ${escHtml(block.completedBy || 'listo')}</span>` : ''}
    </div>
    <div class="block-title">${escHtml(block.title)}</div>
    ${block.purpose ? `<div class="block-purpose">${escHtml(block.purpose)}</div>` : ''}
    <details class="block-details"${exp}>
      <summary>Ver cómo hacerlo</summary>
      ${block.startRitual ? `<div class="start-ritual-box"><span class="sr-label">Cómo empezar</span>${escHtml(block.startRitual)}</div>` : ''}
      <ol class="block-steps">
        ${block.steps.map(s => `<li>${escHtml(s)}</li>`).join('')}
      </ol>
      <div class="block-meta">
        <div class="meta-row meta-reward"><span class="meta-label">Recompensa</span><span>${renderRewardRecommendation(rewardLevel)}</span></div>
        <div class="meta-row"><span class="meta-label">Al terminar</span><span>${escHtml(block.finish)}</span></div>
        <div class="meta-row meta-alarm"><span class="meta-label">Si escala</span><span>${escHtml(block.alarm)}</span></div>
        <div class="meta-row meta-learns"><span class="meta-label">Shadow aprende</span><span>${escHtml(block.learns)}</span></div>
      </div>
      ${!done
        ? `<button class="btn btn-primary" onclick="openLog('${block.id}','${dayDate}')">Marcar como completada ✓</button>`
        : `<div class="log-summary">${logSummary}</div>
           <button class="btn btn-ghost btn-sm" onclick="openLog('${block.id}','${dayDate}')">Editar registro</button>`
      }
    </details>
  </div>`;
}

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── View: HOY ────────────────────────────────────────────────────────────
function renderHoy() {
  if (!state.week) {
    const logs = JSON.parse(localStorage.getItem('shadowLog') || '[]');
    const done = logs.filter(l => l.completedAt);
    const lastEntry = done[done.length - 1];
    const lastDate = lastEntry
      ? new Date(lastEntry.completedAt).toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long' })
      : null;
    const totalSessions = done.length;
    const statsHtml = lastDate
      ? `<div class="week-obj" style="margin-bottom:20px">
           <div class="week-obj-label">Última sesión</div>
           <div class="week-obj-title">${lastDate}</div>
           ${totalSessions > 1 ? `<div class="week-obj-focus">${totalSessions} sesiones completadas</div>` : ''}
         </div>`
      : `<div class="notice-box" style="margin-bottom:20px">Primera vez aquí — el plan se adapta a lo que configures en Ajustes.</div>`;
    return `
      <div style="max-width:480px;margin:0 auto;padding:8px 0">
        <div class="section-title" style="margin-top:0">Shadow · Entrenamiento canino</div>
        <div class="block" style="margin-bottom:16px">
          <div class="block-title" style="font-size:20px">No hay plan para esta semana.</div>
          <div class="block-purpose" style="padding:0 14px 14px">Esta app genera un plan semanal de sesiones estructuradas para Shadow: ejercicios con pasos claros, timer integrado, y registro de progreso. Cada semana parte del punto donde se quedó.</div>
        </div>
        ${statsHtml}
        <button class="btn btn-primary btn-block" onclick="setView('ajustes')">Generar plan semanal →</button>
      </div>
    `;
  }

  const today     = todayISO();
  const todayDay  = state.week.days.find(d => d.date === today);
  const todayIdx  = state.week.days.findIndex(d => d.date === today);

  // Find the next uncompleted block from today onwards
  let nextBlock = null;
  let nextDayName = null;
  const startIdx = todayIdx === -1 ? 0 : todayIdx;
  for (let di = startIdx; di < state.week.days.length; di++) {
    const day = state.week.days[di];
    for (const b of day.blocks) {
      if (!b.completed) { nextBlock = b; nextDayName = day.dayName; break; }
    }
    if (nextBlock) break;
  }

  if (todayIdx === -1) {
    return `<div class="notice-box">
        <p>El plan activo es de la semana del <strong>${state.week.weekOf}</strong>.</p>
        <p>Genera un nuevo plan en <button class="btn-inline" onclick="setView('ajustes')">Ajustes</button>.</p>
      </div>
      ${nextBlock ? `<div class="next-label">▶ PRÓXIMO BLOQUE${nextDayName ? ' — ' + nextDayName.toUpperCase() : ''}</div>${renderBlock(nextBlock, nextBlock.date || today, true)}` : ''}`;
  }

  const doneToday  = todayDay ? todayDay.blocks.filter(b => b.completed).length : 0;
  const totalToday = todayDay ? todayDay.blocks.length : 0;
  const pct        = totalToday ? Math.round(100 * doneToday / totalToday) : 0;

  const isToday = (nextDayName === (todayDay && todayDay.dayName));
  const obj = state.week.objective;

  return `
    <div class="today-header">
      <div class="today-date">${todayDay ? todayDay.dayName : 'Hoy'} · ${today}</div>
      <div class="today-progress">${doneToday} de ${totalToday} sesiones completadas</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>

    ${obj ? `<div class="week-obj">
      <div class="week-obj-label">Objetivo de esta semana</div>
      <div class="week-obj-title">${escHtml(obj.title)}</div>
      <div class="week-obj-focus">${escHtml(obj.focus)}</div>
      <div class="week-obj-tip">${escHtml(obj.tip)}</div>
    </div>` : ''}

    <div class="esc-btn-wrap">
      <button class="esc-btn" onclick="openEscalation()">▲ Las cosas están escalando</button>
    </div>

    ${nextBlock
      ? `<div class="next-block-banner">
           <div class="next-label">${!isToday ? 'Próxima sesión — ' + nextDayName : 'Siguiente sesión'}</div>
           <div class="next-block-featured">
             ${renderBlock(nextBlock, nextBlock.date || today, true)}
           </div>
         </div>`
      : `<div class="all-done">Todas las sesiones de hoy completadas.</div>`
    }

    ${todayDay && todayDay.blocks.length > 1 ? `
      <h2 class="section-title">Plan completo de hoy</h2>
      <div class="blocks-list">
        ${todayDay.blocks.map(b => renderBlock(b, today, false)).join('')}
      </div>` : ''}
  `;
}

// ─── View: SEMANA ─────────────────────────────────────────────────────────
function renderSemana() {
  if (!state.week) {
    return `<div class="empty-state"><p>Sin plan activo.</p><button class="btn btn-primary" onclick="setView('ajustes')">Generar plan</button></div>`;
  }
  const today = todayISO();

  return `
    <div class="week-grid">
      ${state.week.days.map(day => {
        const done  = day.blocks.filter(b => b.completed).length;
        const total = day.blocks.length;
        const isToday  = day.date === today;
        const isPastMiss = day.date < today && done < total;
        return `<div class="day-card${isToday ? ' day-today' : ''}${isPastMiss ? ' day-past-incomplete' : ''}">
          <div class="day-card-header">
            <span class="day-name">${day.dayName.slice(0,3).toUpperCase()}</span>
            <span class="day-date-sm">${day.date.slice(5)}</span>
            <span class="day-progress-sm">${done}/${total}</span>
          </div>
          <div class="day-blocks-mini">
            ${day.blocks.map(b => `
              <div class="mini-block mini-${b.type}${b.completed ? ' mini-done' : ''}"
                   onclick="openDayDetail('${day.date}')">
                <span class="mini-title">${escHtml(b.title)}</span>
                ${b.completed
                  ? `<span class="mini-by">${escHtml((b.completedBy || '✓').slice(0,6))}</span>`
                  : `<span class="mini-dur">${b.duration}m</span>`}
              </div>
            `).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>
    <div id="day-detail"></div>
  `;
}

function openDayDetail(date) {
  const day = state.week && state.week.days.find(d => d.date === date);
  if (!day) return;
  const el = document.getElementById('day-detail');
  if (!el) return;
  el.innerHTML = `
    <h2 class="section-title">${day.dayName.toUpperCase()} — ${date}</h2>
    <div class="blocks-list">
      ${day.blocks.map(b => renderBlock(b, date, false)).join('')}
    </div>`;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── View: REVISIÓN ───────────────────────────────────────────────────────
function renderRevision() {
  const ins = computeInsights();
  if (!ins) return `<div class="empty-state"><p>Sin datos. Genera un plan primero.</p></div>`;
  if (ins.empty) return `<div class="empty-state"><p>Sin registros aún. Completa algunas sesiones para ver tendencias.</p></div>`;

  const { totalBlocks, completedCount, tagCounts, calmTrend, bitingTrend, terminadoRate, tagCalmAvg, suggestions } = ins;
  const pct = Math.round(100 * completedCount / totalBlocks);
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  const maxTag = sortedTags.length ? sortedTags[0][1] : 1;

  return `
    <div class="revision-grid">
      <div class="stat-card">
        <div class="stat-num">${completedCount}/${totalBlocks}</div>
        <div class="stat-label">Bloques completados</div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
      ${terminadoRate !== null ? `<div class="stat-card">
        <div class="stat-num">${Math.round(terminadoRate * 100)}%</div>
        <div class="stat-label">Terminado efectivo</div>
        <div class="stat-trend ${terminadoRate >= 0.6 ? 'trend-good' : 'trend-warn'}">
          ${terminadoRate >= 0.6 ? '↑ bien' : '↓ practicar más'}
        </div>
      </div>` : ''}
      <div class="stat-card">
        <div class="stat-num" style="font-size:16px;text-transform:uppercase">${bitingTrend}</div>
        <div class="stat-label">Tendencia mordida</div>
        <div class="stat-trend ${bitingTrend === 'bajando' ? 'trend-good' : bitingTrend === 'subiendo' ? 'trend-bad' : 'trend-neutral'}">
          ${bitingTrend === 'bajando' ? '↓ bien' : bitingTrend === 'subiendo' ? '↑ atención' : '→ sin cambio'}
        </div>
      </div>
    </div>

    ${sortedTags.length ? `
      <h2 class="section-title">Ejercicios completados</h2>
      <div class="tag-list">
        ${sortedTags.map(([tag, count]) => `<div class="tag-row">
          <span class="tag-name">${tagLabel(tag)}</span>
          <span class="tag-bar-wrap"><span class="tag-bar" style="width:${Math.round(100*count/maxTag)}%"></span></span>
          <span class="tag-count">${count}</span>
        </div>`).join('')}
      </div>` : ''}

    ${calmTrend.length ? `
      <h2 class="section-title">Calma por día (promedio)</h2>
      <div class="calm-chart">
        ${calmTrend.map(d => `<div class="calm-day">
          <div class="calm-bar-wrap"><div class="calm-bar" style="height:${Math.round(d.avg/5*60)}px" title="${d.avg.toFixed(1)}"></div></div>
          <div class="calm-label">${d.date.slice(5)}</div>
          <div class="calm-val">${d.avg.toFixed(1)}</div>
        </div>`).join('')}
      </div>` : ''}

    ${tagCalmAvg.length ? `
      <h2 class="section-title">Calma promedio por ejercicio</h2>
      <div class="tag-list">
        ${tagCalmAvg.map(t => `<div class="tag-row">
          <span class="tag-name">${tagLabel(t.tag)}</span>
          <span class="tag-bar-wrap"><span class="tag-bar tag-bar-blue" style="width:${Math.round(t.avg/5*100)}%"></span></span>
          <span class="tag-count">${t.avg.toFixed(1)}</span>
        </div>`).join('')}
      </div>` : ''}

    ${suggestions.length ? `
      <h2 class="section-title">Sugerencias para la próxima semana</h2>
      <ul class="suggestion-list">
        ${suggestions.map(s => `<li>${escHtml(s)}</li>`).join('')}
      </ul>` : ''}
  `;
}

// ─── View: BIBLIOTECA ────────────────────────────────────────────────────
// ─── Behavior selector ────────────────────────────────────────────────────
function selectBehavior(key) {
  state.selectedBehavior = state.selectedBehavior === key ? null : key;
  saveState();
  document.getElementById('app').innerHTML = renderPlan();
  if (state.selectedBehavior) {
    const el = document.getElementById('plan-detail');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderPlanSession(s, behaviorKey, sessionIndex) {
  const eCls = ENERGY_CLS[s.energyRequired] || '';
  const dCls = DIFF_CLS[s.difficulty] || '';
  const rewardLevel = rewardLevelForPlan(behaviorKey, sessionIndex, s);
  return `<div class="plan-session">
    <div class="plan-session-header">
      <span class="slot-label ${SLOT_CLS[s.slot] || ''}">${s.slot}</span>
      ${s.energyRequired ? `<span class="energy-badge ${eCls}">${ENERGY_LABEL[s.energyRequired]}</span>` : ''}
      ${s.difficulty ? `<span class="diff-badge ${dCls}">${s.difficulty}</span>` : ''}
      ${renderRewardBadge(rewardLevel)}
      <span class="plan-session-dur">${s.duration ? s.duration + ' min' : ''}</span>
    </div>
    <div class="plan-session-title">${escHtml(s.title)}</div>
    <div class="plan-session-purpose">${escHtml(s.purpose)}</div>
    <div class="plan-section start">
      <div class="plan-section-label">Cómo empezar</div>
      <div class="plan-section-body">${escHtml(s.startRitual)}</div>
    </div>
    <div class="plan-section reward">
      <div class="plan-section-label">Recompensa recomendada</div>
      <div class="plan-section-body">${renderRewardRecommendation(rewardLevel)}</div>
    </div>
    <div class="plan-section">
      <div class="plan-section-label">Pasos</div>
      <div class="plan-section-body"><ol>${s.steps.map(st => `<li>${escHtml(st)}</li>`).join('')}</ol></div>
    </div>
    <div class="plan-section">
      <div class="plan-section-label">Cómo terminar</div>
      <div class="plan-section-body">${escHtml(s.endRitual)}</div>
    </div>
    <div class="plan-section warning">
      <div class="plan-section-label">Señales de parada / qué evitar</div>
      <div class="plan-section-body">${escHtml(s.warningSign)}</div>
    </div>
    <div class="plan-section success">
      <div class="plan-section-label">Qué tiene el éxito</div>
      <div class="plan-section-body">${escHtml(s.successLooks)}</div>
    </div>
  </div>`;
}

function renderOutdoorGuide() {
  return `<div class="outdoor-guide">
    <div class="outdoor-guide-title">Regla Malinois: canalizar, no agotar</div>
    <div class="outdoor-guide-copy">La base diaria es baño + olfato. Añade una actividad principal según el día. Carrera, pelota y montaña son herramientas, no la rutina completa.</div>
    <div class="outdoor-guide-grid">
      <div><strong>Cada día</strong><span>Salidas sanitarias · paseo olfativo · check-ins breves</span></div>
      <div><strong>Elige 1 principal</strong><span>Socialización · caminata · pelota · carrera libre · correr · playa · montaña</span></div>
      <div><strong>Después de intensidad</strong><span>5–10 min de olfato lento + agua + entrada tranquila</span></div>
      <div><strong>Si sigue siendo cachorro</strong><span>Bajo impacto y ritmo libre. Sin jogging impuesto. Consulta duración e impacto con su veterinario.</span></div>
    </div>
    <div class="outdoor-guide-alert">Hasta tener recall fiable: zona cerrada o línea larga. Socializar = poder observar y desconectar; no saludar a todos los perros.</div>
  </div>`;
}

function renderOutdoorRoutine(routine) {
  const TYPE_LABELS = {
    base: 'BASE',
    calma: 'OLFATO',
    social: 'SOCIAL',
    habilidad: 'HABILIDAD',
    juego: 'JUEGO',
    fisico: 'FÍSICO',
    entorno: 'ENTORNO',
  };
  const TYPE_CLS = {
    base: 'outdoor-base',
    calma: 'outdoor-calm',
    social: 'outdoor-social',
    habilidad: 'outdoor-skill',
    juego: 'outdoor-play',
    fisico: 'outdoor-physical',
    entorno: 'outdoor-environment',
  };
  const rewardLevel = rewardLevelFor(routine);

  return `<div class="ex-item outdoor-item" id="out-${routine.key}">
    <div class="ex-header outdoor-header" onclick="toggleOutdoor('${routine.key}')">
      <div class="ex-header-left outdoor-header-left">
        <span class="outdoor-type ${TYPE_CLS[routine.type] || ''}">${TYPE_LABELS[routine.type] || routine.type}</span>
        ${renderRewardBadge(rewardLevel)}
        <div>
          <div class="ex-title">${escHtml(routine.title)}</div>
          <div class="ex-sub">${escHtml(routine.subtitle)}</div>
        </div>
      </div>
      <span class="ex-arrow" id="outarr-${routine.key}">▸</span>
    </div>
    <div class="ex-body" id="outb-${routine.key}" style="display:none"></div>
  </div>`;
}

function renderOutdoorBody(routine) {
  const rewardLevel = rewardLevelFor(routine);
  return `
    ${routine.conditionBadge ? `<div class="condition-badge">${escHtml(routine.conditionBadge)}</div>` : ''}
    <div class="ex-row"><span class="ex-key">Duración</span><span>${escHtml(routine.duration)}</span></div>
    <div class="ex-row"><span class="ex-key">Frecuencia</span><span>${escHtml(routine.frequency)}</span></div>
    <div class="ex-row"><span class="ex-key">Intensidad</span><span>${escHtml(routine.intensity)}</span></div>
    <div class="ex-row"><span class="ex-key">Objetivo</span><span>${escHtml(routine.purpose)}</span></div>
    <div class="ex-row ex-row-reward"><span class="ex-key">Premio</span><span>${renderRewardRecommendation(rewardLevel)}</span></div>
    <div class="ex-row outdoor-condition"><span class="ex-key">Condición</span><span>${escHtml(routine.condition)}</span></div>
    <div class="ex-row"><span class="ex-key">Inicio</span><span>${escHtml(routine.start)}</span></div>
    <div class="ex-row"><span class="ex-key">Pasos</span>
      <ol class="ex-steps">${routine.steps.map(step => `<li>${escHtml(step)}</li>`).join('')}</ol>
    </div>
    <div class="ex-row"><span class="ex-key">Cierre</span><span>${escHtml(routine.finish)}</span></div>
    <div class="ex-row ex-row-alarm"><span class="ex-key">Para si</span><span>${escHtml(routine.stop)}</span></div>`;
}

function renderPlan() {
  const BEHAVIOR_KEYS = [
    ['mordida',       'manos / ropa'],
    ['saltos',        'en saludos'],
    ['sofa',          'subir / bajar'],
    ['sigue',         'velcro'],
    ['separacion',    'tiempo solo'],
    ['jaula',         'zona de calma'],
    ['trailla',       'preparación'],
    ['llamada',       'recall'],
    ['impulso',       'autocontrol'],
    ['enriquecimiento','mente activa'],
    ['calma_post',    'post-juego'],
    ['sueno',         'cierre de día'],
  ];

  const sel = state.selectedBehavior;
  const plan = sel ? BEHAVIOR_PLANS[sel] : null;

  const typeLabel = { activacion: 'ACTIVACIÓN', calma: 'CALMA', terminado: 'TERMINADO' };
  const typeCls   = { activacion: 'badge-act', calma: 'badge-calm', terminado: 'badge-term' };

  return `
    ${renderRewardGuide()}

    <h2 class="section-title">¿En qué trabajamos hoy?</h2>
    <div class="behavior-grid">
      ${BEHAVIOR_KEYS.map(([key, sub]) => `
        <button class="behavior-btn${sel === key ? ' selected' : ''}" onclick="selectBehavior('${key}')">
          ${BEHAVIOR_PLANS[key] ? escHtml(BEHAVIOR_PLANS[key].label) : key}
          <span class="behavior-sub">${escHtml(sub)}</span>
        </button>
      `).join('')}
    </div>

    ${plan ? `<div id="plan-detail">
      <div class="plan-intro">
        <div class="plan-intro-title">${escHtml(plan.label)}</div>
        <div class="plan-intro-purpose">${escHtml(plan.purpose)}</div>
      </div>
      ${plan.sessions.map((s, i) => renderPlanSession(s, sel, i)).join('')}
    </div>` : ''}

    <h2 class="section-title">Rutinas de salida — ${OUTDOOR_ROUTINES.length} opciones</h2>
    ${renderOutdoorGuide()}
    <div class="ex-list outdoor-list">
      ${OUTDOOR_ROUTINES.map(routine => renderOutdoorRoutine(routine)).join('')}
    </div>

    <h2 class="section-title">Biblioteca de ejercicios — ${EXERCISE_LIBRARY.length} ejercicios</h2>
    <div class="ex-list">
      ${EXERCISE_LIBRARY.map(ex => {
        const rewardLevel = rewardLevelFor(ex);
        return `
        <div class="ex-item" id="ex-${ex.key}">
          <div class="ex-header" onclick="toggleEx('${ex.key}')">
            <div class="ex-header-left">
              <span class="badge ${typeCls[ex.type] || ''}">${typeLabel[ex.type] || ex.type.toUpperCase()}</span>
              ${renderRewardBadge(rewardLevel)}
              <div>
                <div class="ex-title">${escHtml(ex.title)}</div>
                <div class="ex-sub">${escHtml(ex.subtitle)}</div>
              </div>
            </div>
            <span class="ex-arrow" id="exarr-${ex.key}">▸</span>
          </div>
          <div class="ex-body" id="exb-${ex.key}" style="display:none">
            <div class="ex-row"><span class="ex-key">Duración</span><span>${escHtml(ex.duration)}</span></div>
            <div class="ex-row"><span class="ex-key">Enseña</span><span>${escHtml(ex.teaches)}</span></div>
            <div class="ex-row"><span class="ex-key">Cuándo</span><span>${escHtml(ex.when)}</span></div>
            <div class="ex-row ex-row-reward"><span class="ex-key">Premio</span><span>${renderRewardRecommendation(rewardLevel)}</span></div>
            <div class="ex-row"><span class="ex-key">Inicio</span><span>${escHtml(ex.start)}</span></div>
            <div class="ex-row"><span class="ex-key">Pasos</span>
              <ol class="ex-steps">${ex.steps.map(s => `<li>${escHtml(s)}</li>`).join('')}</ol>
            </div>
            <div class="ex-row"><span class="ex-key">Cierre</span><span>${escHtml(ex.finish)}</span></div>
            <div class="ex-row ex-row-alarm"><span class="ex-key">Si escala</span><span>${escHtml(ex.alarm)}</span></div>
            <div class="ex-row ex-row-mistakes"><span class="ex-key">Errores comunes</span>
              <ul class="ex-mistakes">${ex.mistakes.map(m => `<li>${escHtml(m)}</li>`).join('')}</ul>
            </div>
          </div>
        </div>
      `}).join('')}
    </div>`;
}

function toggleEx(key) {
  const body  = document.getElementById('exb-' + key);
  const arrow = document.getElementById('exarr-' + key);
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display  = open ? 'none' : 'block';
  if (arrow) arrow.textContent = open ? '▸' : '▾';
}

function toggleOutdoor(key) {
  const body  = document.getElementById('outb-' + key);
  const arrow = document.getElementById('outarr-' + key);
  if (!body) return;
  const open = body.style.display !== 'none';
  if (!open && !body.hasChildNodes()) {
    const routine = OUTDOOR_ROUTINES.find(item => item.key === key);
    if (routine) body.innerHTML = renderOutdoorBody(routine);
  }
  body.style.display  = open ? 'none' : 'block';
  if (arrow) arrow.textContent = open ? '▸' : '▾';
}

// ─── Escalation modal ─────────────────────────────────────────────────────
function openEscalation() {
  const modal = document.getElementById('esc-modal');
  if (!modal) return;
  modal.innerHTML = `<div class="esc-modal-box">
    <div class="esc-modal-header">
      <span>Las cosas están escalando</span>
      <button class="modal-close" style="color:var(--red)" onclick="closeEscalation()">✕</button>
    </div>
    <div class="esc-modal-body">
      ${ESCALATION_STEPS.map((s, i) => `
        <div class="esc-step">
          <div class="esc-num">${i + 1}</div>
          <div>
            <div class="esc-text">${escHtml(s.action)}</div>
            <div class="esc-sub">${escHtml(s.detail)}</div>
          </div>
        </div>`).join('')}
      <button class="esc-close-btn" onclick="closeEscalation()">Entendido — fin de sesión</button>
    </div>
  </div>`;
  modal.style.display = 'flex';
}

function closeEscalation() {
  const modal = document.getElementById('esc-modal');
  if (modal) modal.style.display = 'none';
}

// ─── View: AJUSTES ────────────────────────────────────────────────────────
function renderAjustes() {
  const s = state.settings;

  function pills(name, options, current) {
    return options.map(v => `<label class="radio-pill${current === v ? ' radio-on' : ''}">
      <input type="radio" name="${name}" value="${v}" ${current === v ? 'checked' : ''} onchange="updateSetting('${name}','${v}')">
      ${v.charAt(0).toUpperCase() + v.slice(1)}
    </label>`).join('');
  }

  const CORRECTION_OPTS = [
    ['biting',        'Reducir mordida'],
    ['overexcitement','Reducir sobreexcitación'],
    ['jumping',       'Reducir saltos'],
    ['recall',        'Mejorar recall interior'],
    ['calming',       'Mejorar calma general'],
    ['frustration',   'Manejar frustración'],
  ];
  const TEACHING_OPTS = [
    ['legalBiting',   'Mordida legal / tug'],
    ['calmMat',       'Manta de calma'],
    ['touch',         'Touch / nariz a mano'],
    ['espera',        'Espera / impulso'],
    ['scentWork',     'Trabajo de olfato'],
    ['bringObject',   'Traer objeto'],
    ['gameOver',      'Terminado / off-switch'],
    ['objectNames',   'Nombres de objetos'],
  ];

  return `
    <h2 class="section-title">Generar plan semanal</h2>
    <div class="settings-form">
      <div>
        <label class="form-label">Objetivo de corrección principal</label>
        <div class="radio-group">
          ${CORRECTION_OPTS.map(([v, label]) =>
            `<label class="radio-pill${s.correctionGoal === v ? ' radio-on' : ''}">
              <input type="radio" name="correctionGoal" value="${v}" ${s.correctionGoal === v ? 'checked' : ''} onchange="updateSetting('correctionGoal','${v}')">
              ${label}
            </label>`).join('')}
        </div>
      </div>
      <div>
        <label class="form-label">Objetivo de enseñanza principal</label>
        <div class="radio-group">
          ${TEACHING_OPTS.map(([v, label]) =>
            `<label class="radio-pill${s.teachingGoal === v ? ' radio-on' : ''}">
              <input type="radio" name="teachingGoal" value="${v}" ${s.teachingGoal === v ? 'checked' : ''} onchange="updateSetting('teachingGoal','${v}')">
              ${label}
            </label>`).join('')}
        </div>
      </div>
      <div>
        <label class="form-label">Nivel de energía general</label>
        <div class="radio-group">${pills('energyLevel', ['low','medium','high'], s.energyLevel)}</div>
      </div>
      <div>
        <label class="form-label">Nivel de mordida esta semana</label>
        <div class="radio-group">${pills('bitingLevel', ['alto','medio','bajo'], s.bitingLevel)}</div>
      </div>
      <div>
        <label class="form-label">Nivel de terminado</label>
        <div class="radio-group">${pills('terminadoLevel', ['pobre','parcial','bueno'], s.terminadoLevel)}</div>
      </div>
      <div>
        <label class="form-label">Calma general esta semana: <strong id="calm-display">${s.calmScore}</strong>/5</label>
        <input class="form-range" type="range" min="1" max="5" value="${s.calmScore}"
               oninput="state.settings.calmScore=parseInt(this.value);document.getElementById('calm-display').textContent=this.value;saveState()">
      </div>
      <div>
        <label class="form-label">Objeto actual en entrenamiento</label>
        <input class="form-input" type="text" value="${escHtml(s.currentObject)}" placeholder="pelota"
               oninput="state.settings.currentObject=this.value;saveState()">
      </div>
      <div>
        <label class="form-label" style="display:flex;align-items:center;gap:8px;text-transform:none;font-size:12px">
          <input type="checkbox" ${s.newObjectReady ? 'checked' : ''} onchange="updateSetting('newObjectReady',this.checked)">
          Lista para introducir un objeto nuevo esta semana
        </label>
        ${s.newObjectReady ? `<input class="form-input" type="text" placeholder="Nombre del nuevo objeto"
          value="${escHtml(s.nextObject || '')}" oninput="state.settings.nextObject=this.value;saveState()" style="margin-top:6px">` : ''}
      </div>

      <button class="btn btn-primary btn-block" onclick="doGenerateWeek()">▶ Generar plan — semana de ${isoDate(getMondayOf(new Date()))}</button>
      ${state.week ? `<p class="settings-meta">Plan activo generado: ${state.week.weekOf}</p>` : ''}
    </div>

    <h2 class="section-title">Datos</h2>
    <div class="data-actions">
      <button class="btn btn-ghost" onclick="exportJSON()">↓ Exportar JSON</button>
      <button class="btn btn-ghost" onclick="document.getElementById('import-input').click()">↑ Importar JSON</button>
      <input id="import-input" type="file" accept=".json" style="display:none" onchange="importJSON(this.files[0])">
    </div>
  `;
}

function updateSetting(key, value) {
  state.settings[key] = value;
  saveState();
  // Re-render ajustes so radio-pill active classes update
  if (['bitingLevel','terminadoLevel','newObjectReady','correctionGoal','teachingGoal','energyLevel'].includes(key)) {
    document.getElementById('app').innerHTML = renderAjustes();
  }
}

function doGenerateWeek() {
  if (state.week && !confirm('¿Generar nuevo plan? El plan actual se reemplazará (los registros se conservan).')) return;
  state.week = generateWeek(state.settings);
  saveState();
  setView('hoy');
  showNotice('Plan semanal generado');
}

// ─── Log modal ────────────────────────────────────────────────────────────
let _logBlockId = null;
let _logDate    = null;

function openLog(blockId, date) {
  _logBlockId = blockId;
  _logDate    = date;
  const block = findBlock(blockId);
  if (!block) return;
  const log = state.logs[blockId] || {};
  document.getElementById('log-modal').innerHTML = renderLogForm(block, log, date);
  document.getElementById('log-modal').style.display = 'flex';
}

function closeLog() {
  document.getElementById('log-modal').style.display = 'none';
  _logBlockId = null;
  _logDate    = null;
}

function renderLogForm(block, log, date) {
  const slotLabel = block.slot ? ` · ${block.slot}` : '';
  function radioRow(name, opts, current) {
    return `<div class="radio-row">${opts.map(([v, label]) =>
      `<label><input type="radio" name="${name}" value="${v}" ${current === v ? 'checked' : ''}><span>${label}</span></label>`
    ).join('')}</div>`;
  }
  return `<div class="modal-box">
    <div class="modal-header">
      <span>¿Cómo fue la sesión?</span>
      <button class="modal-close" onclick="closeLog()">✕</button>
    </div>
    <div class="modal-body">
      <div class="log-block-title">${escHtml(block.title)}</div>
      <div class="log-block-date">${date}${slotLabel}</div>

      <div>
        <label class="form-label">¿Quién entrenó con Shadow?</label>
        <input class="form-input" id="log-by" type="text" placeholder="Tu nombre"
               value="${escHtml(log.completedBy || '')}" autocomplete="off">
      </div>

      <div>
        <label class="form-label">Calma durante la sesión (1 = muy activada · 5 = muy tranquila)</label>
        <div class="star-row" id="star-row">
          ${[1,2,3,4,5].map(n => `<button class="star-btn${(log.calmScore||0)>=n?' star-on':''}"
              onclick="setStars(${n})">${(log.calmScore||0)>=n?'★':'☆'}</button>`).join('')}
        </div>
        <input type="hidden" id="log-calm-val" value="${log.calmScore||''}">
      </div>

      <div>
        <label class="form-label">Nivel de activación de Shadow durante la sesión</label>
        ${radioRow('energy', [['1','muy baja'],['2','baja'],['3','media'],['4','alta'],['5','muy alta']], String(log.energyLevel||''))}
        <input type="hidden" id="log-energy-val" value="${log.energyLevel||''}">
      </div>

      <div>
        <label class="form-label">¿Cuántas veces mordió manos o ropa? (0 = ninguna)</label>
        <input class="form-input" id="log-biting" type="number" min="0" max="9" inputmode="numeric"
               value="${log.bitingIncidents!=null?log.bitingIncidents:''}">
      </div>

      <div>
        <label class="form-label">Recuperación post-sesión — ¿cuánto tardó en calmarse?</label>
        ${radioRow('recovery', [['rápida','rápida'],['normal','normal'],['lenta','lenta']], log.calmRecovery||'')}
      </div>

      <div>
        <label class="form-label">¿"Terminado" funcionó cuando lo usaste?</label>
        <div class="radio-row">
          <label><input type="radio" name="term" value="si"  ${log.terminadoWorked===true?'checked':''}><span>Sí</span></label>
          <label><input type="radio" name="term" value="no"  ${log.terminadoWorked===false?'checked':''}><span>No</span></label>
          <label><input type="radio" name="term" value="na"  ${log.terminadoWorked==null?'checked':''}><span>No lo usé</span></label>
        </div>
      </div>

      <div>
        <label class="form-label">Notas (opcional)</label>
        <textarea class="form-input form-textarea" id="log-notes"
                  placeholder="Qué ocurrió, el contexto, el ambiente...">${escHtml(log.notes||'')}</textarea>
      </div>

      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="closeLog()">Cancelar</button>
        <button class="btn btn-primary" onclick="saveLog()">Guardar sesión</button>
      </div>
    </div>
  </div>`;
}

function setStars(n) {
  const hidden = document.getElementById('log-calm-val');
  if (hidden) hidden.value = n;
  document.querySelectorAll('.star-btn').forEach((btn, i) => {
    const on = i < n;
    btn.textContent = on ? '★' : '☆';
    btn.classList.toggle('star-on', on);
  });
}

function saveLog() {
  const by        = (document.getElementById('log-by').value || '').trim();
  const calmVal   = document.getElementById('log-calm-val').value;
  const energyEl  = document.querySelector('input[name="energy"]:checked');
  const biting    = document.getElementById('log-biting').value;
  const recoveryEl= document.querySelector('input[name="recovery"]:checked');
  const termEl    = document.querySelector('input[name="term"]:checked');
  const notes     = (document.getElementById('log-notes').value || '').trim();

  if (!by) { showNotice('Indica quién hizo la sesión', 'error'); return; }

  const terminadoWorked = termEl
    ? (termEl.value === 'si' ? true : termEl.value === 'no' ? false : null)
    : null;

  const block = findBlock(_logBlockId);
  const log = {
    blockId:         _logBlockId,
    tag:             block && block.tag,
    date:            _logDate,
    completedBy:     by,
    completedAt:     new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    calmScore:       calmVal ? parseInt(calmVal, 10) : null,
    energyLevel:     energyEl ? parseInt(energyEl.value, 10) : null,
    bitingIncidents: biting !== '' ? parseInt(biting, 10) : null,
    calmRecovery:    recoveryEl ? recoveryEl.value : null,
    terminadoWorked,
    notes,
  };

  state.logs[_logBlockId] = log;

  if (block) {
    block.completed   = true;
    block.completedBy = by;
    block.completedAt = log.completedAt;
  }

  saveState();
  closeLog();
  render();
  showNotice('Sesión guardada');
}

// ─── Helper: find block ───────────────────────────────────────────────────
function findBlock(id) {
  if (!state.week) return null;
  for (const day of state.week.days) {
    for (const b of day.blocks) { if (b.id === id) return b; }
  }
  return null;
}

// ─── Main render ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'hoy',      label: 'HOY',     icon: '▶' },
  { id: 'plan',     label: 'PLAN',    icon: '◆' },
  { id: 'semana',   label: 'SEMANA',  icon: '◼' },
  { id: 'revision', label: 'AVANCE',  icon: '↑' },
  { id: 'ajustes',  label: 'AJUSTES', icon: '⚙' },
];

function render() {
  const nav       = document.getElementById('nav');
  const mobileNav = document.getElementById('mobile-nav');
  const app       = document.getElementById('app');

  const tabHtml = NAV_ITEMS.map(item =>
    `<button class="nav-btn${state.view === item.id ? ' nav-active' : ''}" onclick="setView('${item.id}')">${item.label}</button>`
  ).join('');

  if (nav) nav.innerHTML = tabHtml;

  if (mobileNav) {
    mobileNav.innerHTML = NAV_ITEMS.map(item =>
      `<button class="mobile-tab${state.view === item.id ? ' nav-active' : ''}" onclick="setView('${item.id}')">
        <span class="tab-icon">${item.icon}</span>
        <span>${item.label}</span>
      </button>`
    ).join('');
  }

  switch (state.view) {
    case 'hoy':      app.innerHTML = renderHoy();      break;
    case 'plan':     app.innerHTML = renderPlan();     break;
    case 'semana':   app.innerHTML = renderSemana();   break;
    case 'revision': app.innerHTML = renderRevision(); break;
    case 'ajustes':  app.innerHTML = renderAjustes();  break;
    default:         app.innerHTML = renderHoy();
  }

  // Header status line
  const hs = document.getElementById('header-status');
  if (state.week) {
    const td   = state.week.days.find(d => d.date === todayISO());
    const done = td ? td.blocks.filter(b => b.completed).length : 0;
    const tot  = td ? td.blocks.length : 0;
    hs.innerHTML = `<span class="header-name">🐾 Shadow</span>`
      + `<span class="header-week">semana del ${state.week.weekOf}</span>`
      + (td ? `<span class="header-prog">${done}/${tot} hoy</span>` : '');
  } else {
    hs.innerHTML = `<span class="header-name">🐾 Shadow Trainer</span>`;
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────
loadState();
render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
