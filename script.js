'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('openBtn');
  const envelopeScreen = document.getElementById('envelopeScreen');
  const cardScreen = document.getElementById('cardScreen');
  const typedTextContainer = document.getElementById('typedText');

  const messageText = "Pasa un día espectacular. Quería decirte que me alegra mucho haberte conocido; la química y las risas contigo no se encuentran tan fácil. Que sea un año lleno de sueños cumplidos y de más momentos juntos. ¡Disfruta mucho tu día!";

  const handleOpenCard = (e) => {
    e.preventDefault();
    envelopeScreen.classList.add('hidden');
    
    setTimeout(() => {
      cardScreen.classList.remove('hidden');
      startTypewriter(messageText, typedTextContainer, 28);
    }, 350);
  };

  openBtn.addEventListener('click', handleOpenCard);

  function startTypewriter(text, element, speed) {
    let index = 0;
    element.textContent = '';
    const scrollParent = element.parentElement;
    
    const timer = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        scrollParent.scrollTop = scrollParent.scrollHeight;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }

  initMultiShapeParticles();
});

function initMultiShapeParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = window.innerWidth < 480 ? 35 : 60;
  
  const particles = Array.from({ length: particleCount }, () => {
    const rand = Math.random();
    let type = 'dot';
    if (rand > 0.6 && rand <= 0.85) type = 'star';
    else if (rand > 0.85) type = 'heart';

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedY: Math.random() * -0.3 - 0.05,
      speedX: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      type: type
    };
  });

  function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawHeart(ctx, x, y, size, color) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size);
    ctx.bezierCurveTo(x, y + size, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += p.speedY;
      p.x += p.speedX;
      p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.006;

      const currentAlpha = Math.max(0.08, Math.min(0.7, p.alpha));

      if (p.y < -10) p.y = height + 10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      if (p.type === 'dot') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${currentAlpha})`;
        ctx.fill();
      } else if (p.type === 'star') {
        drawStar(ctx, p.x, p.y, 4, p.size * 2, p.size * 0.8, `rgba(243, 229, 171, ${currentAlpha})`);
      } else if (p.type === 'heart') {
        drawHeart(ctx, p.x, p.y, p.size * 3, `rgba(184, 0, 46, ${currentAlpha * 0.75})`);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}