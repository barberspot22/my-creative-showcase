
import { useEffect, useRef } from "react";

// Shared easing (easeInOutCubic) used for scroll-driven rotation
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function LumusReplicaEffect() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLImageElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const host = hostRef.current;
    if (!wrapper || !host) return;
    let stopped = false;
    let frame = 0;
    let renderer: any;
    let onResize = () => {};
    let onPointer = (_e: PointerEvent) => {};

    // Scroll progress (0 → 1) smoothed with lerp for a jitter-free feel.
    let scrollProgress = 0;
    let smoothProgress = 0;
    const updateScroll = () => {
      const rect = host.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 while hero fully in view, 1 once scrolled a full viewport past top
      const raw = Math.min(1, Math.max(0, -rect.top / vh));
      scrollProgress = easeInOutCubic(raw);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    (async () => {
      // Dynamic import so the vendored Three.js only loads in the browser (avoids SSR issues).
      // @ts-expect-error vendored Three.js build has no local declaration file
      const ThreeModule = await import("../../vendor/three.module.js");
      const THREE: any = ThreeModule;
      if (stopped) return;
      const nearDist = .1;
      const farDist = 10000;
      let width = wrapper.clientWidth;
      let height = wrapper.clientHeight;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, nearDist, farDist);
      camera.position.z = Math.round(farDist / 20);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      wrapper.appendChild(renderer.domElement);

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 0, 100);
      scene.add(light);
      const base = "/lumus-effect/cube/";
      const envMap = new THREE.CubeTextureLoader().load(["posx.jpg", "negx.jpg", "posy.jpg", "negy.jpg", "posz.jpg", "negz.jpg"].map(x => base + x));
      scene.environment = envMap;
      const group = new THREE.Group();
      scene.add(group);
      const loader = new THREE.FontLoader();

      const createTitle = (font: any) => {
        const viewportHeight = 2 * Math.tan((camera.fov * Math.PI / 180) / 2) * camera.position.z;
        const viewportWidth = viewportHeight * camera.aspect;
        const probeSize = 100;
        const probe = new THREE.TextBufferGeometry("GB IA", { font, size: probeSize, height: 0, curveSegments: 20, bevelEnabled: false });
        probe.computeBoundingBox();
        const probeBox = probe.boundingBox;
        const probeWidth = Math.max(1, probeBox.max.x - probeBox.min.x);
        probe.dispose();
        const size = Math.min(viewportWidth * .9 / probeWidth * probeSize, viewportHeight * .56);
        const geometry = new THREE.TextBufferGeometry("GB IA", { font, size, height: 0, curveSegments: 20, bevelEnabled: false });
        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        geometry.translate(-(box.min.x + box.max.x) / 2, -(box.min.y + box.max.y) / 2, -(box.min.z + box.max.z) / 2);
        const material = new THREE.MeshStandardMaterial({ color: "#aaaaaa", metalness: 1, roughness: .2, envMap, envMapIntensity: 1.5 });
        group.clear();
        group.add(new THREE.Mesh(geometry, material));
      };
      loader.load("/lumus-effect/helvetiker_bold.typeface.json", createTitle);

      let mouseX = 0, mouseY = 0;
      onPointer = (e: PointerEvent) => {
        const rect = wrapper.getBoundingClientRect();
        mouseX = e.clientX - (rect.left + rect.width / 2);
        mouseY = e.clientY - (rect.top + rect.height / 2);
      };
      document.addEventListener("pointermove", onPointer, { passive: true });

      const render = () => {
        if (stopped) return;
        camera.position.x += (mouseX * .38 - camera.position.x) * .05;
        camera.position.y += (mouseY * .38 - camera.position.y) * .05;
        camera.lookAt(scene.position);

        // Smooth scroll progress with lerp so rotation never jitters between frames.
        smoothProgress += (scrollProgress - smoothProgress) * 0.08;

        // Subtle idle sway keeps the scene alive, scroll drives the main rotation.
        const idle = Math.sin(Date.now() * .0012) * .06;
        const scrollRotY = smoothProgress * 0.6; // ~34deg over one viewport of scroll
        const scrollRotX = smoothProgress * 0.18;

        group.rotation.x = idle * 0.6 + scrollRotX;
        group.rotation.y = idle + scrollRotY;

        if (robotRef.current) {
          robotRef.current.style.transform =
            `translate3d(0,0,0) rotate(${(scrollRotY * 0.5).toFixed(4)}rad) scale(${(1 - smoothProgress * 0.04).toFixed(4)})`;
          robotRef.current.style.opacity = String(1 - smoothProgress * 0.15);
        }

        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      };
      render();

      onResize = () => {
        width = wrapper.clientWidth;
        height = wrapper.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        loader.load("/lumus-effect/helvetiker_bold.typeface.json", createTitle);
      };
      window.addEventListener("resize", onResize);
    })();

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", updateScroll);
      renderer?.dispose?.();
      wrapper.querySelector("canvas")?.remove();
    };
  }, []);

  return <div ref={hostRef} className="lumusReplicaEffect gbRobotHero" aria-label="GB IA">
    <div ref={wrapperRef} className="lumusTitleCanvas" aria-hidden="true" />
    <img ref={robotRef} className="gbHeroRobot" src="/lumus-effect/gb-ia-robot.png" alt="" aria-hidden="true" />
    <h1>GB IA</h1>
  </div>;
}

  return <div className="lumusReplicaEffect gbRobotHero" aria-label="GB IA">
    <div ref={wrapperRef} className="lumusTitleCanvas" aria-hidden="true" />
    <img className="gbHeroRobot" src="/lumus-effect/gb-ia-robot.png" alt="" aria-hidden="true" />
    <h1>GB IA</h1>
  </div>;
}
