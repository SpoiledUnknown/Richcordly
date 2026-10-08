<template>
  <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <canvas ref="canvasRef" class="w-full h-full block" />
    <div
      class="absolute inset-0 transition-colors duration-500"
      :style="{
        backgroundColor: `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, 0.75)`,
        backdropFilter: `blur(${store.settings.blurDensity / 4}px)`
      }"
    />
    <div
      class="absolute inset-0 transition-all duration-500"
      :style="{
        background: `radial-gradient(ellipse at top, rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.22) 0%, rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, 0.55) 50%, rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, 0.95) 100%)`
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePresenceStore, hexToRgb } from '../stores/presenceStore'

const store = usePresenceStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)

const bgRgb = computed(() => hexToRgb(store.settings.customTheme?.backgroundColor || '#070b14'))
const primaryRgb = computed(() => hexToRgb(store.settings.customTheme?.primaryColor || '#8b5cf6'))
const accentRgb = computed(() => hexToRgb(store.settings.customTheme?.accentColor || '#38bdf8'))

let animFrameId: number | null = null
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  function syncSize(): void {
    if (!canvas) return
    const w = canvas.clientWidth || window.innerWidth || 1280
    const h = canvas.clientHeight || window.innerHeight || 720
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
  }

  resizeObserver = new ResizeObserver(syncSize)
  resizeObserver.observe(canvas)
  syncSize()

  const gl = (canvas.getContext('webgl') ||
    canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
  if (!gl) return

  const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

  const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;
uniform vec3 u_bgColor;
uniform vec3 u_primaryColor;
uniform vec3 u_accentColor;
varying vec2 v_texCoord;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.06;
    
    vec2 p1 = uv * 1.5 + vec2(t * 0.2, t * 0.08);
    vec2 p2 = uv * 2.2 - vec2(t * 0.15, t * 0.12);
    
    float n1 = snoise(p1) * 0.5 + 0.5;
    float n2 = snoise(p2 + n1 * 0.8) * 0.5 + 0.5;
    
    vec3 base = u_bgColor;
    vec3 midNavy = mix(u_bgColor, u_accentColor, 0.25);
    vec3 deepPurple = mix(u_bgColor, u_primaryColor, 0.6);
    vec3 iceGlow = u_accentColor;
    
    vec3 color = mix(base, midNavy, uv.y * 0.7);
    color = mix(color, deepPurple, n1 * 0.45);
    color = mix(color, iceGlow, pow(n2, 2.5) * 0.35);
    
    float dist = distance(uv, vec2(0.5, 0.5));
    color *= smoothstep(1.3, 0.2, dist);
    
    gl_FragColor = vec4(color * u_intensity, 1.0);
}`

  function cs(type: number, src: string): WebGLShader | null {
    if (!gl) return null
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }

  const vShader = cs(gl.VERTEX_SHADER, vs)
  const fShader = cs(gl.FRAGMENT_SHADER, fs)
  if (!vShader || !fShader) return

  const prog = gl.createProgram()
  if (!prog) return
  gl.attachShader(prog, vShader)
  gl.attachShader(prog, fShader)
  gl.linkProgram(prog)
  gl.useProgram(prog)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

  const pos = gl.getAttribLocation(prog, 'a_position')
  gl.enableVertexAttribArray(pos)
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

  const uTime = gl.getUniformLocation(prog, 'u_time')
  const uRes = gl.getUniformLocation(prog, 'u_resolution')
  const uMouse = gl.getUniformLocation(prog, 'u_mouse')
  const uIntensity = gl.getUniformLocation(prog, 'u_intensity')
  const uBgColor = gl.getUniformLocation(prog, 'u_bgColor')
  const uPrimaryColor = gl.getUniformLocation(prog, 'u_primaryColor')
  const uAccentColor = gl.getUniformLocation(prog, 'u_accentColor')

  const mouse = { x: canvas.width / 2, y: canvas.height / 2 }
  const handleMouseMove = (event: MouseEvent): void => {
    if (store.settings.reduceMotion) return
    const rect = canvas.getBoundingClientRect()
    if (rect.width && rect.height) {
      const nx = (event.clientX - rect.left) / rect.width
      const ny = 1.0 - (event.clientY - rect.top) / rect.height
      mouse.x = nx * canvas.width
      mouse.y = ny * canvas.height
    }
  }
  window.addEventListener('mousemove', handleMouseMove)

  let startTime = performance.now()
  function render(time: number): void {
    if (!gl || !canvas) return
    gl.viewport(0, 0, canvas.width, canvas.height)
    const elapsed = store.settings.reduceMotion ? 1000 : time - startTime
    if (uTime) gl.uniform1f(uTime, elapsed * 0.001)
    if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height)
    if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y)
    if (uIntensity) gl.uniform1f(uIntensity, (store.settings.shaderIntensity / 100) * 0.9)
    if (uBgColor) {
      gl.uniform3f(uBgColor, bgRgb.value.r / 255, bgRgb.value.g / 255, bgRgb.value.b / 255)
    }
    if (uPrimaryColor) {
      gl.uniform3f(
        uPrimaryColor,
        primaryRgb.value.r / 255,
        primaryRgb.value.g / 255,
        primaryRgb.value.b / 255
      )
    }
    if (uAccentColor) {
      gl.uniform3f(
        uAccentColor,
        accentRgb.value.r / 255,
        accentRgb.value.g / 255,
        accentRgb.value.b / 255
      )
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    animFrameId = requestAnimationFrame(render)
  }

  animFrameId = requestAnimationFrame(render)

  onUnmounted(() => {
    if (animFrameId) cancelAnimationFrame(animFrameId)
    if (resizeObserver) resizeObserver.disconnect()
    window.removeEventListener('mousemove', handleMouseMove)
  })
})
</script>
