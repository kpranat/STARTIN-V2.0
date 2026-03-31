import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';

// Pure GSAP implementation - no paid plugins required
function hexToRgb(hex: string) {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return { r: 0, g: 0, b: 0 };
    return {
        r: parseInt(m[1], 16),
        g: parseInt(m[2], 16),
        b: parseInt(m[3], 16)
    };
}

const throttle = (func: Function, limit: number) => {
    let lastCall = 0;
    return (...args: any[]) => {
        const now = performance.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            func(...args);
        }
    };
};

interface Dot {
    cx: number;
    cy: number;
    xOffset: number;
    yOffset: number;
    _inertiaApplied: boolean;
}

interface DotGridProps {
    dotSize?: number;
    gap?: number;
    baseColor?: string;
    activeColor?: string;
    proximity?: number;
    speedTrigger?: number;
    shockRadius?: number;
    shockStrength?: number;
    maxSpeed?: number;
    resistance?: number;
    returnDuration?: number;
    className?: string;
    style?: React.CSSProperties;
}

const DotGrid = ({
    dotSize = 5,
    gap = 20,
    baseColor = '#271E37',
    activeColor = '#8b5cf6',
    proximity = 120,
    speedTrigger = 100,
    shockRadius = 250,
    shockStrength = 5,
    maxSpeed = 5000,
    resistance = 750,
    returnDuration = 1.5,
    className = '',
    style
}: DotGridProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dotsRef = useRef<Dot[]>([]);
    const pointerRef = useRef({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        speed: 0,
        lastTime: 0,
        lastX: 0,
        lastY: 0
    });

    const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
    const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

    const circlePath = useMemo(() => {
        if (typeof window === 'undefined' || !window.Path2D) return null;
        const p = new Path2D();
        p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
        return p;
    }, [dotSize]);

    const buildGrid = useCallback(() => {
        const wrap = wrapperRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;

        const { width, height } = wrap.getBoundingClientRect();
        if (width === 0 || height === 0) return;

        const dpr = window.devicePixelRatio || 1;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.scale(dpr, dpr);

        const cell = dotSize + gap;
        const cols = Math.floor((width + gap) / cell);
        const rows = Math.floor((height + gap) / cell);

        const gridW = cell * cols - gap;
        const gridH = cell * rows - gap;

        const extraX = width - gridW;
        const extraY = height - gridH;

        const startX = extraX / 2 + dotSize / 2;
        const startY = extraY / 2 + dotSize / 2;

        const dots: Dot[] = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cx = startX + x * cell;
                const cy = startY + y * cell;
                dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
            }
        }
        dotsRef.current = dots;
    }, [dotSize, gap]);

    useEffect(() => {
        if (!circlePath) return;

        let rafId: number;
        const proxSq = proximity * proximity;

        const draw = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Clear entire canvas without considering scaling/DPR manually (clearRect is scaled by ctx.scale)
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const { x: px, y: py } = pointerRef.current;

            for (let i = 0; i < dotsRef.current.length; i++) {
                const dot = dotsRef.current[i];
                const ox = dot.cx + dot.xOffset;
                const oy = dot.cy + dot.yOffset;
                const dx = dot.cx - px;
                const dy = dot.cy - py;
                const dsq = dx * dx + dy * dy;

                let colorStyle = baseColor;
                if (dsq <= proxSq) {
                    const dist = Math.sqrt(dsq);
                    const t = 1 - Math.min(dist / proximity, 1);
                    const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
                    const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
                    const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
                    colorStyle = `rgb(${r},${g},${b})`;
                }

                ctx.save();
                ctx.translate(ox, oy);
                ctx.fillStyle = colorStyle;
                ctx.fill(circlePath);
                ctx.restore();
            }
            rafId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(rafId);
    }, [proximity, baseColor, activeRgb, baseRgb, circlePath]);

    useEffect(() => {
        buildGrid();
        window.addEventListener('resize', buildGrid);
        return () => window.removeEventListener('resize', buildGrid);
    }, [buildGrid]);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const now = performance.now();
            const pr = pointerRef.current;
            const dt = pr.lastTime ? now - pr.lastTime : 16;
            const dx = e.clientX - pr.lastX;
            const dy = e.clientY - pr.lastY;
            let vx = (dx / (dt || 1)) * 1000;
            let vy = (dy / (dt || 1)) * 1000;
            let speed = Math.hypot(vx, vy);

            if (speed > maxSpeed) {
                const scale = maxSpeed / speed;
                vx *= scale;
                vy *= scale;
                speed = maxSpeed;
            }

            pr.lastTime = now;
            pr.lastX = e.clientX;
            pr.lastY = e.clientY;
            pr.vx = vx;
            pr.vy = vy;
            pr.speed = speed;

            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            pr.x = e.clientX - rect.left;
            pr.y = e.clientY - rect.top;

            for (let i = 0; i < dotsRef.current.length; i++) {
                const dot = dotsRef.current[i];
                const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
                if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
                    dot._inertiaApplied = true;
                    gsap.killTweensOf(dot);

                    const pushX = (dot.cx - pr.x) * 0.1 + vx * 0.005;
                    const pushY = (dot.cy - pr.y) * 0.1 + vy * 0.005;

                    gsap.to(dot, {
                        xOffset: pushX,
                        yOffset: pushY,
                        duration: 0.3,
                        ease: "power2.out",
                        onComplete: () => {
                            gsap.to(dot, {
                                xOffset: 0,
                                yOffset: 0,
                                duration: returnDuration,
                                ease: 'elastic.out(1, 0.75)'
                            });
                            dot._inertiaApplied = false;
                        }
                    });
                }
            }
        };

        const onClick = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;

            for (let i = 0; i < dotsRef.current.length; i++) {
                const dot = dotsRef.current[i];
                const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
                if (dist < shockRadius && !dot._inertiaApplied) {
                    dot._inertiaApplied = true;
                    gsap.killTweensOf(dot);
                    const falloff = Math.max(0, 1 - dist / shockRadius);
                    const pushX = (dot.cx - cx) * shockStrength * falloff;
                    const pushY = (dot.cy - cy) * shockStrength * falloff;

                    gsap.to(dot, {
                        xOffset: pushX,
                        yOffset: pushY,
                        duration: 0.4,
                        ease: "power2.out",
                        onComplete: () => {
                            gsap.to(dot, {
                                xOffset: 0,
                                yOffset: 0,
                                duration: returnDuration,
                                ease: 'elastic.out(1, 0.75)'
                            });
                            dot._inertiaApplied = false;
                        }
                    });
                }
            }
        };

        const throttledMove = throttle(onMove, 32);
        window.addEventListener('mousemove', throttledMove, { passive: true });
        window.addEventListener('click', onClick);

        return () => {
            window.removeEventListener('mousemove', throttledMove);
            window.removeEventListener('click', onClick);
        };
    }, [maxSpeed, speedTrigger, proximity, returnDuration, shockRadius, shockStrength]);

    return (
        <div ref={wrapperRef} className={`relative overflow-hidden ${className}`} style={{ width: '100%', height: '100%', ...style }}>
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
        </div>
    );
};

export default DotGrid;
