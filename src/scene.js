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
// var pointLightHelper = new THREE.PointLightHelper(light,1);
// Ajout de la lumière à la scène
scene.add(camera);
scene.add(light);
// scene.add(pointLightHelper);


// GUI
var gui = new dat.GUI();
var parameters = {
  sphereColor: "#ff233b",
  lightColor: "#ffffff",
  lightx:light.position.x,
  lighty:light.position.y,
  lightz:light.position.z
}

var lightX = gui.add(parameters,'lightx').min(-10).max(10).step(1);
var lightY = gui.add(parameters,'lighty').min(-10).max(10).step(1);
var lightZ = gui.add(parameters,'lightz').min(-10).max(10).step(1);

//Création des sphères
var sphere1 = new THREE.SphereGeometry(1,32,32); // 32 est la valeur Maximal
var sphere2 = new THREE.SphereGeometry(1,10,19);
var sphere3 = new THREE.SphereGeometry(1,15,10);

// Appel de nos élément glsl dans le dom
var myVertexShader = document.getElementById("vertexGouraud").textContent;
var myFragmentShader = document.getElementById("fragmentShaderGouraut").textContent;
var myVertexShaderPhong = document.getElementById("vertexPhong").textContent;
var myFragmentShaderPhong = document.getElementById("fragmentPhong").textContent;
// Donnée partagée entre nos vertex & Fragment
var myColorUni = {type:"v3",value:new THREE.Vector3(0,0,0)}
var myLightUni = {type:"v3",value:new THREE.Vector3(120,120,120)}
var myLightColorUni = {type:"v3",value:new THREE.Vector3(0,0,0)}
var mylightPos = {type:"v3",value:light.position}

var myParasUni = {
  couleur: myColorUni,
  lightColor: myLightColorUni,
  lightUni: myLightUni,
  lightPos: mylightPos
}
// Shader
var shaderMaterialSphere = new THREE.ShaderMaterial({vertexShader:myVertexShader,fragmentShader:myFragmentShader,uniforms:myParasUni});
var shaderMaterialSpherePhong = new THREE.ShaderMaterial({vertexShader:myVertexShader,fragmentShader:myFragmentShader,uniforms:myParasUni});


// Importation

var importer = new THREE.importOBJ();
importer.load('../teapot.obj', function(mesh) {
    // mesh.position.x = 4;
    mesh.geometry.colors = "0xC68866";
    mesh.geometry.vertices;
    //mesh.geometry.computeFaceNormals();
    mesh.geometry.computeVertexNormals();
    // for (var i = 0;i<mesh.geometry.faces.length;i++){
    //   if ((mesh.geometry.faces.length%2)==0){
    //     mesh.geometry.faces[i].color = new THREE.Color(0x4F7CAC);
    //   }
    // }

    // computeFaceNormal implémenté
    // for(face of mesh.geometry.faces){
    //
    //   var faceA = face.a;
    //   var faceB = face.b;
    //   var faceC = face.c;
    //
    //   var verticeA = mesh.geometry.vertices[faceA]
    //   var verticeB = mesh.geometry.vertices[faceB]
    //   var verticeC = mesh.geometry.vertices[faceC]
    //
    //   var normal = new THREE.Vector3().crossVectors(
    //     new THREE.Vector3().subVectors(verticeB,verticeC),
    //     new THREE.Vector3().subVectors(verticeC,verticeA)
    //   ).normalize();
    //
    //   face.normal = normal
    //   face.vertexNormals[0] = normal
    //   face.vertexNormals[1] = normal
    //   face.vertexNormals[2] = normal
    // }

    // computeVertexNormals

    var numFaces = 0;
    var tempNorm = new THREE.Vector3();
    var vertexNormal = [];
    var x = 0; var y = 0; var z = 0;
    for (vertex in mesh.geometry.vertices){
        for (face of mesh.geometry.faces){
          if(face.a == vertex || face.b == vertex || face.c ==vertex){
            x +=face.normal.x;
            y +=face.normal.y;
            z +=face.normal.z;
            numFaces++
          }
        }
        var tempNorm = new THREE.Vector3(x/numFaces,y/numFaces,z/numFaces)
        vertexNormal[vertex] = tempNorm;
    }
    // Appliquer la normal à nos vertex
    for(face of mesh.geometry.faces){
      face.vertexNormals[0] = vertexNormal[face.a]
      face.vertexNormals[1] = vertexNormal[face.b]
      face.vertexNormals[2] = vertexNormal[face.c]
    }



    mesh.scale.x = 2;
    mesh.scale.y = 2;
    mesh.scale.z = 2;
    // var helper = new THREE.FaceNormalsHelper(mesh,1,0xC68866,1);
    var helperVertex = new THREE.VertexNormalsHelper(mesh);
    // scene.add(helper);
    scene.add(helperVertex);
    scene.add(mesh);
  // le paramètre mesh est un objet du type THREE.Mesh dont
  // le champ geometry.vertices contient les positions des sommets lus et
  // le champ geometry.faces contient les faces lues (uniquement les indices des sommets a, b et c sont initialisés)
});

//var Sphere1 = new THREE.Mesh(sphere1,shaderMaterialSpherePhong); Sphere1.translateX(-4); Sphere1.translateY(0);
//var Sphere2 = new THREE.Mesh(sphere2,shaderMaterialSpherePhong); Sphere2.translateX(0); Sphere2.translateY(0);
//var Sphere3 = new THREE.Mesh(sphere3,shaderMaterialSpherePhong); Sphere3.translateX(4); Sphere3.translateY(0);


// Lorsqu'on change les couleurs de sphère
var changeSphereColor = gui.addColor(parameters,'sphereColor');
changeSphereColor.onChange(function(colorValue){
  var RGB = new THREE.Color(colorValue);
  shaderMaterialSphere.uniforms.couleur.value.set(RGB.r,RGB.g,RGB.b);
})

var changeLightColor = gui.addColor(parameters,'lightColor');
changeLightColor.onChange(function(colorValue){
  var RGB = new THREE.Color(colorValue);
  shaderMaterialSphere.uniforms.lightColor.value.set(RGB.r,RGB.g,RGB.b);
})

// Changement dans la lumière
lightX.onChange(function(value){
  light.position.x=value;
}); lightX.listen();

lightY.onChange(function(value){
  light.position.y=value;
}); lightY.listen();

lightZ.onChange(function(value){
  light.position.z=value;
}); lightZ.listen();


//Fonction qui permet l'affichage
function render(){
  requestAnimationFrame(render);
  renderer.render(scene,camera);

}

render();

// http://multivis.net/lecture/phong.html
// http://ruh.li/GraphicsShading.html
// https://openclassrooms.com/courses/les-shaders-en-glsl/communiquer-avec-l-application-attributs-et-uniforms
