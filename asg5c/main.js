// Assignment 5: Three.js 
// Surya Reddy
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';



class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
  }

  let sphere;
  function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  
    const fov = 60;
    const aspect = 2; 
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const scene = new THREE.Scene();
    camera.position.set(0, 1, 2);
  
    // Create texture loader
    const loader = new THREE.TextureLoader();
  
    // Load desert background skybox
    const skyTexture = loader.load('nightdesert.jpg');
    const skyMaterial = new THREE.MeshBasicMaterial({
        map: skyTexture,
        side: THREE.BackSide,
        color: 0x666666, // Darken the texture
        transparent: true,
        opacity: 1.0 // Adjust opacity to make it darker
    });
    const skyGeometry = new THREE.BoxGeometry(25, 25, 25);
    const skybox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skybox);
  
    // Load texture for ground
    const texture = loader.load('concrete.jpg');
    texture.colorSpace = THREE.SRGBColorSpace;
  
    // Create materials
    const material = new THREE.MeshBasicMaterial({ color: 0xFF8844, map: texture });
  
   // Adding point light 
  const pointLightColor = 0xFFFFFF;
  const pointLightIntensity = 150;
  const pointLight = new THREE.PointLight(pointLightColor, pointLightIntensity);
  pointLight.position.set(0, 10, 0);
  scene.add(pointLight);
  const pointLightHelper = new THREE.PointLightHelper(pointLight);
  scene.add(pointLightHelper);


  // Adding directional light
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
  directionalLight.position.set(-1, 2, 4);
  scene.add(directionalLight);

  // Adding ambient light
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
  scene.add(ambientLight);

  const numberOfMeteors = 10; // Number of meteors you want to add
  for (let i = 0; i < numberOfMeteors; i++) {
      const meteor = createMeteorMesh();
      // Randomly position meteors within a designated area
      meteor.position.set(
        Math.random() * 16 - 8, // X-axis, adjust the range from -8 to 8
        Math.random() * 16 - 8, // Y-axis
        Math.random() * 16 - 8  // Z-axis
    );
      // Random rotation
      meteor.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
      );
      scene.add(meteor);
      }


  function updatePointLight() {
    pointLightHelper.update();
  }

  const gui = new GUI();
  gui.addColor(new ColorGUIHelper(pointLight, 'color'), 'value').name('color');
  gui.add(pointLight, 'intensity', 0, 250, 1);
  gui.add(pointLight, 'distance', 0, 40).onChange(updatePointLight);
  makeXYZGUI(gui, pointLight.position, 'position');

  // Adding orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(-20, 3.5, 2);

  controls.update();

  let loadedObject = null;

  {
    const objLoader = new OBJLoader();
    objLoader.load('Porsche_911_GT2.obj', (root) => {
      // Increase the scale factor for a bigger model
      const scaleFactor = 1.5; // Example scale factor, adjust as needed
      root.scale.set(scaleFactor, scaleFactor, scaleFactor);
  
      root.rotation.x = Math.PI / 16; // This rotates the model 90 degrees around the X-axis
  
      // Set the position of the model in the scene
      root.position.set(2, 3, 0); 
  
      // Add the model to the scene
      scene.add(root);
    });
  }



  
    // const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
    // directionalLight.position.set(-1, 2, 4);
    // scene.add(directionalLight);
  
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);

    function createMeteorMesh() {
        // Create the base geometry as an icosahedron
        const geometry = new THREE.IcosahedronGeometry(1, 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0x505050, // dark gray
            roughness: 0.9,
            metalness: 0.1
        });

    const positions = geometry.attributes.position;
    const displacement = 0.2;
    for (let i = 0; i < positions.count; i++) {
        positions.setX(i, positions.getX(i) + (Math.random() - 0.5) * displacement);
        positions.setY(i, positions.getY(i) + (Math.random() - 0.5) * displacement);
        positions.setZ(i, positions.getZ(i) + (Math.random() - 0.5) * displacement);
    }

    // Update the position attribute for the renderer
    positions.needsUpdate = true;

    // Recompute normals after modifying vertices for correct lighting
    geometry.computeVertexNormals();

    // Create the mesh
    const meteor = new THREE.Mesh(geometry, material);
    return meteor;
}



    
    function makeInstance(geometry, color, x, y, z, textured = false) {
        let cubeMaterial;
        if (textured) {
            cubeMaterial = new THREE.MeshStandardMaterial({ map: texture });
        } else {
            cubeMaterial = new THREE.MeshStandardMaterial({ color: color });
        }
        const cube = new THREE.Mesh(geometry, cubeMaterial);
        scene.add(cube);
        cube.position.set(x, y - (geometry.parameters.height ? geometry.parameters.height / 2 : 0), z);
        return cube;
    }

    const cubes = [
        makeInstance(sphereGeometry, 0xCCCCCC, 10, 8, 5, false),
        makeInstance(geometry, 0x7CFC00, 0, 0.18, -4, material),
        makeInstance(geometry, 0x107800, 1, 0.18, -4, material),
        makeInstance(geometry, 0x90e048, 2, 0.18, -4, material),
        makeInstance(geometry, 0x70c048, 3, 0.18, -4, material),
        makeInstance(geometry, 0x7CFC00, 4, 0.18, -4, material),
        makeInstance(geometry, 0xc0f098, 5, 0.18, -4, material),
        makeInstance(geometry, 0x90e048, 0, 0.18, -3, material),
        makeInstance(geometry, 0x7CFC00, 1, 0.18, -3, material),
        makeInstance(geometry, 0x98e070, 2, 0.18, -3, material),
        makeInstance(geometry, 0x107800, 3, 0.18, -3, material),
        makeInstance(geometry, 0x90e048, 4, 0.18, -3, material),
        makeInstance(geometry, 0x7CFC00, 5, 0.18, -3, material),
        makeInstance(geometry, 0xc0f098, 0, 0.18, -2, material),
        makeInstance(geometry, 0x90e048, 1, 0.18, -2, material),
        makeInstance(geometry, 0x7CFC00, 2, 0.18, -2, material),
        makeInstance(geometry, 0xc0f098, 3, 0.18, -2, material),
        makeInstance(geometry, 0x90e048, 4, 0.18, -2, material),
        makeInstance(geometry, 0x107800, 5, 0.18, -2, material),
        makeInstance(geometry, 0xc0f098, 0, 0.18, -1, material),
        makeInstance(geometry, 0x90e048, 1, 0.18, -1, material),
        makeInstance(geometry, 0x7CFC00, 2, 0.18, -1, material),
        makeInstance(geometry, 0x90e048, 3, 0.18, -1, material),
        makeInstance(geometry, 0x70c048, 4, 0.18, -1, material),
        makeInstance(geometry, 0x90e048, 5, 0.18, -1, material),
        makeInstance(geometry, 0x7CFC00, 0, 0.18, 0, material),
        makeInstance(geometry, 0x107800, 1, 0.18, 0, material),
        makeInstance(geometry, 0xc0f098, 2, 0.18, 0, material),
        makeInstance(geometry, 0x90e048, 3, 0.18, 0, material),
        makeInstance(geometry, 0x7CFC00, 4, 0.18, 0, material),
        makeInstance(geometry, 0x90e048, 5, 0.18, 0, material),
        makeInstance(geometry, 0xc0f098, 0, 0.18, 1, material),
        makeInstance(geometry, 0x90e048, 1, 0.18, 1, material),
        makeInstance(geometry, 0x7CFC00, 2, 0.18, 1, material),
        makeInstance(geometry, 0x90e048, 3, 0.18, 1, material),
        makeInstance(geometry, 0xc0f098, 4, 0.18, 1, material),
        makeInstance(geometry, 0x7CFC00, 5, 0.18, 1, material),
        makeInstance(geometry, 0x70c048, 0, 0.18, 2, material),
        makeInstance(geometry, 0x7CFC00, 1, 0.18, 2, material),
        makeInstance(geometry, 0x107800, 2, 0.18, 2, material),
        makeInstance(geometry, 0x70c048, 3, 0.18, 2, material),
        makeInstance(geometry, 0x7CFC00, 4, 0.18, 2, material),
        makeInstance(geometry, 0x70c048, 5, 0.18, 2, material),
        makeInstance(geometry, 0x107800, 0, 0.18, 3, material),
        makeInstance(geometry, 0xc0f098, 1, 0.18, 3, material),
        makeInstance(geometry, 0x70c048, 2, 0.18, 3, material),
        makeInstance(geometry, 0x7CFC00, 3, 0.18, 3, material),
        makeInstance(geometry, 0xc0f098, 4, 0.18, 3, material),
        makeInstance(geometry, 0x7CFC00, 5, 0.18, 3, material),
        makeInstance(geometry, 0x70c048, 0, 0.18, 4, material),
        makeInstance(geometry, 0xc0f098, 1, 0.18, 4, material),
        makeInstance(geometry, 0x7CFC00, 2, 0.18, 4, material),
        makeInstance(geometry, 0x7CFC00, 3, 0.18, 4, material),
        makeInstance(geometry, 0x70c048, 4, 0.18, 4, material),
        makeInstance(geometry, 0xc0f098, 5, 0.18, 4, material),
        //makeInstance(sphereGeometry, 0xCCCCCC, 10, 8, 5, false),
    ];

    sphere = cubes[cubes.length - 1];

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      return needResize;
    }
  
    
    function render(time) {
      time *= 0.001; 
  
      cubes.forEach(cube => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        });

        scene.traverse(object => {
            if (object.isMesh && object.geometry.type === 'IcosahedronGeometry') {
                object.rotation.x += 0.005;
                object.rotation.y += 0.005;
            }
        });
  
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }


  
      renderer.render(scene, camera);
      controls.update();
      requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);
  }
  
main();