/**
 * VOXSTOCK Interactive 3D Presentation Engine
 * Team TRIVOX — Grade 12 James Gosling
 * Philippine Startup Challenge XI
 */

// Global State
const PresentationState = {
  currentSlide: 0,
  totalSlides: 12,
  isTransitioning: false,
  audioEnabled: false,
  audioContext: null,
  rainGainNode: null,
  isOverviewOpen: false,
  isNotesOpen: false,
  isVoiceDemoOpen: false
};

// Speaker Notes Data
const SPEAKER_NOTES = [
  // Slide 1
  `<strong>Slide 1 — Title Pitch:</strong><br>
  Good day, honorable judges of Philippine Startup Challenge XI! We are Team TRIVOX from Grade 12 James Gosling.<br>
  Today, we proudly introduce <strong>VOXSTOCK</strong> — an AI-powered inventory management platform driven by native Philippine voice recognition. Our mission is simple: <em>"Speak. Track. Manage. Effortlessly."</em>`,

  // Slide 2
  `<strong>Slide 2 — Executive Summary:</strong><br>
  Highlight the pain point: 68% of Filipino SMEs lose ₱2.3B annually due to pen-and-paper tracking errors and stockouts.<br>
  VOXSTOCK solves this with zero learning curve. Store owners don't type or scan barcodes; they just speak naturally in Tagalog, Cebuano, or English, achieving 97.4% NLP accuracy.`,

  // Slide 3
  `<strong>Slide 3 — Background of Problem:</strong><br>
  There are 1.1 million MSMEs in the Philippines. Workers spend 4.2 hours every single day manually counting and reconciling goods.<br>
  Post-pandemic supply volatility demands real-time inventory, yet enterprise ERPs like SAP cost over ₱100k/yr. Micro-merchants have been completely left behind.`,

  // Slide 4
  `<strong>Slide 4 — Proposed Solution:</strong><br>
  Explain our 3 core modules:
  1. Voice Command Engine (Tagalog, Cebuano, English NLP)
  2. AI Forecasting Dashboard (predicts stockouts before they happen)
  3. Real-Time Sync Hub (POS, Shopee, Lazada, GCash).<br>
  Directly aligns with UN SDG 9 (Infrastructure & Innovation) and SDG 12 (Reducing Waste).`,

  // Slide 5
  `<strong>Slide 5 — Strategic Objectives:</strong><br>
  Walk through our 5 core measurable targets:
  - Year 1: 500 onboarded MSMEs
  - Month 6: 97%+ NLP accuracy benchmark
  - Year 1: 40% reduction in inventory discrepancies & 60% faster processing
  - Year 3: ASEAN expansion into 3 neighboring markets.`,

  // Slide 6
  `<strong>Slide 6 — Target Market:</strong><br>
  Primary: Sari-sari stores, medium warehouses, and F&B commissaries.<br>
  Secondary: Barangay health centers (medicine stock) and agri-coops.<br>
  TAM is ₱8.7B, SAM is ₱1.2B, and our SOM target for Years 1–3 is ₱120M.`,

  // Slide 7
  `<strong>Slide 7 — Value Proposition:</strong><br>
  Compare VOXSTOCK vs. Traditional tools:
  - Setup: <24h vs. 4 weeks
  - Cost: ₱499/mo vs. ₱50k
  - Hands-free voice input vs. tedious typing
  - Built-in edge AI caching for offline reliability.`,

  // Slide 8
  `<strong>Slide 8 — Business Model:</strong><br>
  Three revenue engines:
  1. Freemium SaaS (Free, Pro ₱499/mo, Enterprise ₱2,499/mo)
  2. B2B API Licensing for logistics
  3. Anonymized FMCG consumption data insights.<br>
  Break-even achieved at Month 18 with 1,200 paying subscribers.`,

  // Slide 9
  `<strong>Slide 9 — Market Analysis:</strong><br>
  The global inventory market is expanding to $5.8B by 2029, while Philippine SaaS is surging at 22% CAGR. Voice commerce is hitting $40B.<br>
  Competitors like Peddlr and Loyverse lack voice AI. VOXSTOCK owns the voice-first MSME sweet spot.`,

  // Slide 10
  `<strong>Slide 10 — Operations Plan:</strong><br>
  Explain the phased rollout (Months 1–6 MVP pilot with 50 stores in NCR, Months 7–12 DTI scale, Year 2–3 ASEAN expansion).<br>
  Highlight the founding team synergy: Azhley (Lead/Strategy), Breian (AI/Voice), and Dref (Full-Stack/UX).`,

  // Slide 11
  `<strong>Slide 11 — Financial Ask:</strong><br>
  We are raising ₱5,000,000 Seed Capital: 30% AI NLP training, 20% Cloud compute, 24% Engineering salaries, 16% Merchant onboarding, 6% Legal, 4% Buffer.<br>
  Projected revenue grows from ₱3.6M (Year 1) to ₱28M (Year 3) with a 3.2x ROI.`,

  // Slide 12
  `<strong>Slide 12 — Closing Pitch:</strong><br>
  Thank the Philippine Startup Challenge XI judges and organizers!<br>
  Reiterate: <em>"Hindi mo na kailangang mag-type. Magsalita ka lang."</em><br>
  Open the floor for questions and invite judges to test the live voice AI demo!`,
];

