window.onload = function() {
  if (!Detector.webgl) Detector.addGetWebGLMessage();
  var flag = false;//是否开始变换
  var container, stats;
  var camera, scene, renderer, particles, geometry, material, glist = [];// glist 点阵数组
  var around, aroundMaterial, aroundPoints;// 环境点组
  var mouseX = 0, mouseY = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  var objIndex = 0;// 当前点阵模型index
  init();
  animate();
  function init() {
    // renderer 的承载容器
    container = document.createElement('div');
    document.body.appendChild(container);
    // 初始化相机
    camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 10, 10000);
    camera.position.z = 100;
    // 初始化场景
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);// 雾化
    //初始化renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    // 初始化geometry
    geometry = new THREE.Geometry();
    around = new THREE.Geometry();
    // 初始化贴图
    var textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = '';
    var mapDot = textureLoader.load('textures/gradient.png');  // 圆点
    //初始变换点组
    for (let i = 0; i < 10000; i++) {
      var vertex = new THREE.Vector3();
      vertex.x = 800 * Math.random() - 400;
      vertex.y = 800 * Math.random() - 400;
      vertex.z = 800 * Math.random() - 400;
      geometry.vertices.push(vertex);
      geometry.colors.push(new THREE.Color(1, 1, 1));
    }
    material = new THREE.PointsMaterial({ size: 4, sizeAttenuation: true, color: 0xffffff, transparent: true, opacity: 1, map: mapDot });
    material.vertexColors = THREE.VertexColors;
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    //环境点组
    for (let i = 0; i < 500; i++) {
      var vertex = new THREE.Vector3();
      vertex.x = 2000 * Math.random() - 1000;
      vertex.y = 2000 * Math.random() - 1000;
      vertex.z = 2000 * Math.random() - 1000;
      around.vertices.push(vertex);
      around.colors.push(new THREE.Color(1, 1, 1));
    }
    aroundMaterial = new THREE.PointsMaterial({ size: 1, sizeAttenuation: true, color: 0xffffff, transparent: true, opacity: 1, map: mapDot });
    aroundMaterial.vertexColors = THREE.VertexColors;
    aroundPoints = new THREE.Points(around, aroundMaterial);
    scene.add(aroundPoints);
    // 加载模型
    loadObject();
    //添加状态监控面板
    stats = new Stats();
    container.appendChild(stats.dom);
    //事件监听
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener("mousewheel", onDocumentMouseWheel, false);
    document.addEventListener("keydown", onDocumentKeyDown, false);
    window.addEventListener('resize', onWindowResize, false);
  }
  function loadObject() {
    var loader = new THREE.JSONLoader();
    loader.load('obj/game.json', function (geo, materials) {
      var colors = [];
      for (var i = 0; i < geo.vertices.length; i++) {
        colors.push(new THREE.Color("rgb(255, 255, 255)"))
      }
      geo.colors = colors;
      geo.center();
      geo.normalize();
      geo.scale(500, 500, 500)
      geo.rotateX(Math.PI / 4)
      geo.rotateY(-Math.PI / 8)
      glist.push(geo)
    })
    loader.load('obj/head.json', function (geo, materials) {
      var colors = [];
      for (var i = 0; i < geo.vertices.length; i++) {
        colors.push(new THREE.Color(1, 1, 1))
      }
      geo.colors = colors;
      geo.center();
      geo.normalize();
      geo.scale(600, 600, 600)
      glist.push(geo)
    })
    loader.load('obj/book.json', function (geo, materials) {
      var colors = [];
      for (var i = 0; i < geo.vertices.length; i++) {
        colors.push(new THREE.Color(1, 1, 1))
      }
      geo.colors = colors;
      geo.center();
      geo.normalize();
      geo.scale(600, 600, 600)
      glist.push(geo)
    })
    loader.load('obj/movie.js', function (geo, materials) {
      var colors = [];
      for (var i = 0; i < geo.vertices.length; i++) {
        colors.push(new THREE.Color(1, 1, 1))
      }
      geo.colors = colors;
      geo.center();
      geo.normalize();
      geo.scale(800, 800, 800);
      geo.rotateX(Math.PI / 2);
      glist.push(geo)
    })
    loader.load('obj/kv.js', function (geo, materials) {
      geo.center();
      geo.normalize();
      geo.scale(800, 800, 800)
      geo.translate(0, -300, 0)
      glist.push(geo)
    })
  }
  function onDocumentMouseWheel() {
    camera.position.z += event.deltaY;
  }
  function tweenObj(index) {
    geometry.vertices.forEach(function (e, i, arr) {
      var length = glist[index].vertices.length;
      var o = glist[index].vertices[i % length];
      new TWEEN.Tween(e).to({
        x: o.x,
        y: o.y,
        z: o.z
      }, 1000).easing(TWEEN.Easing.Exponential.In).delay(1000 * Math.random()).start();
    })
    camera.position.z = 750;
  }
  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  function onDocumentKeyDown(event) {
    if (event.which == 40 && objIndex < 4) {
      objIndex++;
      tweenObj(objIndex);
      flag = true;
    } else if (event.which == 38 && objIndex > 0) {
      objIndex--;
      tweenObj(objIndex);
      flag = true;
    }
  }
  function onDocumentMouseDown(event) {
    event.preventDefault();
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);
    mouseX = event.pageX;
    mouseY = event.pageY;
  }
  function onDocumentMouseMove(event) {
    geometry.rotateY((event.pageX - mouseX) / 1000 * 2 * Math.PI);
    geometry.rotateX((event.pageY - mouseY) / 500 * 2 * Math.PI);
    event.preventDefault();
    mouseX = event.pageX;
    mouseY = event.pageY;
  }
  function onDocumentMouseUp(event) {//释放鼠标键  
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
  }
  function onDocumentMouseOut(event) {//移走鼠标  
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
  }
  function animate(time) {
    requestAnimationFrame(animate);
    render();
    stats.update();
  }
  function render() {
    if (!flag) {
      geometry.rotateY(Math.PI / 200)
    }
    around.rotateX(Math.PI / 1000)
    TWEEN.update();
    camera.lookAt(scene.position);
    geometry.colors.forEach(function (color) {
      color.setRGB(Math.random() * 1, Math.random() * 1, Math.random() * 1);
    });
    geometry.verticesNeedUpdate = true;
    geometry.colorsNeedUpdate = true;
    renderer.render(scene, camera);
  }
}