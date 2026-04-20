import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  FolderKanban,
  Mail,
  Network,
  Shield,
  Wrench,
} from "lucide-react";

function NetworkBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      34,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.34;
    mount.appendChild(renderer.domElement);

    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    scene.add(new THREE.AmbientLight(0xa7f3ff, 0.72));

    const keyLight = new THREE.PointLight(0xeaffc7, 2.8, 120);
    keyLight.position.set(11, 4, 8);
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight(0x67e8f9, 1.35, 100);
    cyanLight.position.set(5, 0, 6);
    scene.add(cyanLight);

    const warmLight = new THREE.PointLight(0xf8fafc, 0.7, 90);
    warmLight.position.set(-7, -2, 6);
    scene.add(warmLight);

    const globeGroup = new THREE.Group();
    globeGroup.position.set(6.55, 1.08, 0.1);
    sceneGroup.add(globeGroup);

    const textureLoader = new THREE.TextureLoader();

    const makeGlowSprite = (
      color,
      opacity = 0.9,
      sizePx = 96,
      innerAlpha = 1
    ) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = sizePx;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return new THREE.Sprite(
          new THREE.SpriteMaterial({
            color,
            transparent: true,
            opacity,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
        );
      }

      const grad = ctx.createRadialGradient(
        sizePx / 2,
        sizePx / 2,
        0,
        sizePx / 2,
        sizePx / 2,
        sizePx / 2
      );
      grad.addColorStop(0, `rgba(255,255,255,${innerAlpha})`);
      grad.addColorStop(0.16, `rgba(255,255,255,${innerAlpha * 0.95})`);
      grad.addColorStop(0.36, "rgba(255,255,255,0.26)");
      grad.addColorStop(1, "rgba(255,255,255,0)");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, sizePx, sizePx);

      const texture = new THREE.CanvasTexture(canvas);

      return new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: texture,
          color,
          transparent: true,
          opacity,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
    };

    const makeNebulaTexture = (stops) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
      stops.forEach(([pos, color]) => grad.addColorStop(pos, color));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      return new THREE.CanvasTexture(canvas);
    };

    const spaceGroup = new THREE.Group();
    sceneGroup.add(spaceGroup);

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1800;
    const starPositions = [];

    for (let i = 0; i < starCount; i++) {
      const radius = 26 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi) * 0.72,
        radius * Math.sin(phi) * Math.sin(theta) - 8
      );
    }

    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starPositions, 3)
    );

    const starMaterial = new THREE.PointsMaterial({
      color: 0xcfe9ff,
      size: 0.095,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    spaceGroup.add(starField);

    const farStarGeometry = new THREE.BufferGeometry();
    const farStarCount = 1200;
    const farStarPositions = [];

    for (let i = 0; i < farStarCount; i++) {
      const radius = 36 + Math.random() * 24;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      farStarPositions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi) * 0.75,
        radius * Math.sin(phi) * Math.sin(theta) - 18
      );
    }

    farStarGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(farStarPositions, 3)
    );

    const farStarMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.06,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });

    const farStars = new THREE.Points(farStarGeometry, farStarMaterial);
    spaceGroup.add(farStars);

    const flashStarCount = 84;
    const flashStars = [];

    for (let i = 0; i < flashStarCount; i++) {
      const radius = 24 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi) * 0.72;
      const z = radius * Math.sin(phi) * Math.sin(theta) - 10;

      const baseOpacity = 0.1 + Math.random() * 0.12;
      const baseSize = 0.085 + Math.random() * 0.045;

      const sprite = makeGlowSprite(0xffffff, baseOpacity, 96, 1);
      sprite.scale.set(baseSize, baseSize, baseSize);
      sprite.position.set(x, y, z);
      spaceGroup.add(sprite);

      flashStars.push({
        sprite,
        position: new THREE.Vector3(x, y, z),
        baseOpacity,
        baseSize,
        flashing: false,
        flashStart: 0,
        flashDuration: 0.42 + Math.random() * 0.18,
      });
    }

    let nextFlashAt = 1.4;
    let lastFlashIndex = -1;

    const nebulaA = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeNebulaTexture([
          [0, "rgba(103,232,249,0.28)"],
          [0.35, "rgba(56,189,248,0.16)"],
          [0.7, "rgba(8,47,73,0.05)"],
          [1, "rgba(0,0,0,0)"],
        ]),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.62,
      })
    );
    nebulaA.position.set(-7.5, 4.2, -14);
    nebulaA.scale.set(14, 10, 1);
    spaceGroup.add(nebulaA);

    const nebulaB = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeNebulaTexture([
          [0, "rgba(125,211,252,0.2)"],
          [0.45, "rgba(34,211,238,0.1)"],
          [0.78, "rgba(8,47,73,0.04)"],
          [1, "rgba(0,0,0,0)"],
        ]),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.5,
      })
    );
    nebulaB.position.set(10.5, -3.4, -12);
    nebulaB.scale.set(12, 8.8, 1);
    spaceGroup.add(nebulaB);

    const earthMap = textureLoader.load(
      "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
    );
    const earthNormal = textureLoader.load(
      "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
    );
    const cloudMap = textureLoader.load(
      "https://threejs.org/examples/textures/planets/earth_clouds_1024.png"
    );

    earthMap.colorSpace = THREE.SRGBColorSpace;
    cloudMap.colorSpace = THREE.SRGBColorSpace;
    earthMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
    earthNormal.anisotropy = renderer.capabilities.getMaxAnisotropy();
    cloudMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
    earthMap.wrapS = THREE.RepeatWrapping;
    earthNormal.wrapS = THREE.RepeatWrapping;

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(3.45, 120, 120),
      new THREE.MeshPhongMaterial({
        map: earthMap,
        normalMap: earthNormal,
        normalScale: new THREE.Vector2(0.5, 0.5),
        emissiveMap: earthMap,
        emissive: new THREE.Color(0x7fae7a),
        emissiveIntensity: 0.98,
        specular: new THREE.Color(0x111111),
        shininess: 8,
        transparent: true,
        opacity: 0.995,
      })
    );

    sphere.material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        diffuseColor.rgb = (diffuseColor.rgb - 0.5) * 1.62 + 0.5;
        diffuseColor.rgb *= vec3(0.78, 0.92, 0.70);
        diffuseColor.rgb += 0.16;
        `
      );
    };

    globeGroup.add(sphere);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(3.56, 120, 120),
      new THREE.MeshBasicMaterial({
        color: 0x7ee7ff,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
      })
    );
    globeGroup.add(atmosphere);

    const rim = new THREE.Mesh(
      new THREE.SphereGeometry(3.5, 120, 120),
      new THREE.MeshBasicMaterial({
        color: 0xf1f6cf,
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
      })
    );
    globeGroup.add(rim);

    const cloudLayer = new THREE.Mesh(
      new THREE.SphereGeometry(3.49, 120, 120),
      new THREE.MeshPhongMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.1,
        depthWrite: false,
      })
    );
    globeGroup.add(cloudLayer);

    const latLongToVector3 = (lat, lon, radius = 3.47) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);

      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    let landMaskReady = false;
    let landImageData = null;
    let landImageWidth = 0;
    let landImageHeight = 0;

    const isLandCoord = (lat, lon) => {
      if (!landMaskReady || !landImageData) return true;

      const x = Math.min(
        landImageWidth - 1,
        Math.max(0, Math.floor(((lon + 180) / 360) * landImageWidth))
      );
      const y = Math.min(
        landImageHeight - 1,
        Math.max(0, Math.floor(((90 - lat) / 180) * landImageHeight))
      );

      const i = (y * landImageWidth + x) * 4;
      const r = landImageData[i];
      const g = landImageData[i + 1];
      const b = landImageData[i + 2];
      const brightness = (r + g + b) / 3;

      return brightness > 90;
    };

    const nudgeToNearestLand = (lat, lon, maxRadius = 10, step = 0.4) => {
      if (isLandCoord(lat, lon)) return [lat, lon];

      for (let radius = step; radius <= maxRadius; radius += step) {
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
          const testLat = Math.max(
            -89.5,
            Math.min(89.5, lat + Math.sin(angle) * radius)
          );
          const testLon = ((lon + Math.cos(angle) * radius + 540) % 360) - 180;

          if (isLandCoord(testLat, testLon)) return [testLat, testLon];
        }
      }

      return [lat, lon];
    };

    const landParticleGroup = new THREE.Group();
    globeGroup.add(landParticleGroup);

    const networkGroup = new THREE.Group();
    globeGroup.add(networkGroup);

    const networkNodes = [
      {
        id: "sf",
        label: "San Francisco",
        lat: 37.77,
        lon: -122.41,
        color: 0x38bdf8,
        role: "core",
      },
      {
        id: "ny",
        label: "New York",
        lat: 40.71,
        lon: -74.0,
        color: 0x7dd3fc,
        role: "core",
      },
      {
        id: "ldn",
        label: "London",
        lat: 51.5,
        lon: -0.1,
        color: 0x7dd3fc,
        role: "transit",
      },
      {
        id: "par",
        label: "Paris",
        lat: 48.85,
        lon: 2.35,
        color: 0xfacc15,
        role: "regional",
      },
      {
        id: "lag",
        label: "Lagos",
        lat: 6.52,
        lon: 3.37,
        color: 0xf59e0b,
        role: "regional",
      },
      {
        id: "cai",
        label: "Cairo",
        lat: 30.04,
        lon: 31.24,
        color: 0xfacc15,
        role: "regional",
      },
      {
        id: "nbo",
        label: "Nairobi",
        lat: -1.29,
        lon: 36.82,
        color: 0x38bdf8,
        role: "regional",
      },
      {
        id: "jhb",
        label: "Johannesburg",
        lat: -26.2,
        lon: 28.04,
        color: 0xf97316,
        role: "edge",
      },
      {
        id: "mum",
        label: "Mumbai",
        lat: 19.08,
        lon: 72.88,
        color: 0x38bdf8,
        role: "transit",
      },
      {
        id: "sgp",
        label: "Singapore",
        lat: 1.29,
        lon: 103.85,
        color: 0x7dd3fc,
        role: "core",
      },
      {
        id: "rec",
        label: "Recife",
        lat: -8.05,
        lon: -34.9,
        color: 0x38bdf8,
        role: "transit",
      },
      {
        id: "ssa",
        label: "Salvador",
        lat: -12.97,
        lon: -38.5,
        color: 0x7dd3fc,
        role: "regional",
      },
      {
        id: "rio",
        label: "Rio de Janeiro",
        lat: -22.91,
        lon: -43.17,
        color: 0xfacc15,
        role: "regional",
      },
      {
        id: "sp",
        label: "São Paulo",
        lat: -23.55,
        lon: -46.63,
        color: 0xf59e0b,
        role: "core",
      },
      {
        id: "bue",
        label: "Buenos Aires",
        lat: -34.6,
        lon: -58.38,
        color: 0x7dd3fc,
        role: "regional",
      },
      {
        id: "jkt",
        label: "Jakarta",
        lat: -6.21,
        lon: 106.85,
        color: 0x38bdf8,
        role: "transit",
      },
      {
        id: "per",
        label: "Perth",
        lat: -31.95,
        lon: 115.86,
        color: 0xfacc15,
        role: "regional",
      },
      {
        id: "adl",
        label: "Adelaide",
        lat: -34.93,
        lon: 138.6,
        color: 0x7dd3fc,
        role: "regional",
      },
      {
        id: "syd",
        label: "Sydney",
        lat: -33.87,
        lon: 151.21,
        color: 0x38bdf8,
        role: "core",
      },
      {
        id: "mel",
        label: "Melbourne",
        lat: -37.81,
        lon: 144.96,
        color: 0xf59e0b,
        role: "regional",
      },
    ];

    const routeDefinitions = [
      {
        id: "pacific-backbone",
        from: "sf",
        to: "ny",
        color: 0x38bdf8,
        packetColor: 0x7dd3fc,
        packets: 3,
        speed: 0.11,
        reversePackets: 2,
        reverseSpeed: 0.084,
      },
      {
        id: "atlantic-backbone",
        from: "ny",
        to: "ldn",
        color: 0x7dd3fc,
        packetColor: 0xe0f2fe,
        packets: 4,
        speed: 0.116,
        reversePackets: 2,
        reverseSpeed: 0.09,
      },
      {
        id: "europe-link",
        from: "ldn",
        to: "par",
        color: 0xfacc15,
        packetColor: 0xfef08a,
        packets: 2,
        speed: 0.09,
        reversePackets: 1,
        reverseSpeed: 0.07,
      },
      {
        id: "africa-west",
        from: "cai",
        to: "lag",
        color: 0xf59e0b,
        packetColor: 0xfcd34d,
        packets: 3,
        speed: 0.096,
        reversePackets: 1,
        reverseSpeed: 0.074,
      },
      {
        id: "africa-east",
        from: "lag",
        to: "nbo",
        color: 0x38bdf8,
        packetColor: 0x7dd3fc,
        packets: 2,
        speed: 0.089,
        reversePackets: 1,
        reverseSpeed: 0.068,
      },
      {
        id: "africa-south",
        from: "nbo",
        to: "jhb",
        color: 0xf97316,
        packetColor: 0xfdba74,
        packets: 2,
        speed: 0.084,
        reversePackets: 1,
        reverseSpeed: 0.064,
      },
      {
        id: "africa-to-europe",
        from: "lag",
        to: "ldn",
        color: 0x7dd3fc,
        packetColor: 0xe0f2fe,
        packets: 2,
        speed: 0.092,
        reversePackets: 1,
        reverseSpeed: 0.07,
      },
      {
        id: "cairo-to-nairobi",
        from: "cai",
        to: "nbo",
        color: 0x38bdf8,
        packetColor: 0xbfdbfe,
        packets: 2,
        speed: 0.086,
        reversePackets: 1,
        reverseSpeed: 0.064,
      },
      {
        id: "lagos-to-johannesburg",
        from: "lag",
        to: "jhb",
        color: 0xf59e0b,
        packetColor: 0xfcd34d,
        packets: 2,
        speed: 0.09,
        reversePackets: 1,
        reverseSpeed: 0.066,
      },
      {
        id: "lagos-to-recife",
        from: "lag",
        to: "rec",
        color: 0x38bdf8,
        packetColor: 0xe0f2fe,
        packets: 3,
        speed: 0.09,
        reversePackets: 2,
        reverseSpeed: 0.07,
      },
      {
        id: "johannesburg-to-rio",
        from: "jhb",
        to: "rio",
        color: 0xf59e0b,
        packetColor: 0xfcd34d,
        packets: 2,
        speed: 0.086,
        reversePackets: 1,
        reverseSpeed: 0.065,
      },
      {
        id: "lagos-to-salvador",
        from: "lag",
        to: "ssa",
        color: 0x7dd3fc,
        packetColor: 0xbfdbfe,
        packets: 2,
        speed: 0.084,
        reversePackets: 1,
        reverseSpeed: 0.063,
      },
      {
        id: "recife-to-salvador",
        from: "rec",
        to: "ssa",
        color: 0x38bdf8,
        packetColor: 0xbfdbfe,
        packets: 2,
        speed: 0.081,
        reversePackets: 1,
        reverseSpeed: 0.06,
      },
      {
        id: "salvador-to-rio",
        from: "ssa",
        to: "rio",
        color: 0x7dd3fc,
        packetColor: 0xe0f2fe,
        packets: 2,
        speed: 0.08,
        reversePackets: 1,
        reverseSpeed: 0.059,
      },
      {
        id: "rio-to-sao-paulo",
        from: "rio",
        to: "sp",
        color: 0xfacc15,
        packetColor: 0xfef08a,
        packets: 2,
        speed: 0.078,
        reversePackets: 1,
        reverseSpeed: 0.058,
      },
      {
        id: "sao-paulo-to-buenos-aires",
        from: "sp",
        to: "bue",
        color: 0xf59e0b,
        packetColor: 0xfcd34d,
        packets: 2,
        speed: 0.079,
        reversePackets: 1,
        reverseSpeed: 0.058,
      },
      {
        id: "recife-to-rio",
        from: "rec",
        to: "rio",
        color: 0x7dd3fc,
        packetColor: 0xe0f2fe,
        packets: 2,
        speed: 0.082,
        reversePackets: 1,
        reverseSpeed: 0.06,
      },
      {
        id: "recife-to-sao-paulo",
        from: "rec",
        to: "sp",
        color: 0x38bdf8,
        packetColor: 0xbfdbfe,
        packets: 2,
        speed: 0.084,
        reversePackets: 1,
        reverseSpeed: 0.061,
      },
      {
        id: "salvador-to-sao-paulo",
        from: "ssa",
        to: "sp",
        color: 0xfacc15,
        packetColor: 0xfef08a,
        packets: 2,
        speed: 0.081,
        reversePackets: 1,
        reverseSpeed: 0.06,
      },
      {
        id: "rio-to-buenos-aires",
        from: "rio",
        to: "bue",
        color: 0x7dd3fc,
        packetColor: 0xe0f2fe,
        packets: 2,
        speed: 0.079,
        reversePackets: 1,
        reverseSpeed: 0.058,
      },
      {
        id: "sao-paulo-to-london",
        from: "sp",
        to: "ldn",
        color: 0x38bdf8,
        packetColor: 0xe0f2fe,
        packets: 3,
        speed: 0.083,
        reversePackets: 2,
        reverseSpeed: 0.062,
      },
      {
        id: "rio-to-lagos",
        from: "rio",
        to: "lag",
        color: 0xf59e0b,
        packetColor: 0xfcd34d,
        packets: 2,
        speed: 0.084,
        reversePackets: 1,
        reverseSpeed: 0.062,
      },
      {
        id: "sao-paulo-to-new-york",
        from: "sp",
        to: "ny",
        color: 0x7dd3fc,
        packetColor: 0xe0f2fe,
        packets: 2,
        speed: 0.083,
        reversePackets: 1,
        reverseSpeed: 0.061,
      },
      {
        id: "asia-uplink",
        from: "mum",
        to: "sgp",
        color: 0x38bdf8,
        packetColor: 0xbfdbfe,
        packets: 3,
        speed: 0.102,
        reversePackets: 2,
        reverseSpeed: 0.078,
      },
      {
        id: "singapore-to-jakarta",
        from: "sgp",
        to: "jkt",
        color: 0x7dd3fc,
        packetColor: 0xe0f2fe,
        packets: 2,
        speed: 0.082,
        reversePackets: 1,
        reverseSpeed: 0.06,
      },
      {
        id: "jakarta-to-perth",
        from: "jkt",
        to: "per",
        color: 0x38bdf8,
        packetColor: 0xbfdbfe,
        packets: 2,
        speed: 0.084,
        reversePackets: 1,
        reverseSpeed: 0.061,
      },
      {
        id: "perth-to-adelaide",
        from: "per",
        to: "adl",
        color: 0xfacc15,
        packetColor: 0xfef08a,
        packets: 2,
        speed: 0.079,
        reversePackets: 1,
        reverseSpeed: 0.058,
      },
      {
        id: "adelaide-to-melbourne",
        from: "adl",
        to: "mel",
        color: 0x7dd3fc,
        packetColor: 0xe0f2fe,
        packets: 2,
        speed: 0.078,
        reversePackets: 1,
        reverseSpeed: 0.057,
      },
      {
        id: "melbourne-to-sydney",
        from: "mel",
        to: "syd",
        color: 0x38bdf8,
        packetColor: 0xbfdbfe,
        packets: 2,
        speed: 0.077,
        reversePackets: 1,
        reverseSpeed: 0.056,
      },
      {
        id: "singapore-to-sydney",
        from: "sgp",
        to: "syd",
        color: 0x7dd3fc,
        packetColor: 0xe0f2fe,
        packets: 2,
        speed: 0.083,
        reversePackets: 1,
        reverseSpeed: 0.061,
      },
      {
        id: "sydney-to-sao-paulo",
        from: "syd",
        to: "sp",
        color: 0x38bdf8,
        packetColor: 0xbfdbfe,
        packets: 2,
        speed: 0.076,
        reversePackets: 1,
        reverseSpeed: 0.055,
      },
    ];

    const nodeLookup = new Map();
    const routeState = [];
    const nodePulseState = [];
    let particleMesh = null;
    let particleMaterial = null;
        const clearGroup = (group) => {
      while (group.children.length) {
        const child = group.children[0];
        group.remove(child);

        if (child.geometry) child.geometry.dispose?.();

        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose?.());
          } else {
            child.material.dispose?.();
          }
        }

        if (child.children?.length) {
          clearGroup(child);
        }
      }
    };

    const buildNodes = () => {
      networkNodes.forEach((node, index) => {
        const [safeLat, safeLon] = nudgeToNearestLand(
          node.lat,
          node.lon,
          12,
          0.25
        );
        const position = latLongToVector3(safeLat, safeLon, 3.5);

        const container = new THREE.Group();
        container.position.copy(position);
        container.lookAt(position.clone().multiplyScalar(2));

        const core = new THREE.Mesh(
          new THREE.SphereGeometry(
            node.role === "core" ? 0.042 : 0.032,
            18,
            18
          ),
          new THREE.MeshBasicMaterial({
            color: node.color,
            transparent: true,
            opacity: 0.95,
          })
        );

        const halo = makeGlowSprite(node.color, 0.52, 80, 1);
        halo.scale.set(
          node.role === "core" ? 0.3 : 0.24,
          node.role === "core" ? 0.3 : 0.24,
          node.role === "core" ? 0.3 : 0.24
        );

        const outerRing = new THREE.Mesh(
          new THREE.RingGeometry(0.05, 0.063, 40),
          new THREE.MeshBasicMaterial({
            color: 0xe2f6ff,
            transparent: true,
            opacity: 0.42,
            side: THREE.DoubleSide,
          })
        );
        outerRing.lookAt(position.clone().multiplyScalar(2));

        container.add(core);
        container.add(halo);
        container.add(outerRing);
        networkGroup.add(container);

        nodeLookup.set(node.id, {
          ...node,
          safeLat,
          safeLon,
          position,
          container,
          core,
          halo,
          outerRing,
        });

        nodePulseState.push({
          nodeId: node.id,
          phase: index * 0.55,
          roleBoost: node.role === "core" ? 0.12 : 0.06,
        });
      });
    };

    const createPacket = (color, size = 0.1, opacity = 0.88) => {
      const sprite = makeGlowSprite(color, opacity, 80, 1);
      sprite.scale.set(size, size * 0.88, size);
      return sprite;
    };

    const buildRoutes = () => {
      routeDefinitions.forEach((route, routeIndex) => {
        const fromNode = nodeLookup.get(route.from);
        const toNode = nodeLookup.get(route.to);
        if (!fromNode || !toNode) return;

        const start = fromNode.position.clone().normalize().multiplyScalar(3.5);
        const end = toNode.position.clone().normalize().multiplyScalar(3.5);

        const distance = start.distanceTo(end);
        const arcHeight =
          distance > 5.2 ? 4.08 : distance > 4.1 ? 3.92 : 3.78;

        const mid = start
          .clone()
          .add(end)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(arcHeight);

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(180);

        const baseLine = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.13,
          })
        );

        const glowLine = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({
            color: route.color,
            transparent: true,
            opacity: 0.48,
          })
        );

        networkGroup.add(baseLine);
        networkGroup.add(glowLine);

        const forwardPackets = [];
        for (let i = 0; i < route.packets; i++) {
          const packet = createPacket(route.packetColor, 0.11, 0.92);
          networkGroup.add(packet);
          forwardPackets.push({
            sprite: packet,
            t: i / route.packets,
            speed: route.speed,
            phase: Math.random() * Math.PI * 2,
          });
        }

        const reversePackets = [];
        for (let i = 0; i < route.reversePackets; i++) {
          const packet = createPacket(0xffffff, 0.075, 0.42);
          networkGroup.add(packet);
          reversePackets.push({
            sprite: packet,
            t: i / Math.max(route.reversePackets, 1),
            speed: route.reverseSpeed,
            phase: Math.random() * Math.PI * 2,
          });
        }

        const startBeacon = makeGlowSprite(fromNode.color, 0.16, 78, 1);
        const endBeacon = makeGlowSprite(toNode.color, 0.16, 78, 1);
        startBeacon.position.copy(start);
        endBeacon.position.copy(end);
        startBeacon.scale.set(0.16, 0.16, 0.16);
        endBeacon.scale.set(0.16, 0.16, 0.16);

        networkGroup.add(startBeacon);
        networkGroup.add(endBeacon);

        routeState.push({
          id: route.id,
          curve,
          fromNode,
          toNode,
          baseLine,
          glowLine,
          forwardPackets,
          reversePackets,
          startBeacon,
          endBeacon,
          phase: routeIndex * 0.4,
        });
      });
    };

    const buildLandParticles = () => {
      const img = earthMap.image;
      if (!img || !img.width) return;

      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = img.width;
      sampleCanvas.height = img.height;
      const sampleCtx = sampleCanvas.getContext("2d");
      if (!sampleCtx) return;

      sampleCtx.drawImage(img, 0, 0);
      landImageData = sampleCtx.getImageData(0, 0, img.width, img.height).data;
      landImageWidth = img.width;
      landImageHeight = img.height;
      landMaskReady = true;

      const particleCount = 5400;
      const positions = [];
      let attempts = 0;
      const maxAttempts = particleCount * 20;

      while (positions.length < particleCount * 3 && attempts < maxAttempts) {
        attempts += 1;
        const lat = Math.random() * 180 - 90;
        const lon = Math.random() * 360 - 180;
        if (!isLandCoord(lat, lon)) continue;

        const v = latLongToVector3(lat, lon, 3.5 + Math.random() * 0.02);
        positions.push(v.x, v.y, v.z);
      }

      if (particleMesh) {
        landParticleGroup.remove(particleMesh);
        particleMesh.geometry.dispose();
        particleMaterial?.dispose?.();
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );

      particleMaterial = new THREE.PointsMaterial({
        color: 0xe7f5c9,
        size: 0.017,
        transparent: true,
        opacity: 0.56,
        depthWrite: false,
      });

      particleMesh = new THREE.Points(particleGeometry, particleMaterial);
      landParticleGroup.add(particleMesh);

      clearGroup(networkGroup);
      nodeLookup.clear();
      routeState.length = 0;
      nodePulseState.length = 0;

      buildNodes();
      buildRoutes();
    };

    earthMap.onUpdate = () => {
      buildLandParticles();
    };

    buildLandParticles();

    const globeBaseRotation = 4.62;

    sphere.rotation.y = globeBaseRotation;
    atmosphere.rotation.y = globeBaseRotation;
    rim.rotation.y = globeBaseRotation;
    landParticleGroup.rotation.y = globeBaseRotation;
    networkGroup.rotation.y = globeBaseRotation;
    cloudLayer.rotation.y = globeBaseRotation + 0.04;

    let animationFrame;
    let frame = 0;

    const triggerFlash = (time) => {
      const available = flashStars
        .map((star, index) => ({ star, index }))
        .filter(({ star, index }) => !star.flashing && index !== lastFlashIndex);

      if (!available.length) return;

      let chosen = available[Math.floor(Math.random() * available.length)];

      if (lastFlashIndex !== -1) {
        const lastPos = flashStars[lastFlashIndex].position;
        const sorted = [...available].sort((a, b) => {
          const distA = a.star.position.distanceTo(lastPos);
          const distB = b.star.position.distanceTo(lastPos);
          return distB - distA;
        });

        chosen =
          sorted[Math.floor(Math.random() * Math.min(sorted.length, 10))];
      }

      chosen.star.flashing = true;
      chosen.star.flashStart = time;
      chosen.star.flashDuration = 0.4 + Math.random() * 0.16;
      lastFlashIndex = chosen.index;
      nextFlashAt = time + 1.8 + Math.random() * 1.4;
    };

    const animate = () => {
      frame += 1;
      const time = frame * 0.01;

      globeGroup.rotation.y += 0.00068;
      atmosphere.rotation.y += 0.00076;
      rim.rotation.y += 0.00036;
      cloudLayer.rotation.y += 0.00106;

      spaceGroup.rotation.y += 0.00004;
      starField.material.opacity = 0.78 + Math.sin(time * 0.5) * 0.03;
      farStars.material.opacity = 0.46 + Math.sin(time * 0.35) * 0.025;
      nebulaA.material.opacity = 0.56 + Math.sin(time * 0.22) * 0.03;
      nebulaB.material.opacity = 0.44 + Math.sin(time * 0.18 + 1.2) * 0.03;

      if (time >= nextFlashAt) {
        triggerFlash(time);
      }

      flashStars.forEach((star) => {
        if (!star.flashing) {
          star.sprite.material.opacity = star.baseOpacity;
          star.sprite.scale.set(star.baseSize, star.baseSize, star.baseSize);
          return;
        }

        const elapsed = time - star.flashStart;
        const progress = elapsed / star.flashDuration;

        if (progress >= 1) {
          star.flashing = false;
          star.sprite.material.opacity = star.baseOpacity;
          star.sprite.scale.set(star.baseSize, star.baseSize, star.baseSize);
          return;
        }

        let intensity;

        if (progress < 0.08) {
          intensity = progress / 0.08;
        } else if (progress < 0.18) {
          intensity = 1;
        } else {
          intensity = Math.pow(1 - (progress - 0.18) / 0.82, 2.4);
        }

        const flashOpacity = Math.min(2.2, star.baseOpacity + intensity * 1.9);
        const flashScale = star.baseSize * (1 + intensity * 1.45);

        star.sprite.material.opacity = flashOpacity;
        star.sprite.scale.set(flashScale, flashScale, flashScale);
      });

      const globePulse = 1 + Math.sin(time * 0.16) * 0.012;
      globeGroup.scale.setScalar(globePulse);

      nodePulseState.forEach((entry, index) => {
        const node = nodeLookup.get(entry.nodeId);
        if (!node) return;

        const pulse =
          0.72 + Math.sin(time * 2 + entry.phase) * 0.12 + entry.roleBoost;
        node.halo.material.opacity = pulse * 0.54;

        const haloScale = 0.22 + pulse * 0.075;
        node.halo.scale.set(haloScale, haloScale, haloScale);

        node.core.material.opacity =
          0.82 + Math.sin(time * 2.8 + index) * 0.08;

        const ringOpacity = 0.2 + Math.sin(time * 1.7 + index) * 0.08;
        node.outerRing.material.opacity = ringOpacity;
      });

      routeState.forEach((route, routeIndex) => {
        route.glowLine.material.opacity =
          0.38 + Math.sin(time * 1.4 + route.phase) * 0.05;

        route.startBeacon.material.opacity =
          0.1 + Math.sin(time * 2.2 + routeIndex) * 0.035;
        route.endBeacon.material.opacity =
          0.1 + Math.sin(time * 2.2 + routeIndex + 1.2) * 0.035;

        route.forwardPackets.forEach((packet, i) => {
          packet.t += packet.speed * 0.01;
          if (packet.t > 1) packet.t = 0;

          const pos = route.curve.getPoint(packet.t);
          packet.sprite.position.copy(pos);

          packet.sprite.material.opacity =
            0.74 + Math.sin(time * 6.4 + i + routeIndex + packet.phase) * 0.12;
        });

        route.reversePackets.forEach((packet, i) => {
          packet.t += packet.speed * 0.01;
          if (packet.t > 1) packet.t = 0;

          const reverseT = 1 - packet.t;
          const pos = route.curve.getPoint(reverseT);
          packet.sprite.position.copy(pos);

          packet.sprite.material.opacity =
            0.26 + Math.sin(time * 4.8 + i + routeIndex + packet.phase) * 0.05;
        });
      });

      if (particleMaterial) {
        particleMaterial.opacity = 0.54 + Math.sin(time * 2.1) * 0.06;
        particleMaterial.size = 0.016 + (Math.sin(time * 2.1) + 1) * 0.0011;
      }

      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      const mobile = width < 900;
      globeGroup.position.set(mobile ? 5.25 : 6.55, mobile ? 0.94 : 1.08, 0.1);
      camera.position.set(0, 0, mobile ? 11.2 : 10.5);

      nebulaA.position.set(mobile ? -6.4 : -7.5, mobile ? 3.6 : 4.2, -14);
      nebulaB.position.set(mobile ? 8.8 : 10.5, mobile ? -2.8 : -3.4, -12);
    };

    handleResize();
    animate();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);

      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose?.();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose?.());
          } else {
            obj.material.dispose?.();
          }
        }
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}

export default function PortfolioSite() {
  const projects = [
    {
      title: "Inter-VLAN Routing with Router-on-a-Stick",
      category: "Network Design",
      tools: [
        "Cisco Packet Tracer",
        "Inter-VLAN Routing",
        "Router-on-a-Stick",
        "VLANs",
      ],
      summary:
        "Implemented inter-VLAN routing using a router-on-a-stick configuration to enable controlled communication between segmented networks while preserving logical separation across departments.",
      outcome:
        "Strengthened routing design fundamentals, improved understanding of segmented traffic flow, and demonstrated how connectivity and isolation work together in a structured network.",
      href: "https://github.com/Pelumi-Johnson/Inter-VLAN-Routing-Implementation-Using-Router-on-a-Stick/tree/main",
    },
    {
      title: "Wireshark Traffic Analysis Case Study",
      category: "Traffic Analysis",
      tools: ["Wireshark", "DNS", "HTTP", "TCP Analysis"],
      summary:
        "Captured and analyzed network traffic in a lab environment to identify communication patterns, review insecure transmissions, and interpret protocol-level behavior through targeted filtering.",
      outcome:
        "Improved packet analysis workflow, documented useful filters, and strengthened the ability to explain traffic behavior from both troubleshooting and security perspectives.",
      href: "https://github.com/Pelumi-Johnson/Cloud-Infrastructure-Projects/tree/main",
    },
    {
      title: "Access Control Implementation with ACLs",
      category: "Network Security",
      tools: ["ACLs", "Cisco Packet Tracer", "Policy Enforcement", "VLANs"],
      summary:
        "Implemented access control lists across segmented networks to restrict unnecessary communication, enforce policy boundaries, and better control traffic between internal zones.",
      outcome:
        "Reduced lateral movement paths, reinforced segmentation with policy-based filtering, and improved hands-on understanding of access control in routed environments.",
      href: "https://github.com/Pelumi-Johnson/Access-Control-Implementation-with-ACLs-Across-VLAN-Segments/tree/main",
    },
  ];

  const skills = {
    Networking: [
      "TCP/IP",
      "Subnetting",
      "Routing & Switching",
      "VLANs",
      "NAT",
      "Troubleshooting",
    ],
    Security: [
      "Network Segmentation",
      "Packet Analysis",
      "Firewall Rules",
      "Threat Detection",
      "Access Control",
    ],
    Tools: [
      "Wireshark",
      "Nmap",
      "Cisco Packet Tracer",
      "GNS3",
      "Linux",
      "TryHackMe",
    ],
  };

  const certifications = {
    achieved: [
      "CompTIA CySA+",
      "Splunk Core Certified User",
      "Cisco Networking Basics",
      "Cisco Junior Cybersecurity Analyst Career Path",
    ],
    inProgress: ["CCNA", "CompTIA Security+", "CompTIA Network+"],
  };

  const highlights = [
    { label: "Focus", value: "Secure Infrastructure" },
    { label: "Track", value: "Network Engineering" },
    { label: "Foundation", value: "Cybersecurity Technology" },
  ];

  const contacts = [
    {
      label: "Email",
      display: "pelumijohnson1999@gmail.com",
      href: "mailto:pelumijohnson1999@gmail.com",
      Icon: Mail,
    },
    {
      label: "LinkedIn",
      display: "linkedin.com/in/pelumijohnson",
      href: "https://linkedin.com/in/pelumijohnson",
      Icon: Briefcase,
    },
    {
      label: "GitHub",
      display: "github.com/Pelumi-Johnson",
      href: "https://github.com/Pelumi-Johnson",
      Icon: FolderKanban,
    },
  ];

  const resumeUrl =
    "https://1drv.ms/w/c/23f0955b17273bb4/IQABfSV-ymYwRpg3VWx-XtwAAbiqmyCN_IX1KfLAXDi1Ty8?e=0hYmLk";

  const moreProjectsUrl = "https://github.com/Pelumi-Johnson";

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <NetworkBackground />

      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,_rgba(8,47,73,0.18),_rgba(2,6,23,0.64)_34%,_rgba(2,6,23,0.92)_100%)]" />

      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.025),transparent_18%,transparent_82%,rgba(255,255,255,0.03))]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/45 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-semibold tracking-wide text-white">
              Pelumi Johnson
            </p>
            <p className="text-sm text-slate-400">
              Cybersecurity Technology Student • Aspiring Network Engineer
            </p>
          </div>

          <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
            <a href="#about" className="transition hover:text-cyan-400">
              About
            </a>
            <a href="#projects" className="transition hover:text-cyan-400">
              Projects
            </a>
            <a href="#skills" className="transition hover:text-cyan-400">
              Skills
            </a>
            <a
              href="#certifications"
              className="transition hover:text-cyan-400"
            >
              Certifications
            </a>
            <a href="#contact" className="transition hover:text-cyan-400">
              Contact
            </a>
          </nav>
        </div>
      </header>
            <main className="relative z-20">
        <section className="border-b border-white/10">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1.2fr_0.8fr] md:py-28">
            <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-950/55 p-8 shadow-[0_0_60px_rgba(6,182,212,0.08)] backdrop-blur-md">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-cyan-300">
                <Shield className="h-3.5 w-3.5" />
                Cybersecurity Technology Degree
              </p>

              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
                Building secure networks with an engineer’s mindset.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                I am Pelumi Johnson, pursuing a degree in Cybersecurity
                Technology while building a career in network engineering. My
                portfolio highlights hands-on labs, network design projects,
                traffic analysis, and security-focused infrastructure work.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300"
                >
                  View Projects
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:border-cyan-300 hover:bg-cyan-400/20"
                >
                  View Resume
                </a>

                <a
                  href="#contact"
                  className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  Contact Me
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {[
                {
                  icon: Network,
                  title: "Network Design",
                  desc: "Segmented topologies, IP planning, switching, and routing principles applied through hands-on lab work.",
                },
                {
                  icon: Shield,
                  title: "Network Security",
                  desc: "Traffic visibility, policy enforcement, access control, and security-focused infrastructure decisions.",
                },
                {
                  icon: FolderKanban,
                  title: "Lab Documentation",
                  desc: "Structured write-ups that capture setup, implementation, results, and technical takeaways clearly.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group rounded-3xl border border-white/10 bg-slate-900/55 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900/70"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                        Focus Area
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-white">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                About
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                A cybersecurity foundation that strengthens network engineering.
              </h2>
              <p className="mt-4 max-w-md leading-7 text-slate-400">
                I design and analyze network infrastructure with an emphasis on
                scalability, performance, and security at the architecture
                level.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/45 p-6 leading-7 text-slate-300 backdrop-blur-md">
              My work is centered on how systems behave in real environments and
              how to build networks that remain stable, efficient, and secure
              under changing conditions.
            </div>
          </div>
        </section>

        <section
          id="projects"
          className="border-y border-white/10 bg-slate-900/25"
        >
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  Projects
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white">
                  Featured labs and case studies
                </h2>
              </div>

              <p className="max-w-2xl text-slate-400">
                Selected work focused on network design, traffic analysis, and
                security implementation through practical lab environments.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.title}
                  className="group rounded-3xl border border-white/10 bg-slate-950/65 p-6 shadow-lg shadow-black/20 backdrop-blur-md transition duration-300 hover:-translate-y-1.5 hover:border-cyan-400/30 hover:shadow-cyan-950/20"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    {project.category}
                  </p>

                  <h3 className="mt-3 text-xl font-semibold text-white">
                    {project.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {project.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Outcome
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {project.outcome}
                    </p>
                  </div>

                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                  >
                    View Project
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </article>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <a
                href={moreProjectsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:border-cyan-300 hover:bg-cyan-400/20"
              >
                See More Projects
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="skills" className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Skills
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Technical strengths
              </h2>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 md:block">
              Secure infrastructure • Traffic analysis • Troubleshooting
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {Object.entries(skills).map(([group, items]) => (
              <div
                key={group}
                className="rounded-3xl border border-white/10 bg-slate-900/45 p-6 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300">
                    {group === "Networking" ? (
                      <Network className="h-4 w-4" />
                    ) : group === "Security" ? (
                      <Shield className="h-4 w-4" />
                    ) : (
                      <Wrench className="h-4 w-4" />
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-white">{group}</h3>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="certifications"
          className="border-y border-white/10 bg-slate-900/25"
        >
          <div className="mx-auto max-w-6xl px-6 py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Certifications
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Certifications
            </h2>

            <div className="mt-8">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Achieved
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {certifications.achieved.map((cert) => (
                  <div
                    key={cert}
                    className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-slate-200 backdrop-blur-md"
                  >
                    <BadgeCheck className="h-5 w-5 text-cyan-300" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-sm uppercase tracking-[0.2em] text-slate-400">
                In Progress
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {certifications.inProgress.map((cert) => (
                  <div
                    key={cert}
                    className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/50 p-6 text-slate-300 backdrop-blur-md"
                  >
                    <BadgeCheck className="h-5 w-5 text-cyan-300" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-6xl px-6 py-16">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-950/80 p-8 backdrop-blur-md md:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Let’s connect
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              You can reach me by email, connect with me on LinkedIn, review my
              work on GitHub, and access my resume directly. I am building a
              portfolio centered on network engineering, practical labs, and
              security-focused infrastructure work.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {contacts.map(({ label, display, href, Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 p-4"
                >
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Icon className="h-4 w-4" />
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {label}
                    </p>
                  </div>

                  <a
                    href={href}
                    target={label === "Email" ? undefined : "_blank"}
                    rel={label === "Email" ? undefined : "noopener noreferrer"}
                    className="mt-2 block text-sm text-slate-200 transition hover:text-cyan-300"
                  >
                    {display}
                  </a>
                </div>
              ))}

              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                <div className="flex items-center gap-2 text-cyan-300">
                  <FolderKanban className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Resume
                  </p>
                </div>

                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-sm text-slate-200 transition hover:text-cyan-300"
                >
                  Open Resume
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}