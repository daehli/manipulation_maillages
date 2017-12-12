# Manipulation de maillages

Présenté par **Daehli Nadeau-Otis**

## Cross-origin

Ma première difficulté dans ce travail fut, le `Cross origin` (croc). J'ai commencé par commenter une ligne dans le loaderOBJ `loader.setCrossOrigin("*");`. Par la suite, j'ai essayé de changer le `Header` avec **Modify Headers** avec l’option suivante:

| Name        | Value           |
| ------------- |:-------------:|
| Access-Control-Allow-Origin    | * |

Le résultat n'était pas concluant. J'avais toujours le même problème. J'ai pensé faire un simple serveur avec des fichiers statiques à l'intérieur.Par contre, ce n'était pas l'objectif du TP.

Un de mes camarades est venu à ma rescousse avec la commande suivante :
`$ open -a Google\ Chrome --args --disable-web-security --user-data-dir`

## Manipulation des normales

Maintenant que notre objet complexe est instancié dans three.js. Il est possible de faire des calculs sur ces vertices. Chaque vertice, est lié avec 2 autres vertices pour former un triplet de vertices(point dans un plan). Ce triplet construit est une face de l'objet.

À partir des faces, il est possible de calculer la normale. La normale est un vecteur perpendiculaire à la face de l'objet.

La commutation des normales des faces a été implémenter comme ceci.

```javascript
// Notre objet est loadé
// ...
for(face of mesh.geometry.faces){

  var faceA = face.a;
  var faceB = face.b;
  var faceC = face.c;

  var verticeA = mesh.geometry.vertices[faceA]
  var verticeB = mesh.geometry.vertices[faceB]
  var verticeC = mesh.geometry.vertices[faceC]

  var normal = new THREE.Vector3().crossVectors(
    new THREE.Vector3().subVectors(verticeB,verticeC),
    new THREE.Vector3().subVectors(verticeC,verticeA)
  ).normalize();

  face.normal = normal
  face.vertexNormals[0] = normal
  face.vertexNormals[1] = normal
  face.vertexNormals[2] = normal
}

// Un utilitaire pour voir la normale des faces
var helper = new THREE.FaceNormalsHelper(mesh,1,0xC68866,1);
```

L’objet est dans l'espace euclidien $`R^3`$, le produit vectoriel est réalisé avec 2 vecteurs, soit $`\vec{u}`$ et $`\vec{v}`$ qui ont été obtenu sur trois points $`(A,B,C)`$.

$`\vec{u} = \vec{BC}`$ et $`\vec{v} = \vec{CA}`$

Ensuite, il faut faire  le produit vectoriel $`||\vec{u} \wedge \vec{v}||`$ et on le normalise.  

|Normale des Faces|
|---|
|![alt text][faceNormal]|

La deuxième fonction qui devait être implémentée est `computeVertexNormals`. Cette fonction retourne la moyenne des vertices sur chaque point des faces.

```javascript
// Notre objet est loadé
var numFaces = 0;
var tempNorm = new THREE.Vector3();
vertexNormal = [];
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
// Un utilitaire pour voir la moyenne des vecteurs
var helperVertex = new THREE.VertexNormalsHelper(mesh,0.2,0xC68866,1);
```


## NaN

Qu'est ce que c'est un `NaN`. J'ai débuté par programmer ma fonction `computeVertexNormals`. J'étais sûre que ma fonction était implémentée convenablement pour résoudre le problème des moyennes des vertices sur une face. J'ai décidé d'utiliser le débogueur de Chrome pour voir ce qui se produisait dans ma fonction. J'ai découvert que toutes mes variables déclarées plus haut. Devenait des `NaN`. J'ai fait quelques recherches et j'ai découvert que `NaN`est une abréviation pour  `Not-a-Number`.

J'ai eu quelques soucis, avec ce type de variable. En fait, j'ai eux beaucoup de soucis. Car, les variables qui devait être des nombres ou des Vecteurs ce transformait en `NaN`. Il était donc impossible de les réassigner à un autre type de variable. Étant donné que JavaScript est un langage non typé. Je ne pouvais pas choisir le type de mes variables lors de la déclaration.

Voici un exemple clair pour illustrer le problème de typage de JavaScript

