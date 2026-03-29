import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MAX_COLORS = 8;
const frag = `
  uniform vec2 uCanvas; uniform float uTime; uniform float uSpeed; uniform vec2 uRot;
  uniform int uColorCount; uniform vec3 uColors[${MAX_COLORS}]; uniform int uTransparent;
  uniform float uScale; uniform float uFrequency; uniform float uWarpStrength;
  uniform vec2 uPointer; uniform float uMouseInfluence; uniform float uParallax;
  uniform float uNoise; varying vec2 vUv;
  void main() {
    float t = uTime * uSpeed; vec2 p = vUv * 2.0 - 1.0;
    p += uPointer * uParallax * 0.1;
    vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
    vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y) / max(uScale, 0.0001);
    q /= 0.5 + 0.2 * dot(q, q); q += 0.2 * cos(t) - 7.56;
    q += (uPointer - rp) * uMouseInfluence * 0.2;
    vec3 col = vec3(0.0); float a = 1.0; float cover = 0.0;
    for (int i = 0; i < ${MAX_COLORS}; ++i) {
      if (i >= uColorCount) break;
      vec2 s = q - float(i) * 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float w = 1.0 - exp(-6.0 / exp(6.0 * m));
      col += uColors[i] * w; cover = max(cover, w);
    }
    col = clamp(col, 0.0, 1.0); a = uTransparent > 0 ? cover : 1.0;
    gl_FragColor = vec4(col * a, a);
  }
`;

interface ColorBendsProps {
    rotation?: number;
    speed?: number;
    colors?: string[];
    transparent?: boolean;
    scale?: number;
    frequency?: number;
    warpStrength?: number;
    mouseInfluence?: number;
    parallax?: number;
    noise?: number;
}

export default function ColorBends({
    rotation = 45,
    speed = 0.2,
    colors = ['#6b21a8', '#db2777', '#06b6d4', '#3b82f6'],
    transparent = false,
    scale = 1,
    frequency = 1,
    warpStrength = 1,
    mouseInfluence = 1,
    parallax = 0.5,
    noise = 0
}: ColorBendsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const rad = (rotation * Math.PI) / 180;

        const material = new THREE.ShaderMaterial({
            vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
            fragmentShader: frag,
            uniforms: {
                uCanvas: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
                uTime: { value: 0 },
                uSpeed: { value: speed },
                uRot: { value: new THREE.Vector2(Math.cos(rad), Math.sin(rad)) },
                uColorCount: { value: Math.min(colors.length, MAX_COLORS) },
                uColors: {
                    value: Array.from({ length: MAX_COLORS }, (_, i) => {
                        const colorStr = i < colors.length ? colors[i] : '#000000';
                        return new THREE.Color(colorStr);
                    })
                },
                uTransparent: { value: transparent ? 1 : 0 },
                uScale: { value: scale },
                uFrequency: { value: frequency },
                uWarpStrength: { value: warpStrength },
                uPointer: { value: new THREE.Vector2(0, 0) },
                uMouseInfluence: { value: mouseInfluence },
                uParallax: { value: parallax },
                uNoise: { value: noise }
            },
            transparent: true
        });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(mesh);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const startTime = performance.now();

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            material.uniforms.uPointer.value.set(x, y);
        };
        window.addEventListener('mousemove', handleMouseMove);

        const handleResize = () => {
            if (!container) return;
            renderer.setSize(container.clientWidth, container.clientHeight);
            material.uniforms.uCanvas.value.set(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        const loop = () => {
            material.uniforms.uTime.value = (performance.now() - startTime) * 0.001;
            renderer.render(scene, camera);
            frameRef.current = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            material.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [colors, speed, scale, frequency, warpStrength, rotation, transparent, mouseInfluence, parallax, noise]);

    return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />;
}