// Slide Titles for Overview Modal
const SLIDE_TITLES = [
  "Title & Team Introduction",
  "I. Executive Summary",
  "II. Background of Problem",
  "III. Proposed Startup Solution",
  "IV. Strategic Objectives",
  "V. Target Market & Beneficiaries",
  "VI. Value Proposition Matrix",
  "VII. Business Model & Pricing",
  "VIII. Market & Competitive Analysis",
  "IX. Operations Plan & Roadmap",
  "X. Financial Ask & Projections",
  "Closing & Grand Pitch"
];

/* ==========================================================================
   Three.js 3D Background & Slide-Specific Scene Visualizer
   ========================================================================== */
class Presentation3DScene {
  constructor() {
    this.canvas = document.getElementById("webgl-canvas");
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.rainParticles = null;
    this.rainCount = 1400;
    this.fogPlanes = [];
    this.slideObjects = [];
    this.currentSlideObj = null;
    this.sunBeamGroup = null;
    this.clock = new THREE.Clock();
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x12141a, 0.022);

    // 2. Camera setup
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 18);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // 4. Lighting
    this.setupLighting();

    // 5. Ambient Fog & Rain Particle System
    this.createRainSystem();
    this.createVolumetricFogPlanes();

    // 6. Build 12 Distinct Slide 3D Objects
    this.buildSlideObjects();

    // 7. Event listeners
    window.addEventListener("resize", () => this.onWindowResize());
    window.addEventListener("mousemove", (e) => this.onMouseMove(e));

    // 8. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0x8e9aaf, 0.7);
    this.scene.add(this.ambientLight);

    // Key directional light with soft blue tint
    this.dirLight = new THREE.DirectionalLight(0xb0bec5, 1.2);
    this.dirLight.position.set(10, 20, 15);
    this.scene.add(this.dirLight);

    // Cyan glowing point light (representing AI/technology core)
    this.cyanPointLight = new THREE.PointLight(0x5dade2, 2.5, 30);
    this.cyanPointLight.position.set(0, 0, 5);
    this.scene.add(this.cyanPointLight);

    // Purple soft rim light
    this.purpleRimLight = new THREE.PointLight(0xa29bfe, 1.5, 25);
    this.purpleRimLight.position.set(-8, -5, 2);
    this.scene.add(this.purpleRimLight);
  }

  createRainSystem() {
    const rainGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.rainCount * 3);
    const velocities = new Float32Array(this.rainCount);

    for (let i = 0; i < this.rainCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45; // x
      positions[i * 3 + 1] = Math.random() * 30 - 10; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 35; // z
      velocities[i] = 0.15 + Math.random() * 0.25;
    }

    rainGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Particle texture canvas for realistic soft raindrop streak
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(8, 0, 8, 64);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.5, "rgba(176,190,197,0.7)");
    grad.addColorStop(1, "rgba(255,255,255,0.95)");
    ctx.fillStyle = grad;
    ctx.fillRect(6, 0, 4, 64);

    const rainTexture = new THREE.CanvasTexture(canvas);

    const rainMat = new THREE.PointsMaterial({
      size: 0.65,
      map: rainTexture,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.rainParticles = new THREE.Points(rainGeo, rainMat);
    this.rainVelocities = velocities;
    this.scene.add(this.rainParticles);
  }

  createVolumetricFogPlanes() {
    // Drifting horizontal atmospheric fog layers
    const fogGroup = new THREE.Group();
    const planeGeo = new THREE.PlaneGeometry(60, 40);

    // Procedural noise cloud texture
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    const radGrad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    radGrad.addColorStop(0, "rgba(142, 154, 175, 0.25)");
    radGrad.addColorStop(0.5, "rgba(42, 45, 52, 0.12)");
    radGrad.addColorStop(1, "rgba(18, 20, 26, 0)");
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 256, 256);

    const fogTex = new THREE.CanvasTexture(canvas);

    for (let i = 0; i < 4; i++) {
      const fogMat = new THREE.MeshBasicMaterial({
        map: fogTex,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        blending: THREE.NormalBlending,
        side: THREE.DoubleSide
      });
      const fogMesh = new THREE.Mesh(planeGeo, fogMat);
      fogMesh.position.set((i - 1.5) * 12, (i - 1.5) * 4, -5 - i * 4);
      fogMesh.rotation.z = i * 0.4;
      fogGroup.add(fogMesh);
      this.fogPlanes.push(fogMesh);
    }

    this.scene.add(fogGroup);
  }

  buildSlideObjects() {
    this.slideObjectsContainer = new THREE.Group();
    this.scene.add(this.slideObjectsContainer);

    // ==========================================
    // 0. Slide 1 (Title): Futuristic Holographic Gyro Core
    // ==========================================
    const obj0 = new THREE.Group();
    const torusKnotGeo = new THREE.TorusKnotGeometry(2.2, 0.4, 100, 16);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x5dade2,
      emissive: 0x1b3b55,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true
    });
    const knotMesh = new THREE.Mesh(torusKnotGeo, torusMat);
    obj0.add(knotMesh);

    // Outer gyro rings
    const ringGeo = new THREE.TorusGeometry(3.6, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x81ecec, transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    const ring2 = ring1.clone();
    ring2.rotation.x = Math.PI / 2;
    obj0.add(ring1);
    obj0.add(ring2);
    obj0.knot = knotMesh;
    obj0.ring1 = ring1;
    obj0.ring2 = ring2;
    this.slideObjects.push(obj0);

    // ==========================================
    // 1. Slide 2 (Summary): Pulsing Energy Sphere with Aura Shells
    // ==========================================
    const obj1 = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(2.0, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x5dade2,
      emissive: 0x2980b9,
      roughness: 0.1,
      metalness: 0.9,
      wireframe: false
    });
    const mainSphere = new THREE.Mesh(sphereGeo, sphereMat);
    obj1.add(mainSphere);

    // Translucent pulse shell
    const shellGeo = new THREE.SphereGeometry(2.6, 24, 24);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x81ecec,
      transparent: true,
      opacity: 0.25,
      wireframe: true
    });
    const pulseShell = new THREE.Mesh(shellGeo, shellMat);
    obj1.add(pulseShell);
    obj1.mainSphere = mainSphere;
    obj1.pulseShell = pulseShell;
    this.slideObjects.push(obj1);

    // ==========================================
    // 2. Slide 3 (Problem): Shattered Glass Crystal Shards Floating
    // ==========================================
    const obj2 = new THREE.Group();
    obj2.shards = [];
    const shardGeo = new THREE.TetrahedronGeometry(0.8, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0xe74c3c,
      emissive: 0x4a1510,
      roughness: 0.1,
      metalness: 0.7,
      transparent: true,
      opacity: 0.85
    });

    for (let i = 0; i < 28; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      shard.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 5
      );
      shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      shard.scale.setScalar(0.4 + Math.random() * 0.9);
      shard.userData = {
        origX: shard.position.x,
        origY: shard.position.y,
        origZ: shard.position.z,
        rotSpeed: 0.01 + Math.random() * 0.02
      };
      obj2.add(shard);
      obj2.shards.push(shard);
    }
    this.slideObjects.push(obj2);

    // ==========================================
    // 3. Slide 4 (Solution): Voice Soundwave Audio Spectrum Ribbon
    // ==========================================
    const obj3 = new THREE.Group();
    const waveCount = 42;
    obj3.waveBars = [];
    const barGeo = new THREE.BoxGeometry(0.18, 1, 0.18);

    for (let i = 0; i < waveCount; i++) {
      const t = i / waveCount;
      const barMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.5 + t * 0.15, 0.8, 0.6),
        emissive: 0x1b3b55,
        roughness: 0.3
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set((i - waveCount / 2) * 0.28, 0, 0);
      obj3.add(bar);
      obj3.waveBars.push(bar);
    }
    this.slideObjects.push(obj3);

    // ==========================================
    // 4. Slide 5 (Objectives): Ascending Target Milestone Discs
    // ==========================================
    const obj4 = new THREE.Group();
    obj4.discs = [];
    for (let i = 0; i < 5; i++) {
      const discGeo = new THREE.CylinderGeometry(0.8 - i * 0.08, 0.8 - i * 0.08, 0.12, 32);
      const discMat = new THREE.MeshStandardMaterial({
        color: 0x48c78e,
        emissive: 0x145a32,
        roughness: 0.2,
        metalness: 0.6
      });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.position.set((i - 2) * 2.0, (i - 2) * 0.8, 0);
      disc.rotation.x = 0.4;
      disc.rotation.y = 0.2;
      obj4.add(disc);
      obj4.discs.push(disc);
    }
    this.slideObjects.push(obj4);

    // ==========================================
    // 5. Slide 6 (Target Market): Interconnected 3D Node Network
    // ==========================================
    const obj5 = new THREE.Group();
    obj5.nodes = [];
    const nodeGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x5dade2,
      emissive: 0x2980b9,
      roughness: 0.2
    });

    const nodePositions = [];
    for (let i = 0; i < 22; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4
      );
      node.position.copy(pos);
      obj5.add(node);
      obj5.nodes.push(node);
      nodePositions.push(pos);
    }

    // Connect nodes with line segments
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x81ecec,
      transparent: true,
      opacity: 0.35
    });
    const lineGeo = new THREE.BufferGeometry();
    const lineCoords = [];

    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 3.2) {
          lineCoords.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
          lineCoords.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        }
      }
    }
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(lineCoords, 3));
    const networkLines = new THREE.LineSegments(lineGeo, lineMat);
    obj5.add(networkLines);
    this.slideObjects.push(obj5);

    // ==========================================
    // 6. Slide 7 (Value Prop): Comparison Skyscraper Towers
    // ==========================================
    const obj6 = new THREE.Group();
    // Tower 1 (Traditional - Heavy, Red/Grey)
    const t1Geo = new THREE.BoxGeometry(1.6, 2.5, 1.6);
    const t1Mat = new THREE.MeshStandardMaterial({
      color: 0x7f8c8d,
      roughness: 0.9,
      metalness: 0.1
    });
    const tower1 = new THREE.Mesh(t1Geo, t1Mat);
    tower1.position.set(-2.2, -0.8, 0);
    obj6.add(tower1);

    // Tower 2 (VOXSTOCK - Sleek, Glowing Cyan)
    const t2Geo = new THREE.BoxGeometry(1.6, 5.0, 1.6);
    const t2Mat = new THREE.MeshStandardMaterial({
      color: 0x5dade2,
      emissive: 0x1b3b55,
      roughness: 0.1,
      metalness: 0.9,
      wireframe: false
    });
    const tower2 = new THREE.Mesh(t2Geo, t2Mat);
    tower2.position.set(2.2, 0.4, 0);
    obj6.add(tower2);
    obj6.tower1 = tower1;
    obj6.tower2 = tower2;
    this.slideObjects.push(obj6);

    // ==========================================
    // 7. Slide 8 (Business Model): Orbiting Currency/Ecosystem Rings
    // ==========================================
    const obj7 = new THREE.Group();
    const centralSphereGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const centralMat = new THREE.MeshStandardMaterial({
      color: 0xa29bfe,
      emissive: 0x3d3570,
      roughness: 0.2,
      metalness: 0.8
    });
    const core = new THREE.Mesh(centralSphereGeo, centralMat);
    obj7.add(core);

    // 3 Orbiting Satellites
    obj7.satellites = [];
    for (let i = 0; i < 3; i++) {
      const satGeo = new THREE.OctahedronGeometry(0.5, 0);
      const satMat = new THREE.MeshStandardMaterial({
        color: 0x5dade2,
        emissive: 0x1b3b55,
        metalness: 0.8
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      obj7.add(sat);
      obj7.satellites.push(sat);
    }
    this.slideObjects.push(obj7);

    // ==========================================
    // 8. Slide 9 (Market Analysis): 3D Rising Bar Chart Columns
    // ==========================================
    const obj8 = new THREE.Group();
    obj8.bars = [];
    const heights = [1.2, 2.0, 3.2, 4.6, 6.2];
    for (let i = 0; i < heights.length; i++) {
      const bGeo = new THREE.BoxGeometry(0.7, heights[i], 0.7);
      const bMat = new THREE.MeshStandardMaterial({
        color: 0x5dade2,
        emissive: 0x154360,
        roughness: 0.2,
        metalness: 0.8
      });
      const bar = new THREE.Mesh(bGeo, bMat);
      bar.position.set((i - 2) * 1.3, heights[i] / 2 - 2.5, 0);
      obj8.add(bar);
      obj8.bars.push(bar);
    }
    this.slideObjects.push(obj8);

    // ==========================================
    // 9. Slide 10 (Operations Plan): 3D Glowing Roadmap Highway
    // ==========================================
    const obj9 = new THREE.Group();
    const roadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6, -2, -3),
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(2, 1, 2),
      new THREE.Vector3(6, 2.5, 0)
    ]);
    const tubeGeo = new THREE.TubeGeometry(roadCurve, 64, 0.25, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x5dade2,
      emissive: 0x1b3b55,
      metalness: 0.8
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    obj9.add(tubeMesh);

    // 3 Milestone Beacons
    obj9.beacons = [];
    const beaconPts = roadCurve.getPoints(3);
    for (let i = 0; i < beaconPts.length; i++) {
      const bGeo = new THREE.SphereGeometry(0.4, 16, 16);
      const bMat = new THREE.MeshStandardMaterial({
        color: 0x48c78e,
        emissive: 0x145a32
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.copy(beaconPts[i]);
      obj9.add(bMesh);
      obj9.beacons.push(bMesh);
    }
    this.slideObjects.push(obj9);

    // ==========================================
    // 10. Slide 11 (Financials): 3D Segmented Donut Slices
    // ==========================================
    const obj10 = new THREE.Group();
    obj10.slices = [];
    const sliceColors = [0x5dade2, 0x48c78e, 0xa29bfe, 0xf39c12, 0xe74c3c, 0xf1c40f];
    for (let i = 0; i < 6; i++) {
      const arc = (Math.PI * 2) / 6;
      const sGeo = new THREE.TorusGeometry(2.0, 0.45, 16, 16, arc * 0.92);
      const sMat = new THREE.MeshStandardMaterial({
        color: sliceColors[i],
        emissive: 0x152238,
        roughness: 0.2,
        metalness: 0.7
      });
      const slice = new THREE.Mesh(sGeo, sMat);
      slice.rotation.z = i * arc;
      obj10.add(slice);
      obj10.slices.push(slice);
    }
    this.slideObjects.push(obj10);

    // ==========================================
    // 11. Slide 12 (Closing): Golden Sunburst Rays & Victory Trophy
    // ==========================================
    const obj11 = new THREE.Group();
    const starGeo = new THREE.DodecahedronGeometry(2.2, 1);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xf1c40f,
      emissive: 0x7d6608,
      roughness: 0.1,
      metalness: 0.9
    });
    const starMesh = new THREE.Mesh(starGeo, starMat);
    obj11.add(starMesh);

    // Sunburst god-ray beams
    const rayGroup = new THREE.Group();
    const rayGeo = new THREE.CylinderGeometry(0.04, 0.6, 12, 8);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xffeaa7,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < 12; i++) {
      const ray = new THREE.Mesh(rayGeo, rayMat);
      ray.position.set(0, 0, 0);
      ray.rotation.z = (i / 12) * Math.PI * 2;
      rayGroup.add(ray);
    }
    obj11.add(rayGroup);
    obj11.starMesh = starMesh;
    obj11.rayGroup = rayGroup;
    this.sunBeamGroup = rayGroup;
    this.slideObjects.push(obj11);

    // Hide all objects initially except slide 0
    this.slideObjects.forEach((obj, idx) => {
      obj.visible = idx === 0;
      obj.position.set(4.5, 0, -2); // Positioned slightly to the right of text
      obj.scale.setScalar(0.9);
      this.slideObjectsContainer.add(obj);
    });

    this.currentSlideObj = this.slideObjects[0];
  }

  transitionToSlide(slideIndex) {
    if (!this.slideObjects[slideIndex]) return;

    const oldObj = this.currentSlideObj;
    const newObj = this.slideObjects[slideIndex];

    // Animate out old object
    if (oldObj && oldObj !== newObj) {
      gsap.to(oldObj.scale, {
        x: 0.001,
        y: 0.001,
        z: 0.001,
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => {
          oldObj.visible = false;
        }
      });
    }

    // Animate in new object
    newObj.visible = true;
    newObj.scale.set(0.001, 0.001, 0.001);
    gsap.to(newObj.scale, {
      x: 0.9,
      y: 0.9,
      z: 0.9,
      duration: 0.7,
      delay: 0.2,
      ease: "back.out(1.4)"
    });

    this.currentSlideObj = newObj;

    // Special scene lighting effects per slide
    if (slideIndex === 11) {
      // Closing slide: Clear rain, brighten golden sun
      gsap.to(this.rainParticles.material, { opacity: 0.05, duration: 1.2 });
      gsap.to(this.dirLight, { intensity: 2.2, duration: 1.2 });
      gsap.to(this.ambientLight.color, { r: 1.0, g: 0.95, b: 0.8, duration: 1.2 });
    } else {
      // Standard moody rainy scene
      gsap.to(this.rainParticles.material, { opacity: 0.55, duration: 0.8 });
      gsap.to(this.dirLight, { intensity: 1.2, duration: 0.8 });
      gsap.to(this.ambientLight.color, { r: 0.55, g: 0.6, b: 0.68, duration: 0.8 });
    }
  }

  onMouseMove(e) {
    this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth mouse parallax
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    this.camera.position.x = this.mouseX * 0.8;
    this.camera.position.y = -this.mouseY * 0.6;
    this.camera.lookAt(0, 0, 0);

    // 1. Update Rain Particles
    if (this.rainParticles) {
      const positions = this.rainParticles.geometry.attributes.position.array;
      for (let i = 0; i < this.rainCount; i++) {
        positions[i * 3 + 1] -= this.rainVelocities[i]; // drop down
        // Recycle rain if below floor
        if (positions[i * 3 + 1] < -12) {
          positions[i * 3 + 1] = 18;
          positions[i * 3] = (Math.random() - 0.5) * 45;
        }
      }
      this.rainParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 2. Drift Fog Planes
    this.fogPlanes.forEach((fog, i) => {
      fog.position.x += Math.sin(elapsedTime * 0.2 + i) * 0.008;
      fog.rotation.z += 0.0003 * (i % 2 === 0 ? 1 : -1);
    });

    // 3. Animate Current Slide Object
    if (this.currentSlideObj && this.currentSlideObj.visible) {
      this.currentSlideObj.rotation.y += 0.008;

      // Object specific micro-animations
      if (this.currentSlideObj.knot) {
        this.currentSlideObj.knot.rotation.x += 0.005;
        this.currentSlideObj.ring1.rotation.z += 0.01;
        this.currentSlideObj.ring2.rotation.y += 0.012;
      }

      if (this.currentSlideObj.pulseShell) {
        const pulse = 1 + Math.sin(elapsedTime * 3) * 0.08;
        this.currentSlideObj.pulseShell.scale.setScalar(pulse);
      }

      if (this.currentSlideObj.shards) {
        this.currentSlideObj.shards.forEach((shard, idx) => {
          shard.rotation.x += shard.userData.rotSpeed;
          shard.rotation.y += shard.userData.rotSpeed;
          shard.position.y = shard.userData.origY + Math.sin(elapsedTime * 2 + idx) * 0.2;
        });
      }

      if (this.currentSlideObj.waveBars) {
        this.currentSlideObj.waveBars.forEach((bar, idx) => {
          const waveHeight = 0.5 + Math.abs(Math.sin(elapsedTime * 4 + idx * 0.25)) * 2.8;
          bar.scale.y = waveHeight;
        });
      }

      if (this.currentSlideObj.satellites) {
        this.currentSlideObj.satellites.forEach((sat, idx) => {
          const angle = elapsedTime * 1.5 + (idx * Math.PI * 2) / 3;
          sat.position.set(Math.cos(angle) * 3.2, Math.sin(angle * 0.8) * 1.5, Math.sin(angle) * 3.2);
          sat.rotation.y += 0.02;
        });
      }

      if (this.currentSlideObj.rayGroup) {
        this.currentSlideObj.rayGroup.rotation.z += 0.004;
        this.currentSlideObj.starMesh.rotation.y += 0.01;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

/* ==========================================================================
   Procedural Web Audio Rain Ambience Engine
   ========================================================================== */
class ProceduralRainAudio {
  constructor() {
    this.ctx = null;
    this.gainNode = null;
    this.noiseNode = null;
    this.isPlaying = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Master Gain
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    // Procedural Pink/White Noise Generator for soothing rain
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    // Filter to simulate soft raindrops hitting glass
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    this.noiseNode.connect(filter);
    filter.connect(this.gainNode);
    this.noiseNode.start(0);
  }

  toggle() {
    if (!this.ctx) {
      this.init();
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (!this.isPlaying) {
      this.gainNode.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 1.5);
      this.isPlaying = true;
      return true;
    } else {
      this.gainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
      this.isPlaying = false;
      return false;
    }
  }

  playChime() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15);
      g.gain.setValueAtTime(0.08, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {
      // Audio autoplay policy catch
    }
  }
}

/* ==========================================================================
   Voice Command NLP Simulator & Demo Sandbox
   ========================================================================== */
class VoiceDemoEngine {
  constructor() {
    this.inputField = document.getElementById("custom-voice-input");
    this.actionEl = document.getElementById("nlp-action");
    this.qtyEl = document.getElementById("nlp-quantity");
    this.prodEl = document.getElementById("nlp-product");
    this.dialectEl = document.getElementById("nlp-dialect");
    this.confEl = document.getElementById("nlp-confidence");
    this.inventoryLedger = document.getElementById("inventory-ledger");
    this.simStock = {
      sardinas: 150,
      milk: 45,
      rice: 28,
      oil: 82
    };

    this.init();
  }

  init() {
    const runBtn = document.getElementById("btn-run-voice-parse");
    if (runBtn) {
      runBtn.addEventListener("click", () => this.processCommand(this.inputField.value));
    }

    const commandChips = document.querySelectorAll(".command-chip");
    commandChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const cmd = chip.getAttribute("data-cmd");
        this.inputField.value = cmd;
        this.processCommand(cmd);
      });
    });
  }

  processCommand(rawText) {
    if (!rawText || rawText.trim() === "") return;
    const text = rawText.toLowerCase();

    let action = "QUERY_STOCK";
    let quantity = "1 Unit";
    let product = "General SKU";
    let dialect = "Philippine English";
    let confidence = 98.4;

    // Dialect Detection
    if (text.includes("magdagdag") || text.includes("natitirang") || text.includes("bawas") || text.includes("ilan")) {
      dialect = "Tagalog (Filipino)";
    } else if (text.includes("pagbawas") || text.includes("puno") || text.includes("sako nga bugas") || text.includes("dugang")) {
      dialect = "Cebuano (Bisaya)";
    }

    // Action Detection
    if (text.includes("dagdag") || text.includes("add") || text.includes("dugang") || text.includes("plus") || text.includes("receive")) {
      action = "ADD_STOCK";
    } else if (text.includes("bawas") || text.includes("deduct") || text.includes("minus") || text.includes("kuha") || text.includes("sold")) {
      action = "DEDUCT_STOCK";
    } else if (text.includes("check") || text.includes("ilan") || text.includes("pila") || text.includes("status")) {
      action = "QUERY_STOCK";
    }

    // Number extraction
    const numMatch = text.match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0]) : 10;

    // Product & Unit extraction
    if (text.includes("sardinas") || text.includes("sardine")) {
      product = "Canned Sardines (Mega / 555)";
      quantity = `${num} Cases`;
      if (action === "ADD_STOCK") this.simStock.sardinas += num;
      if (action === "DEDUCT_STOCK") this.simStock.sardinas = Math.max(0, this.simStock.sardinas - num);
    } else if (text.includes("milk") || text.includes("bear brand") || text.includes("gatas")) {
      product = "Bear Brand Powdered Milk 300g";
      quantity = `${num} Boxes`;
      if (action === "ADD_STOCK") this.simStock.milk += num;
      if (action === "DEDUCT_STOCK") this.simStock.milk = Math.max(0, this.simStock.milk - num);
    } else if (text.includes("bugas") || text.includes("rice") || text.includes("sinandomeng") || text.includes("bigas")) {
      product = "Premium Sinandomeng Rice 50kg";
      quantity = `${num} Sacks`;
      if (action === "ADD_STOCK") this.simStock.rice += num;
      if (action === "DEDUCT_STOCK") this.simStock.rice = Math.max(0, this.simStock.rice - num);
    } else if (text.includes("mantika") || text.includes("oil") || text.includes("lana")) {
      product = "Golden Fiesta Cooking Oil 1L";
      quantity = `${num} Bottles`;
      if (action === "ADD_STOCK") this.simStock.oil += num;
      if (action === "DEDUCT_STOCK") this.simStock.oil = Math.max(0, this.simStock.oil - num);
    } else {
      product = "Assorted Store Merchandise";
      quantity = `${num} Units`;
    }

    // UI Updates
    this.actionEl.textContent = action;
    this.actionEl.className = `cell-val ${action === "ADD_STOCK" ? "action-add" : action === "DEDUCT_STOCK" ? "red-text" : "cyan-text"}`;
    this.qtyEl.textContent = quantity;
    this.prodEl.textContent = product;
    this.dialectEl.textContent = dialect;
    this.confEl.textContent = `Confidence: ${(confidence + Math.random() * 1.4).toFixed(1)}%`;

    // Render Ledger
    this.inventoryLedger.innerHTML = `
      <span class="ledger-pill ${text.includes("sardinas") ? "active" : ""}">📦 Sardinas: <strong>${this.simStock.sardinas} cases</strong></span>
      <span class="ledger-pill ${text.includes("milk") ? "active" : ""}">🥛 Bear Brand Milk: <strong>${this.simStock.milk} boxes</strong></span>
      <span class="ledger-pill ${text.includes("bugas") || text.includes("rice") || text.includes("bigas") ? "active" : ""}">🌾 Sinandomeng Rice: <strong>${this.simStock.rice} sacks</strong></span>
      <span class="ledger-pill ${text.includes("mantika") || text.includes("oil") ? "active" : ""}">🍳 Cooking Oil: <strong>${this.simStock.oil} bottles</strong></span>
    `;

    // Animate output container
    gsap.fromTo("#nlp-output-box", 
      { scale: 0.98, boxShadow: "0 0 25px rgba(93, 173, 226, 0.6)" },
      { scale: 1, boxShadow: "0 0 10px rgba(93, 173, 226, 0.2)", duration: 0.4, ease: "power2.out" }
    );
  }
}

