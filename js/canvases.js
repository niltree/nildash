window.getCanvases = function () {
  var cs = document.querySelectorAll('canvas');
  var canvas1 = cs[0];
  var canvas2 = cs[1];
  var canvas3 = cs[2];
  makeCanvas(canvas1);
  makeCanvas(canvas2);
  makeCanvas(canvas3);
}

window.makeCanvas = function (canvas) {

  // scene size
  var WIDTH = 320;
  var HEIGHT = 150;

  // camera
  var VIEW_ANGLE = 45;
  var ASPECT = WIDTH / HEIGHT;
  var NEAR = 1;
  var FAR = 500;

  var camera, scene, renderer;

  var cameraControls;

  var sphereGroup, smallSphere;

  init();
  animate();

  function init() {

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( WIDTH, HEIGHT );

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
    camera.position.set( 0, 75, 160 );

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set( 0, 40, 0);
    cameraControls.maxDistance = 400;
    cameraControls.minDistance = 10;
    cameraControls.update();

    //

    var planeGeo = new THREE.PlaneBufferGeometry( 100.1, 100.1 );

    // reflectors/mirrors

    var geometry = new THREE.CircleBufferGeometry( 40, 64 );
    var groundMirror = new THREE.Reflector( geometry, {
      clipBias: 0.003,
      textureWidth: WIDTH * window.devicePixelRatio,
      textureHeight: HEIGHT * window.devicePixelRatio,
      color: 0x777777,
      recursion: 1
    } );
    groundMirror.position.y = 0.5;
    groundMirror.rotateX( - Math.PI / 2 );
    scene.add( groundMirror );

    var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
    var verticalMirror = new THREE.Reflector( geometry, {
      clipBias: 0.003,
      textureWidth: WIDTH * window.devicePixelRatio,
      textureHeight: HEIGHT * window.devicePixelRatio,
      color: 0x889999,
      recursion: 1
    } );
    verticalMirror.position.y = 50;
    verticalMirror.position.z = - 50;
    scene.add( verticalMirror );


    sphereGroup = new THREE.Object3D();
    scene.add( sphereGroup );

    var geometry = new THREE.CylinderBufferGeometry( 0.1, 15 * Math.cos( Math.PI / 180 * 30 ), 0.1, 24, 1 );
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x444444 } );
    var sphereCap = new THREE.Mesh( geometry, material );
    sphereCap.position.y = - 15 * Math.sin( Math.PI / 180 * 30 ) - 0.05;
    sphereCap.rotateX( - Math.PI );

    var geometry = new THREE.SphereBufferGeometry( 15, 24, 24, Math.PI / 2, Math.PI * 2, 0, Math.PI / 180 * 120 );
    var halfSphere = new THREE.Mesh( geometry, material );
    halfSphere.add( sphereCap );
    halfSphere.rotateX( - Math.PI / 180 * 135 );
    halfSphere.rotateZ( - Math.PI / 180 * 20 );
    halfSphere.position.y = 7.5 + 15 * Math.sin( Math.PI / 180 * 30 );

    sphereGroup.add( halfSphere );

    var geometry = new THREE.IcosahedronBufferGeometry( 5, 0 );
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x333333, flatShading: true } );
    smallSphere = new THREE.Mesh( geometry, material );
    scene.add(smallSphere);

    // walls
    var planeTop = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
    planeTop.position.y = 100;
    planeTop.rotateX( Math.PI / 2 );
    scene.add( planeTop );

    var planeBottom = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
    planeBottom.rotateX( - Math.PI / 2 );
    scene.add( planeBottom );

    var planeFront = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x7f7fff } ) );
    planeFront.position.z = 50;
    planeFront.position.y = 50;
    planeFront.rotateY( Math.PI );
    scene.add( planeFront );

    var planeRight = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x00ff00 } ) );
    planeRight.position.x = 50;
    planeRight.position.y = 50;
    planeRight.rotateY( - Math.PI / 2 );
    scene.add( planeRight );

    var planeLeft = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xff0000 } ) );
    planeLeft.position.x = -50;
    planeLeft.position.y = 50;
    planeLeft.rotateY( Math.PI / 2 );
    scene.add( planeLeft );

    // lights
    var mainLight = new THREE.PointLight( 0xcccccc, 1.5, 250 );
    mainLight.position.y = 60;
    scene.add( mainLight );

    var greenLight = new THREE.PointLight( 0x00ff00, 0.25, 1000 );
    greenLight.position.set( 550, 50, 0 );
    scene.add( greenLight );

    var redLight = new THREE.PointLight( 0xff0000, 0.25, 1000 );
    redLight.position.set( - 550, 50, 0 );
    scene.add( redLight );

    var blueLight = new THREE.PointLight( 0x7f7fff, 0.25, 1000 );
    blueLight.position.set( 0, 50, 550 );
    scene.add( blueLight );

  }

  function animate() {

    requestAnimationFrame( animate );

    var timer = Date.now() * 0.01;

    sphereGroup.rotation.y -= 0.002;

    smallSphere.position.set(
      Math.cos( timer * 0.1 ) * 30,
      Math.abs( Math.cos( timer * 0.2 ) ) * 20 + 5,
      Math.sin( timer * 0.1 ) * 30
    );
    smallSphere.rotation.y = ( Math.PI / 2 ) - timer * 0.1;
    smallSphere.rotation.z = timer * 0.8;

    renderer.render(scene, camera);
  }
}