```javascript
var nombre;

for(var i = 1; i<=10;i++){
  if(i%5==0){
    // Si i est diviseur de 5
    nombre += i;
    // on l'ajoute à nombre
  }
}

console.log(nombre)
// Résultat attendu : 15
// Résultat obtenu : NaN
```

La console aurait dû indiquer 15. En fait, elle retournait `NaN`.Il semble que `NaN` soit un type de variable. Il doit surement exister un type Nombre dans JavaScript. Voici comment j'ai trouvé le type de nombre.

```javascript
typeof(4)
// Retourne "Number"
```

J'ai repris mon code et j’ai  assigné la valeur `Number` à mes variables.

```javascript
var nombre = Number;

for(var i = 1; i<=10;i++){
  if(i%5==0){
    // Si i est diviseur de 5
    nombre += i;
    // on l'ajoute à nombre
  }
}

console.log(nombre)
// Résultat attendu : 15
// Résultat obtenu : function Number() { [native code] }510
```

Alors maintenant, j'étais dans une fâcheuse situation. Je ne pouvais même pas déclarer mes variables et en plus je ne pouvais pas leur assigner de nouvelles valeurs. L'horreur pour un programmeur.

J'ai ouvert ma console dans mon navigateur web et j'ai tapé la commande suivante.


```javascript
var nombre = 0;

// Résultat : nombre = 0

typeof(nombre)
// Résultat: "number"
```

Et si je changeais ma variable `var nombre;` par `var nombre = 0;` dans ma simple fonction pour voir ce qui se passe.

```
var nombre = 0;

for(var i = 1; i<=10;i++){
  if(i%5==0){
    // Si i est diviseur de 5
    nombre += i;
    // on l'ajoute à nombre
  }
}

console.log(nombre)
// Résultat attendu : 15
// Résultat obtenu : 15
```

Je ne pouvais pas en croire mes yeux. JavaScript était censé être un langage flexible. Il est possible de redéfinir des valeurs dans les variables à tout moment. Si nous ne déclarons aucun type (string,number,Vector3) JavaScript, lui donne comme type `NaN`. Dans l'exemple, il est possible de voir les limitations de JavaScript pour la déclaration dynamique. Malgré tout, JavaScript reste un langage très flexible, mais parfois il lui arrive de faire des résultats inattendus.  

### Les bases WebGl

Il me semble très intéressant de connaitre les bases en WebGl, puisque `three.js` est une librairie qui simplifie l'utilisation de WebGL.

WebGl est en fait une API de pixélisation et non une API de 3D.


### WebGl Vs OpenGL

Il est important de faire une distinction entre WebGl et OpenGl. Il y a beaucoup de tutoriels sur OpenGl et WebGl. La différence entre les deux peut parfois devenir une confusion pour le programmeur. En fait, WebGl est un sous-ensemble de OpenGl. Il permet d'être utilisé directement sur un navigateur web.  


## Model Vue Projection Matrix (MVP)

Dans ce TP, je me suis davantage intéressé au Matrix de projection, vue et modèle. Je n'avais pas très bien compris comment ces matrices fonctionnaient. Je suis retourné dans mes anciens cours de mathématique (Algèbre linéaire). J'ai commencé par revoir mes matrices et les vecteurs.

### Espace modèle (Model Space)

L'espace modèle est défini par des points dans un espace 3D autour de l'origine. Prenons la forme d’un carré centré à l'origine par (0,0,0).

```javascript
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
```

Tous les triplets de coordonnée représentent un vertice du cube à l'origine. Maintenant, nous devons lier chacun des vertices pour former les faces du cube.


``` javascript
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
```

Maintenant,la forme est centrée en `(0,0,0)`. La longueur des axes est de longueur 2. On peut voir que les axes font 2 fois la longueur de notre cube sur chaque face.

|Taille du Cube|
|---|
|![alt text][longueur]|

### World Space

L'espace du monde est l'espace dans lequel les objets **vivent**. L'axe des $`Z`$ peut représenté le nord. L'axe des $`X`$ pourraient être vu comme l'ouest et l'est. Le sud pourrait être $`Y`$. Dans cet espace, nous pouvons appliquer différentes formules mathématiques pour modifier les objets.

Il est possible d’appliquer des rotations sur différents axes.