/* ==========================================================================
   Presentation Controller
   ========================================================================== */
class PresentationApp {
  constructor() {
    this.slides = document.querySelectorAll(".slide");
    this.dotsContainer = document.getElementById("slide-dots");
    this.progressBar = document.getElementById("top-progress-bar");
    this.currentNumEl = document.getElementById("current-slide-num");
    this.totalNumEl = document.getElementById("total-slide-num");
    this.overviewGrid = document.getElementById("overview-thumbnails-grid");
    this.notesContent = document.getElementById("speaker-notes-content");

    this.scene3D = new Presentation3DScene();
    this.audioEngine = new ProceduralRainAudio();
    this.voiceDemo = new VoiceDemoEngine();

    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    PresentationState.totalSlides = this.slides.length;
    this.totalNumEl.textContent = String(PresentationState.totalSlides).padStart(2, "0");

    this.buildSlideDots();
    this.buildOverviewGrid();
    this.bindEvents();
    this.goToSlide(0, false);
  }

  buildSlideDots() {
    this.dotsContainer.innerHTML = "";
    for (let i = 0; i < PresentationState.totalSlides; i++) {
      const dot = document.createElement("div");
      dot.className = `slide-dot ${i === 0 ? "active" : ""}`;
      dot.title = `Go to Slide ${i + 1}: ${SLIDE_TITLES[i] || ""}`;
      dot.addEventListener("click", () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
  }

  buildOverviewGrid() {
    this.overviewGrid.innerHTML = "";
    for (let i = 0; i < PresentationState.totalSlides; i++) {
      const card = document.createElement("div");
      card.className = `overview-card-thumb ${i === 0 ? "current" : ""}`;
      card.innerHTML = `
        <div class="thumb-num">SLIDE ${String(i + 1).padStart(2, "0")}</div>
        <div class="thumb-title">${SLIDE_TITLES[i] || "Slide " + (i + 1)}</div>
      `;
      card.addEventListener("click", () => {
        this.goToSlide(i);
        this.toggleOverviewModal(false);
      });
      this.overviewGrid.appendChild(card);
    }
  }

  bindEvents() {
    // Navigation Buttons
    document.getElementById("btn-prev").addEventListener("click", () => this.prevSlide());
    document.getElementById("btn-next").addEventListener("click", () => this.nextSlide());

    // Audio Toggle
    const audioBtn = document.getElementById("btn-audio-toggle");
    const audioLabel = document.getElementById("audio-btn-label");
    audioBtn.addEventListener("click", () => {
      const isPlaying = this.audioEngine.toggle();
      audioLabel.textContent = isPlaying ? "Rain Sound: ON" : "Rain Sound: OFF";
      audioBtn.classList.toggle("highlight", isPlaying);
    });

    // Overview Toggle
    document.getElementById("btn-overview-toggle").addEventListener("click", () => {
      this.toggleOverviewModal(true);
    });
    document.getElementById("btn-close-overview-modal").addEventListener("click", () => {
      this.toggleOverviewModal(false);
    });
    document.getElementById("overview-modal-backdrop").addEventListener("click", () => {
      this.toggleOverviewModal(false);
    });

    // Speaker Notes Toggle
    document.getElementById("btn-notes-toggle").addEventListener("click", () => {
      this.toggleSpeakerNotes();
    });
    document.getElementById("btn-close-notes").addEventListener("click", () => {
      this.toggleSpeakerNotes(false);
    });

    // Live Voice Demo Modal
    document.getElementById("btn-voice-demo").addEventListener("click", () => {
      this.toggleVoiceModal(true);
    });
    document.getElementById("btn-close-voice-modal").addEventListener("click", () => {
      this.toggleVoiceModal(false);
    });
    document.getElementById("voice-modal-backdrop").addEventListener("click", () => {
      this.toggleVoiceModal(false);
    });

    // Fullscreen Toggle
    document.getElementById("btn-fullscreen").addEventListener("click", () => {
      this.toggleFullscreen();
    });

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));

    // Touch Swipe Gestures for Tablet / Mobile
    window.addEventListener("touchstart", (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  }

  handleKeyDown(e) {
    // Disable slide keys if typing inside input
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    switch (e.key) {
      case "ArrowRight":
      case " ":
      case "PageDown":
        e.preventDefault();
        this.nextSlide();
        break;
      case "ArrowLeft":
      case "Backspace":
      case "PageUp":
        e.preventDefault();
        this.prevSlide();
        break;
      case "Home":
        e.preventDefault();
        this.goToSlide(0);
        break;
      case "End":
        e.preventDefault();
        this.goToSlide(PresentationState.totalSlides - 1);
        break;
      case "o":
      case "O":
        this.toggleOverviewModal();
        break;
      case "n":
      case "N":
        this.toggleSpeakerNotes();
        break;
      case "d":
      case "D":
        this.toggleVoiceModal();
        break;
      case "f":
      case "F":
        this.toggleFullscreen();
        break;
    }
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  nextSlide() {
    if (PresentationState.currentSlide < PresentationState.totalSlides - 1) {
      this.goToSlide(PresentationState.currentSlide + 1);
    }
  }

  prevSlide() {
    if (PresentationState.currentSlide > 0) {
      this.goToSlide(PresentationState.currentSlide - 1);
    }
  }

  goToSlide(targetIndex, animate = true) {
    if (targetIndex < 0 || targetIndex >= PresentationState.totalSlides) return;
    if (PresentationState.isTransitioning && animate) return;

    PresentationState.isTransitioning = true;
    const prevIndex = PresentationState.currentSlide;
    PresentationState.currentSlide = targetIndex;

    const currentSlideEl = this.slides[prevIndex];
    const targetSlideEl = this.slides[targetIndex];

    // Play subtle audio chime
    if (animate) {
      this.audioEngine.playChime();
    }

    // 1. Transition 3D Background Object
    this.scene3D.transitionToSlide(targetIndex);

    // 2. Animate Slides via GSAP
    if (animate && currentSlideEl !== targetSlideEl) {
      // Outgoing slide animation
      gsap.to(currentSlideEl, {
        opacity: 0,
        scale: 0.95,
        y: -15,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          currentSlideEl.classList.remove("active");
          targetSlideEl.classList.add("active");

          // Incoming slide animation
          gsap.fromTo(targetSlideEl,
            { opacity: 0, scale: 0.96, y: 20 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.55,
              ease: "power3.out",
              onComplete: () => {
                PresentationState.isTransitioning = false;
              }
            }
          );

          // Staggered animate cards inside incoming slide
          const cards = targetSlideEl.querySelectorAll(".animate-box");
          if (cards.length > 0) {
            gsap.fromTo(cards,
              { opacity: 0, y: 25 },
              { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
            );
          }
        }
      });
    } else {
      this.slides.forEach((s, idx) => {
        s.classList.toggle("active", idx === targetIndex);
      });
      PresentationState.isTransitioning = false;
    }

    // 3. Update HUD elements
    this.updateHUD(targetIndex);
  }

  updateHUD(index) {
    // Progress Bar
    const pct = ((index + 1) / PresentationState.totalSlides) * 100;
    this.progressBar.style.width = `${pct}%`;

    // Slide Counter
    this.currentNumEl.textContent = String(index + 1).padStart(2, "0");

    // Dot indicators
    const dots = this.dotsContainer.querySelectorAll(".slide-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === index);
    });

    // Overview thumbs
    const thumbs = this.overviewGrid.querySelectorAll(".overview-card-thumb");
    thumbs.forEach((th, idx) => {
      th.classList.toggle("current", idx === index);
    });

    // Speaker Notes Content
    if (this.notesContent) {
      this.notesContent.innerHTML = SPEAKER_NOTES[index] || "<p>No speaker notes for this slide.</p>";
    }
  }

  toggleOverviewModal(forceState) {
    const modal = document.getElementById("modal-overview");
    const open = forceState !== undefined ? forceState : !modal.classList.contains("open");
    modal.classList.toggle("open", open);
  }

  toggleVoiceModal(forceState) {
    const modal = document.getElementById("modal-voice-demo");
    const open = forceState !== undefined ? forceState : !modal.classList.contains("open");
    modal.classList.toggle("open", open);
  }

  toggleSpeakerNotes(forceState) {
    const drawer = document.getElementById("drawer-speaker-notes");
    const open = forceState !== undefined ? forceState : !drawer.classList.contains("open");
    drawer.classList.toggle("open", open);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
}

// Initialize Presentation on DOM Ready
window.addEventListener("DOMContentLoaded", () => {
  window.voxstockApp = new PresentationApp();
});
