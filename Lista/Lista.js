/* Lista.js mantiene la logica JavaScript vista per la navbar 
   della pagina index-home, da ripetere in ogni altra pagina del 
   sito web: nessuna libreria esterna: vanilla JS puro.
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


  /* DROPDOWN LUOGHI
     Gestisce:
       1. Apertura / chiusura il pannello al click sul pulsante "Luoghi"
       2. Chiusura cliccando fuori dal pannello
       3. Chiusura con il tasto Escape (già gestito sopra)
       4. Aggiornamento aria-expanded per accessibilità
       5. Checkbox selezionabili liberamente
       6. Bottone "Filtra": chiude il pannello (performativo) */

  const luoghiBtn    = document.querySelector('.places-btn');
  const luoghiMenu   = document.querySelector('.menu-casc-pl');
  const filtraBtn    = document.querySelector('.to-filter-btn');

  /* Apertura / chiusura del pannello Luoghi */
  function toggleLuoghi(forcedState) {
    if (!luoghiBtn || !luoghiMenu) return;

    const isOpen = (forcedState !== undefined)
      ? forcedState
      : !luoghiMenu.classList.contains('open');

    luoghiMenu.classList.toggle('open', isOpen);
    luoghiBtn.setAttribute('aria-expanded', String(isOpen));
  }

  if (luoghiBtn) {
    luoghiBtn.addEventListener('click', (e) => {
      e.stopPropagation();   /* impedisce la propagazione al listener "click outside" */
      toggleLuoghi();
    });
  }

  /* Click fuori dal pannello Luoghi → chiude il dropdown */
  document.addEventListener('click', (e) => {
    if (
      luoghiMenu &&
      !luoghiMenu.contains(e.target) &&
      e.target !== luoghiBtn
    ) {
      toggleLuoghi(false);
    }
  });

  /* Escape chiude anche il pannello Luoghi */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleLuoghi(false);
    }
  });

  /* Pulsante "Filtra": chiude il pannello, nessun filtro reale */
  if (filtraBtn) {
    filtraBtn.addEventListener('click', () => {
      toggleLuoghi(false);
    });
  }
})(); /* IIFE — isola tutte le variabili dal namespace globale */