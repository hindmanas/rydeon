import React, { useEffect, useRef } from 'react';

/* ======================================================================
   RYDEON — 3D CAMPUS CONNECTIVITY MODEL CONSTANTS
   ====================================================================== */
const RAW = [
  { id:'pcu',    name:'Pimpri Chinchwad University', cat:'edu',   lat:18.6517, lng:73.7615, rides: 482 },
  { id:'wakad',  name:'Wakad Chowk',                 cat:'hub',   lat:18.5993, lng:73.7614, rides: 617 },
  { id:'metro',  name:'Pimpri Metro Station',         cat:'metro', lat:18.6294, lng:73.8033, rides: 356 },
  { id:'hinj',   name:'Hinjewadi IT Park',            cat:'work',  lat:18.5912, lng:73.7387, rides: 891 },
  { id:'pj',     name:'Pune Junction',                cat:'metro', lat:18.5285, lng:73.8744, rides: 743 },
  { id:'undri',  name:'Undri',                        cat:'res',   lat:18.4636, lng:73.9006, rides: 214 },
  { id:'hadapsar', name:'Hadapsar',                   cat:'work',  lat:18.5089, lng:73.9260, rides: 398 },
];

const NET = {
  teal:    ['#14b8a6', 0x14b8a6],
  emerald: ['#22c58d', 0x22c58d],
  cyan:    ['#38d9e8', 0x38d9e8],
};

const SEGMENTS = [
  { a:'pcu',   b:'metro', net:'teal' },
  { a:'metro', b:'wakad', net:'teal' },
  { a:'wakad', b:'hinj',  net:'teal' },
  { a:'wakad', b:'pj',    net:'emerald' },
  { a:'pj',    b:'hadapsar', net:'emerald' },
  { a:'pj',    b:'undri', net:'cyan' },
  { a:'undri', b:'hadapsar', net:'cyan' },
];

const DOTTED = [
  { a:'pcu', b:'hinj' },
  { a:'metro', b:'pj' },
  { a:'wakad', b:'hadapsar' },
];

const ICONS = {
  edu:   '<svg viewBox="0 0 24 24" fill="none" stroke="#38d9e8" stroke-width="1.6"><path d="M12 3 2 8l10 5 10-5-10-5Z"/><path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5"/></svg>',
  hub:   '<svg viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="1.6"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.2 2"/></svg>',
  metro: '<svg viewBox="0 0 24 24" fill="none" stroke="#38d9e8" stroke-width="1.6"><rect x="5" y="4" width="14" height="13" rx="3"/><path d="M8 21h8M8 17v1M16 17v1"/><circle cx="8.5" cy="12.5" r="0.6" fill="#38d9e8"/><circle cx="15.5" cy="12.5" r="0.6" fill="#38d9e8"/></svg>',
  work:  '<svg viewBox="0 0 24 24" fill="none" stroke="#22c58d" stroke-width="1.6"><rect x="4" y="9" width="16" height="11" rx="1.4"/><path d="M9 9V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3"/></svg>',
  res:   '<svg viewBox="0 0 24 24" fill="none" stroke="#8fa1bd" stroke-width="1.6"><path d="M4 11 12 4l8 7"/><path d="M6 10v9h12v-9"/></svg>',
};

