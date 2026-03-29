import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FloatingLinesProps {
  enabledWaves?: string[];
  lineCount?: number;
  lineDistance?: number;
  interactive?: boolean;
}

const fragmentShader = `
  precision highp float;
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec2 uMouse;

  float wave(vec2 uv, float freq, float amp, float speed, float offset) {
    return amp * sin(uv.x * freq + iTime * speed + offset);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= iResolution.x / iResolution.y;

    vec3 col = vec3(0.0);

    // Top waves
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float y = 0.6 + fi * 0.06;
      float w = wave(uv, 3.0 + fi * 0.5, 0.04 + fi * 0.01, 0.8 + fi * 0.2, fi * 1.5);
      float d = abs(uv.y - y - w);
      float line = 0.002 / d;
      vec3 c = mix(vec3(0.4, 0.1, 0.8), vec3(0.1, 0.6, 0.9), fi / 5.0);
      col += c * line * 0.15;
    }

    // Middle waves
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float y = 0.35 + fi * 0.06;
      float w = wave(uv, 2.5 + fi * 0.7, 0.05 + fi * 0.008, 0.6 + fi * 0.15, fi * 2.0 + 3.14);
      float d = abs(uv.y - y - w);
      float line = 0.002 / d;
      vec3 c = mix(vec3(0.9, 0.2, 0.6), vec3(0.4, 0.1, 0.8), fi / 5.0);
      col += c * line * 0.12;
    }

    // Bottom waves
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float y = 0.1 + fi * 0.06;
      float w = wave(uv, 4.0 + fi * 0.3, 0.03 + fi * 0.012, 1.0 + fi * 0.1, fi * 0.8 + 1.57);
      float d = abs(uv.y - y - w);
      float line = 0.002 / d;
      vec3 c = mix(vec3(0.1, 0.6, 0.9), vec3(0.9, 0.2, 0.6), fi / 5.0);
      col += c * line * 0.1;
    }

    // Mouse interaction glow
    float mouseDist = length(p - uMouse * vec2(iResolution.x / iResolution.y, 1.0));
    col += vec3(0.3, 0.1, 0.5) * 0.05 / (mouseDist + 0.3);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const FloatingLines = ({
  interactive = true
}: FloatingLinesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const mouseUniform = new THREE.Vector2(0, 0);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        uMouse: { value: mouseUniform }
      },
      vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
      fragmentShader: fragmentShader,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    const startTime = performance.now();

    const handleMouse = (e: MouseEvent) => {
      if (!interactive) return;
      mouseUniform.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener('mousemove', handleMouse);

    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      material.uniforms.iResolution.value.set(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      material.uniforms.iTime.value = (performance.now() - startTime) * 0.001;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
};

export default FloatingLines;
