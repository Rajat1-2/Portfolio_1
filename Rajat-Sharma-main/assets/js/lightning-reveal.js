// Lightning Reveal Effect using Three.js
// Follows mouse with an electric glow and reveals hidden text texture under the cursor

(function () {
  // Graceful exit if no THREE
  if (typeof THREE === 'undefined') {
    console.warn('[lightning-reveal] THREE not found; skipping reveal effect.');
    return;
  }

  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  if (isCoarse) {
    // Disable on touch/mobile for performance and UX
    return;
  }

  const cfgEl = document.getElementById('reveal-config');
  const TEXT = (cfgEl?.getAttribute('data-text') || 'RAJAT SHARMA').toString();
  const TEXT_COLOR = cfgEl?.getAttribute('data-color') || '#ffffff';
  const TEXT_FONT = cfgEl?.getAttribute('data-font') || 'bold 96px Arial';

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // transparent
  const canvas = renderer.domElement;
  canvas.className = 'reveal-canvas';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.zIndex = '1';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // Create a text texture using 2D canvas
  function createTextTexture() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    if (!ctx) return new THREE.Texture();

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = TEXT_FONT;

    // Auto shrink font if too wide
    let fontSize = parseInt(TEXT_FONT.match(/\d+/)?.[0] || '96', 10);
    const family = TEXT_FONT.replace(/.*\d+px\s*/, '') || 'Arial';
    function fits(fs) {
      ctx.font = `bold ${fs}px ${family}`;
      const m = ctx.measureText(TEXT);
      return m.width < w * 0.9; // 90% of width
    }
    while (fontSize > 24 && !fits(fontSize)) fontSize -= 4;
    ctx.font = `bold ${fontSize}px ${family}`;

    // Draw with slight shadow for stronger mask
    ctx.shadowColor = 'rgba(255,255,255,0.25)';
    ctx.shadowBlur = Math.max(8, Math.floor(fontSize * 0.08));
    ctx.fillText(TEXT, w / 2, h / 2);

    const tex = new THREE.Texture(c);
    tex.needsUpdate = true;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  let textTexture = createTextTexture();

  const uniforms = {
    u_time: { value: 0 },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) }, // normalized 0..1
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    u_tex: { value: textTexture },
  };

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  // Simple hash noise
  const fragmentShader = `
    precision highp float;
    varying vec2 vUv;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform vec2 u_resolution;
    uniform sampler2D u_tex;

    float hash(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5,183.3)));
      return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }
    float noise(in vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      float n = mix(mix( hash(i + vec2(0.0,0.0)),
                         hash(i + vec2(1.0,0.0)), u.x),
                    mix( hash(i + vec2(0.0,1.0)),
                         hash(i + vec2(1.0,1.0)), u.x), u.y);
      return 0.5 + 0.5*n;
    }

    // Cheap lightning-like field
    float lightning(vec2 uv, vec2 m) {
      // Warp space around mouse for jagged edges
      vec2 d = uv - m;
      float r = length(d);
      float ang = atan(d.y, d.x);
      float n = noise(vec2(ang*2.5 + u_time*1.3, r*6.0 - u_time*2.0));
      float rim = smoothstep(0.35, 0.0, r + (n-0.5)*0.08);
      // Add streaky variations
      float bands = smoothstep(0.015, 0.0, abs(sin(ang*18.0 + u_time*5.0))*0.04 + r*0.2);
      return clamp(rim + bands*0.6, 0.0, 1.0);
    }

    void main(){
      // Correct for non-square view
      vec2 uv = vUv;
      vec2 mouse = u_mouse;
      mouse.y = 1.0 - mouse.y; // convert to GL uv space

      float field = lightning(uv, mouse);
      vec4 txt = texture2D(u_tex, uv);

      // Reveal text where field is strong; add a warm electric glow
      float alpha = field * txt.a;
      vec3 glow = mix(vec3(0.99, 0.62, 0.0), vec3(1.0, 0.78, 0.2), 0.5) * pow(field, 1.5) * 0.6;
      vec3 col = txt.rgb * alpha + glow;

      gl_FragColor = vec4(col, alpha);
    }
  `;

  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.NormalBlending,
  });

  const geo = new THREE.PlaneBufferGeometry(2, 2);
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  const mouse = new THREE.Vector2(0.5, 0.5);
  function onPointerMove(e) {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    mouse.set(x, y);
    uniforms.u_mouse.value.copy(mouse);
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    // Rebuild text texture on resize for crispness
    if (textTexture) textTexture.dispose();
    textTexture = createTextTexture();
    uniforms.u_tex.value = textTexture;
  }
  window.addEventListener('resize', onResize);

  let start = performance.now();
  function tick() {
    const now = performance.now();
    uniforms.u_time.value = (now - start) / 1000.0;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
