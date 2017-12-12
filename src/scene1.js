var container = document.getElementById("threejsContainer");
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 10;

var renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setClearColor( 0x373E40, 0.6);
renderer.setSize( window.innerWidth, window.innerHeight );
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render );
controls.enableZoom = false;
container.appendChild(renderer.domElement);

// Light
var light = new THREE.PointLight(0xffffff,3,3,3);
light.position.set(0,0,9);
// Light Display
// Ajout de la lumière à la scène
scene.add(camera);
scene.add(light);
// Axis Helper
var axisHelper = new THREE.AxisHelper( 2 );
scene.add( axisHelper );

// Création des cubes

var geometry = new THREE.Geometry();
// Point de chaque Vertices
geometry.vertices.push(
  new THREE.Vector3(-1.0, -1.0, -1.0), // 0 En bas à gauche
  new THREE.Vector3(1.0, 1.0, -1.0),// 1 En bas à droite
  new THREE.Vector3(1.0, -1.0, -1.0),// 2
  new THREE.Vector3(-1.0, -1.0, 1.0),// 3
  new THREE.Vector3(-1.0, 1.0, 1.0),// 4
  new THREE.Vector3(-1.0, 1.0, -1.0),// 5
  new THREE.Vector3(1.0, 1.0, 1.0),// 6
  new THREE.Vector3(1.0, -1.0, 1.0)// 7
);


// geometry.colors.push(
//   new THREE.Color(0xff0000),
//   new THREE.Color(0xB1DDF1),
//   new THREE.Color(0x81B29A),
//   new THREE.Color(0xF4F1DE),
//   new THREE.Color(0xE07A5F),
//   new THREE.Color(0xF2CC8F),
//   new THREE.Color(0xE396DF),
//   new THREE.Color(0xCCE8CC)
// )

// listeCouleur = [
//   new THREE.Color(0xff0000),
//   new THREE.Color(0xB1DDF1),
//   new THREE.Color(0x81B29A),
//   new THREE.Color(0xF4F1DE),
//   new THREE.Color(0xE07A5F),
//   new THREE.Color(0xF2CC8F),
//   new THREE.Color(0xE396DF),
//   new THREE.Color(0xCCE8CC),
//   new THREE.Color(0xCCE8CC),
//   new THREE.Color(0xCCE8CC),
//   new THREE.Color(0xCCE8CC),
//   new THREE.Color(0xCCE8CC)
// ]
// Création des faces

geometry.faces.push(
  // Face Avant
  new THREE.Face3(4,3,7),
  new THREE.Face3(4,6,7),

  // Face Gauche
  new THREE.Face3(6,1,7),
  new THREE.Face3(1,2,7),

  // Face Droite
  new THREE.Face3(4,3,5),
  new THREE.Face3(5,0,3),

  // Face Haut
  new THREE.Face3(4,6,5),
  new THREE.Face3(5,1,4),

  // Face arrière
  new THREE.Face3(5,1,2),
  new THREE.Face3(5,0,2),

  // Face Bas
  new THREE.Face3(3,7,0),
  new THREE.Face3(3,7,2)
);
//
// for (color de geometry.faces){
//   console.log(color);
//   for (couleur of listeCouleur){
//       color.color = couleur
//   }
// }




geometry.computeBoundingBox();




var material = new THREE.MeshBasicMaterial({wireframe:true});
var cube = new THREE.Mesh(geometry,material.clone());

var new_cube = cube.clone();

scene.add(cube);
scene.add(new_cube);
//
// new_cube.material.color = new THREE.Color(0xE07A5F);

// Appliquer une translation de v = [4,4,4,0]
var t = new THREE.Matrix4();
t.set(
  1.0,0.0,0.0,4.0,
  0.0,1.0,0.0,0.0,
  0.0,0.0,1.0,0.0,
  0.0,0.0,0.0,1.0
);
new_cube.applyMatrix(t);

// Appliquer une Rotation X de 45 Degre

var r_x = new THREE.Matrix4();
var c_x = Math.cos(Math.PI/4);
var s_x = Math.sin(Math.PI/4);
r_x.set(
  1,0,0,0,
  0,c_x,-s_x,0,
  0,s_x,c_x,0,
  0,0,0,1
);

// new_cube.applyMatrix(r_x);

// Appliquer une Rotation Y de 45 Degre

var r_y = new THREE.Matrix4();
var c_y = Math.cos(Math.PI/4);
var s_y = Math.sin(Math.PI/4);
r_y.set(
  c_y,0,s_y,0,
  0,1,0,0,
  -s_y,0,c_y,0,
  0,0,0,1
);

// new_cube.applyMatrix(r_y);

// Appliquer une Rotation Z de 45 Degre

var r_z = new THREE.Matrix4();
var c_z = Math.cos(Math.PI/4);
var s_z = Math.sin(Math.PI/4);
r_z.set(
  c_z,-s_z,0,0,
  s_z,c_z,0,0,
  0,0,1,0,
  0,0,0,1
);

// new_cube.applyMatrix(r_z);

// Appliquer un redimenssionnement de l'objet de facteur 2

var s_v = new THREE.Matrix4();
s_v.set(
  2.0,0.0,0.0,0.0,
  0.0,2.0,0.0,0.0,
  0.0,0.0,2.0,0.0,
  0.0,0.0,0.0,1.0
);

// new_cube.applyMatrix(s_v);

//Fonction qui permet l'affichage
function render(){
  requestAnimationFrame(render);
  renderer.render(scene,camera);
}

render();

// http://multivis.net/lecture/phong.html
// http://ruh.li/GraphicsShading.html
// https://openclassrooms.com/courses/les-shaders-en-glsl/communiquer-avec-l-application-attributs-et-uniforms
// http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/
// http://rodrigo-silveira.com/3d-programming-transformation-matrix-tutorial/
// https://www.quora.com/How-do-model-view-and-projection-matrices-work-in-OpenGL?share=1
