# Cyber Runner - Videogioco Arcade 2D in JavaScript Canvas

Videogioco arcade a scorrimento orizzontale (endless runner), sviluppato interamente in JavaScript vanilla su HTML5 Canvas e Web Audio API.

Demo online giocabile: [https://hv94.github.io/cyber-runner/](https://hv94.github.io/cyber-runner/)

---

## Descrizione del progetto

Il progetto è nato come esercitazione pratica di programmazione per approfondire la gestione di un motore grafico 2D nel browser, la gestione degli eventi in tempo reale e la sintesi sonora via codice senza l'utilizzo di librerie o framework esterni.

Obiettivi tecnici affrontati:
- Ciclo di animazione a 60 FPS basato su `requestAnimationFrame` con calcolo del delta time per garantire fluidità costante indipendentemente dal dispositivo.
- Gestione della fisica del personaggio (gravità, accelerazione, attrito, salto, doppio salto e scivolata).
- Sistema di rilevamento delle collisioni basato su assi ortogonali (AABB - Axis-Aligned Bounding Box) con adattamento dinamico dell'ingombro durante la scivolata.
- Sfondo a più livelli con effetto parallasse (scorrimento differenziato a velocità scalari) per dare profondità alla scena.
- Generazione sintetica del sonoro tramite Web Audio API nativa (`AudioContext`, `OscillatorNode`, `GainNode`) per generare salti, impatti e bonus senza dover caricare file audio esterni.
- Controlli ibridi: tastiera per postazioni desktop (frecce direzionali / WASD) e pulsanti touch / gesture di scorrimento (swipe) per smartphone e tablet.
- Salvataggio del punteggio record nel browser tramite `localStorage`.

---

## Comandi di gioco

| Azione | Tastiera (PC / Desktop) | Schermo Touch (Smartphone / Tablet) |
|---|---|---|
| Salto / Doppio Salto | Spazio, Freccia Su, W | Pulsante Salta [▲] o scorrimento verso l'alto |
| Scivolata | Freccia Giù, S | Pulsante Scivola [▼] o scorrimento verso il basso |
| Pausa | P o Esc | Pulsante Pausa a schermo |
| Audio On / Off | Icona volume | Icona volume |

---

## Note tecniche e sviluppo

- **Linguaggi**: HTML5, CSS3, JavaScript ES6+ (senza dipendenze esterne).
- **Grafica**: Canvas 2D nativo del browser.
- **Audio**: Web Audio API standard W3C (sintesi sonora in tempo reale).
- **Compatibilità**: responsive per desktop e dispositivi mobili.

---

**Autore**: Valentyn Haidukov  
Perito Informatico e Telecomunicazioni • Categorie Protette (L. 68/99)  
- Portfolio e CV: [https://hv94.github.io/curriculum-vitae/](https://hv94.github.io/curriculum-vitae/)  
- Profilo GitHub: [@HV94](https://github.com/HV94)
