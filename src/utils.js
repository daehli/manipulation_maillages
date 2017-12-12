////////////////////
THREE.importOBJ.prototype = {

    constructor: THREE.importOBJ,

    load: function ( url, onLoad, onProgress, onError ) {

        var scope = this;

        var loader = new THREE.XHRLoader( scope.manager );
        //loader.setCrossOrigin("*");
        loader.load( url, function ( text ) {

            onLoad( scope.parse( text ) );

        } );

    },

    parse: function ( text ) {

               var geometry = new THREE.Geometry();

               // v float float float
               var vertex_pattern = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

               // f vertex vertex vertex
               var face_pattern = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

               var lines = text.split( '\n' );

               for ( var i = 0; i < lines.length; i ++ ) {

                   var line = lines[ i ];
                   line = line.trim();

                   var res;

                   if ( line.length === 0 || line.charAt( 0 ) === '#' ) {
                       continue;
                   } else if ( ( res = vertex_pattern.exec( line ) ) !== null ) {
                       geometry.vertices.push(
                               new THREE.Vector3( parseFloat(res[1]), parseFloat(res[2]), parseFloat(res[3]) )
                               );
                   } else if ( ( res = face_pattern.exec( line ) ) !== null ) {
                       geometry.faces.push( new THREE.Face3(
                                   parseInt(res[1]) - 1,
                                   parseInt(res[2]) - 1,
                                   parseInt(res[3]) - 1
                                   ) );
                   } else {
                       console.log( "THREE.OBJLoader: Unhandled line " + line );
                   }

               }

               var mesh = new THREE.Mesh( geometry );

               return mesh;

           }

};
////////////////////
