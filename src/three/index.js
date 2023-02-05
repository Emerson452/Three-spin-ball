import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
const scene = new THREE.Scene();

//Sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#00FF83",
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
scene.add(light);

//Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

//Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2); //augmenter le nmb de pixels (default = 1)
renderer.render(scene, camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; //amortissement physique
controls.enablePan = false; //suppression du déplacement de l'objet (clique droit)
controls.enableZoom = false; //suppression du zoom (molette)
//Rotation automatique
controls.autoRotate = true;
controls.autoRotateSpeed = 3;

//Resize
window.addEventListener("resize", () => {
  //Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  // mesh.position.x += 0.2
  controls.update(); // animation continue même après le déclic
  //Pas de déformation
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

//Timeline magic
const tl = gsap.timeline({ default: { duration: 1 } }); //synchroniser plusieurs animations ensemble
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 }); //animer quelque chose d'une position à une autre (la c'est une animation de mesh scale)

//Mousse Animation Color
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255), // changement de cette valeur en fonction de la largeur de la page
      Math.round((e.pageY / sizes.height) * 255),
      150, //150 par défaut
    ];
    //animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    new THREE.Color("rgb(0,100,150");
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
