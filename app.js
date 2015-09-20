      var scene, camera, render, text, originGeom, abTextGeom, wdTextGeom, fullGeom, composer;

      function init() {
          scene = new THREE.Scene();

          camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);
          scene.add(camera);

          abTextGeom = new THREE.TextGeometry("</WEB-design>", {

              size: 7,
              height: 3,
              curveSegments: 1,

              font: "droid sans",
              weight: "normal",
              style: "normal",

              bevelThickness: 1,
              bevelSize: 1.1,
              bevelEnabled: false,

              material: 1,
              extrudeMaterial: 1

          });

          abTextGeom.computeBoundingBox();
          abTextGeom.computeVertexNormals();

          var centerX = 0.5 * (abTextGeom.boundingBox.max.x - abTextGeom.boundingBox.min.x);
          var centerY = 0.5 * (abTextGeom.boundingBox.max.y - abTextGeom.boundingBox.min.y);
          var centerZ = 0.5 * (abTextGeom.boundingBox.max.z - abTextGeom.boundingBox.min.z);

          abTextGeom.dynamic = true;
          abTextGeom.verticesNeedUpdate = true;

          fullGeom = abTextGeom.clone();

          wdTextGeom = new THREE.TextGeometry("by Alexander Buzin", {

              size: 3,
              height: 3,
              curveSegments: 10,

              font: "lobster",
              weight: "normal",
              style: "normal",

              bevelThickness: 2,
              bevelSize: 1.5,
              bevelEnabled: false,

              material: 1,
              extrudeMaterial: 1

          });

          wdTextGeom.computeBoundingBox();
          wdTextGeom.computeVertexNormals();

          var wdcenterX = 0.5 * (wdTextGeom.boundingBox.max.x - wdTextGeom.boundingBox.min.x);
          var wdcenterY = 0.5 * (wdTextGeom.boundingBox.max.y - wdTextGeom.boundingBox.min.y);
          var wdcenterZ = 0.5 * (wdTextGeom.boundingBox.max.z - wdTextGeom.boundingBox.min.z);

          wdTextGeom.dynamic = true;
          wdTextGeom.verticesNeedUpdate = true;

          var wdText = new THREE.Mesh(wdTextGeom, new THREE.MeshLambertMaterial({
              color: 0xD97904,
              transparent: true,
              opacity: 0
          }));
          wdText.position.set(-wdcenterX, -wdcenterY, -50 - wdcenterZ);
          //wdText.visible = false;
          scene.add(wdText);

          // NOTE: Make triangles from geometry.

          var newGeom = new THREE.Object3D();
          var oldGeom = new THREE.Object3D();

          abTextGeom.faces.forEach(function (face, index) {

              var plusOrMinus1 = Math.random() < 0.5 ? -1 : 1;
              var plusOrMinus2 = Math.random() < 0.5 ? -1 : 1;
              var plusOrMinus3 = Math.random() < 0.5 ? -1 : 1;

              var _diff = 50;

              var xr = Math.random() * _diff * plusOrMinus1;
              var yr = Math.random() * _diff * plusOrMinus2;
              var zr = Math.random() * _diff * plusOrMinus3;

              var triangleback = new THREE.Geometry();

            [].push.apply(triangleback.vertices, [
                    abTextGeom.vertices[face.a],
                    abTextGeom.vertices[face.b],
                    abTextGeom.vertices[face.c]
            ]);

              triangleback.faces.push(new THREE.Face3(0, 1, 2));

              var triangleMeshold = new THREE.Mesh(triangleback, new THREE.MeshBasicMaterial({
                  color: 0x000000
              }));

              oldGeom.add(triangleMeshold);

              var triangle = new THREE.Geometry();

            [].push.apply(triangle.vertices, [
                    abTextGeom.vertices[face.a],
                    abTextGeom.vertices[face.b],
                    abTextGeom.vertices[face.c]
            ]);

              triangle.faces.push(new THREE.Face3(0, 1, 2));

              triangle.faceVertexUvs[0].push([
                new THREE.Vector2(0, 0),
                new THREE.Vector2(0, 0.1),
                new THREE.Vector2(0.1, 0.1),
                new THREE.Vector2(0.1, 0),
            ]);

              triangle.computeFaceNormals();

              var triangleMesh = new THREE.Mesh(triangle, new THREE.MeshPhongMaterial({
                  color: 0xF2B705
              }));

              triangleMesh.position.x += xr;
              triangleMesh.position.y += yr;
              triangleMesh.position.z += zr;
              triangleMesh.rotation.x += xr / 1000;
              triangleMesh.rotation.y += yr / 1000;

              newGeom.add(triangleMesh);
          });




          newGeom.children.forEach(function (vert, index) {
              var tween = new TWEEN.Tween(vert.position).to(oldGeom.children[index].position, 5000)
                  .easing(TWEEN.Easing.Cubic.In);
              tween.onUpdate(function () {
                  vert.position.x = this.x;
                  vert.position.y = this.y;
                  vert.position.z = this.z;
                  vert.rotation.x = this.x / 100;
                  vert.rotation.y = this.y / 100;
              });

              // FIXME: use this func.
              tween.onComplete(function () {
                  newGeom = fullGeom;
              });

              tween.start();

          })

          text = newGeom;

          newGeom.position.set(-centerX, -centerY + 10, -50 - centerZ);
          scene.add(newGeom);




          // NOTE: light.

          var light = new THREE.PointLight(0xffffff, 1);
          light.position = camera.position;

          scene.add(light);

          renderer = new THREE.WebGLRenderer();
          renderer.setClearColor(0xF2F2F2);
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.render(scene, camera);

          $(renderer.domElement).css({
              'width': '100%',
              'height': '100%'
          });

          $(renderer.domElement).attr('');

          $('body').append(renderer.domElement);

          $('body').css({
              'margin': 0,
              'padding': 0,
              'position': 'relative',
              'overflow': 'hidden'
          });


          composer = new WAGNER.Composer(renderer);
          composer.setSize(window.innerWidth, window.innerHeight);
          renderer.autoClearColor = true;
          composer.reset();
          composer.render(scene, camera);


          var wrZB = new WAGNER.ZoomBlurPass();
          wrZB.params.strength = .025;
          wrZB.params.center.set(.5 * composer.width, .5 * composer.height);
          composer.pass(wrZB);

          var wrVP = new WAGNER.VignettePass();
          wrVP.params.amount = 0.7;
          wrVP.params.falloff = 0.2;

          var wrNP = new WAGNER.NoisePass();
          wrNP.params.amount = 0.1;
          wrNP.params.speed = 0.3;

          var wrDP = new WAGNER.DirtPass();


          composer.eff = [];

          composer.eff.push(wrZB);
          composer.eff.push(wrVP);
          composer.eff.push(wrDP);
          composer.eff.push(wrNP);

          animate();

          var tween2 = new TWEEN.Tween({
                  space: 400
              }).to({
                  space: 250
              }, 5000)
              .easing(TWEEN.Easing.Cubic.In)
              .onUpdate(function () {
                  $('#content ul').css('width', this.space);
                  $('#content').css('left', $(window).width() * 0.5 - $('#content').width() * 0.5);
                  wdText.material.opacity = (-this.space + 400) / 150;
              }).start();

          $('#content').fadeIn(5000);
      }

      function animate(time) {
          requestAnimationFrame(animate);

          TWEEN.update(time);

          composer.reset();
          composer.render(scene, camera);

          composer.eff.forEach(function (effect, index) {
              composer.pass(effect);
          })

          composer.toScreen();
      }


      function changeLocation() {
          var wrPP = new WAGNER.PixelatePass();;
          wrPP.params.amount = 640;

          composer.eff.push(wrPP);

          var tweenpixel = new TWEEN.Tween({
                  space: 640
              }).to({
                  space: 1
              }, 500)
              .easing(TWEEN.Easing.Circular.Out)
              .onUpdate(function () {
                  wrPP.params.amount = this.space;
              }).onComplete(function() {
                  var tweenpixel2 = new TWEEN.Tween({
                      space: 1
                  }).to({
                      space: 650
                  }, 500)
                  .easing(TWEEN.Easing.Circular.In)
                  .onUpdate(function () {
                      wrPP.params.amount = this.space;
                  }).onComplete(function() {
                      composer.eff.slice(0, composer.eff.length-1);
                  }).start();
              }).start();
      }



      $(document).on('mousemove', function (e) {
          var tx = e.clientX - window.innerWidth * 0.5;
          var ty = e.clientY - window.innerHeight * 0.5;

          camera.position.x = -tx / 15;
          camera.position.y = ty / 50;
          camera.lookAt(new THREE.Vector3(-tx / 100, ty / 100, -50));
      });

      $(window).on('load resize', function () {
          $('#content').css('left', $(window).width() * 0.5 - $('#content').width() * 0.5);

          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();

          renderer.setSize(window.innerWidth, window.innerHeight);
          composer.setSize(window.innerWidth, window.innerHeight);
      });

      init();