function ThreeDModel() {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const labelLayerRef = useRef(null);
  const tooltipRef = useRef(null);
  const ttNameRef = useRef(null);
  const ttMetaRef = useRef(null);
  const backPillRef = useRef(null);
  const stageHintRef = useRef(null);
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);

  useEffect(() => {
    let checkInterval = null;
    let animationFrameId = null;
    let renderer = null;

    // References to remove events on cleanup
    let handleResize = null;
    let handleScroll = null;
    let onMouseMove = null;
    let onMouseLeave = null;
    let onCanvasClick = null;
    let onBackPillClick = null;
    let onNavPrevClick = null;
    let onNavNextClick = null;

    const initThreeD = () => {
      const THREE = window.THREE;
      if (!THREE || !stageRef.current || !canvasRef.current) return;

      const stage = stageRef.current;
      const canvas = canvasRef.current;
      const labelLayer = labelLayerRef.current;
      const tooltip = tooltipRef.current;
      const ttName = ttNameRef.current;
      const ttMeta = ttMetaRef.current;
      const backPill = backPillRef.current;
      const stageHint = stageHintRef.current;
      const navPrev = navPrevRef.current;
      const navNext = navNextRef.current;

      /* ---------- 1. Location data Setup ---------- */
      const meanLat = RAW.reduce((s, d) => s + d.lat, 0) / RAW.length;
      const meanLng = RAW.reduce((s, d) => s + d.lng, 0) / RAW.length;
      const cosLat = Math.cos(meanLat * Math.PI / 180);
      const SPREAD = 1.9;

      RAW.forEach(d => {
        const dLat = (d.lat - meanLat) * 111;
        const dLng = (d.lng - meanLng) * 111 * cosLat;
        d.x = dLng * SPREAD;
        d.z = -dLat * SPREAD;
        d.pos = new THREE.Vector3(d.x, 0.15, d.z);
      });

      const hub = id => RAW.find(d => d.id === id);

      RAW.forEach(d => {
        d.segs = SEGMENTS.map((s, i) => (s.a === d.id || s.b === d.id) ? i : -1).filter(i => i >= 0);
      });

      /* ---------- 2. Renderer / scene / camera ---------- */
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xdcecf7);
      scene.fog = new THREE.FogExp2(0xdfeff8, 0.0105);

      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 300);

      const OVERVIEW_TARGET = new THREE.Vector3(0.5, 0, 0.5);
      const OVERVIEW_RADIUS = 49;
      const FOCUS_RADIUS = 11.5;
      const ROTATE_SPEED = 0.045;

      let autoTheta = 0.78;
      let phi = 1.02;
      let currentRadius = OVERVIEW_RADIUS;
      let currentTarget = OVERVIEW_TARGET.clone();
      let focusedId = null;

      function sphToCartesian(r, theta, ph) {
        return new THREE.Vector3(
          r * Math.sin(ph) * Math.cos(theta),
          r * Math.cos(ph),
          r * Math.sin(ph) * Math.sin(theta)
        );
      }

      function setFocus(id) {
        focusedId = id;
        if (backPill) backPill.classList.toggle('show', !!id);
        if (stageHint) stageHint.style.opacity = id ? 0 : 0.6;
      }

      /* ---------- 3. Lighting ---------- */
      scene.add(new THREE.HemisphereLight(0xdff0ff, 0xcdd9c2, 0.75));
      scene.add(new THREE.AmbientLight(0xffffff, 0.45));

      const sun = new THREE.DirectionalLight(0xfff2d9, 1.9);
      sun.position.set(-26, 42, 18);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      sun.shadow.camera.left = -42; sun.shadow.camera.right = 42;
      sun.shadow.camera.top = 42;   sun.shadow.camera.bottom = -42;
      sun.shadow.camera.near = 5;   sun.shadow.camera.far = 105;
      sun.shadow.bias = -0.0015;
      sun.shadow.radius = 3;
      scene.add(sun);

      const skyFill = new THREE.DirectionalLight(0xbfe0ff, 0.35);
      skyFill.position.set(20, 18, -20);
      scene.add(skyFill);

      const rim = new THREE.DirectionalLight(0x14b8a6, 0.12);
      rim.position.set(15, 8, 15);
      scene.add(rim);

      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      /* ---------- 4. Ground ---------- */
      function makeGroundTexture() {
        const size = 2048;
        const cvs = document.createElement('canvas');
        cvs.width = cvs.height = size;
        const ctx = cvs.getContext('2d');

        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.72);
        grad.addColorStop(0, '#c8dcb8');
        grad.addColorStop(0.55, '#bcd2ac');
        grad.addColorStop(1, '#a9c398');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        const WORLD_HALF = 38;
        const toPx = (x, z) => [((x + WORLD_HALF) / (WORLD_HALF * 2)) * size, ((z + WORLD_HALF) / (WORLD_HALF * 2)) * size];

        ctx.strokeStyle = 'rgba(90,100,80,0.10)';
        ctx.lineWidth = 1.4;
        const step = size / 46;
        for (let i = 0; i <= 46; i++) {
          ctx.beginPath(); ctx.moveTo(i * step, 0); ctx.lineTo(i * step, size); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, i * step); ctx.lineTo(size, i * step); ctx.stroke();
        }

        ctx.lineCap = 'round';
        SEGMENTS.concat(DOTTED).forEach(s => {
          const A = hub(s.a), B = hub(s.b);
          const [ax, az] = toPx(A.x, A.z);
          const [bx, bz] = toPx(B.x, B.z);
          ctx.strokeStyle = 'rgba(70,75,72,0.28)';
          ctx.lineWidth = 30;
          ctx.beginPath(); ctx.moveTo(ax, az); ctx.lineTo(bx, bz); ctx.stroke();
          ctx.strokeStyle = 'rgba(225,222,205,0.30)';
          ctx.lineWidth = 5;
          ctx.beginPath(); ctx.moveTo(ax, az); ctx.lineTo(bx, bz); ctx.stroke();
        });

        RAW.forEach(d => {
          const [px, pz] = toPx(d.x, d.z);
          const clusterR = 190;
          for (let i = 0; i < 70; i++) {
            const ang = Math.random() * Math.PI * 2;
            const rad = Math.random() * clusterR;
            const bx = px + Math.cos(ang) * rad;
            const by = pz + Math.sin(ang) * rad;
            const w = 10 + Math.random() * 22;
            const h = 8 + Math.random() * 18;
            ctx.fillStyle = `rgba(${150 + Math.random() * 30},${152 + Math.random() * 28},${140 + Math.random() * 24},${0.4 + Math.random() * 0.25})`;
            ctx.fillRect(bx - w / 2, by - h / 2, w, h);
          }
        });

        const tex = new THREE.CanvasTexture(cvs);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        return tex;
      }

      const groundGeo = new THREE.PlaneGeometry(80, 80, 24, 24);
      {
        const pos = groundGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i), y = pos.getY(i);
          const h = Math.sin(x * 0.09) * 0.18 + Math.cos(y * 0.11) * 0.16;
          pos.setZ(i, h * 0.35);
        }
        groundGeo.computeVertexNormals();
      }
      const groundMat = new THREE.MeshStandardMaterial({
        map: makeGroundTexture(),
        roughness: 0.95,
        metalness: 0.05,
        color: 0xffffff,
      });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      {
        const vgTex = (() => {
          const c = document.createElement('canvas'); c.width = c.height = 512;
          const ctx = c.getContext('2d');
          const g = ctx.createRadialGradient(256, 256, 150, 256, 256, 256);
          g.addColorStop(0, 'rgba(223,240,250,0)');
          g.addColorStop(1, 'rgba(223,240,250,0.55)');
          ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);
          return new THREE.CanvasTexture(c);
        })();
        const vg = new THREE.Mesh(new THREE.PlaneGeometry(88, 88), new THREE.MeshBasicMaterial({ map: vgTex, transparent: true, depthWrite: false }));
        vg.rotation.x = -Math.PI / 2;
        vg.position.y = 0.03;
        scene.add(vg);
      }

      /* ---------- 5. Buildings ---------- */
      function makeWindowTexture() {
        const s = 128, cvs = document.createElement('canvas'); cvs.width = s; cvs.height = s;
        const ctx = cvs.getContext('2d');
        ctx.fillStyle = '#eef2f5'; ctx.fillRect(0, 0, s, s);
        const cols = 6, rows = 10;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const lit = Math.random() < 0.12;
          ctx.fillStyle = lit ? 'rgba(255,244,214,0.55)' : 'rgba(140,175,205,0.55)';
          const w = s / cols, h = s / rows;
          ctx.fillRect(c * w + w * 0.22, r * h + h * 0.2, w * 0.56, h * 0.5);
        }
        const tex = new THREE.CanvasTexture(cvs);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        return tex;
      }
      const winTex = makeWindowTexture();

      const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
      const buildingMat = new THREE.MeshStandardMaterial({
        color: 0xdde3e0,
        map: winTex,
        emissiveMap: winTex,
        emissive: new THREE.Color(0xfff4d8),
        emissiveIntensity: 0.04,
        roughness: 0.85,
        metalness: 0.06,
      });
      const BCOUNT = 150;
      const buildings = new THREE.InstancedMesh(buildingGeo, buildingMat, BCOUNT);
      buildings.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      {
        const dummy = new THREE.Object3D();
        const colorVar = new THREE.Color();
        let idx = 0;
        const perHub = Math.floor(BCOUNT / RAW.length);
        RAW.forEach(d => {
          const isPCU = d.id === 'pcu';
          for (let i = 0; i < perHub; i++) {
            const ang = Math.random() * Math.PI * 2;
            const rad = isPCU ? (3.4 + Math.random() * 3.6) : (1.4 + Math.random() * 4.6);
            const x = d.x + Math.cos(ang) * rad;
            const z = d.z + Math.sin(ang) * rad;
            const w = 0.5 + Math.random() * 0.9;
            const depth = 0.5 + Math.random() * 0.9;
            const distFactor = 1 - Math.min(rad / 6, 1) * 0.55;
            const height = (1.2 + Math.random() * 4.2) * distFactor;
            dummy.position.set(x, height / 2, z);
            dummy.scale.set(w, height, depth);
            dummy.rotation.y = Math.random() * 0.2;
            dummy.updateMatrix();
            buildings.setMatrixAt(idx, dummy.matrix);
            const shade = 0.82 + Math.random() * 0.35;
            colorVar.setRGB(0.80 * shade, 0.83 * shade, 0.85 * shade);
            buildings.setColorAt(idx, colorVar);
            idx++;
          }
        });
        buildings.count = idx;
      }
      buildings.instanceMatrix.needsUpdate = true;
      buildings.castShadow = false; // Disable instanced shadows for significant framerate boost
      buildings.receiveShadow = true;
      scene.add(buildings);

      /* ---------- 6. Landmark landmark ---------- */
      function buildPCULandmark(centerPos) {
        const group = new THREE.Group();
        group.position.set(centerPos.x, 0, centerPos.z);

        const stone = new THREE.MeshStandardMaterial({ color: 0xf3f1e8, roughness: 0.78, metalness: 0.04 });
        const stoneDark = new THREE.MeshStandardMaterial({ color: 0xe4e0d2, roughness: 0.8, metalness: 0.04 });
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x9fc3d9, roughness: 0.25, metalness: 0.35, emissive: 0x1c2a33, emissiveIntensity: 0.08 });

        const addBox = (w, h, d, x, y, z, mat = stone, rotY = 0) => {
          const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
          m.position.set(x, y, z); m.rotation.y = rotY;
          m.castShadow = true; m.receiveShadow = true;
          group.add(m);
          return m;
        };

        const towerH = 6.4;
        addBox(2.4, towerH, 1.7, 0, towerH / 2, 0, stone);
        addBox(1.9, towerH * 0.92, 0.06, 0, towerH * 0.5, 0.89, glassMat);

        const archCount = 8;
        for (let i = 0; i < archCount; i++) {
          const t = (i + 0.5) / archCount - 0.5;
          const arch = new THREE.Mesh(
            new THREE.TorusGeometry(0.16, 0.035, 8, 12, Math.PI),
            stoneDark
          );
          arch.position.set(t * 2.2, towerH + 0.18, 0.86);
          arch.rotation.z = Math.PI;
          arch.castShadow = true;
          group.add(arch);
        }
        addBox(2.5, 0.14, 1.8, 0, towerH + 0.36, 0, stoneDark);

        const porticoH = 2.5;
        addBox(1.5, porticoH, 1.0, 0, porticoH / 2, 1.55, stone);
        addBox(1.7, 0.12, 1.2, 0, porticoH + 0.06, 1.55, stoneDark);
        for (let i = 0; i < 4; i++) {
          const px = -0.55 + i * 0.37;
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, porticoH * 0.9, 10), stoneDark);
          col.position.set(px, porticoH * 0.45, 2.0);
          col.castShadow = true;
          group.add(col);
        }

        addBox(1.7, 4.4, 1.5, -3.1, 2.2, -0.6, stone, 0.05);
        addBox(1.7, 4.9, 1.5, 3.1, 2.45, -0.6, stone, -0.05);

        const lawn = new THREE.Mesh(new THREE.CircleGeometry(2.1, 24), new THREE.MeshStandardMaterial({ color: 0x8fbf6f, roughness: 1 }));
        lawn.rotation.x = -Math.PI / 2;
        lawn.position.set(0, 0.02, 2.9);
        lawn.receiveShadow = true;
        group.add(lawn);

        scene.add(group);
        return towerH;
      }
      const pcuTowerHeight = buildPCULandmark(hub('pcu').pos);
      hub('pcu').pos.y = pcuTowerHeight + 0.5;

      /* ---------- 7. Route curves, glow, nodes, particles ---------- */
      function makeCurve(a, b) {
        const A = a.pos.clone(), B = b.pos.clone();
        const mid = A.clone().lerp(B, 0.5);
        const dist = A.distanceTo(B);
        mid.y += Math.min(2.2, 0.7 + dist * 0.09);
        const dir = new THREE.Vector3().subVectors(B, A).normalize();
        const side = new THREE.Vector3(-dir.z, 0, dir.x);
        mid.add(side.multiplyScalar(dist * 0.06 * (Math.random() > 0.5 ? 1 : -1)));
        return new THREE.CatmullRomCurve3([A, mid, B]);
      }

      const routeGroup = new THREE.Group();
      scene.add(routeGroup);
      const routeMeshes = [];
      const particles = [];

      SEGMENTS.forEach((seg, i) => {
        const A = hub(seg.a), B = hub(seg.b);
        const curve = makeCurve(A, B);
        const colorHex = NET[seg.net][1];

        const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.045, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.9 });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        routeGroup.add(tube);

        const glowGeo = new THREE.TubeGeometry(curve, 48, 0.16, 8, false);
        const glowMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        routeGroup.add(glow);

        routeMeshes.push({ seg, tube, glow, curve, baseOpacity: 0.9, baseGlow: 0.12 });

        const pCount = 2;
        for (let p = 0; p < pCount; p++) {
          const geo = new THREE.SphereGeometry(0.075, 10, 10);
          const mat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.95 });
          const mesh = new THREE.Mesh(geo, mat);
          routeGroup.add(mesh);
          particles.push({ mesh, curve, t: p / pCount, speed: 0.055 + Math.random() * 0.02, colorHex });
        }
      });

      DOTTED.forEach(d => {
        const A = hub(d.a), B = hub(d.b);
        const curve = makeCurve(A, B);
        const pts = curve.getPoints(40);
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineDashedMaterial({ color: 0x6f88ab, dashSize: 0.22, gapSize: 0.18, transparent: true, opacity: 0.35 });
        const line = new THREE.Line(geo, mat);
        line.computeLineDistances();
        routeGroup.add(line);
      });

      function makeGlowTexture() {
        const s = 128, cvs = document.createElement('canvas'); cvs.width = cvs.height = s;
        const ctx = cvs.getContext('2d');
        const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
        g.addColorStop(0, 'rgba(255,255,255,0.9)');
        g.addColorStop(0.4, 'rgba(255,255,255,0.35)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
        return new THREE.CanvasTexture(cvs);
      }
      const glowTex = makeGlowTexture();

      const hubObjs = [];
      RAW.forEach(d => {
        const netColor = d.segs.length ? NET[SEGMENTS[d.segs[0]].net][1] : 0x38d9e8;

        const coreGeo = new THREE.SphereGeometry(0.16, 16, 16);
        const coreMat = new THREE.MeshBasicMaterial({ color: netColor });
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.position.copy(d.pos);
        scene.add(core);

        const haloMat = new THREE.SpriteMaterial({ map: glowTex, color: netColor, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
        const halo = new THREE.Sprite(haloMat);
        halo.scale.set(1.1, 1.1, 1);
        halo.position.copy(d.pos);
        scene.add(halo);

        const hitGeo = new THREE.SphereGeometry(0.55, 8, 8);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const hit = new THREE.Mesh(hitGeo, hitMat);
        hit.position.copy(d.pos);
        hit.userData.id = d.id;
        scene.add(hit);

        hubObjs.push({ data: d, core, halo, hit, netColor });
      });

      /* ---------- 8. Camera rig setup ---------- */
      let mouseNDC = new THREE.Vector2(-10, -10);
      let mouseScreen = { x: 0, y: 0 };
      let hoveredId = null;
      let scrollZoom = 0;
      const raycaster = new THREE.Raycaster();
      const clock = new THREE.Clock();

      function updateCamera(dt, elapsed) {
        autoTheta += dt * ROTATE_SPEED;
        const phiWobble = phi + Math.sin(elapsed * 0.09) * 0.015;

        const desiredRadius = focusedId
          ? FOCUS_RADIUS
          : OVERVIEW_RADIUS - scrollZoom * 10;
        const desiredTarget = focusedId ? hub(focusedId).pos : OVERVIEW_TARGET;

        currentRadius += (desiredRadius - currentRadius) * 0.045;
        currentTarget.lerp(desiredTarget, 0.045);

        const pos = sphToCartesian(currentRadius, autoTheta, phiWobble).add(currentTarget);

        const parallax = focusedId ? 0.35 : 1;
        pos.x += mouseNDC.x * 1.1 * parallax;
        pos.y += mouseNDC.y * 0.6 * parallax;

        camera.position.lerp(pos, 0.08);
        camera.lookAt(currentTarget);
      }

      /* ---------- 9. Resize / DOM label sync ---------- */
      /* ---------- 9. Resize / DOM label sync ---------- */
      let stageRect = { width: 400, height: 300 };
      handleResize = () => {
        if (!stage) return;
        const w = stage.clientWidth, h = stage.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        const rect = stage.getBoundingClientRect();
        stageRect = { width: rect.width, height: rect.height };
      };
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', () => setTimeout(handleResize, 250));

      /* build DOM labels */
      const labelEls = {};
      RAW.forEach(d => {
        const el = document.createElement('div');
        el.className = 'loc-label';
        el.innerHTML = `<span class="ic">${ICONS[d.cat]}</span><span>${d.name}</span>`;
        if (labelLayer) labelLayer.appendChild(el);
        labelEls[d.id] = el;
      });

      const projected = new THREE.Vector3();
      function syncLabels() {
        if (!stage || !labelLayer) return;
        const width = stageRect.width;
        const height = stageRect.height;
        const activeId = hoveredId || focusedId;

        RAW.forEach(d => {
          projected.copy(d.pos); projected.y += 0.55;
          projected.project(camera);
          const x = (projected.x * 0.5 + 0.5) * width;
          const y = (1 - (projected.y * 0.5 + 0.5)) * height;
          const el = labelEls[d.id];
          if (el) {
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            el.classList.toggle('dim', activeId && activeId !== d.id);
            el.classList.toggle('active', activeId === d.id);
          }
        });

        if (activeId && tooltip && ttName && ttMeta) {
          const d = hub(activeId);
          projected.copy(d.pos); projected.y += 1.0;
          projected.project(camera);
          const x = (projected.x * 0.5 + 0.5) * width;
          const y = (1 - (projected.y * 0.5 + 0.5)) * height;
          tooltip.style.left = x + 'px';
          tooltip.style.top = y + 'px';
          tooltip.classList.add('show');
          ttName.textContent = d.name;
          ttMeta.textContent = `${d.rides} active rides`;
        } else if (tooltip) {
          tooltip.classList.remove('show');
        }
      }

      /* ---------- 10. Pointer + scroll interaction ---------- */
      onMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseNDC.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        mouseScreen.x = e.clientX; mouseScreen.y = e.clientY;

        raycaster.setFromCamera(mouseNDC, camera);
        const hits = raycaster.intersectObjects(hubObjs.map(h => h.hit));
        hoveredId = hits.length ? hits[0].object.userData.id : null;
        canvas.style.cursor = hoveredId ? 'pointer' : 'default';
      };
      canvas.addEventListener('mousemove', onMouseMove);

      onMouseLeave = () => {
        hoveredId = null;
        mouseNDC.set(-10, -10);
      };
      canvas.addEventListener('mouseleave', onMouseLeave);
      canvas.style.cursor = 'default';

      onCanvasClick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const ndc = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -(((e.clientY - rect.top) / rect.height) * 2 - 1)
        );
        raycaster.setFromCamera(ndc, camera);
        const hits = raycaster.intersectObjects(hubObjs.map(h => h.hit));
        if (hits.length) {
          setFocus(hits[0].object.userData.id);
        } else if (focusedId) {
          setFocus(null);
        }
      };
      canvas.addEventListener('click', onCanvasClick);

      if (backPill) {
        onBackPillClick = () => setFocus(null);
        backPill.addEventListener('click', onBackPillClick);
      }

      const LOCATION_ORDER = RAW.map(d => d.id);
      function stepLocation(delta) {
        const curIdx = focusedId ? LOCATION_ORDER.indexOf(focusedId) : -1;
        const nextIdx = curIdx < 0
          ? (delta > 0 ? 0 : LOCATION_ORDER.length - 1)
          : (curIdx + delta + LOCATION_ORDER.length) % LOCATION_ORDER.length;
        setFocus(LOCATION_ORDER[nextIdx]);
      }

      if (navPrev) {
        onNavPrevClick = () => stepLocation(-1);
        navPrev.addEventListener('click', onNavPrevClick);
      }
      if (navNext) {
        onNavNextClick = () => stepLocation(1);
        navNext.addEventListener('click', onNavNextClick);
      }

      handleScroll = () => {
        if (!stage) return;
        const rect = stage.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        const progress = 1 - Math.min(Math.max((rect.top + rect.height * 0.5) / (vh), 0), 1);
        scrollZoom = Math.min(Math.max(progress, 0), 1);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      /* ---------- 11. Animate ---------- */
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const dt = clock.getDelta();
        const elapsed = clock.elapsedTime;

        updateCamera(dt, elapsed);

        const activeId = hoveredId || focusedId;
        hubObjs.forEach(h => {
          const isActive = activeId === h.data.id;
          const pulse = 1 + Math.sin(elapsed * 2.2 + h.data.x) * 0.12;
          const boost = isActive ? 1.5 : 1;
          h.halo.scale.setScalar(1.1 * pulse * boost);
          h.halo.material.opacity = (isActive ? 0.85 : 0.5) * (0.75 + Math.sin(elapsed * 2.2 + h.data.x) * 0.25);
          h.core.scale.setScalar(isActive ? 1.35 : 1);
        });

        const activeSegs = activeId ? new Set(hub(activeId).segs) : null;
        routeMeshes.forEach((r, i) => {
          const on = !activeSegs || activeSegs.has(i);
          const targetOp = activeSegs ? (on ? 1 : 0.18) : r.baseOpacity;
          const targetGlow = activeSegs ? (on ? 0.28 : 0.05) : r.baseGlow;
          r.tube.material.opacity += (targetOp - r.tube.material.opacity) * 0.12;
          r.glow.material.opacity += (targetGlow - r.glow.material.opacity) * 0.12;
        });

        particles.forEach(p => {
          p.t += dt * p.speed;
          if (p.t > 1) p.t -= 1;
          const pos = p.curve.getPointAt(p.t);
          p.mesh.position.copy(pos);
          const pulse = 0.85 + Math.sin(elapsed * 4 + p.t * 10) * 0.15;
          p.mesh.scale.setScalar(pulse);
        });

        syncLabels();
        renderer.render(scene, camera);
      };

      handleResize();
      animate();
      stage.classList.remove('loading');
    };

    // Check if window.THREE CDN is fully loaded
    checkInterval = setInterval(() => {
      if (window.THREE) {
        clearInterval(checkInterval);
        initThreeD();
      }
    }, 100);

    return () => {
      clearInterval(checkInterval);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer) renderer.dispose();

      // Clean up event listeners
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseleave', onMouseLeave);
        canvas.removeEventListener('click', onCanvasClick);
      }
      
      const backPill = backPillRef.current;
      if (backPill) backPill.removeEventListener('click', onBackPillClick);
      
      const navPrev = navPrevRef.current;
      if (navPrev) navPrev.removeEventListener('click', onNavPrevClick);
      
      const navNext = navNextRef.current;
      if (navNext) navNext.removeEventListener('click', onNavNextClick);
    };
  }, []);

  return (
    <>
      <style>{`
        :root {
          --sky-top: #bfe3f7;
          --sky-mid: #dff0fa;
          --sky-horizon: #f3f7ee;
          --bg-void: #05080f;
          --bg-navy: #0a1220;
          --panel: #0c1526;
          --line: rgba(148,168,196,0.14);
          --text-primary: #e8edf5;
          --text-muted: #8fa1bd;
          --teal: #14b8a6;
          --emerald: #22c58d;
          --cyan: #38d9e8;
        }

        #rydeon-stage {
          position: relative;
          width: 100%;
          height: 480px;
          border-radius: 1rem;
          background:
            radial-gradient(ellipse 120% 55% at 50% 0%, #fdf6e3 0%, transparent 45%),
            linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 45%, var(--sky-horizon) 100%);
          overflow: hidden;
        }

        #rydeon-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        .stage-frame {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
        }

        .stage-eyebrow {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-primary);
          pointer-events: auto;
          background: rgba(9, 16, 28, 0.65);
          border: 1px solid rgba(148, 168, 196, 0.2);
          border-radius: 999px;
          padding: 6px 12px;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        .stage-eyebrow .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 8px 2px rgba(56, 217, 232, 0.7);
          animation: blink 2.4s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        .stage-legend {
          position: absolute;
          bottom: 20px;
          left: 20px;
          display: flex;
          gap: 12px;
          pointer-events: auto;
          font-size: 10px;
          color: var(--text-primary);
          background: rgba(9, 16, 28, 0.65);
          border: 1px solid rgba(148, 168, 196, 0.2);
          border-radius: 999px;
          padding: 8px 14px;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        .stage-legend .item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stage-legend .swatch {
          width: 10px;
          height: 3px;
          border-radius: 2px;
        }

        .stage-hint {
          position: absolute;
          bottom: 20px;
          right: 20px;
          font-size: 10px;
          color: var(--text-primary);
          opacity: 0.75;
          letter-spacing: 0.04em;
          pointer-events: none;
          text-align: right;
          background: rgba(9, 16, 28, 0.55);
          border: 1px solid rgba(148, 168, 196, 0.15);
          border-radius: 999px;
          padding: 6px 12px;
        }

        .back-pill {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(10, 18, 32, 0.85);
          border: 1px solid rgba(56, 217, 232, 0.4);
          border-radius: 999px;
          color: var(--text-primary);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          pointer-events: auto;
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 0.3s ease, transform 0.3s ease, border-color 0.2s ease;
        }

        .back-pill:hover {
          border-color: rgba(56, 217, 232, 0.75);
        }

        .back-pill.show {
          opacity: 1;
          transform: translateY(0);
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(10, 18, 32, 0.65);
          border: 1px solid rgba(148, 168, 196, 0.25);
          color: var(--text-primary);
          cursor: pointer;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 7;
          pointer-events: auto;
          opacity: 0.55;
          transition: opacity 0.25s ease, border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
        }

        .nav-arrow--left { left: 12px; }
        .nav-arrow--right { right: 12px; }

        .nav-arrow:hover {
          opacity: 1;
          border-color: rgba(56, 217, 232, 0.65);
          background: rgba(10, 18, 32, 0.8);
        }

        .nav-arrow:active {
          transform: translateY(-50%) scale(0.92);
        }

        #rydeon-stage:hover .nav-arrow {
          opacity: 0.85;
        }

        @media (max-width: 680px) {
          #rydeon-stage {
            height: 380px;
          }
          .stage-eyebrow {
            top: 12px;
            left: 12px;
            font-size: 8px;
            padding: 5px 10px;
            max-width: 60vw;
          }
          .stage-legend {
            left: 12px;
            right: 12px;
            bottom: 12px;
            width: calc(100% - 24px);
            justify-content: space-between;
            gap: 6px;
            padding: 6px 12px;
            font-size: 8.5px;
          }
          .stage-hint {
            display: none;
          }
          .back-pill {
            top: 12px;
            right: 12px;
            padding: 5px 10px;
            font-size: 9.5px;
          }
          .nav-arrow {
            width: 34px;
            height: 34px;
          }
          .nav-arrow--left { left: 6px; }
          .nav-arrow--right { right: 6px; }
        }

        /* --- floating labels --- */
        .loc-label {
          position: absolute;
          transform: translate(-50%, -100%);
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 8px 5px 6px;
          background: rgba(10, 18, 32, 0.72);
          border: 1px solid rgba(148, 168, 196, 0.2);
          border-radius: 6px;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          font-size: 10px;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
          transition: opacity 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
          z-index: 6;
        }

        .loc-label .ic {
          width: 12px;
          height: 12px;
          flex: none;
          opacity: 0.9;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loc-label .ic svg {
          width: 100%;
          height: 100%;
        }

        .loc-label.dim {
          opacity: 0.35;
        }

        .loc-label.active {
          border-color: rgba(56, 217, 232, 0.55);
          box-shadow: 0 3px 12px rgba(56, 217, 232, 0.25);
        }

        /* --- tooltip --- */
        .loc-tooltip {
          position: absolute;
          transform: translate(-50%, -100%);
          background: rgba(8, 14, 26, 0.95);
          border: 1px solid rgba(56, 217, 232, 0.45);
          border-radius: 8px;
          padding: 8px 12px;
          min-width: 130px;
          pointer-events: none;
          z-index: 20;
          opacity: 0;
          transition: opacity 0.18s ease, transform 0.18s ease;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        }

        .loc-tooltip.show {
          opacity: 1;
        }

        .loc-tooltip .name {
          font-size: 11.5px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .loc-tooltip .meta {
          font-size: 10px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .loc-tooltip .meta .pulse-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--emerald);
          box-shadow: 0 0 6px 1px rgba(34, 197, 141, 0.8);
        }

        #rydeon-stage.loading #rydeon-canvas {
          opacity: 0;
        }

        #rydeon-stage #rydeon-canvas {
          opacity: 1;
          transition: opacity 1s ease;
        }
      `}</style>

      <section ref={stageRef} id="rydeon-stage" className="loading">
        <canvas ref={canvasRef} id="rydeon-canvas"></canvas>

        <div className="stage-frame">
          <div className="stage-eyebrow">
            <span className="dot"></span>
            Rydeon Live Network — Pune
          </div>

          <div className="stage-legend">
            <div className="item">
              <span className="swatch" style={{ background: 'var(--teal)', boxShadow: '0 0 6px rgba(20,184,166,0.7)' }}></span>
              Campus Line
            </div>
            <div className="item">
              <span className="swatch" style={{ background: 'var(--emerald)', boxShadow: '0 0 6px rgba(34,197,141,0.7)' }}></span>
              City Line
            </div>
            <div className="item">
              <span className="swatch" style={{ background: 'var(--cyan)', boxShadow: '0 0 6px rgba(56,217,232,0.7)' }}></span>
              Metro Link
            </div>
          </div>

          <div ref={stageHintRef} className="stage-hint" id="stageHint">
            Click a node to focus · Scroll to zoom
          </div>

          <button ref={backPillRef} className="back-pill" id="backPill" type="button">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to network view
          </button>
        </div>

        <button ref={navPrevRef} className="nav-arrow nav-arrow--left" id="navPrev" type="button" aria-label="Previous location">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        
        <button ref={navNextRef} className="nav-arrow nav-arrow--right" id="navNext" type="button" aria-label="Next location">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div ref={labelLayerRef} id="labelLayer"></div>
        
        <div ref={tooltipRef} id="tooltip" className="loc-tooltip">
          <div ref={ttNameRef} className="name" id="ttName">—</div>
          <div className="meta">
            <span className="pulse-dot"></span>
            <span ref={ttMetaRef} id="ttMeta">—</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default ThreeDModel;