window.bigCanvas = function () {
  var container;
  var bigCanvas = document.getElementById('bigCanvas');
  if (!bigCanvas) return;

  var camera, scene, renderer;
  var group;
  var targetRotation = 0;
  var targetRotationOnMouseDown = 0;
  var mouseX = 0;
  var mouseXOnMouseDown = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  init();
  animate();
  function init() {
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 0, 150, 750 );
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );

    scene.add( new THREE.AmbientLight( 0x808080 ) );
    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 1 );
    scene.add( light );
    group = new THREE.Group();
    group.position.y = 50;
    scene.add( group );
    // NURBS curve
    var nurbsControlPoints = [];
    var nurbsKnots = [];
    var nurbsDegree = 3;
    for ( var i = 0; i <= nurbsDegree; i ++ ) {
      nurbsKnots.push( 0 );
    }
    for ( var i = 0, j = 20; i < j; i ++ ) {
      nurbsControlPoints.push(
        new THREE.Vector4(
          Math.random() * 400 - 200,
          Math.random() * 400,
          Math.random() * 400 - 200,
          1 // weight of control point: higher means stronger attraction
        )
      );
      var knot = ( i + 1 ) / ( j - nurbsDegree );
      nurbsKnots.push( THREE.Math.clamp( knot, 0, 1 ) );
    }
    var nurbsCurve = new THREE.NURBSCurve( nurbsDegree, nurbsKnots, nurbsControlPoints );
    var nurbsGeometry = new THREE.BufferGeometry();
    nurbsGeometry.setFromPoints( nurbsCurve.getPoints( 200 ) );
    var nurbsMaterial = new THREE.LineBasicMaterial( { linewidth: 10, color: 0x333333 } );
    var nurbsLine = new THREE.Line( nurbsGeometry, nurbsMaterial );
    nurbsLine.position.set( 200, - 100, 0 );
    group.add( nurbsLine );
    var nurbsControlPointsGeometry = new THREE.BufferGeometry();
    nurbsControlPointsGeometry.setFromPoints( nurbsCurve.controlPoints );
    var nurbsControlPointsMaterial = new THREE.LineBasicMaterial( { linewidth: 2, color: 0x333333, opacity: 0.25, transparent: true } );
    var nurbsControlPointsLine = new THREE.Line( nurbsControlPointsGeometry, nurbsControlPointsMaterial );
    nurbsControlPointsLine.position.copy( nurbsLine.position );
    group.add( nurbsControlPointsLine );
    // NURBS surface
    var nsControlPoints = [
      [
        new THREE.Vector4 ( -200, -200, 100, 1 ),
        new THREE.Vector4 ( -200, -100, -200, 1 ),
        new THREE.Vector4 ( -200, 100, 250, 1 ),
        new THREE.Vector4 ( -200, 200, -100, 1 )
      ],
      [
        new THREE.Vector4 ( 0, -200, 0, 1 ),
        new THREE.Vector4 ( 0, -100, -100, 5 ),
        new THREE.Vector4 ( 0, 100, 150, 5 ),
        new THREE.Vector4 ( 0, 200, 0, 1 )
      ],
      [
        new THREE.Vector4 ( 200, -200, -100, 1 ),
        new THREE.Vector4 ( 200, -100, 200, 1 ),
        new THREE.Vector4 ( 200, 100, -250, 1 ),
        new THREE.Vector4 ( 200, 200, 100, 1 )
      ]
    ];
    var degree1 = 2;
    var degree2 = 3;
    var knots1 = [0, 0, 0, 1, 1, 1];
    var knots2 = [0, 0, 0, 0, 1, 1, 1, 1];
    var nurbsSurface = new THREE.NURBSSurface(degree1, degree2, knots1, knots2, nsControlPoints);
    var map = new THREE.TextureLoader().load( 'textures/UV_Grid_Sm.jpg' );
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;
    function getSurfacePoint( u, v ) {
      return nurbsSurface.getPoint( u, v );
    }
    var geometry = new THREE.ParametricBufferGeometry( getSurfacePoint, 20, 20 );
    var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide } );
    var object = new THREE.Mesh( geometry, material );
    object.position.set( - 200, 100, 0 );
    object.scale.multiplyScalar( 1 );
    group.add( object );
    //
    renderer = new THREE.WebGLRenderer( { antialias: true, canvas: bigCanvas } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    //
    window.addEventListener( 'resize', onWindowResize, false );
  }
  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  //
  function onDocumentMouseDown( event ) {
    event.preventDefault();
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false );
    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
  }
  function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
  }
  function onDocumentMouseUp( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
  }
  function onDocumentMouseOut( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
  }
  function onDocumentTouchStart( event ) {
    if ( event.touches.length == 1 ) {
      event.preventDefault();
      mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
      targetRotationOnMouseDown = targetRotation;
    }
  }
  function onDocumentTouchMove( event ) {
    if ( event.touches.length == 1 ) {
      event.preventDefault();
      mouseX = event.touches[ 0 ].pageX - windowHalfX;
      targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
    }
  }
  //
  function animate() {
    requestAnimationFrame( animate );
    render();
  }
  function render() {
    group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
    renderer.render( scene, camera );
  }
}
