import './style.css';
import { gsap } from 'gsap';
import { config } from './config';

class MotherDayCinema {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.scenes = {
      s1: document.getElementById('scene-1'),
      s2: document.getElementById('scene-2'),
      s3: document.getElementById('scene-3'),
      s5: document.getElementById('scene-5'),
      s6: document.getElementById('scene-6'),
      s7: document.getElementById('scene-7'),
      floor: document.getElementById('gallery-floor')
    };
    
    this.galleryItems = [];
    this.galleryIndex = 2;
    this.galleryInterval = null;

    this.init();
  }

  init() {
    this.setupCanvas();
    this.createParticles();
    this.animateParticles();
    this.populateContent();
    this.setupGalleryNav();
    this.startLoading();

    window.addEventListener('resize', () => this.setupCanvas());
    document.getElementById('restart-btn').addEventListener('click', () => location.reload());
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    for (let i = 0; i < 200; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        blink: Math.random() * 0.02
      });
    }
  }

  animateParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.opacity += p.blink;

      if (p.opacity > 0.8 || p.opacity < 0.1) p.blink *= -1;
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
      this.ctx.fill();
    });
    requestAnimationFrame(() => this.animateParticles());
  }

  populateContent() {
    document.getElementById('hero-img').src = '/image-reveal.png';

    const galleryGrid = document.getElementById('gallery-grid');
    config.galleryImages.forEach((imgSrc, i) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `<img src="${imgSrc}" alt="Memory">`;
      // Initially hide the items with proper 3D setup
      gsap.set(item, { opacity: 0, x: 0, z: -500, rotateY: 0 });
      galleryGrid.appendChild(item);
      this.galleryItems.push(item);
    });
  }

  setupGalleryNav() {
    const btnLeft = document.getElementById('nav-arrow-left');
    const btnRight = document.getElementById('nav-arrow-right');

    if (btnLeft) {
      btnLeft.addEventListener('click', () => {
        this.galleryIndex = (this.galleryIndex - 1 + this.galleryItems.length) % this.galleryItems.length;
        this.updateGalleryPositions();
        this.resetGalleryAutoPlay();
      });
    }

    if (btnRight) {
      btnRight.addEventListener('click', () => {
        this.galleryIndex = (this.galleryIndex + 1) % this.galleryItems.length;
        this.updateGalleryPositions();
        this.resetGalleryAutoPlay();
      });
    }
  }

  resetGalleryAutoPlay() {
    if (this.galleryInterval) {
      clearInterval(this.galleryInterval);
      this.galleryInterval = setInterval(() => {
        this.galleryIndex = (this.galleryIndex + 1) % this.galleryItems.length;
        this.updateGalleryPositions();
      }, 2500);
    }
  }

  updateGalleryPositions() {
    this.galleryItems.forEach((item, index) => {
      let offset = index - this.galleryIndex;
      // circular layout logic
      if (offset < -2) offset += this.galleryItems.length;
      if (offset > 2) offset -= this.galleryItems.length;

      const isActive = offset === 0;
      const isLeft = offset < 0;
      const isRight = offset > 0;
      const absOffset = Math.abs(offset);

      const zIndex = 10 - absOffset;
      const scale = isActive ? 1 : 1 - absOffset * 0.15;
      const spread = window.innerWidth < 600 ? 120 : 260;
      const translateX = offset * spread; // Spread distance
      const rotateY = isLeft ? 35 : isRight ? -35 : 0;
      const opacity = absOffset > 2 ? 0 : isActive ? 1 : 0.6;
      
      const filter = isActive ? 'blur(0px) brightness(1.1)' : 'blur(2px) brightness(0.4)';
      const borderColor = isActive ? 'var(--gold-bright)' : 'rgba(212, 175, 55, 0.3)';
      const boxShadow = isActive ? '0 0 50px rgba(250, 218, 94, 0.4)' : '0 0 20px rgba(212, 175, 55, 0.1)';

      item.style.zIndex = zIndex;
      item.style.filter = filter;
      item.style.borderColor = borderColor;
      item.style.boxShadow = boxShadow;

      gsap.to(item, {
        x: translateX,
        scale: scale,
        rotateY: rotateY,
        opacity: opacity,
        duration: 0.8,
        ease: 'power3.out'
      });
    });
  }

  startLoading() {
    gsap.to('.progress', {
      width: '100%',
      duration: 2,
      ease: 'expo.inOut',
      onComplete: () => {
        gsap.to('#loader', { opacity: 0, duration: 1, onComplete: () => {
          document.getElementById('loader').remove();
          this.playCinematic();
        }});
      }
    });
  }

  playCinematic() {
    const tl = gsap.timeline();

    // Scene 1: Intro
    tl.to(this.scenes.s1, { autoAlpha: 1, duration: 2 })
      .to(this.scenes.s1, { autoAlpha: 0, duration: 1, delay: 1.5 });

    // Scene 2: Line Art Image Reveal
    tl.set(this.scenes.s2, { autoAlpha: 1 })
      .to('.glow-line', { strokeDashoffset: 0, duration: 4, ease: 'power2.inOut' })
      .to('#mother-child-art', { clipPath: 'inset(0% 0 0 0)', duration: 4, ease: 'power2.inOut' }, "-=4")
      .to(this.scenes.s2, { autoAlpha: 0, duration: 1.5, delay: 1.5 });

    // Scene 3: Image Reveal
    tl.set(this.scenes.s3, { autoAlpha: 1 })
      .from('.hero-image-container', { scale: 0.5, opacity: 0, duration: 2, ease: 'expo.out' })
      .from('.halo-glow', { scale: 0, opacity: 0, duration: 2 }, '-=1.5')

    // Scene 4: Heartbeat Overlay
    tl.to('#heartbeat-overlay', { opacity: 1, duration: 0.5 })
      .to('.ekg-path', { strokeDashoffset: 0, duration: 2, ease: 'none' })
      .to(this.scenes.s3, { autoAlpha: 0, duration: 1.5, delay: 0.5 });

    // Scene 5: Message
    tl.to(this.scenes.s5, { autoAlpha: 1, duration: 2 })
      .to(this.scenes.s5, { autoAlpha: 0, duration: 1, delay: 3 });

    // Scene 6: 3D Gallery Carousel
    tl.to(this.scenes.floor, { opacity: 1, duration: 1 })
      .set(this.scenes.s6, { autoAlpha: 1 }, '-=0.5')
      .call(() => {
        this.galleryIndex = 2; // Center image
        this.updateGalleryPositions(); // Init layout
      })
      .to('.nav-arrow', { opacity: 1, duration: 1 }, "+=0.5")
      .call(() => {
        // Start auto-play
        this.galleryInterval = setInterval(() => {
          this.galleryIndex = (this.galleryIndex + 1) % this.galleryItems.length;
          this.updateGalleryPositions();
        }, 3000);
      })
      // Keep Scene 6 visible for 12 seconds
      .to(this.scenes.s6, { autoAlpha: 0, duration: 1.5, delay: 12, onStart: () => {
        if (this.galleryInterval) clearInterval(this.galleryInterval);
      }})
      .to('.nav-arrow', { opacity: 0, duration: 1 }, '-=1.5')
      .to(this.scenes.floor, { opacity: 0, duration: 1 });

    // Scene 7: Final
    tl.set(this.scenes.s7, { autoAlpha: 1 })
      .from('#scene-7 > div:nth-child(1)', { y: -30, opacity: 0, duration: 2, ease: 'power4.out' }) // US Logo
      .from('#scene-7 > div:nth-child(2)', { y: -20, opacity: 0, duration: 2, ease: 'power4.out' }, "-=1.5") // URBANINK STUDIOS
      // Animate the heartbeat line drawing
      .fromTo('.final-ekg', { strokeDasharray: 2000, strokeDashoffset: 2000 }, { strokeDashoffset: 0, duration: 3, ease: 'none' }, "-=1")
      .from('#scene-7 p', { y: 20, opacity: 0, duration: 1.5 }, "-=1")
      .from('#restart-btn', { opacity: 0, duration: 1 }, "+=1");
  }
}

window.onload = () => new MotherDayCinema();
