# Cyber Runner 2099 - Neon Escape ⚡

Un videogioco arcade 2D endless runner a tema Cyberpunk, sviluppato interamente in JavaScript puro (Vanilla ES6+) con HTML5 Canvas e Web Audio API nativa.

🎮 **Demo Giocabile Online**: [https://hv94.github.io/cyber-runner/](https://hv94.github.io/cyber-runner/)

---

## 🌟 Caratteristiche Principali

- **Rendering a 60 FPS con Parallax Scrolling**:
  - Sfondo dinamico a 4 livelli (cielo stellato digitale, skyline di grattacieli con finestre illuminate e antenne, autostrade aeree con veicoli in transito, pavimento a griglia neon prospettica).
- **Fisica & Controlli Fluidi**:
  - Meccanica di **Salto** e **Doppio Salto** con particelle propulsori a reazione.
  - Meccanica di **Scivolata** con riduzione della hitbox (hitbox detection dinamica) e scintille da attrito sul suolo.
- **Audio Procedurale Nativo (Web Audio API)**:
  - Tutti i suoni (salti, scivolate, raccolta chip di memoria, power-up ed esplosioni) sono generati sinteticamente tramite oscillatori audio del browser. Zero dipendenze da file audio esterni pesanti o lenti da caricare.
- **Mobile First & Touch Ready**:
  - Controlli touch ergonomici su schermo (tasti dedicati Salto e Scivolata).
  - Supporto gesture **Swipe Up** (Salto) e **Swipe Down** (Scivolata) con prevenzione dello scrolling nativo del browser.
- **Power-up e Progressione**:
  - **Scudo Protettivo (🛡️)**: assorbe 1 collisione evitando il Game Over.
  - **Overdrive Turbo (⚡)**: velocità aumentata, invincibilità temporanea e magnete automatico per i chip dati.
  - Salvataggio del Record Personale in `localStorage`.

---

## 🕹️ Comandi di Gioco

| Azione | Tastiera PC | Smartphone & Tablet |
|---|---|---|
| **Salto / Doppio Salto** | `Spazio`, `Freccia Su` o `W` | Tasto touch **SALTA [▲]** o **Swipe In Alto** |
| **Scivolata** | `Freccia Giù` o `S` | Tasto touch **SCIVOLA [▼]** o **Swipe In Basso** |
| **Pausa** | `P` o `Esc` | Icona Pausa in alto a destra |
| **Audio ON/OFF** | Icona Audio | Icona Audio |

---

## 🛠️ Stack Tecnologico

- **Frontend**: HTML5 semantico, CSS3 Modern Flexbox/Grid con variabili CSS e filtri Backdrop Blur.
- **Logica & Motore Grafico**: JavaScript (Vanilla ES6+) orientato a oggetti, Canvas 2D API (`requestAnimationFrame`).
- **Audio**: Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`).
- **Testing & Compatibilità**: Testato e ottimizzato per Google Chrome, Safari, Firefox ed Edge (Desktop & Mobile).

---

## 👨‍💻 Autore

**Valentyn Haidukov**  
Perito Informatico e delle Telecomunicazioni  
Iscritto alle Categorie Protette (L. 68/99)  
- **CV Interattivo**: [https://hv94.github.io/curriculum-vitae/](https://hv94.github.io/curriculum-vitae/)
- **LinkedIn**: [https://www.linkedin.com/in/valentyn-haidukov/](https://www.linkedin.com/in/valentyn-haidukov/)
- **GitHub**: [@HV94](https://github.com/HV94)
