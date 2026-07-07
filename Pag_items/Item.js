/* Item_1.js — Prima Repubblica, prime elezioni
   Logica JavaScript della pagina della singola risorsa descritta. */

(function () {
  'use strict';

  /* NAVBAR
     Gestisce:
       1. Bottone hamburger ☰ → apre/chiude il menu principale
       2. Bottone "Catalogo"  → apre/chiude il sottomenu
       3. Chiusura cliccando fuori dall'header (click outside)
       4. Chiusura con il tasto Escape (accessibilità) */

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


  /* DROPDOWN DOWNLOAD IMMAGINE
     Gestisce:
       1. Apri / chiudi il pannello al click sul pulsante "Immagine"
       2. Chiusura cliccando fuori dal pannello
       3. Chiusura con il tasto Escape (già gestito sopra)
       4. Aggiornamento aria-expanded per accessibilità
       5. Pulsante "Scarica": chiude il pannello (nessun download reale) */

  const downloadBtn  = document.getElementById('dropdownMenuButton');
  const downloadMenu = document.querySelector('.dropdown-menu');
  const btnScarica   = document.querySelector('.btn-download');

  /* Apri / chiudi pannello download */
  function toggleDownload(forcedState) {
    if (!downloadBtn || !downloadMenu) return;

    const isOpen = (forcedState !== undefined)
      ? forcedState
      : !downloadMenu.classList.contains('show');

    downloadMenu.classList.toggle('show', isOpen);
    downloadBtn.setAttribute('aria-expanded', String(isOpen));
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.stopPropagation();   /* impedisce la propagazione al listener "click outside" */
      toggleDownload();
    });
  }

  /* Click fuori dal pannello → chiude il dropdown download */
  document.addEventListener('click', (e) => {
    if (
      downloadMenu &&
      !downloadMenu.contains(e.target) &&
      e.target !== downloadBtn
    ) {
      toggleDownload(false);
    }
  });

  /* Escape chiude anche il dropdown download
     (il listener keydown della navbar è già attivo!!!
      Aggiunta solo la chiusura del dropdown) */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleDownload(false);
    }
  });

  /* Pulsante "Scarica": chiude il pannello, nessun download reale */
  if (btnScarica) {
    btnScarica.addEventListener('click', () => {
      toggleDownload(false);
    });
  }

})(); /* IIFE — isola tutte le variabili dal namespace globale */
