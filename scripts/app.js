const PASOS = [
  {
    imagen: 'assets/images/gatito.jpg',
    emoji: '🌷',
    pregunta: '¿Ya te levantaste, chambeadora?',
    texto: ''
  },
  {
    imagen: 'assets/images/gatito2.gif',
    emoji: '🤔',
    pregunta: 'Epa, tengo una pregunta… ¿Quieres saber?',
    texto: ''
  },
  {
    imagen: 'assets/images/gatito3.gif',
    emoji: '🍣',
    pregunta: '¿Quieres ir a comer sushi conmigo?',
    texto: 'Solo se acepta la respuesta por WhatsApp',
    botones: false
  }
];

const VOLUMEN = 0.5;

const tarjeta = document.getElementById('tarjeta');
const foto = document.querySelector('.foto');
const imagen = document.getElementById('imagen');
const pregunta = document.getElementById('pregunta');
const texto = document.getElementById('texto');
const opciones = document.getElementById('opciones');
const btnSi = document.getElementById('btnSi');
const btnNo = document.getElementById('btnNo');
const musica = document.getElementById('musica');

let paso = 0;
let esquives = 0;
let avisando = false;

musica.volume = VOLUMEN;

function musicaPrender() {
  if (!musica.paused) return;
  musica.play().catch(function () {});
}

musicaPrender();
document.addEventListener('pointerdown', musicaPrender, { once: true });
document.addEventListener('touchstart', musicaPrender, { once: true });
document.addEventListener('keydown', musicaPrender, { once: true });

function mostrar(contenido) {
  foto.dataset.emoji = contenido.emoji;
  foto.classList.remove('sin-foto');

  if (imagen.getAttribute('src') !== contenido.imagen) {
    imagen.setAttribute('src', contenido.imagen);
    imagen.setAttribute('alt', contenido.pregunta);
  }

  pregunta.textContent = contenido.pregunta;
  texto.textContent = contenido.texto || '';
  btnSi.textContent = 'Sí';
  opciones.hidden = contenido.botones === false;

  btnNo.textContent = 'No';
  btnNo.classList.remove('suelto');
  btnNo.style.left = '';
  btnNo.style.top = '';
  btnNo.style.transform = '';
  esquives = 0;
  avisando = false;
}

imagen.addEventListener('error', function () {
  foto.classList.add('sin-foto');
});

btnSi.addEventListener('click', function () {
  musicaPrender();

  if (paso >= PASOS.length - 1) return;

  paso++;
  mostrar(PASOS[paso]);
});

function escapar(e) {
  if (e) e.preventDefault();

  const margen = 12;
  const maxX = Math.max(margen, tarjeta.clientWidth - btnNo.offsetWidth - margen);
  const maxY = Math.max(margen, tarjeta.clientHeight - btnNo.offsetHeight - margen);

  if (!btnNo.classList.contains('suelto')) {
    btnNo.style.left = Math.max(margen, Math.min(maxX, btnNo.offsetLeft)) + 'px';
    btnNo.style.top = Math.max(margen, Math.min(maxY, btnNo.offsetTop)) + 'px';
    btnNo.classList.add('suelto');
  }

  const actualX = parseFloat(btnNo.style.left) || 0;
  const actualY = parseFloat(btnNo.style.top) || 0;
  const distancia = Math.min(maxX, maxY) * 0.5;

  let x = margen;
  let y = margen;
  let intentos = 0;

  do {
    x = margen + Math.random() * (maxX - margen);
    y = margen + Math.random() * (maxY - margen);
    intentos++;
  } while (Math.hypot(x - actualX, y - actualY) < distancia && intentos < 30);

  btnNo.style.left = x + 'px';
  btnNo.style.top = y + 'px';
  btnNo.style.transform = 'rotate(' + (Math.random() * 26 - 13).toFixed(1) + 'deg)';

  esquives++;

  if (esquives === 8 && !avisando) {
    avisando = true;
    texto.textContent = 'Eso no se hacee';
  }
}

btnNo.addEventListener('mouseenter', escapar);
btnNo.addEventListener('pointerdown', escapar);
btnNo.addEventListener('touchstart', escapar, { passive: false });
btnNo.addEventListener('focus', escapar);
btnNo.addEventListener('click', escapar);

mostrar(PASOS[0]);
