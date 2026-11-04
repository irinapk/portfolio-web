import * as THREE from "three";

// Glass orb + orbit rings + dust + contact torus. Imperative three.js, owned by <Background3D/>.
const RING_DEFS = [
  { r: 1.75, rx: 1.22, rz: -0.28, speed: 0.12, color: 0x84e1ee },
  { r: 2.25, rx: 1.32, rz: 0.42, speed: -0.08, color: 0xb9a8e8 },
  { r: 2.8, rx: 1.12, rz: 0.05, speed: 0.05, color: 0x69d4e2 },
];

const RIM_VERTEX = `
varying vec3 vN; varying vec3 vV;
void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`;
const RIM_FRAGMENT = `
uniform float uOpacity; varying vec3 vN; varying vec3 vV;
void main(){ float f = pow(1. - abs(dot(vN, vV)), 2.6);
  vec3 c = mix(vec3(.82,.74,.96), vec3(.41,.83,.89), smoothstep(-.6,.7,vN.y));
  gl_FragColor = vec4(c*f*1.5, f*uOpacity); }`;

export class OrbScene {
  constructor(canvas) {
    const mobile = window.innerWidth <= 820;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    this.camera.position.set(0, 0, 9);
    this.scene.environment = this.#buildEnvironment();
    this.scene.add(new THREE.AmbientLight(0x406a70, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(-3, 4, 5);
    this.scene.add(key);

    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x1c6670, metalness: 0.15, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.03,
      envMapIntensity: 2.4, transparent: true, opacity: 0.62, depthWrite: false,
    });
    this.rimMaterial = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uOpacity: { value: 1 } }, vertexShader: RIM_VERTEX, fragmentShader: RIM_FRAGMENT,
    });

    // orb
    this.orb = new THREE.Group();
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), glass);
    sphere.renderOrder = 2;
    const rim = new THREE.Mesh(new THREE.SphereGeometry(1.005, 96, 64), this.rimMaterial);
    rim.renderOrder = 3;
    this.core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.5, 1),
      new THREE.MeshStandardMaterial({ color: 0x0b2a2f, emissive: 0x69d4e2, emissiveIntensity: 0.75, flatShading: true, metalness: 0.4, roughness: 0.3 }),
    );
    this.cage = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.78, 1)),
      new THREE.LineBasicMaterial({ color: 0xaef5ff, transparent: true, opacity: 0.35 }),
    );
    this.orb.add(sphere, rim, this.core, this.cage);
    this.scene.add(this.orb);

    // rings
    this.ringGroup = new THREE.Group();
    this.scene.add(this.ringGroup);
    this.rings = RING_DEFS.map((def, i) => {
      const group = new THREE.Group();
      group.rotation.set(def.rx, 0, def.rz);
      const material = new THREE.MeshBasicMaterial({ color: def.color, transparent: true, opacity: 0.6, depthWrite: false });
      group.add(new THREE.Mesh(new THREE.TorusGeometry(def.r, 0.006, 8, 256), material));
      const satellite = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), new THREE.MeshBasicMaterial({ color: 0xddfbff, transparent: true }));
      group.add(satellite);
      this.ringGroup.add(group);
      return { def, group, material, satellite, phase: i * 2.1 };
    });

    // dust
    const count = mobile ? 400 : 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 9, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      positions.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.6, r * Math.cos(ph) - 4], i * 3);
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({
      color: 0x84e1ee, size: 0.028, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.scene.add(this.dust);

    // contact: a big glass ring with a smaller companion ring at its top-right (drag either to rotate both)
    this.torusRim = this.rimMaterial.clone();
    this.torusRim.uniforms = { uOpacity: { value: 1 } };
    const torusGlass = glass.clone();
    torusGlass.color.set(0x2a8591);
    torusGlass.opacity = 0.72;
    torusGlass.depthWrite = true; // the two rings overlap, so they need proper depth sorting
    this.torus = new THREE.Group();
    const bigRing = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.4, 96, 256), torusGlass);
    const bigRim = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.402, 96, 256), this.torusRim);
    bigRim.renderOrder = 3;
    this.torus.add(bigRing, bigRim);
    this.scene.add(this.torus);
    this.torusRadius = 1.05 + 0.4; // outer extent of the big ring, for hit-testing

    // separate small ring: its own object (not a child of the big ring), so it never passes through it
    const smallGlass = torusGlass.clone();
    smallGlass.color.set(0x6b5a99);
    this.smallRing = new THREE.Group();
    const smallBody = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.17, 64, 192), smallGlass);
    const smallRim = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.172, 64, 192), this.torusRim);
    smallRim.renderOrder = 3;
    this.smallRing.add(smallBody, smallRim);
    this.scene.add(this.smallRing);
    this.smallOffset = new THREE.Vector3(1.55, 1.3, 0.3); // top-right of the big ring, in big-ring units
    this.smallRadius = 0.5 + 0.17;
    this.smallTilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.9, 0.6, 0.4));
    this.smallSpin = new THREE.Quaternion();
    this.smallAxis = new THREE.Vector3(0, 0, 1);

    // drag rotation state (world-space angular velocity in rad/s)
    this.spin = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.55, -0.5, 0));
    this.spinVel = new THREE.Vector2(0, 0);
    this.idleVel = new THREE.Vector2(0.08, 0.22);
    this.dragging = false;
    this.hover = 0;
    this.lastTime = 0;
    this.axisX = new THREE.Vector3(1, 0, 0);
    this.axisY = new THREE.Vector3(0, 1, 0);
    this.dq = new THREE.Quaternion();

    this.tmp = new THREE.Vector3();
    this.resize();
  }

  #buildEnvironment() {
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.MeshBasicMaterial({ color: 0x081012, side: THREE.BackSide })));
    const panel = (color, w, h, pos, k) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
      m.position.set(...pos);
      m.lookAt(0, 0, 0);
      env.add(m);
    };
    panel(0x69d4e2, 9, 9, [-9, 2, 5], 1.6);
    panel(0xd0bdf4, 7, 7, [9, -2, 4], 1.3);
    panel(0xffffff, 12, 1.4, [0, 10, 3], 3.2);
    panel(0x4eeaff, 5, 12, [3, 0, -10], 1.1);
    panel(0xe44c63, 1.6, 1.6, [-5, -7, 5], 1.6);
    const texture = pmrem.fromScene(env, 0.02).texture;
    pmrem.dispose();
    return texture;
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  /** Half the visible width/height of the z=0 plane, in world units. */
  viewport() {
    const hh = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.camera.position.z;
    return { hw: hh * this.camera.aspect, hh };
  }

  render(state, time, pointer, scrollY, reduce) {
    const { orb, ringGroup, rings, torus, core, cage, dust } = this;
    const tx = reduce ? 0 : pointer.x * 0.35, ty = reduce ? 0 : pointer.y * 0.25;
    const lerp = (a, b, t) => a + (b - a) * t;

    orb.visible = state.s > 0.015;
    orb.position.set(state.x, state.y, 0);
    orb.scale.setScalar(Math.max(0.0001, state.s));
    orb.rotation.y = lerp(orb.rotation.y, tx + time * 0.15, 0.05);
    orb.rotation.x = lerp(orb.rotation.x, ty, 0.05);
    core.rotation.set(time * 0.4, time * 0.3, 0);
    cage.rotation.set(-time * 0.2, time * 0.25, 0);

    ringGroup.visible = state.s * state.rings > 0.01;
    ringGroup.position.copy(orb.position);
    ringGroup.scale.setScalar(Math.max(0.0001, state.s * state.ringScale));
    ringGroup.rotation.x = lerp(ringGroup.rotation.x, ty * 0.6, 0.05);
    ringGroup.rotation.y = lerp(ringGroup.rotation.y, tx * 0.8, 0.05);
    rings.forEach((ring, i) => {
      const visible = i < 2 ? state.rings : state.rings * state.stack;
      const highlight = state.highlight === i ? 1.7 : state.highlight >= 0 ? 0.45 : 1;
      ring.material.opacity = 0.55 * visible * highlight;
      ring.satellite.material.opacity = visible;
      const a = (reduce ? 0 : time * ring.def.speed * 3) + ring.phase;
      ring.satellite.position.set(Math.cos(a) * ring.def.r, Math.sin(a) * ring.def.r, 0);
    });

    const dt = Math.min(0.1, Math.max(0, time - this.lastTime));
    this.lastTime = time;
    torus.visible = state.torus > 0.015;
    torus.position.set(state.tx, state.ty, 0);
    torus.scale.setScalar(Math.max(0.0001, state.torus));
    if (!this.dragging) {
      // momentum after a drag, easing back to a slow idle spin
      const idle = reduce ? 0 : 1;
      const ease = 1 - Math.exp(-dt * 1.6);
      this.spinVel.x += (this.idleVel.x * idle - this.spinVel.x) * ease;
      this.spinVel.y += (this.idleVel.y * idle - this.spinVel.y) * ease;
      this.#rotateBy(this.spinVel.y * dt, this.spinVel.x * dt);
    }
    torus.quaternion.copy(this.spin);
    // small ring: follows the same drag rotation around its own centre, plus a slow independent roll and bob
    const small = this.smallRing;
    small.visible = torus.visible;
    const bob = reduce ? 0 : Math.sin(time * 0.9) * 0.06;
    small.position.copy(torus.position).addScaledVector(this.smallOffset, torus.scale.x);
    small.position.y += bob * torus.scale.x;
    small.scale.copy(torus.scale);
    this.smallSpin.setFromAxisAngle(this.smallAxis, reduce ? 0 : time * 0.5);
    small.quaternion.copy(this.spin).multiply(this.smallTilt).multiply(this.smallSpin);
    this.hover += ((this.dragging ? 1.8 : this.hovering ? 1.45 : 1) - this.hover) * 0.12;
    this.torusRim.uniforms.uOpacity.value = this.hover;

    dust.rotation.y = time * 0.01 + tx * 0.1;
    dust.position.y = -scrollY * 0.0006;

    this.renderer.render(this.scene, this.camera);
    this.scene.updateMatrixWorld();
  }

  /** Screen position of a point on ring `ringIndex` at angle `a`, plus whether it is behind the orb. */
  projectOnRing(ringIndex, a) {
    const ring = this.rings[ringIndex];
    const v = this.tmp.set(Math.cos(a) * ring.def.r, Math.sin(a) * ring.def.r, 0).applyMatrix4(ring.group.matrixWorld);
    const behind = v.z < this.orb.position.z - 0.05;
    v.project(this.camera);
    return { x: (v.x * 0.5 + 0.5) * window.innerWidth, y: (-v.y * 0.5 + 0.5) * window.innerHeight, behind };
  }

  #rotateBy(aroundY, aroundX) {
    this.dq.setFromAxisAngle(this.axisY, aroundY);
    this.spin.premultiply(this.dq);
    this.dq.setFromAxisAngle(this.axisX, aroundX);
    this.spin.premultiply(this.dq);
    this.spin.normalize();
  }

  /** Pointer drag on the contact rings: dx/dy in pixels, dtMs since the previous move. */
  dragTorus(dx, dy, dtMs) {
    const k = 0.009;
    this.#rotateBy(dx * k, dy * k);
    const dt = Math.max(8, dtMs) / 1000;
    // remember the flick speed for momentum (clamped so a fast flick doesn't spin forever)
    this.spinVel.set(THREE.MathUtils.clamp((dy * k) / dt, -9, 9), THREE.MathUtils.clamp((dx * k) / dt, -9, 9));
  }

  setTorusDragging(on) {
    this.dragging = on;
  }

  setTorusHover(on) {
    this.hovering = on;
  }

  #screenCircle(position, radius) {
    const c = this.tmp.copy(position).project(this.camera);
    const cx = (c.x * 0.5 + 0.5) * window.innerWidth, cy = (-c.y * 0.5 + 0.5) * window.innerHeight;
    const edge = this.tmp.copy(position).add(new THREE.Vector3(radius, 0, 0)).project(this.camera);
    return { x: cx, y: cy, r: Math.abs((edge.x * 0.5 + 0.5) * window.innerWidth - cx) };
  }

  /** Screen-space circles over the big and small contact rings (for the drag hit areas). */
  torusScreen() {
    if (!this.torus.visible) return null;
    const s = this.torus.scale.x;
    return [this.#screenCircle(this.torus.position, this.torusRadius * s), this.#screenCircle(this.smallRing.position, this.smallRadius * s)];
  }

  ringSpeed(i) {
    return this.rings[i].def.speed;
  }

  dispose() {
    this.renderer.dispose();
    this.scene.traverse((o) => {
      o.geometry?.dispose?.();
      if (o.material) [].concat(o.material).forEach((m) => m.dispose());
    });
  }
}
