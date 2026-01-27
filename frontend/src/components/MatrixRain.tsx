'use client';

import { useEffect, useRef, useCallback } from 'react';

interface MatrixRainProps {
  /**
   * Color of the matrix characters (default: '#0f0' - bright green)
   */
  color?: string;
  /**
   * Background color (default: '#000' - black)
   */
  backgroundColor?: string;
  /**
   * Font size in pixels (default: 15)
   */
  fontSize?: number;
  /**
   * Animation speed in milliseconds (default: 50)
   * Lower value = faster animation
   */
  speed?: number;
  /**
   * Custom CSS class name
   */
  className?: string;
}

export default function MatrixRain({
  color = '#0f0',
  backgroundColor = '#000',
  fontSize = 15,
  speed = 50,
  className = '',
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const yposRef = useRef<number[]>([]);
  const colsRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);

  // Initialize canvas and animation state
  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    let ctx = ctxRef.current;
    if (!ctx) {
      ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return false;
      ctxRef.current = ctx;
    }

    // Get device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Set actual size in memory (scaled for device pixel ratio)
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Scale the context to match device pixel ratio
    ctx.scale(dpr, dpr);

    // Set display size (CSS pixels)
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Calculate number of columns
    const cols = Math.floor(width / 20) + 1;
    colsRef.current = cols;

    // Initialize y positions array
    if (!isInitializedRef.current || yposRef.current.length !== cols) {
      yposRef.current = Array(cols).fill(0);
      isInitializedRef.current = true;
    }

    // Draw initial background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    return true;
  }, [backgroundColor]);

  // Animation loop using requestAnimationFrame
  const animate = useCallback(
    (currentTime: number) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      // Throttle animation based on speed prop
      const elapsed = currentTime - lastTimeRef.current;
      if (elapsed < speed) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = currentTime;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Draw semi-transparent black rectangle for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      // Set font and color
      ctx.fillStyle = color;
      ctx.font = `${fontSize}pt monospace`;

      // Update and draw each column
      const ypos = yposRef.current;
      const cols = colsRef.current;

      for (let i = 0; i < cols; i++) {
        const y = ypos[i];
        const x = i * 20;

        // Generate random character (ASCII printable + some extended)
        // Using range that includes numbers, letters, and symbols for matrix effect
        const charCode = Math.random() < 0.5
          ? 0x30a0 + Math.floor(Math.random() * 96) // Japanese katakana (matrix style)
          : 33 + Math.floor(Math.random() * 94); // ASCII printable (33-126)
        const text = String.fromCharCode(charCode);

        // Draw character
        ctx.fillText(text, x, y);

        // Update position
        if (y > 100 + Math.random() * 10000) {
          ypos[i] = 0;
        } else {
          ypos[i] = y + 20;
        }
      }

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [color, fontSize, speed]
  );

  // Resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Cancel current animation
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Reinitialize canvas
    if (initializeCanvas()) {
      // Restart animation
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [initializeCanvas, animate]);

  // Debounce resize handler
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = setTimeout(() => {
      handleResize();
    }, 150);
  }, [handleResize]);

  useEffect(() => {
    // Initialize canvas
    if (!initializeCanvas()) return;

    // Start animation
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    // Add resize listener
    window.addEventListener('resize', debouncedResize, { passive: true });

    // Cleanup
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      window.removeEventListener('resize', debouncedResize);
    };
  }, [initializeCanvas, animate, debouncedResize]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
}