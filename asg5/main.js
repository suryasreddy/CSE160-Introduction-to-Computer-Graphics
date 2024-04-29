import * as THREE from 'three';

			import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
			import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
            
            function main() {
                const canvas = document.querySelector('#c');
                const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
            
                const fov = 75;
                const aspect = 2; // the canvas default
                const near = 0.1;
                const far = 100;
                const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
                camera.position.z = 5;
            
                const scene = new THREE.Scene();
            
                {
                    const color = 0xFFFFFF;
                    const intensity = 3;
                    const light = new THREE.DirectionalLight(color, intensity);
                    light.position.set(-1, 2, 4);
                    scene.add(light);
                }
            
                // Define geometries for cube, cylinder, triangle, and sphere
                const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
                const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
                // Define triangle vertices
                const prismVertices = [
                    new THREE.Vector3(0, 1, 0),
                    new THREE.Vector3(-1, -1, 1),
                    new THREE.Vector3(1, -1, 1),
                    new THREE.Vector3(1, -1, -1),
                    new THREE.Vector3(-1, -1, -1)
                ];
                // Create prism geometry
                const prismGeometry = new THREE.BufferGeometry().setFromPoints(prismVertices);
                prismGeometry.setIndex([
                    0, 1, 2,
                    0, 2, 3,
                    0, 3, 4,
                    0, 4, 1,
                    1, 2, 3,
                    1, 3, 4
                ]);
                prismGeometry.computeVertexNormals();
                const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
            
                function makeInstance(geometry, color, x) {
                  const loader = new THREE.TextureLoader();
                  const texture = loader.load('cat.jpg');
                  texture.encoding = THREE.sRGBEncoding; // Set the texture encoding for correct gamma display
                  const material = new THREE.MeshBasicMaterial({
                      color,
                      map: texture,
                  });
                  const mesh = new THREE.Mesh(geometry, material);
                  scene.add(mesh);
                  mesh.position.x = x;
                  return mesh;
              }
              
            
                const shapes = [
                    makeInstance(boxGeometry, 0x44aa88, 0),
                    makeInstance(cylinderGeometry, 0x8844aa, -2),
                    makeInstance(prismGeometry, 0xaa8744, 2),
                    makeInstance(sphereGeometry, 0x3F51B5, 1),
                    makeInstance(cylinderGeometry, 0x4CAF50, -1),
                ];
            
                function render(time) {
                    time *= 0.001; // convert time to seconds
            
                    shapes.forEach((shape, ndx) => {
                        const speed = 1 + ndx * 0.1;
                        const rot = time * speed;
                        shape.rotation.x = rot;
                        shape.rotation.y = rot;
                    });
            
                    renderer.render(scene, camera);
                    requestAnimationFrame(render);
                }
            
                requestAnimationFrame(render);
            }
            
            main();
            
			let camera, scene, renderer;

			let object;
            

            //Code for 3d object taken from threejs/examples source code on the three.js tutorial website
			init();

			function init() {

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20 );
				camera.position.z = 2.5;

				// scene

				scene = new THREE.Scene();

				const ambientLight = new THREE.AmbientLight( 0xffffff );
				scene.add( ambientLight );

				const pointLight = new THREE.PointLight( 0xffffff, 15 );
				camera.add( pointLight );
				scene.add( camera );

				// manager

				function loadModel() {

					object.traverse( function ( child ) {

						if ( child.isMesh ) child.material.map = texture;

					} );

					object.position.y = - 0.95;
					object.scale.setScalar( 0.01 );
					scene.add( object );

					render();

				}

				const manager = new THREE.LoadingManager( loadModel );

				// texture

				const textureLoader = new THREE.TextureLoader( manager );
				const texture = textureLoader.load( 'uv_grid_opengl.jpg', render );
				texture.colorSpace = THREE.SRGBColorSpace;

				// model

				function onProgress( xhr ) {

					if ( xhr.lengthComputable ) {

						const percentComplete = xhr.loaded / xhr.total * 100;
						console.log( 'model ' + percentComplete.toFixed( 2 ) + '% downloaded' );

					}

				}

				function onError() {}

				const loader = new OBJLoader( manager );
				loader.load( 'male02.obj', function ( obj ) {

					object = obj;

				}, onProgress, onError );

				//

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				//

				const controls = new  OrbitControls( camera, renderer.domElement );
				controls.minDistance = 2;
				controls.maxDistance = 5;
				controls.addEventListener( 'change', render );

				//

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function render() {

				renderer.render( scene, camera );

			}

