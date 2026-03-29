import { useEffect, useRef } from 'react';


const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float iTime;
  uniform vec2 iResolution;
  uniform float uHeight;
  uniform float uBaseWidth;
  uniform float uGlow;
  uniform float uNoise;
  uniform float uScale;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float sdTriangle(vec2 p, vec2 p0, vec2 p1, vec2 p2) {
    vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
    vec2 v0 = p - p0, v1 = p - p1, v2 = p - p2;
    vec2 pq0 = v0 - e0*clamp(dot(v0,e0)/dot(e0,e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1*clamp(dot(v1,e1)/dot(e1,e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2*clamp(dot(v2,e2)/dot(e2,e2), 0.0, 1.0);
    float s = sign(e0.x*e2.y - e0.y*e2.x);
    vec2 d = min(min(vec2(dot(pq0,pq0), s*(v0.x*e0.y-v0.y*e0.x)),
                     vec2(dot(pq1,pq1), s*(v1.x*e1.y-v1.y*e1.x))),
                     vec2(dot(pq2,pq2), s*(v2.x*e2.y-v2.y*e2.x)));
    return -sqrt(d.x)*sign(d.y);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 p = (uv - 0.5) * 2.0;
    p.x *= iResolution.x / iResolution.y;

    float scale = uScale;
    float h = uHeight * scale;
    float w = uBaseWidth * scale * 0.5;

    // Rotating pyramid
    float angle = iTime * 0.3;
    float c = cos(angle), s = sin(angle);
    vec2 rp = vec2(p.x * c - p.y * s, p.x * s + p.y * c);

    vec2 top = vec2(0.0, h * 0.5);
    vec2 bl = vec2(-w, -h * 0.5);
    vec2 br = vec2(w, -h * 0.5);

    float d = sdTriangle(rp, top, bl, br);

    // Fractal noise
    float n = noise(p * 3.0 + iTime * 0.5) * uNoise;

    // Prism color refraction
    vec3 col = vec3(0.0);
    float edge = smoothstep(0.02, -0.02, d);
    float glow = exp(-abs(d) * 4.0) * uGlow;

    // Spectral colors
    vec3 c1 = vec3(0.4, 0.1, 0.8); // purple
    vec3 c2 = vec3(0.1, 0.6, 0.9); // cyan
    vec3 c3 = vec3(0.9, 0.2, 0.6); // pink

    float phase = iTime * 0.5;
    vec3 glowColor = mix(c1, c2, sin(phase) * 0.5 + 0.5);
    glowColor = mix(glowColor, c3, sin(phase * 1.3 + 1.0) * 0.5 + 0.5);

    // Interior fill
    vec3 interior = mix(c1 * 0.3, c2 * 0.3, sin(rp.x * 5.0 + iTime) * 0.5 + 0.5);
    interior += c3 * 0.15 * sin(rp.y * 4.0 - iTime * 0.7);
    interior += n * 0.15;

    col = interior * edge + glowColor * glow;

    // Background ambient
    vec3 bg = vec3(0.02, 0.01, 0.04);
    bg += vec3(0.03, 0.01, 0.05) * noise(uv * 8.0 + iTime * 0.1);

    col = mix(bg, col, edge + glow * 0.5);
    col += glow * glowColor * 0.3;

    gl_FragColor = vec4(col, 1.0);
  }
`;

interface PrismProps {
    height?: number;
    baseWidth?: number;
    animationType?: string;
    glow?: number;
    noise?: number;
    transparent?: boolean;
    scale?: number;
}

const Prism = ({
    height = 3.5,
    baseWidth = 5.5,
    glow = 1,
    noise = 0.5,
    scale = 3.6
}: PrismProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);

        const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
        if (!gl) return;

        // Compile shaders
        const vs = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(vs, vertexShader);
        gl.compileShader(vs);

        const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(fs, fragmentShader);
        gl.compileShader(fs);

        const program = gl.createProgram()!;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        // Full-screen quad
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        // Uniform locations
        const uTime = gl.getUniformLocation(program, 'iTime');
        const uRes = gl.getUniformLocation(program, 'iResolution');
        const uH = gl.getUniformLocation(program, 'uHeight');
        const uBW = gl.getUniformLocation(program, 'uBaseWidth');
        const uGlow = gl.getUniformLocation(program, 'uGlow');
        const uNoise = gl.getUniformLocation(program, 'uNoise');
        const uScale = gl.getUniformLocation(program, 'uScale');

        gl.uniform1f(uH, height);
        gl.uniform1f(uBW, baseWidth);
        gl.uniform1f(uGlow, glow);
        gl.uniform1f(uNoise, noise);
        gl.uniform1f(uScale, scale * 0.1);

        const resize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            const dpr = Math.min(window.devicePixelRatio, 2);
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uRes, canvas.width, canvas.height);
        };
        resize();
        window.addEventListener('resize', resize);

        const startTime = performance.now();
        const render = () => {
            const t = (performance.now() - startTime) * 0.001;
            gl.uniform1f(uTime, t);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            frameRef.current = requestAnimationFrame(render);
        };
        frameRef.current = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener('resize', resize);
            if (container.contains(canvas)) {
                container.removeChild(canvas);
            }
        };
    }, [height, baseWidth, glow, noise, scale]);

    return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />;
};

export default Prism;
