/**
 * ==============================================================================
 * CYBER RUNNER - VIDEOGIOCO ARCADE 2D IN JAVASCRIPT CANVAS
 * Sviluppato da Valentyn Haidukov (Perito Informatico - L. 68/99)
 * ==============================================================================
 * Codice JavaScript Vanilla pulito e lineare.
 * Caratteristiche principali:
 * - Ciclo di gioco a 60 FPS con requestAnimationFrame
 * - Motore fisico 2D: gravità, salto, doppio salto e scivolata
 * - Rilevamento collisioni AABB (Axis-Aligned Bounding Box) con hitbox dinamica
 * - Effetti sonori sintetici tramite Web Audio API (zero file audio esterni)
 * - Controlli desktop (Tastiera: Spazio/Frecce/WASD) e smartphone (Touch/Swipe)
 * - Salvataggio record punteggio persistente in localStorage
 * ==============================================================================
 */

(function () {
  'use strict';

  // ----------------------------------------------------------------------------
  // 1. SISTEMA AUDIO PROCEDURALE (WEB AUDIO API)
  // ----------------------------------------------------------------------------
  class SimpleAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = localStorage.getItem('cyber_runner_muted') === 'true';
    }

    init() {
      try {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            this.ctx = new AudioContext();
          }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      } catch (e) {
        console.warn('Audio non inizializzato:', e);
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem('cyber_runner_muted', this.isMuted.toString());
      return this.isMuted;
    }

    // Effetto sonoro del salto
    playJump() {
      if (this.isMuted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } catch (e) {}
    }

    // Effetto sonoro del doppio salto
    playDoubleJump() {
      if (this.isMuted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } catch (e) {}
    }

    // Effetto sonoro della scivolata
    playSlide() {
      if (this.isMuted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.18);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } catch (e) {}
    }

    // Effetto sonoro raccolta Chip Dati
    playCoin() {
      if (this.isMuted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1320, now + 0.06);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } catch (e) {}
    }

    // Effetto sonoro impatto / Game Over
    playImpact() {
      if (this.isMuted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.28);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      } catch (e) {}
    }
  }

  // ----------------------------------------------------------------------------
  // 2. MOTORE DI GIOCO CYBER RUNNER
  // ----------------------------------------------------------------------------
  class CyberRunnerGame {
    constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.sound = new SimpleAudioEngine();

      this.width = 960;
      this.height = 540;
      this.groundY = 440;

      // Stato di gioco: 'start' | 'playing' | 'paused' | 'gameover'
      this.state = 'start';
      this.speed = 6;
      this.baseSpeed = 6;
      this.distance = 0;
      this.chips = 0;
      this.bestDistance = parseInt(localStorage.getItem('cyber_runner_best') || '0', 10);

      // Personaggio
      this.player = {
        x: 120,
        y: this.groundY - 58,
        width: 36,
        height: 58,
        normalHeight: 58,
        slideHeight: 28,
        vy: 0,
        gravity: 0.65,
        jumpStrength: -13,
        doubleJumpStrength: -11,
        canDoubleJump: true,
        isJumping: false,
        isSliding: false,
        slideTimer: 0,
        runFrame: 0
      };

      // Ostacoli e Chip
      this.obstacles = [];
      this.collectibles = [];
      this.obstacleSpawnTimer = 0;
      this.collectibleSpawnTimer = 0;

      // Sfondo ed elementi grafici
      this.bgOffset = 0;
      this.gridOffset = 0;
      this.stars = this.generateStars(40);
      this.buildings = this.generateBuildings();

      this.initUI();
      this.initEvents();
      this.updateHUD();

      // Loop di animazione
      this.lastTime = performance.now();
      requestAnimationFrame(this.gameLoop.bind(this));
    }

    // Generazione stelle di sfondo
    generateStars(count) {
      const stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * this.width,
          y: Math.random() * (this.groundY - 150),
          size: Math.random() * 2 + 1,
          speed: Math.random() * 0.4 + 0.1
        });
      }
      return stars;
    }

    // Generazione skyline futuristico
    generateBuildings() {
      const buildings = [];
      let currentX = 0;
      while (currentX < this.width + 300) {
        const w = Math.floor(Math.random() * 60 + 40);
        const h = Math.floor(Math.random() * 140 + 80);
        buildings.push({
          x: currentX,
          y: this.groundY - h,
          w: w,
          h: h,
          hasLight: Math.random() > 0.4
        });
        currentX += w + Math.floor(Math.random() * 20 + 10);
      }
      return buildings;
    }

    // --------------------------------------------------------------------------
    // 3. GESTIONE INTERFACCIA UTENTE & CONTROLLI
    // --------------------------------------------------------------------------
    initUI() {
      this.ui = {
        distance: document.getElementById('hudDistance'),
        chips: document.getElementById('hudChips'),
        best: document.getElementById('hudBest'),
        startScreen: document.getElementById('startScreen'),
        pauseScreen: document.getElementById('pauseScreen'),
        gameOverScreen: document.getElementById('gameOverScreen'),
        finalDistance: document.getElementById('finalDistance'),
        finalChips: document.getElementById('finalChips'),
        finalScore: document.getElementById('finalScore'),
        finalBest: document.getElementById('finalBest'),
        newRecordBadge: document.getElementById('newRecordBadge'),
        audioBtn: document.getElementById('audioToggleBtn'),
        pauseBtn: document.getElementById('pauseBtn')
      };

      if (this.ui.best) this.ui.best.textContent = `${this.bestDistance} m`;
      this.updateAudioButton();
    }

    updateAudioButton() {
      if (this.ui.audioBtn) {
        this.ui.audioBtn.textContent = this.sound.isMuted ? '🔇' : '🔊';
      }
    }

    updateHUD() {
      if (this.ui.distance) this.ui.distance.textContent = `${Math.floor(this.distance)} m`;
      if (this.ui.chips) this.ui.chips.textContent = this.chips;
      if (this.ui.best) this.ui.best.textContent = `${this.bestDistance} m`;
    }

    initEvents() {
      // Tasti menu
      const startBtn = document.getElementById('startBtn');
      const retryBtn = document.getElementById('retryBtn');
      const resumeBtn = document.getElementById('resumeBtn');

      if (startBtn) startBtn.addEventListener('click', () => this.startGame());
      if (retryBtn) retryBtn.addEventListener('click', () => this.startGame());
      if (resumeBtn) resumeBtn.addEventListener('click', () => this.togglePause());

      if (this.ui.audioBtn) {
        this.ui.audioBtn.addEventListener('click', () => {
          this.sound.toggleMute();
          this.updateAudioButton();
        });
      }

      if (this.ui.pauseBtn) {
        this.ui.pauseBtn.addEventListener('click', () => this.togglePause());
      }

      // Controlli Tastiera Desktop
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          e.preventDefault();
          if (this.state === 'playing') this.jump();
          else if (this.state === 'start' || this.state === 'gameover') this.startGame();
        } else if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          e.preventDefault();
          if (this.state === 'playing') this.slide();
        } else if (e.code === 'KeyP' || e.code === 'Escape') {
          e.preventDefault();
          if (this.state === 'playing' || this.state === 'paused') this.togglePause();
        }
      });

      // Controlli Touch Mobile (Pulsanti Salta e Scivola)
      const touchJump = document.getElementById('touchJumpBtn');
      const touchSlide = document.getElementById('touchSlideBtn');

      if (touchJump) {
        touchJump.addEventListener('touchstart', (e) => {
          e.preventDefault();
          if (this.state === 'playing') this.jump();
        }, { passive: false });
        touchJump.addEventListener('click', () => {
          if (this.state === 'playing') this.jump();
        });
      }

      if (touchSlide) {
        touchSlide.addEventListener('touchstart', (e) => {
          e.preventDefault();
          if (this.state === 'playing') this.slide();
        }, { passive: false });
        touchSlide.addEventListener('click', () => {
          if (this.state === 'playing') this.slide();
        });
      }

      // Gesture Swipe su Canvas per smartphone
      let touchStartY = 0;
      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) touchStartY = e.touches[0].clientY;
      }, { passive: true });

      this.canvas.addEventListener('touchend', (e) => {
        if (e.changedTouches.length > 0) {
          const deltaY = e.changedTouches[0].clientY - touchStartY;
          if (deltaY < -35) {
            // Swipe verso l'alto -> Salta
            if (this.state === 'playing') this.jump();
          } else if (deltaY > 35) {
            // Swipe verso il basso -> Scivola
            if (this.state === 'playing') this.slide();
          }
        }
      }, { passive: true });
    }

    // --------------------------------------------------------------------------
    // 4. STATI E AZIONI DEL PERSONAGGIO
    // --------------------------------------------------------------------------
    startGame() {
      this.sound.init();
      this.state = 'playing';
      this.speed = this.baseSpeed;
      this.distance = 0;
      this.chips = 0;
      this.obstacles = [];
      this.collectibles = [];
      this.obstacleSpawnTimer = 50;

      // Reset posizione giocatore
      this.player.y = this.groundY - this.player.normalHeight;
      this.player.height = this.player.normalHeight;
      this.player.vy = 0;
      this.player.isJumping = false;
      this.player.isSliding = false;
      this.player.canDoubleJump = true;

      // Nascondi schermate overlay
      if (this.ui.startScreen) this.ui.startScreen.classList.remove('active');
      if (this.ui.pauseScreen) this.ui.pauseScreen.classList.remove('active');
      if (this.ui.gameOverScreen) this.ui.gameOverScreen.classList.remove('active');

      this.updateHUD();
    }

    togglePause() {
      if (this.state === 'playing') {
        this.state = 'paused';
        if (this.ui.pauseScreen) this.ui.pauseScreen.classList.add('active');
      } else if (this.state === 'paused') {
        this.state = 'playing';
        if (this.ui.pauseScreen) this.ui.pauseScreen.classList.remove('active');
      }
    }

    jump() {
      if (!this.player.isJumping) {
        // Primo salto
        this.player.vy = this.player.jumpStrength;
        this.player.isJumping = true;
        this.player.isSliding = false;
        this.player.height = this.player.normalHeight;
        this.player.canDoubleJump = true;
        this.sound.playJump();
      } else if (this.player.canDoubleJump) {
        // Secondo salto in aria
        this.player.vy = this.player.doubleJumpStrength;
        this.player.canDoubleJump = false;
        this.sound.playDoubleJump();
      }
    }

    slide() {
      if (!this.player.isJumping && !this.player.isSliding) {
        this.player.isSliding = true;
        this.player.slideTimer = 35; // durata circa 0.6s a 60fps
        this.player.height = this.player.slideHeight;
        this.player.y = this.groundY - this.player.slideHeight;
        this.sound.playSlide();
      }
    }

    gameOver() {
      this.state = 'gameover';
      this.sound.playImpact();

      const finalDistMeters = Math.floor(this.distance);
      const finalTotalScore = finalDistMeters * 10 + (this.chips * 50);
      const isNewRecord = finalDistMeters > this.bestDistance;

      if (isNewRecord) {
        this.bestDistance = finalDistMeters;
        localStorage.setItem('cyber_runner_best', this.bestDistance.toString());
      }

      if (this.ui.finalDistance) this.ui.finalDistance.textContent = `${finalDistMeters} m`;
      if (this.ui.finalChips) this.ui.finalChips.textContent = this.chips;
      if (this.ui.finalScore) this.ui.finalScore.textContent = `${finalTotalScore} PTS`;
      if (this.ui.finalBest) this.ui.finalBest.textContent = `${this.bestDistance} m`;
      if (this.ui.newRecordBadge) this.ui.newRecordBadge.style.display = isNewRecord ? 'block' : 'none';

      if (this.ui.gameOverScreen) this.ui.gameOverScreen.classList.add('active');
      this.updateHUD();
    }

    // --------------------------------------------------------------------------
    // 5. AGGIORNAMENTO LOGICA DI GIOCO (UPDATE)
    // --------------------------------------------------------------------------
    update() {
      if (this.state !== 'playing') return;

      // Avanzamento e incremento graduale della velocità
      this.distance += this.speed * 0.05;
      this.speed = Math.min(14, this.baseSpeed + (this.distance * 0.003));
      this.updateHUD();

      // Animazione frame corsa
      this.player.runFrame += 0.25;

      // Fisica del giocatore (Gravità)
      this.player.y += this.player.vy;
      this.player.vy += this.player.gravity;

      // Controllo atterraggio al suolo
      if (this.player.y >= this.groundY - this.player.height) {
        this.player.y = this.groundY - this.player.height;
        this.player.vy = 0;
        this.player.isJumping = false;
        this.player.canDoubleJump = true;
      }

      // Gestione scivolata temporizzata
      if (this.player.isSliding) {
        this.player.slideTimer--;
        if (this.player.slideTimer <= 0) {
          this.player.isSliding = false;
          this.player.height = this.player.normalHeight;
          this.player.y = this.groundY - this.player.normalHeight;
        }
      }

      // Spostamento Sfondo Parallasse
      this.bgOffset = (this.bgOffset + this.speed * 0.4) % this.width;
      this.gridOffset = (this.gridOffset + this.speed) % 40;

      // Spostamento stelle
      this.stars.forEach(star => {
        star.x -= star.speed * (this.speed * 0.3);
        if (star.x < 0) star.x = this.width;
      });

      // Spostamento palazzi
      this.buildings.forEach(b => {
        b.x -= this.speed * 0.5;
      });
      // Ricicla palazzi usciti a sinistra
      if (this.buildings.length > 0 && this.buildings[0].x + this.buildings[0].w < 0) {
        const removed = this.buildings.shift();
        const last = this.buildings[this.buildings.length - 1];
        removed.x = last.x + last.w + Math.floor(Math.random() * 20 + 10);
        this.buildings.push(removed);
      }

      // Generazione Ostacoli
      this.obstacleSpawnTimer--;
      if (this.obstacleSpawnTimer <= 0) {
        const type = Math.random() > 0.45 ? 'barrier' : 'drone';
        if (type === 'barrier') {
          // Barriera di sicurezza a terra (da saltare)
          this.obstacles.push({
            type: 'barrier',
            x: this.width + 40,
            y: this.groundY - 46,
            w: 32,
            h: 46
          });
        } else {
          // Drone di pattuglia volante (da schivare scivolando)
          this.obstacles.push({
            type: 'drone',
            x: this.width + 40,
            y: this.groundY - 80,
            w: 42,
            h: 36
          });
        }
        // Intervallo di spawn variabile
        this.obstacleSpawnTimer = Math.floor(Math.random() * 40 + 75);
      }

      // Generazione Chip Dati
      this.collectibleSpawnTimer--;
      if (this.collectibleSpawnTimer <= 0) {
        const high = Math.random() > 0.5;
        this.collectibles.push({
          x: this.width + 20,
          y: high ? this.groundY - 95 : this.groundY - 35,
          size: 18
        });
        this.collectibleSpawnTimer = Math.floor(Math.random() * 50 + 60);
      }

      // Movimento Ostacoli e Collisione
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];
        obs.x -= this.speed;

        // Collisione AABB con margine di tolleranza di 4px
        if (this.checkCollision(this.player, obs)) {
          this.gameOver();
          return;
        }

        // Rimuovi ostacoli usciti a sinistra
        if (obs.x + obs.w < -50) {
          this.obstacles.splice(i, 1);
        }
      }

      // Movimento Chip Dati e Raccolta
      for (let i = this.collectibles.length - 1; i >= 0; i--) {
        const chip = this.collectibles[i];
        chip.x -= this.speed;

        // Raccolta chip
        if (
          this.player.x < chip.x + chip.size &&
          this.player.x + this.player.width > chip.x &&
          this.player.y < chip.y + chip.size &&
          this.player.y + this.player.height > chip.y
        ) {
          this.chips++;
          this.sound.playCoin();
          this.collectibles.splice(i, 1);
          continue;
        }

        if (chip.x < -30) {
          this.collectibles.splice(i, 1);
        }
      }
    }

    // Rilevamento collisione AABB
    checkCollision(p, o) {
      const margin = 5;
      return (
        p.x + margin < o.x + o.w &&
        p.x + p.width - margin > o.x &&
        p.y + margin < o.y + o.h &&
        p.y + p.height - margin > o.y
      );
    }

    // --------------------------------------------------------------------------
    // 6. RENDERING GRAFICO SU CANVAS 2D
    // --------------------------------------------------------------------------
    draw() {
      // Sfondo cielo notte cyberpunk
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
      bgGrad.addColorStop(0, '#040714');
      bgGrad.addColorStop(1, '#0e172e');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, this.width, this.height);

      // Stelle
      this.ctx.fillStyle = '#ffffff';
      this.stars.forEach(s => {
        this.ctx.globalAlpha = Math.sin(this.distance * 0.1 + s.x) * 0.3 + 0.6;
        this.ctx.fillRect(s.x, s.y, s.size, s.size);
      });
      this.ctx.globalAlpha = 1.0;

      // Skyline città neon
      this.buildings.forEach(b => {
        this.ctx.fillStyle = '#0a1024';
        this.ctx.fillRect(b.x, b.y, b.w, b.h);
        this.ctx.strokeStyle = '#1e293b';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(b.x, b.y, b.w, b.h);

        // Finestre illuminate
        if (b.hasLight) {
          this.ctx.fillStyle = '#38bdf8';
          this.ctx.globalAlpha = 0.4;
          for (let wy = b.y + 12; wy < this.groundY - 15; wy += 18) {
            this.ctx.fillRect(b.x + 8, wy, 6, 8);
            if (b.w > 40) this.ctx.fillRect(b.x + b.w - 14, wy, 6, 8);
          }
          this.ctx.globalAlpha = 1.0;
        }
      });

      // Griglia pavimento futuristica
      this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      this.ctx.lineWidth = 1;
      for (let x = -this.gridOffset; x < this.width; x += 40) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, this.groundY);
        this.ctx.lineTo(x - 50, this.height);
        this.ctx.stroke();
      }

      // Linee orizzontali pavimento
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.groundY + 30);
      this.ctx.lineTo(this.width, this.groundY + 30);
      this.ctx.moveTo(0, this.groundY + 65);
      this.ctx.lineTo(this.width, this.groundY + 65);
      this.ctx.stroke();

      // Linea orizzonte neon principale
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.lineWidth = 3;
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.groundY);
      this.ctx.lineTo(this.width, this.groundY);
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      // Disegna Chip Dati
      this.collectibles.forEach(chip => {
        this.ctx.save();
        this.ctx.translate(chip.x + chip.size / 2, chip.y + chip.size / 2);
        this.ctx.rotate(this.distance * 0.1);
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.shadowColor = '#fbbf24';
        this.ctx.shadowBlur = 8;
        this.ctx.fillRect(-chip.size / 2, -chip.size / 2, chip.size, chip.size);
        this.ctx.fillStyle = '#fef08a';
        this.ctx.fillRect(-chip.size / 4, -chip.size / 4, chip.size / 2, chip.size / 2);
        this.ctx.restore();
      });

      // Disegna Ostacoli
      this.obstacles.forEach(obs => {
        if (obs.type === 'barrier') {
          // Barriera di sicurezza laser
          this.ctx.fillStyle = '#ef4444';
          this.ctx.shadowColor = '#ef4444';
          this.ctx.shadowBlur = 10;
          this.ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

          this.ctx.fillStyle = '#ffffff';
          this.ctx.fillRect(obs.x + 4, obs.y + 6, obs.w - 8, 4);
          this.ctx.fillRect(obs.x + 4, obs.y + 20, obs.w - 8, 4);
          this.ctx.fillRect(obs.x + 4, obs.y + 34, obs.w - 8, 4);
          this.ctx.shadowBlur = 0;
        } else {
          // Drone volante
          this.ctx.fillStyle = '#a855f7';
          this.ctx.shadowColor = '#c084fc';
          this.ctx.shadowBlur = 10;
          this.ctx.beginPath();
          this.ctx.arc(obs.x + obs.w / 2, obs.y + obs.h / 2, obs.w / 2.2, 0, Math.PI * 2);
          this.ctx.fill();

          // Occhio scanner centrale
          this.ctx.fillStyle = '#ef4444';
          this.ctx.beginPath();
          this.ctx.arc(obs.x + obs.w / 2 - 4, obs.y + obs.h / 2, 5, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.shadowBlur = 0;
        }
      });

      // Disegna Personaggio Giocatore
      this.drawPlayer();
    }

    drawPlayer() {
      const p = this.player;
      this.ctx.save();
      this.ctx.translate(p.x, p.y);

      if (p.isSliding) {
        // Scivolata: profilo ribassato
        this.ctx.fillStyle = '#06b6d4';
        this.ctx.shadowColor = '#06b6d4';
        this.ctx.shadowBlur = 8;
        this.ctx.fillRect(0, 4, p.width + 12, p.height - 4);

        // Visore neon
        this.ctx.fillStyle = '#00f0ff';
        this.ctx.fillRect(p.width - 2, 8, 10, 6);

        // Scia di attrito a terra
        this.ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
        this.ctx.fillRect(-15, p.height - 3, 20, 3);
      } else {
        // Corsa e Salto
        const legSwing = Math.sin(p.runFrame) * 8;

        // Gambe
        this.ctx.strokeStyle = '#0284c7';
        this.ctx.lineWidth = 6;
        this.ctx.lineCap = 'round';

        // Gamba sinistra
        this.ctx.beginPath();
        this.ctx.moveTo(10, 35);
        this.ctx.lineTo(8 + legSwing, 54);
        this.ctx.stroke();

        // Gamba destra
        this.ctx.beginPath();
        this.ctx.moveTo(22, 35);
        this.ctx.lineTo(24 - legSwing, 54);
        this.ctx.stroke();

        // Busto
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(6, 16, 22, 22);

        // Giacca / Corazza Neon
        this.ctx.strokeStyle = '#00f0ff';
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.shadowBlur = 6;
        this.ctx.strokeRect(6, 16, 22, 22);

        // Testa
        this.ctx.fillStyle = '#1e293b';
        this.ctx.beginPath();
        this.ctx.arc(17, 9, 8, 0, Math.PI * 2);
        this.ctx.fill();

        // Visore Cyberpunk
        this.ctx.fillStyle = '#00f0ff';
        this.ctx.fillRect(16, 6, 8, 4);

        // Braccia in corsa
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(17, 20);
        this.ctx.lineTo(17 - legSwing * 0.8, 32);
        this.ctx.stroke();
      }

      this.ctx.restore();
    }

    // --------------------------------------------------------------------------
    // 7. GAME LOOP PRINCIPALE
    // --------------------------------------------------------------------------
    gameLoop(timestamp) {
      this.update();
      this.draw();
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  // Avvio al caricamento del documento
  document.addEventListener('DOMContentLoaded', () => {
    new CyberRunnerGame();
  });
})();
