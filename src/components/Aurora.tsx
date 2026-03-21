'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec3 } from 'ogl';

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  speed?: number;
}

function hexToVec3(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

const VERT = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform float uBlend;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

//  Simplex noise helpers
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x - floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main(){
  float t = uTime * 0.3;
  vec2 uv = vUv;

  // Multiple wave layers
  float n1 = snoise(vec2(uv.x * 2.0 + t * 0.4, uv.y * 1.5 + t * 0.3)) * uAmplitude;
  float n2 = snoise(vec2(uv.x * 3.0 - t * 0.35, uv.y * 2.5 - t * 0.25)) * uAmplitude;
  float n3 = snoise(vec2(uv.x * 1.5 + t * 0.5, uv.y * 1.0 + t * 0.15)) * uAmplitude;

  // aurora bands drifting vertically
  float band1 = smoothstep(0.0, 0.5, uv.y + n1 * 0.35 - 0.1);
  float band2 = smoothstep(0.1, 0.6, uv.y + n2 * 0.3 + 0.1);
  float band3 = smoothstep(0.2, 0.8, uv.y + n3 * 0.4 + 0.3);

  vec3 col = mix(uColor0, uColor1, band1);
  col = mix(col, uColor2, band2 * uBlend);
  col = mix(col, uColor1, band3 * uBlend * 0.5);

  // Fade toward the top so the white page header is visible
  float topFade = smoothstep(0.85, 1.0, uv.y);
  col = mix(col, vec3(1.0), topFade * 0.9);

  // Fade toward the bottom
  float botFade = smoothstep(0.0, 0.25, uv.y);
  col = mix(vec3(1.0), col, botFade);

  // Overall alpha — keep the background bright (white-ish) so text is readable
  float alpha = (1.0 - topFade) * botFade * 0.55;

  gl_FragColor = vec4(col, alpha);
}
`;

export default function Aurora({
  colorStops = ['#7cff67', '#B19EEF', '#5227FF'],
  amplitude = 1.0,
  blend = 0.5,
  speed = 1.0,
}: AuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const resize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };
    window.addEventListener('resize', resize);
    resize();

    const geometry = new Triangle(gl);

    const c0 = hexToVec3(colorStops[0] ?? '#7cff67');
    const c1 = hexToVec3(colorStops[1] ?? '#B19EEF');
    const c2 = hexToVec3(colorStops[2] ?? '#5227FF');

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uBlend: { value: blend },
        uColor0: { value: new Vec3(...c0) },
        uColor1: { value: new Vec3(...c1) },
        uColor2: { value: new Vec3(...c2) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    let raf: number;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      program.uniforms.uTime.value = (t / 1000) * speed;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      container.removeChild(gl.canvas);
      renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [colorStops, amplitude, blend, speed]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}
