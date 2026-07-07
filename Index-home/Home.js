/* HOME.JS raccoglie in un unico file tutta la logica JavaScript
   della pagina index-home:
   nessuna libreria esterna: vanilla JS puro.
   Entrambe le parti sono incapsulate in un'unica IIFE così
   le loro variabili non inquinano il namespace globale.
   Una IIFE (Immediately Invoked Function Expression) in JavaScript 
   è una funzione definita e eseguita immediatamente nello stesso 
   punto in cui viene creata. Il suo scopo principale è creare un 
   ambito (scope) locale isolato per le variabili, evitando di 
   "inquinare" lo scope globale */

(function () {
  'use strict';

  /* NAVBAR
     Gestisce:
       1. Bottone hamburger ☰ → apre/chiude il menu principale
       2. Bottone "Catalogo"  → apre/chiude il sottomenu
       3. Chiusura cliccando fuori dall'header (click outside)
       4. Chiusura con il tasto Escape (accessibilità) */

  /* Selezione elementi navbar */
  const toggleBtn    = document.getElementById('toggleBtn');
  const navMenu      = document.getElementById('navMenu');
  const catalogoBtn  = document.getElementById('catalogoToggle');
  const catalogoMenu = document.getElementById('catalogoMenu');

  /* Apri / chiudi menu principale
     forcedState (true/false) permette di forzare lo stato;
     senza argomento inverte lo stato corrente (toggle) */
  function toggleMenu(forcedState) {
    if (!toggleBtn || !navMenu) return;

    const isOpen = (forcedState !== undefined)
      ? forcedState
      : !navMenu.classList.contains('open');

    navMenu.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    /* Cambia simbolo: ☰ quando chiuso, ✕ quando aperto */
    toggleBtn.textContent = isOpen ? '✕' : '☰';
    
    if (!isOpen) toggleBtn.blur();
    /* Quando il menu si chiude, toglie il focus dal bottone
    così l'anello di evidenziazione del browser scompare.
    .blur() rimuove il focus dall'elemento corrente. */
  }

  /* Apri / chiudi sottomenu Catalogo 
     In più ruota la freccia ▾ di 180° tramite style.transform */
  function toggleCatalogo(forcedState) {
    if (!catalogoBtn || !catalogoMenu) return;

    const isOpen = (forcedState !== undefined)
      ? forcedState
      : !catalogoMenu.classList.contains('open');

    catalogoMenu.classList.toggle('open', isOpen);
    catalogoBtn.setAttribute('aria-expanded', String(isOpen));

    const arrow = catalogoBtn.querySelector('.arrow');
    if (arrow) arrow.style.transform = isOpen ? 'rotate(180deg)' : '';
  }

  /* Event listener navbar */
  if (toggleBtn)   toggleBtn.addEventListener('click',  () => toggleMenu());
  if (catalogoBtn) catalogoBtn.addEventListener('click', () => toggleCatalogo());

  /* Click fuori dall'header → chiude tutto */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('header')) {
      toggleMenu(false);
      toggleCatalogo(false);
    }
  });

  /* Tasto Escape → chiude tutto e riporta focus al bottone ☰ */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleMenu(false);
      toggleCatalogo(false);
      if (toggleBtn) toggleBtn.focus();
    }
  });


  /* CAROSELLO
     Gestisce:
       1. Spostamento slide via translateX
       2. Frecce sinistra / destra
       3. Pallini indicatori cliccabili
       4. Swipe touch (mobile)
       5. Autoplay con pausa al hover
       6. Navigazione da tastiera (← →) */

  /* Selezione elementi carosello
     Nomi diversi dalle variabili navbar: nessun conflitto */
  const track    = document.querySelector('.carousel__track');
  const slides   = Array.from(document.querySelectorAll('.carousel__slide'));
  const dots     = Array.from(document.querySelectorAll('.carousel__dot'));
  const btnLeft  = document.querySelector('.carousel__arrow--left');
  const btnRight = document.querySelector('.carousel__arrow--right');
  const carousel = document.querySelector('.carousel');

  /* Se il carosello non è presente nella pagina, salta tutto  */
  if (track && slides.length > 0) {

    let currentIndex = 0;
    let autoplayId   = null;

    /* Sposta la striscia alla slide indicata dall'indice
       Ogni slide è larga 100%: translateX(-index * 100%)
       porta la slide corretta sotto la finestra visibile. */
    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      /* Aggiorna pallini e attributi ARIA */
      dots.forEach((dot, i) => {
        dot.classList.toggle('carousel__dot--active', i === currentIndex);
        dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
      });
    }

    /* Frecce */
    if (btnLeft)  btnLeft.addEventListener('click',  () => goToSlide(currentIndex - 1));
    if (btnRight) btnRight.addEventListener('click', () => goToSlide(currentIndex + 1));

    /* Pallini */
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goToSlide(i));
    });

    /* Swipe touch (mobile) */
    let touchStartX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) goToSlide(currentIndex + (delta > 0 ? 1 : -1));
    });

    /* Autoplay */
    const AUTOPLAY_INTERVAL = 5000; /* ms */

    function startAutoplay() {
      autoplayId = setInterval(() => goToSlide(currentIndex + 1), AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
      clearInterval(autoplayId);
    }

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    /* Tastiera (← →) */
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  goToSlide(currentIndex - 1);
      if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    });

    /* Avvio */
    goToSlide(0);
    startAutoplay();

  }

})(); /* IIFE — isola tutte le variabili dal namespace globale */