Rotation sur l'axe des $`X`$
```math
R_x(\theta) =  
\begin{bmatrix}
1 &
0 &
0 &
\\
0 &
\cos(\theta) &
-\sin(\theta) &
\\
0 &
\sin(\theta)&
\cos(\theta)&
\end{bmatrix}
```
On fait une rotation de 45 degré à notre object sur l'axe des $`X`$

```javascript
// Appliquer une Rotation X de 45 degré

var r_x = new THREE.Matrix4();
var c_x = Math.cos(Math.PI/4);
var s_x = Math.sin(Math.PI/2);
r_x.set(
  1,0,0,0,
  0,c_x,-s_x,0,
  0,s_x,c_x,0,
  0,0,0,1
);
```

Une rotation sur l'axe des $`Y`$

```math
R_y(\theta) =  
\begin{bmatrix}
\cos(\theta) &
0 &
\sin(\theta) &
\\
0 &
1 &
0 &
\\
-\sin(\theta) &
0 &
\cos(\theta)&
\end{bmatrix}
```

Il est aussi possible d'appliquer une rotation sur l'axe des Y.

```javascript
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
```

Une Rotation sur l'axe des $`Z`$

```math
R_z(\theta) =  
\begin{bmatrix}
\cos(\theta) &
-\sin(\theta) &
0 &
\\
\sin(\theta) &
\cos(theta) &
0 &
\\
0 &
0 &
1 &
\end{bmatrix}
```

Pour conclure, il est aussi possible de faire la rotation sur l'axe des $`Z`$

```javascript
// Appliquer une Rotation Z de 45 Degré

var r_z = new THREE.Matrix4();
var c_z = Math.cos(Math.PI/4);
var s_z = Math.sin(Math.PI/4);
r_z.set(
  c_z,0,s_z,0,
  0,1,0,0,
  -s_z,0,c_z,0,
  0,0,0,1
);
```

Ces rotations agissent toutes différemment sur l'objet.Elles  appliquent toutes une rotation différente sur chacun des axes.

|$`R_x(\theta)`$|$`R_y(\theta)`$|$`R_z(\theta)`$|
|---|---|---|
|![alt text][axe_x]|![alt text][axe_y]|![alt text][axe_z]

Il est aussi possible d'agrandir ou de diminuer la taille de notre objet avec notre matrice.

```math
S_v =  
\begin{bmatrix}
S_x &
0 &
0
\\
0 &
S_y &
0
\\
0 &
0 &
S_z
\end{bmatrix}
```
Les valeurs de $`S_v`$  remplacent les valeurs qui sont normalement les valeurs de la matrice identité. $`S_v`$ agit seulement sur la taille de l'objet. Dans l'image qui suit, le cube est 2 fois plus grand que l'original.

|Redimensionnement de 2|
|---|
|![alt text][scale]|


La translation permet de déplacer l'objet dans l'espace du monde. Le vecteur appliqué sur la matrice va déplacer l'objet dans une direction.

```math
T_v =  
\begin{bmatrix}
1 &
0 &
0 &
v_x &
\\
0 &
1 &
0 &
v_y &
\\
0 &
0 &
1 &
v_z &
\\
0 &
0 &
0 &
1 &
\end{bmatrix}
```

La matrice principale est devenue une matrice 4X4 pour pouvoir appliquer les trois actions possibles(rotation,redimensionnement,translation) en même temps. La dernière ligne est représentée comme la continuité de la matrice identité. Le cube a été translaté de 4 positions sur l'axe des $`X`$.

|Translation de 4 sur l'axe des $`X`$|
|---|
|![alt text][translation]|





[axe_x]: https://git.unistra.fr/nadeauotis/P4x/raw/master/TP3/images/axe_x.png
[axe_y]: https://git.unistra.fr/nadeauotis/P4x/raw/master/TP3/images/axe_y.png
[axe_z]: https://git.unistra.fr/nadeauotis/P4x/raw/master/TP3/images/axe_z.png
[translation]: https://git.unistra.fr/nadeauotis/P4x/raw/master/TP3/images/translation.png
[scale]: https://git.unistra.fr/nadeauotis/P4x/raw/master/TP3/images/scale.png
[longueur]: /assets/longeur.png
[faceNormal]: https://git.unistra.fr/nadeauotis/P4x/raw/master/TP3/images/faceNormal.png
