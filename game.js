/**
 * CYBER RUNNER 2099 - ULTRA MODERN VECTOR EDITION
 * Autore: Valentyn Haidukov
 * Stile: Modern Minimalist Cyberpunk (High-Fidelity Vector Motion & Procedural Audio)
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. PROCEDURAL SOUND ENGINE (WEB AUDIO API - ZERO LAG, ZERO FILE ESTERNI)
  // =========================================================================
  class ModernSoundEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = localStorage.getItem('cyber_runner_muted') === 'true';
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem('cyber_runner_muted', this.isMuted.toString());
      return this.isMuted;
    }

    // Salto morbido e risonante (Smooth Sine Sweep)
    playJump() {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.12);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    }

    // Doppio salto: impulso aereo con armonico superiore
    playDoubleJump() {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(380, now);
      osc1.frequency.exponentialRampToValueAtTime(840, now + 0.16);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(190, now);
      osc2.frequency.exponentialRampToValueAtTime(420, now + 0.16);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.16);
      osc2.stop(now + 0.16);
    }

    // Scivolata: fruscio sintetizzato filtrato (soft friction)
    playSlide() {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    }

    // Raccolta chip di dati: campane cristalline su scala pentatonica
    playCrystalChime(combo = 0) {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5, D5, E5, G5, A5, C6
      const freq = scale[combo % scale.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    }

    // Power-up raccolto (Accordo maggiore ascendente)
    playPowerupFanfare() {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.25);
      });
    }

    // Impatto o ostacolo rotto
    playImpact() {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(20, now + 0.3);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  // =========================================================================
  // 2. GIOCO PRINCIPALE CYBER RUNNER 2099
  // =========================================================================
  class ModernCyberRunner {
    constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.sound = new ModernSoundEngine();

      this.width = 960;
      this.height = 540;
      this.groundY = 430; // Quota della pista maglev

      this.state = 'START'; // START, PLAYING, PAUSED, GAMEOVER

      // Statistiche
      this.distance = 0;
      this.chipsCollected = 0;
      this.score = 0;
      this.bestDistance = parseInt(localStorage.getItem('cyber_runner_best') || '0', 10);
      
      // Velocità iniziale accessibile e rilassante, con accelerazione molto graduale
      this.baseSpeed = 5.2;
      this.speed = this.baseSpeed;
      this.scrollX = 0;

      // Giocatore: Cyber Parkour Athlete con cinematica articolata
      this.player = {
        x: 130,
        y: this.groundY - 72,
        width: 36,
        height: 72,
        normalHeight: 72,
        slideHeight: 34,
        vy: 0,
        gravity: 0.70,
        jumpPower: -14.2,
        doubleJumpPower: -12.5,
        jumpsLeft: 2,
        isGrounded: true,
        isSliding: false,
        slideTimer: 0,
        slideMaxDuration: 36,
        shield: false,
        boostTimer: 0,
        boostMaxDuration: 360,
        animTime: 0,
        rotation: 0,
        coyoteTime: 0,
        jumpBuffer: 0,
        ghostTrail: [],
        scarfNodes: [] // 6 nodi fisici per il mantello/sciarpa fotonica fluttuante
      };

      // Inizializza nodi per il mantello/sciarpa
      for (let i = 0; i < 7; i++) {
        this.player.scarfNodes.push({
          x: this.player.x - i * 8,
          y: this.player.y + 20
        });
      }

      // Entità di gioco
      this.obstacles = [];
      this.chips = [];
      this.particles = [];
      this.shockwaves = [];
      this.skyTraffic = [];
      this.spawnTimer = 60;
      this.comboTier = 0;

      // Skyline procedurale moderna
      this.bgBuildings1 = [];
      this.bgBuildings2 = [];
      this.neonBillboards = [];
      this.initBackground();

      // Riferimenti interfaccia UI
      this.ui = {
        startScreen: document.getElementById('startScreen'),
        pauseScreen: document.getElementById('pauseScreen'),
        gameOverScreen: document.getElementById('gameOverScreen'),
        startBtn: document.getElementById('startBtn'),
        resumeBtn: document.getElementById('resumeBtn'),
        retryBtn: document.getElementById('retryBtn'),
        pauseBtn: document.getElementById('pauseBtn'),
        audioToggleBtn: document.getElementById('audioToggleBtn'),
        hudDistance: document.getElementById('hudDistance'),
        hudChips: document.getElementById('hudChips'),
        hudBest: document.getElementById('hudBest'),
        powerupBar: document.getElementById('powerupBar'),
        powerupFill: document.getElementById('powerupFill'),
        powerupName: document.getElementById('powerupName'),
        finalDistance: document.getElementById('finalDistance'),
        finalChips: document.getElementById('finalChips'),
        finalScore: document.getElementById('finalScore'),
        finalBest: document.getElementById('finalBest'),
        newRecordBadge: document.getElementById('newRecordBadge'),
        touchJumpBtn: document.getElementById('touchJumpBtn'),
        touchSlideBtn: document.getElementById('touchSlideBtn')
      };

      this.bindEvents();
      this.updateHudBest();

      // Loop di rendering a 60 FPS
      requestAnimationFrame(this.gameLoop.bind(this));
    }

    // =======================================================================
    // COSTRUZIONE AMBIENTE FUTURISTICO
    // =======================================================================
    initBackground() {
      // 1. Monoliti lontani (Parallasse lento)
      this.bgBuildings1 = [];
      for (let x = 0; x < 2000; x += Math.random() * 80 + 70) {
        this.bgBuildings1.push({
          x: x,
          w: Math.random() * 80 + 60,
          h: Math.random() * 260 + 160,
          color: '#070c1b'
        });
      }

      // 2. Grattacieli intermedi con griglie di finestre eleganti
      this.bgBuildings2 = [];
      for (let x = 0; x < 2000; x += Math.random() * 70 + 50) {
        this.bgBuildings2.push({
          x: x,
          w: Math.random() * 60 + 50,
          h: Math.random() * 180 + 100,
          color: '#0b1429',
          accent: Math.random() > 0.5 ? '#00f0ff' : '#8b5cf6'
        });
      }

      // 3. Traffico aereo nello skyline (Aerovetture volanti con scie di luce)
      this.skyTraffic = [
        { x: 100, y: 120, speed: -1.8, w: 24, color: '#38bdf8' },
        { x: 500, y: 170, speed: -2.4, w: 30, color: '#f43f5e' },
        { x: 800, y: 90, speed: -1.2, w: 20, color: '#38bdf8' }
      ];

      // 4. Cartelloni olografici moderni (Minimal Vector)
      this.neonBillboards = [
        { x: 280, y: 140, text: 'VALENTYN', color: '#00f0ff' },
        { x: 780, y: 160, text: 'NEXUS 2099', color: '#38bdf8' },
        { x: 1280, y: 130, text: 'CYBER RUN', color: '#8b5cf6' }
      ];
    }

    // =======================================================================
    // GESTIONE INPUT (TASTIERA PC & TOUCH MOBILE)
    // =======================================================================
    bindEvents() {
      // Tastiera: Frecce direzionali e Spazio
      window.addEventListener('keydown', (e) => {
        if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
          e.preventDefault();
          this.triggerJump();
        } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
          e.preventDefault();
          this.triggerSlide();
        } else if (e.code === 'KeyP' || e.code === 'Escape') {
          e.preventDefault();
          this.togglePause();
        }
      });

      // Click / tocco diretto sul canvas per saltare
      this.canvas.addEventListener('mousedown', (e) => {
        if (this.state === 'PLAYING') {
          this.triggerJump();
        }
      });

      // Touch Buttons
      const addTouch = (elem, action) => {
        if (!elem) return;
        elem.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.sound.init();
          action();
        }, { passive: false });
        elem.addEventListener('mousedown', (e) => {
          e.preventDefault();
          this.sound.init();
          action();
        });
      };

      addTouch(this.ui.touchJumpBtn, () => this.triggerJump());
      addTouch(this.ui.touchSlideBtn, () => this.triggerSlide());

      // Gesture Swipe su mobile
      let touchStartY = 0;
      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) touchStartY = e.touches[0].clientY;
      }, { passive: true });

      this.canvas.addEventListener('touchend', (e) => {
        if (e.changedTouches.length > 0) {
          const dy = e.changedTouches[0].clientY - touchStartY;
          if (dy < -30) this.triggerJump();
          else if (dy > 30) this.triggerSlide();
        }
      }, { passive: true });

      // Pulsanti Menu
      this.ui.startBtn.addEventListener('click', () => this.startGame());
      this.ui.resumeBtn.addEventListener('click', () => this.togglePause());
      this.ui.retryBtn.addEventListener('click', () => this.startGame());
      this.ui.pauseBtn.addEventListener('click', () => this.togglePause());

      this.ui.audioToggleBtn.addEventListener('click', () => {
        this.sound.init();
        const muted = this.sound.toggleMute();
        this.ui.audioToggleBtn.textContent = muted ? '🔇' : '🔊';
      });
    }

    updateHudBest() {
      if (this.ui.hudBest) {
        this.ui.hudBest.textContent = `${this.bestDistance} m`;
      }
    }

    // Salto e doppio salto fluido con jump buffering
    triggerJump() {
      if (this.state !== 'PLAYING') return;
      this.sound.init();

      // Se stava scivolando, annulla la scivolata ed esegui subito il salto parkour
      if (this.player.isSliding) {
        this.stopSlide();
      }

      if (this.player.isGrounded || this.player.coyoteTime > 0) {
        // Primo salto
        this.player.vy = this.player.jumpPower;
        this.player.isGrounded = false;
        this.player.coyoteTime = 0;
        this.player.jumpsLeft = 1;
        this.sound.playJump();
        this.addShockwave(this.player.x + 18, this.groundY, '#00f0ff', 24);
      } else if (this.player.jumpsLeft > 0) {
        // Doppio salto con capriola frontale
        this.player.vy = this.player.doubleJumpPower;
        this.player.jumpsLeft = 0;
        this.player.rotation = 0.1; // Avvia rotazione acrobatica
        this.sound.playDoubleJump();
        this.addShockwave(this.player.x + 18, this.player.y + 40, '#38bdf8', 28);
      } else {
        // Salva nel buffer se tocca terra nei prossimi 6 frame
        this.player.jumpBuffer = 6;
      }
    }

    // Scivolata dinamica a terra
    triggerSlide() {
      if (this.state !== 'PLAYING') return;
      this.sound.init();

      if (!this.player.isSliding) {
        this.player.isSliding = true;
        this.player.slideTimer = this.player.slideMaxDuration;
        this.player.height = this.player.slideHeight;
        this.player.y = this.groundY - this.player.slideHeight;
        this.sound.playSlide();

        if (!this.player.isGrounded) {
          this.player.vy = 12; // Scivolata immediata verso terra
        }
      } else {
        this.player.slideTimer = this.player.slideMaxDuration;
      }
    }

    stopSlide() {
      this.player.isSliding = false;
      this.player.slideTimer = 0;
      this.player.height = this.player.normalHeight;
      this.player.y = this.groundY - this.player.normalHeight;
    }

    togglePause() {
      if (this.state === 'PLAYING') {
        this.state = 'PAUSED';
        this.ui.pauseScreen.classList.add('active');
      } else if (this.state === 'PAUSED') {
        this.state = 'PLAYING';
        this.ui.pauseScreen.classList.remove('active');
      }
    }

    startGame() {
      this.sound.init();
      this.state = 'PLAYING';

      this.ui.startScreen.classList.remove('active');
      this.ui.pauseScreen.classList.remove('active');
      this.ui.gameOverScreen.classList.remove('active');

      this.distance = 0;
      this.chipsCollected = 0;
      this.score = 0;
      this.speed = this.baseSpeed;
      this.scrollX = 0;

      this.player.y = this.groundY - this.player.normalHeight;
      this.player.height = this.player.normalHeight;
      this.player.vy = 0;
      this.player.rotation = 0;
      this.player.isGrounded = true;
      this.player.isSliding = false;
      this.player.jumpsLeft = 2;
      this.player.coyoteTime = 0;
      this.player.jumpBuffer = 0;
      this.player.shield = false;
      this.player.boostTimer = 0;
      this.player.ghostTrail = [];

      // Ripristina mantello
      for (let i = 0; i < this.player.scarfNodes.length; i++) {
        this.player.scarfNodes[i].x = this.player.x - i * 8;
        this.player.scarfNodes[i].y = this.player.y + 20;
      }

      this.obstacles = [];
      this.chips = [];
      this.particles = [];
      this.shockwaves = [];
      this.spawnTimer = 55;
      this.comboTier = 0;
    }

    // =======================================================================
    // LOGICA DI GIOCO & AGGIORNAMENTO FISICA
    // =======================================================================
    update() {
      if (this.state !== 'PLAYING') return;

      // Gestione Overdrive Turbo
      const isBoosting = this.player.boostTimer > 0;
      if (isBoosting) {
        this.player.boostTimer--;
        const pct = (this.player.boostTimer / this.player.boostMaxDuration) * 100;
        this.ui.powerupFill.style.width = `${pct}%`;
        if (this.player.boostTimer <= 0) {
          this.ui.powerupBar.style.display = 'none';
        }
      }

      // Velocità progressiva molto morbida (mai ingestibile)
      const targetSpeed = Math.min(8.6, this.baseSpeed + this.distance * 0.0012);
      this.speed = isBoosting ? targetSpeed * 1.45 : targetSpeed;

      this.scrollX += this.speed;
      this.distance = Math.floor(this.scrollX / 12);

      // Fisica verticale e atterraggio
      if (!this.player.isGrounded) {
        this.player.vy += this.player.gravity;
        this.player.y += this.player.vy;

        // Rotazione acrobatica del doppio salto
        if (this.player.rotation > 0) {
          this.player.rotation += 0.22;
          if (this.player.rotation >= Math.PI * 2) {
            this.player.rotation = 0;
          }
        }

        const floorY = this.player.isSliding ? (this.groundY - this.player.slideHeight) : (this.groundY - this.player.normalHeight);
        if (this.player.y >= floorY) {
          this.player.y = floorY;
          this.player.vy = 0;
          this.player.rotation = 0;
          this.player.isGrounded = true;
          this.player.jumpsLeft = 2;

          // Se era stato memorizzato un salto nel buffer, eseguilo subito
          if (this.player.jumpBuffer > 0) {
            this.player.jumpBuffer = 0;
            this.triggerJump();
          }
        }
      } else {
        this.player.coyoteTime = 6;
      }

      if (this.player.jumpBuffer > 0) {
        this.player.jumpBuffer--;
      }

      // Gestione Scivolata
      if (this.player.isSliding) {
        this.player.slideTimer--;
        // Scintille di frizione radente sul pavimento
        if (Math.random() > 0.3) {
          this.particles.push({
            x: this.player.x + 8,
            y: this.groundY - 1,
            vx: -Math.random() * 5 - 2,
            vy: -Math.random() * 2,
            size: Math.random() * 2.2 + 1,
            color: '#00f0ff',
            alpha: 1,
            decay: 0.05
          });
        }
        if (this.player.slideTimer <= 0) {
          this.stopSlide();
        }
      }

      // Fisica della sciarpa fotonica (Verlet Integration)
      const collarX = this.player.x + 12;
      const collarY = this.player.y + 18;
      this.player.scarfNodes[0].x = collarX;
      this.player.scarfNodes[0].y = collarY;

      for (let i = 1; i < this.player.scarfNodes.length; i++) {
        const curr = this.player.scarfNodes[i];
        const prev = this.player.scarfNodes[i - 1];

        // Gravità + vento contrario dovuto alla velocità
        const windX = -this.speed * 0.9;
        const waveY = Math.sin(this.player.animTime * 2.5 + i * 0.7) * 2;
        curr.x += (prev.x + windX - curr.x) * 0.55;
        curr.y += (prev.y + waveY + 1.2 - curr.y) * 0.45;
      }

      // Scia Olografica Moderna (Motion Blur)
      if (Math.random() > 0.35 || isBoosting) {
        this.player.ghostTrail.unshift({
          x: this.player.x,
          y: this.player.y,
          h: this.player.height,
          isSliding: this.player.isSliding,
          alpha: 0.5,
          color: isBoosting ? '#fbbf24' : '#00f0ff'
        });
        if (this.player.ghostTrail.length > 6) {
          this.player.ghostTrail.pop();
        }
      }
      for (const g of this.player.ghostTrail) {
        g.x -= this.speed * 0.35;
        g.alpha -= 0.07;
      }
      this.player.ghostTrail = this.player.ghostTrail.filter(g => g.alpha > 0);

      this.player.animTime += 0.22;

      // Spawn Ostacoli e Chip
      this.spawnEntities();

      // Aggiorna Ostacoli
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];
        obs.x -= this.speed;

        if (this.checkCollision(this.player, obs)) {
          if (this.player.boostTimer > 0) {
            // Overdrive: vaporizza l'ostacolo
            this.addExplosion(obs.x + obs.w / 2, obs.y + obs.h / 2, '#fbbf24', 20);
            this.obstacles.splice(i, 1);
            this.sound.playImpact();
            continue;
          } else if (this.player.shield) {
            // Scudo protettivo: assorbe il colpo
            this.player.shield = false;
            this.addShockwave(this.player.x + 18, this.player.y + 36, '#00f0ff', 36);
            this.obstacles.splice(i, 1);
            this.sound.playImpact();
            continue;
          } else {
            this.triggerGameOver();
            return;
          }
        }

        if (obs.x + obs.w < -100) {
          this.obstacles.splice(i, 1);
        }
      }

      // Aggiorna Cristalli / Chip Dati
      for (let i = this.chips.length - 1; i >= 0; i--) {
        const c = this.chips[i];
        c.x -= this.speed;
        c.rot = (c.rot || 0) + 0.04;

        // Magnete dei cristalli durante l'Overdrive
        if (this.player.boostTimer > 0) {
          const dx = (this.player.x + 18) - c.x;
          const dy = (this.player.y + 36) - c.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 260) {
            c.x += dx * 0.16;
            c.y += dy * 0.16;
          }
        }

        if (this.checkCollision(this.player, c)) {
          if (c.isPowerup) {
            if (c.powerType === 'SHIELD') {
              this.player.shield = true;
            } else {
              this.player.boostTimer = this.player.boostMaxDuration;
              this.ui.powerupBar.style.display = 'flex';
              this.ui.powerupName.textContent = 'OVERDRIVE TURBO';
              this.ui.powerupFill.style.width = '100%';
            }
            this.sound.playPowerupFanfare();
            this.addShockwave(c.x, c.y, '#fbbf24', 30);
          } else {
            this.chipsCollected++;
            this.comboTier++;
            this.score += c.value;
            this.sound.playCrystalChime(this.comboTier);
            this.addExplosion(c.x, c.y, c.color, 8);
          }
          this.chips.splice(i, 1);
          continue;
        }

        if (c.x + c.w < -60) {
          this.chips.splice(i, 1);
        }
      }

      // Aggiorna particelle
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) this.particles.splice(i, 1);
      }

      // Aggiorna onde d'urto
      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const sw = this.shockwaves[i];
        sw.radius += 2.6;
        sw.alpha -= 0.04;
        if (sw.alpha <= 0) this.shockwaves.splice(i, 1);
      }

      this.updateHUD();
    }

    // =======================================================================
    // GENERATORE PROCEDURALE OSTACOLI & CRISTALLI
    // =======================================================================
    spawnEntities() {
      this.spawnTimer--;
      if (this.spawnTimer <= 0) {
        // Intervallo di spawn proporzionato alla velocità
        const gap = Math.max(65, 120 - Math.floor(this.distance / 140));
        this.spawnTimer = Math.floor(Math.random() * 30 + gap);

        const r = Math.random();

        if (r < 0.46) {
          // OSTACOLO 1: Barriera al plasma energetica da terra (Richiede SALTO)
          this.obstacles.push({
            type: 'PLASMA_GATE',
            x: this.width + 40,
            y: this.groundY - 48,
            w: 28,
            h: 48,
            color: '#00f0ff'
          });
        } else if (r < 0.78) {
          // OSTACOLO 2: Drone Olografico aereo con raggio conico (Richiede SCIVOLATA)
          this.obstacles.push({
            type: 'DRONE_SCANNER',
            x: this.width + 40,
            y: this.groundY - 100,
            w: 52,
            h: 68,
            color: '#38bdf8'
          });
        } else {
          // OSTACOLO 3: Barriera pylon elettrificata
          this.obstacles.push({
            type: 'PYLON_FIELD',
            x: this.width + 40,
            y: this.groundY - 52,
            w: 34,
            h: 52,
            color: '#8b5cf6'
          });
        }

        // Genera cristalli di dati o power-up
        this.spawnCrystals();
      }
    }

    spawnCrystals() {
      const spawnX = this.width + 90;
      const isHigh = Math.random() > 0.5;
      const spawnY = isHigh ? (this.groundY - 120) : (this.groundY - 38);

      // 8% probabilità power-up
      if (Math.random() < 0.08) {
        const isShield = Math.random() > 0.5;
        this.chips.push({
          x: spawnX,
          y: spawnY - 12,
          w: 26,
          h: 26,
          isPowerup: true,
          powerType: isShield ? 'SHIELD' : 'BOOST'
        });
        return;
      }

      // Gruppo di 3 cristalli di dati
      for (let i = 0; i < 3; i++) {
        this.chips.push({
          x: spawnX + i * 34,
          y: spawnY,
          w: 18,
          h: 18,
          value: 100,
          color: '#00f0ff'
        });
      }
    }

    checkCollision(rect1, rect2) {
      const pad = 6;
      return (
        rect1.x + pad < rect2.x + rect2.w - pad &&
        rect1.x + rect1.width - pad > rect2.x + pad &&
        rect1.y + pad < rect2.y + rect2.h - pad &&
        rect1.y + rect1.height - pad > rect2.y + pad
      );
    }

    addShockwave(x, y, color, maxR = 24) {
      this.shockwaves.push({ x, y, radius: 4, maxRadius: maxR, color, alpha: 0.85 });
    }

    addExplosion(x, y, color, count = 16) {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * 4 + 1.5;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          size: Math.random() * 2.5 + 1.2,
          color: color,
          alpha: 1,
          decay: 0.038
        });
      }
    }

    updateHUD() {
      if (this.ui.hudDistance) this.ui.hudDistance.textContent = `${this.distance} m`;
      if (this.ui.hudChips) this.ui.hudChips.textContent = this.chipsCollected;
    }

    triggerGameOver() {
      this.state = 'GAMEOVER';
      this.sound.playImpact();

      const totalScore = this.distance + (this.chipsCollected * 50);
      const isNewBest = this.distance > this.bestDistance;
      if (isNewBest) {
        this.bestDistance = this.distance;
        localStorage.setItem('cyber_runner_best', this.bestDistance.toString());
        this.updateHudBest();
      }

      this.ui.finalDistance.textContent = `${this.distance} m`;
      this.ui.finalChips.textContent = this.chipsCollected;
      this.ui.finalScore.textContent = `${totalScore} PTS`;
      this.ui.finalBest.textContent = `${this.bestDistance} m`;
      this.ui.newRecordBadge.style.display = isNewBest ? 'block' : 'none';

      this.ui.gameOverScreen.classList.add('active');
    }

    // =======================================================================
    // RENDERING MODERNO AD ALTA DEFINIZIONE (CANVAS 60 FPS)
    // =======================================================================
    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      // 1. Cielo notturno profondo (Deep Obsidian to Dark Indigo)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
      skyGrad.addColorStop(0, '#040714');
      skyGrad.addColorStop(0.55, '#070f26');
      skyGrad.addColorStop(1, '#101a38');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, this.width, this.height);

      // 2. Parallasse: Traffico aereo nello sfondo
      this.renderSkyTraffic(ctx);

      // 3. Parallasse Livello 1: Monoliti lontani
      this.renderDistantMonoliths(ctx);

      // 4. Parallasse Livello 2: Skyline moderna con finestre
      this.renderMidSkyline(ctx);

      // 5. Cartelloni Olografici Moderni
      this.renderHoloBillboards(ctx);

      // 6. Pista Maglev Futuristica
      this.renderMaglevHighway(ctx);

      // 7. Onde d'urto ad anello
      for (const sw of this.shockwaves) {
        ctx.save();
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = sw.alpha;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 8. Ostacoli Moderni
      for (const obs of this.obstacles) {
        this.renderModernObstacle(ctx, obs);
      }

      // 9. Cristalli di Dati Poligonali
      for (const c of this.chips) {
        this.renderDataCrystal(ctx, c);
      }

      // 10. Particelle
      for (const p of this.particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 11. Personaggio: Cyber Parkour Athlete con cinematica fluida
      this.renderRunnerAthlete(ctx);
    }

    renderSkyTraffic(ctx) {
      ctx.save();
      for (const vehicle of this.skyTraffic) {
        vehicle.x += vehicle.speed;
        if (vehicle.x < -60) vehicle.x = this.width + 60;

        ctx.fillStyle = vehicle.color;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(vehicle.x, vehicle.y, vehicle.w, 2.5);

        // Scia di luce posteriore
        const trailGrad = ctx.createLinearGradient(vehicle.x + vehicle.w, vehicle.y, vehicle.x + vehicle.w + 40, vehicle.y);
        trailGrad.addColorStop(0, vehicle.color);
        trailGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = trailGrad;
        ctx.fillRect(vehicle.x + vehicle.w, vehicle.y, 40, 2);
      }
      ctx.restore();
    }

    renderDistantMonoliths(ctx) {
      ctx.save();
      const offset = (this.scrollX * 0.12) % 400;
      ctx.translate(-offset, 0);

      for (let i = 0; i < 4; i++) {
        const shiftX = i * 450;
        for (const b of this.bgBuildings1) {
          const bx = b.x + shiftX;
          if (bx + b.w < -100 || bx > this.width + 400) continue;
          const by = this.groundY - b.h;

          ctx.fillStyle = b.color;
          ctx.fillRect(bx, by, b.w, b.h);

          // Bordo superiore con tenue profilo luminescente
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
          ctx.lineWidth = 1;
          ctx.strokeRect(bx, by, b.w, b.h);
        }
      }
      ctx.restore();
    }

    renderMidSkyline(ctx) {
      ctx.save();
      const offset = (this.scrollX * 0.28) % 360;
      ctx.translate(-offset, 0);

      for (let i = 0; i < 4; i++) {
        const shiftX = i * 450;
        for (const b of this.bgBuildings2) {
          const bx = b.x + shiftX;
          if (bx + b.w < -100 || bx > this.width + 400) continue;
          const by = this.groundY - b.h;

          ctx.fillStyle = b.color;
          ctx.fillRect(bx, by, b.w, b.h);

          // Linea architettonica verticale
          ctx.strokeStyle = b.accent;
          ctx.globalAlpha = 0.25;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(bx + b.w / 2, by);
          ctx.lineTo(bx + b.w / 2, by + b.h * 0.7);
          ctx.stroke();

          // Griglia ordinata di finestre moderne
          ctx.fillStyle = b.accent;
          ctx.globalAlpha = 0.2;
          for (let wy = by + 20; wy < this.groundY - 15; wy += 26) {
            for (let wx = bx + 8; wx < bx + b.w - 10; wx += 16) {
              if (Math.sin(wx * 2 + wy) > 0.05) {
                ctx.fillRect(wx, wy, 6, 12);
              }
            }
          }
          ctx.globalAlpha = 1.0;
        }
      }
      ctx.restore();
    }

    renderHoloBillboards(ctx) {
      ctx.save();
      const offset = (this.scrollX * 0.2) % 600;
      for (const bill of this.neonBillboards) {
        let bx = (bill.x - offset);
        if (bx < -200) bx += 1200;

        // Cornice olografica moderna
        ctx.strokeStyle = bill.color;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bx, bill.y, 130, 32);

        // Testo olografico
        ctx.font = "600 11px 'Space Grotesk', sans-serif";
        ctx.fillStyle = bill.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bill.text, bx + 65, bill.y + 16);
      }
      ctx.restore();
    }

    renderMaglevHighway(ctx) {
      ctx.save();

      // Bordo laser superiore della pista
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, this.groundY);
      ctx.lineTo(this.width, this.groundY);
      ctx.stroke();

      // Manto scuro della carreggiata
      const trackGrad = ctx.createLinearGradient(0, this.groundY, 0, this.height);
      trackGrad.addColorStop(0, '#0a1022');
      trackGrad.addColorStop(1, '#040712');
      ctx.fillStyle = trackGrad;
      ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);

      // Indicatori a freccia (Chevron) che scorrono fluidi
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 2;
      const chevronGap = 90;
      const offset = this.scrollX % chevronGap;

      for (let x = -offset; x < this.width + chevronGap; x += chevronGap) {
        ctx.beginPath();
        ctx.moveTo(x, this.groundY + 12);
        ctx.lineTo(x + 14, this.groundY + 22);
        ctx.lineTo(x, this.groundY + 32);
        ctx.stroke();
      }

      ctx.restore();
    }

    // =======================================================================
    // CINEMATICA VETTORIALE DEL RUNNER (ATLETA PARKOUR CON ARTI ARTICOLATI)
    // =======================================================================
    renderRunnerAthlete(ctx) {
      const p = this.player;

      // 1. Scia Olografica di movimento
      for (const g of p.ghostTrail) {
        ctx.save();
        ctx.globalAlpha = g.alpha * 0.35;
        ctx.fillStyle = g.color;
        if (g.isSliding) {
          ctx.beginPath();
          ctx.roundRect(g.x - 8, g.y + 6, p.width + 24, g.h - 6, 6);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.roundRect(g.x + 4, g.y + 4, p.width - 8, g.h - 4, 8);
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.save();

      // Scudo protettivo (Sfera geometrica moderna)
      if (p.shield) {
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x + p.width / 2, p.y + p.height / 2, p.height * 0.65, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Aura Overdrive
      if (p.boostTimer > 0) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(p.x - 6, p.y - 4, p.width + 12, p.height + 8);
      }

      // 2. Mantello/Sciarpa Fotonica Fluttuante (Physics Nodes)
      if (p.scarfNodes.length > 1) {
        ctx.save();
        ctx.strokeStyle = p.boostTimer > 0 ? '#fbbf24' : '#00f0ff';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(p.scarfNodes[0].x, p.scarfNodes[0].y);
        for (let i = 1; i < p.scarfNodes.length; i++) {
          ctx.lineTo(p.scarfNodes[i].x, p.scarfNodes[i].y);
        }
        ctx.stroke();
        ctx.restore();
      }

      if (p.isSliding) {
        // --- POSE: SCIVOLATA PARKOUR A TERRA ---
        const sx = p.x;
        const sy = p.y;

        // Corpo atletico affusolato e disteso
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(sx - 8, sy + 6, p.width + 26, p.height - 6, 8);
        ctx.fill();

        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Visore olografico orizzontale
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(sx + p.width + 4, sy + 10, 10, 5);

      } else {
        // --- POSE: CORSA O SALTO (CINEMATICA ARTICOLATA) ---
        ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
        if (p.rotation > 0) {
          ctx.rotate(p.rotation);
        }
        ctx.translate(-(p.x + p.width / 2), -(p.y + p.height / 2));

        const bounce = p.isGrounded ? Math.sin(p.animTime * 2) * 2.5 : 0;
        const px = p.x;
        const py = p.y + bounce;

        const cycle = p.isGrounded ? Math.sin(p.animTime * 2) : 0.5;

        // Torso / Armatura leggera (leggermente inclinata in avanti)
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(px + 10, py + 18);
        ctx.lineTo(px + p.width - 2, py + 22);
        ctx.lineTo(px + p.width - 8, py + 48);
        ctx.lineTo(px + 4, py + 46);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Casco e Visore aerodinamico
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(px + 20, py + 12, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(px + 22, py + 8, 10, 4.5);

        // Gambe articolate (Coscia + Stinco con flessione realistica del ginocchio)
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        // Gamba Anteriore
        const hip1X = px + 18;
        const hip1Y = py + 46;
        const knee1X = hip1X + cycle * 12;
        const knee1Y = hip1Y + 14;
        const foot1X = knee1X + cycle * 8;
        const foot1Y = py + 72;

        ctx.beginPath();
        ctx.moveTo(hip1X, hip1Y);
        ctx.lineTo(knee1X, knee1Y);
        ctx.lineTo(foot1X, foot1Y);
        ctx.stroke();

        // Gamba Posteriore
        const hip2X = px + 12;
        const hip2Y = py + 46;
        const knee2X = hip2X - cycle * 12;
        const knee2Y = hip2Y + 14;
        const foot2X = knee2X - cycle * 8;
        const foot2Y = py + 72;

        ctx.beginPath();
        ctx.moveTo(hip2X, hip2Y);
        ctx.lineTo(knee2X, knee2Y);
        ctx.lineTo(foot2X, foot2Y);
        ctx.stroke();

        // Braccia in sincronia opposta
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;

        // Braccio Anteriore
        ctx.beginPath();
        ctx.moveTo(px + 18, py + 24);
        ctx.lineTo(px + 18 - cycle * 10, py + 34);
        ctx.lineTo(px + 18 - cycle * 14, py + 42);
        ctx.stroke();

        // Bagliore di salto sotto gli stivali
        if (!p.isGrounded) {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(px + 16, py + 74, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    // =======================================================================
    // OSTACOLI & CRISTALLI MODERNI (VECTOR DESIGN)
    // =======================================================================
    renderModernObstacle(ctx, obs) {
      ctx.save();

      if (obs.type === 'PLASMA_GATE') {
        // Piloni laterali con raggio al plasma verticale
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

        // Arco al plasma
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(obs.x + 8, obs.y + 4, obs.w - 16, obs.h - 8);

      } else if (obs.type === 'DRONE_SCANNER') {
        // Drone aerodinamico moderno con raggio di scansione conico verso il basso
        const dy = obs.y + Math.sin(this.scrollX * 0.08) * 4;

        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(obs.x, dy, obs.w, 18);
        ctx.fillRect(obs.x, dy, obs.w, 18);

        // Sensore centrale
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(obs.x + obs.w / 2, dy + 9, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Raggio laser conico di scansione
        const scanGrad = ctx.createLinearGradient(0, dy + 18, 0, dy + obs.h);
        scanGrad.addColorStop(0, 'rgba(244, 63, 94, 0.35)');
        scanGrad.addColorStop(1, 'rgba(244, 63, 94, 0.04)');
        ctx.fillStyle = scanGrad;
        ctx.beginPath();
        ctx.moveTo(obs.x + 8, dy + 18);
        ctx.lineTo(obs.x + obs.w - 8, dy + 18);
        ctx.lineTo(obs.x + obs.w + 6, dy + obs.h);
        ctx.lineTo(obs.x - 6, dy + obs.h);
        ctx.closePath();
        ctx.fill();

      } else {
        // Pylone con campo energetico viola
        ctx.fillStyle = '#111827';
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      }

      ctx.restore();
    }

    renderDataCrystal(ctx, c) {
      ctx.save();
      const cy = c.y + Math.sin(this.scrollX * 0.1) * 3;

      if (c.isPowerup) {
        // Sfera olografica moderna
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(c.x + 13, cy + 13, 13, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.powerType === 'SHIELD' ? '🛡️' : '⚡', c.x + 13, cy + 14);
      } else {
        // Rombo di dati poligonale
        ctx.translate(c.x + 9, cy + 9);
        ctx.rotate(c.rot || 0);

        ctx.fillStyle = c.color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(8, 0);
        ctx.lineTo(0, 8);
        ctx.lineTo(-8, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }

    // =======================================================================
    // LOOP PRINCIPALE
    // =======================================================================
    gameLoop() {
      this.update();
      this.render();
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  // =========================================================================
  // AVVIO AL CARICAMENTO DOM
  // =========================================================================
  window.addEventListener('DOMContentLoaded', () => {
    new ModernCyberRunner();
  });
})();
