import React, { useEffect, useRef } from 'react';

interface StarfieldBackgroundProps {
  speedMultiplier?: number;
}

export const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({
  speedMultiplier = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate stars
    const starCount = 180;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speed: (Math.random() * 0.8 + 0.2) * speedMultiplier,
      brightness: Math.random(),
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      color: ['#ffffff', '#bae6fd', '#fef08a', '#e9d5ff'][Math.floor(Math.random() * 4)],
    }));

    // Shooting star state
    let shootingStar: {
      x: number;
      y: number;
      length: number;
      speed: number;
      dx: number;
      dy: number;
      life: number;
      maxLife: number;
    } | null = null;

    const maybeTriggerShootingStar = () => {
      if (!shootingStar && Math.random() < 0.008) {
        shootingStar = {
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.3,
          length: Math.random() * 80 + 50,
          speed: Math.random() * 12 + 14,
          dx: 1,
          dy: 0.6,
          life: 0,
          maxLife: 40,
        };
      }
    };

    const render = () => {
      // Cosmic deep space gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#030712');
      bgGrad.addColorStop(0.5, '#0b0f19');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle nebular glows
      const nebulaGrad1 = ctx.createRadialGradient(
        width * 0.2,
        height * 0.3,
        10,
        width * 0.2,
        height * 0.3,
        width * 0.45
      );
      nebulaGrad1.addColorStop(0, 'rgba(56, 189, 248, 0.07)');
      nebulaGrad1.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = nebulaGrad1;
      ctx.fillRect(0, 0, width, height);

      const nebulaGrad2 = ctx.createRadialGradient(
        width * 0.8,
        height * 0.7,
        10,
        width * 0.8,
        height * 0.7,
        width * 0.5
      );
      nebulaGrad2.addColorStop(0, 'rgba(168, 85, 247, 0.08)');
      nebulaGrad2.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = nebulaGrad2;
      ctx.fillRect(0, 0, width, height);

      // Update and draw stars
      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        star.brightness += star.twinkleSpeed;
        const alpha = 0.4 + Math.sin(star.brightness) * 0.5;

        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw shooting star
      maybeTriggerShootingStar();
      if (shootingStar) {
        shootingStar.x += shootingStar.dx * shootingStar.speed;
        shootingStar.y += shootingStar.dy * shootingStar.speed;
        shootingStar.life++;

        const trailGrad = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          shootingStar.x - shootingStar.dx * shootingStar.length,
          shootingStar.y - shootingStar.dy * shootingStar.length
        );
        trailGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        trailGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - shootingStar.dx * shootingStar.length,
          shootingStar.y - shootingStar.dy * shootingStar.length
        );
        ctx.stroke();

        if (shootingStar.life >= shootingStar.maxLife) {
          shootingStar = null;
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [speedMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      id="space-starfield-canvas"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
