    var camera, scene, renderer, // Global camera, scene and renderer object.
        figureObject, 
        bgPlane, 
        isRotating = true,
        animperfunc = [],
        stereo3 = {};

    init();
    animate();

    function init() {
        // NOTE: Scene init.
        scene = new THREE.Scene();
        
        // NOTE: Camera init.
        camera = new THREE.PerspectiveCamera(
            75, // Aspect
            $('#canvasInner').width() / $('#canvasInner').height(), 
            1, // Near.
            10000 // Far.
        );
        
        camera.position.z = 500;
        
        scene.add(camera);

        //NOTE: figureObject init.

        figureObject = new THREE.Object3D();
        figureObject.position.set(0, 0, 0);
        
        scene.add(figureObject);

        // NOTE: render init.

        renderer = new THREE.WebGLRenderer();
        renderer.setSize($('#canvasInner').width(), $('#canvasInner').height());
        renderer.render(scene, camera);
        renderer.setClearColor(0x000000);
        
        $('#canvasInner').append(renderer.domElement);

        // NOTE: Orbit contols init.

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);


    }

    function animate() {
        requestAnimationFrame(animate);

        // Rotate figure.
        if (isRotating) figureObject.rotation.y = Date.now() * 0.001;
        
        controls.update();
        
        // FIXME: ???
        animperfunc.forEach(function (func) {
            func();
        })
        
        renderer.render(scene, camera);
    }

    function render() {
        renderer.render(scene, camera);
    }


    // NOTE:  Sphere_figure *FUNCTION*
    /**
     * SPHERE_FIGURE.
     *
     * @param {Object} options Sphere figure options. (OPTIONAL)
     */
    function Sphere_figure(options) {
        if (typeof sphere_f != "object") {
            
            this.opt = options || {};
            this.radius = this.opt.radius || 200; //deafult is 200
            
            this.pos = this.opt.pos || {
                x: 0,
                y: 0,
                z: 0
            };
            
            this.pos.x = this.pos.x || 0;
            this.pos.y = this.pos.y || 0;
            this.pos.z = this.pos.z || 0;
            
            this.colorHex = this.opt.color || 0x00ff00;
            this.wf = typeof this.opt.wf == "boolean" ? this.opt.wf : true;
            this.sphere_f_radius = {};


            sphere_f = new THREE.Mesh(new THREE.SphereGeometry(this.radius, 32, 32), new THREE.MeshBasicMaterial({
                color: this.colorHex,
                wireframe: this.wf,
                transparent: true,
                opacity: 1
            }));
            
            figureObject.add(sphere_f);
            
            $('#sphere_check').prop('checked', true);
            $('#sphere_check').parent().find('input[type=range]').attr('disabled', false);
            
        } else {
            if (typeof sphere_f == "object") {
                figureObject.add(sphere_f);
                $('#sphere_check').prop('checked', true);
                $('#sphere_check').parent().find('input[type=range]').attr('disabled', false);
            }
            
            return false;
        }
    }

    // NOTE: Sphere_figure prototype remove *FUNCTION*
    /**
     * REMOVE.
     */
    Sphere_figure.prototype.remove = function () {
        figureObject.remove(sphere_f);
        
        $('#sphere_check').prop('checked', false);
        $('#sphere_check').attr('disabled', true);
        $('#sphere_check').parent().find('input[type=range]').attr('disabled', true);
    }

    Sphere_figure.prototype.showRadius = function () {
        if (typeof sphere_f_radius != "object") {
            this.radiusGeometry = new THREE.Geometry();
            this.radiusGeometry.vertices.push(
                new THREE.Vector3(0, 0, 0), 
                new THREE.Vector3(200, 0, 0), 
                new THREE.Vector3(0, 1, 0), 
                new THREE.Vector3(200, 1, 0), 
                new THREE.Vector3(0, 0, 1), 
                new THREE.Vector3(200, 0, 1)
            );
            
            sphere_f_radius = new THREE.Line(
                this.radiusGeometry, 
                new THREE.LineBasicMaterial({
                    color: 0xff0000,
                    linewidth: 10
                })
            );
            
            sphere_f.add(sphere_f_radius);
        } else {
            if (typeof sphere_f_radius == "object")
                sphere_f.add(sphere_f_radius);

            return false;
        }
    }

    // NOTE:     Sphere_figure prototype hideRadius *FUNCTION*
    /**
     * HIDERADIUS.
     */
    Sphere_figure.prototype.hideRadius = function () {
        sphere_f.remove(sphere_f_radius);
    }

    // NOTE:     Sphere_figure prototype showDiametr *FUNCTION*
    /**
     * SHOWDIAMETR.
     */
    Sphere_figure.prototype.showDiametr = function () {
        if (typeof sphere_f_diametr != "object") {
            this.radiusGeometry = new THREE.Geometry();
            this.radiusGeometry.vertices.push(
                new THREE.Vector3(-200, 0, 0), 
                new THREE.Vector3(200, 0, 0), 
                new THREE.Vector3(-200, 1, 0), 
                new THREE.Vector3(200, 1, 0), 
                new THREE.Vector3(-200, 0, 1), 
                new THREE.Vector3(200, 0, 1)
            );
            
            sphere_f_diametr = new THREE.Line(
                this.radiusGeometry, 
                new THREE.LineBasicMaterial({
                    color: 0x00000ff,
                    linewidth: 10
                })
            );
            
            sphere_f.add(sphere_f_radius);
        } else {
            if (typeof sphere_f_diametr == "object")
                sphere_f.add(sphere_f_diametr);
                
            return false;
        }
    }

    // NOTE:     Sphere_figure prototype hideDiametr *FUNCTION*
    /**
     * HIDEDIAMETR.
     */
    Sphere_figure.prototype.hideDiametr = function () {
        sphere_f.remove(sphere_f_diametr);
    }

    // NOTE:     Sphere_figure prototype changeOpacity *FUNCTION*
    /**
     * CHANGEOPACITY.
     *
     * @param {Float} value Opacity. (REQUIRED)
     */
    Sphere_figure.prototype.changeOpacity = function (value) {
        sphere_f.material.opacity = value;
    }

    // NOTE:  Cube_figure *FUNCTION*
    /**
     * CUBE_FIGURE.
     *
     * @param {Object} options Cube figure options. (OPTIONAL)
     */
    function Cube_figure(options) {
        if (typeof cube_f != "object") {
            this.opt = options || {};
            
            this.radius = this.opt.radius || 200; //deafult is 200
            
            this.pos = this.opt.pos || {
                x: 0,
                y: 0,
                z: 0
            };
            
            this.pos.x = this.pos.x || 0;
            this.pos.y = this.pos.y || 0;
            this.pos.z = this.pos.z || 0;
            
            this.colorHex = this.opt.color || 0x00ff00;
            this.wf = typeof this.opt.wf == "boolean" ? this.opt.wf : true;
            
            this.sphere_f_radius = {};

            cube_f = new THREE.Mesh(
                new THREE.BoxGeometry(this.radius, this.radius, this.radius), 
                new THREE.MeshBasicMaterial({
                    color: this.colorHex,
                    wireframe: this.wf,
                    transparent: true,
                    opacity: 1
                })
            );
            
            figureObject.add(cube_f);
            
            $('#cube_check').prop('checked', true);
            $('#cube_check').parent().find('input[type=range]').attr('disabled', false);
        } else {
            if (typeof cube_f == "object") {
                figureObject.add(cube_f);
                
                $('#cube_check').prop('checked', true);
                $('#cube_check').parent().find('input[type=range]').attr('disabled', false);
            }
            
            return false;
        }
    }

    // NOTE:     Cube_figure prototype remove *FUNCTION*
    /**
     * REMOVE.
     */
    Cube_figure.prototype.remove = function () {
        figureObject.remove(cube_f);
        
        $('#cube_check').prop('checked', false);
        $('#cube_check').attr('disabled', true);
        $('#cube_check').parent().find('input[type=range]').attr('disabled', false);
    }

    // NOTE:     Cube_figure prototype showHeights *FUNCTION*
    /**
     * SHOWHEIGHTS.
     */
    Cube_figure.prototype.showHeights = function () {
        if (typeof cube_f_heights != "array") {
            cube_f_heights = [];
            
            for (var i = 0; i < 8; i++) {
                cube_f_heights.push(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), new THREE.MeshBasicMaterial({
                    color: 0xff0000
                })));
                cube_f.add(cube_f_heights[i]);
            }
            
            cube_f_heights[0].position.set(-100, -100, -100);
            cube_f_heights[1].position.set(-100, 100, -100);
            cube_f_heights[2].position.set(-100, 100, 100);
            cube_f_heights[3].position.set(-100, -100, 100);
            cube_f_heights[4].position.set(100, -100, -100);
            cube_f_heights[5].position.set(100, 100, -100);
            cube_f_heights[6].position.set(100, 100, 100);
            cube_f_heights[7].position.set(100, -100, 100);
        } else {
            if (typeof cube_f_heights == "array") {
                cube_f_heights.forEach(function () {
                    cube_f.add(this);
                });
            }
            
            return false;
        }
    }

    // NOTE:     Cube_figure prototype hideHeights *FUNCTION*
    /**
     * HIDEHEIGHTS.
     */
    Cube_figure.prototype.hideHeights = function () {
        for (var i = 0; i < 8; i++) {
            cube_f.remove(cube_f_heights[i]);
        }
    }

    // NOTE:     Cube_figure prototype showBorder *FUNCTION*
    /**
     * SHOWBORDER.
     */
    Cube_figure.prototype.showBorder = function () {
        if (typeof cube_f_border != "object") {
            this.radiusGeometry = new THREE.Geometry();
            this.radiusGeometry.vertices.push(
                new THREE.Vector3(100, 100, 100),
                new THREE.Vector3(100, -100, 100), 
                new THREE.Vector3(101, 100, 100), 
                new THREE.Vector3(101, -100, 100), 
                new THREE.Vector3(100, 100, 101), 
                new THREE.Vector3(100, -100, 101)
            );
            
            cube_f_border = new THREE.Line(
                this.radiusGeometry, 
                new THREE.LineBasicMaterial({
                    color: 0xE16FF5,
                    linewidth: 10
                })
            );
            
            cube_f.add(cube_f_border);
        } else {
            if (typeof cube_f_border == "object")
                cube_f.add(cube_f_border);
            
            return false;
        }
    }

    // NOTE:     Cube_figure prototype hideBorder *FUNCTION*
    /**
     * HIDEBORDER.
     */
    Cube_figure.prototype.hideBorder = function () {
        cube_f.remove(cube_f_border);
    }

    // NOTE:     Cube_figure prototype changeOpacity *FUNCTION*
    /**
     * CHANGEOPACITY.
     *
     * @param {Float} value Opacity. (REQUIRED)
     */
    Cube_figure.prototype.changeOpacity = function (value) {
        cube_f.material.opacity = value;
    }

    // NOTE:  Cylinder_figure *FUNCTION*
    /**
     * CYLINDER_FIGURE.
     *
     * @param {Object} options Cylinder figure options. (OPTIONAL)
     */
    function Cylinder_figure(options) {
        if (typeof cylinder_f != "object") {
            this.opt = options || {};
            
            this.pos = this.opt.pos || {
                x: 0,
                y: 0,
                z: 0
            };
            
            this.pos.x = this.pos.x || 0;
            this.pos.y = this.pos.y || 0;
            this.pos.z = this.pos.z || 0;
            
            this.colorHex = this.opt.color || 0x00ff00;
            this.wf = typeof this.opt.wf == "boolean" ? this.opt.wf : true;
            
            this.rTop = this.opt.rTop || 0;
            this.rBottom = this.opt.rBottom || 200;
            this.height = this.opt.height || 400;
            this.sphere_f_radius = {};


            cylinder_f = new THREE.Mesh(
                new THREE.CylinderGeometry(
                    this.rTop, 
                    this.rBottom, 
                    this.height, 
                    50, 
                    1, 
                    false
                ), 
                
                new THREE.MeshBasicMaterial({
                    color: this.colorHex,
                    wireframe: this.wf,
                    transparent: true,
                    opacity: 1
                })
            );
            
            cylinder_f.height = this.height;
            cylinder_f.rBottom = this.rBottom;
            
            figureObject.add(cylinder_f);
            
            $('#cylinder_check').prop('checked', true);
            $('#cylinder_check').parent().find('input[type=range]').attr('disabled', false);
        } else {
            if (typeof cylinder_f == "object") {
                figureObject.add(cylinder_f);
                $('#cylinder_check').prop('checked', true);
                $('#cylinder_check').parent().find('input[type=range]').attr('disabled', false);
            }
            
            return false;
        }
    }

    // NOTE:     Cylinder_figure prototype remove *FUNCTION*
    /**
     * REMOVE.
     */
    Cylinder_figure.prototype.remove = function () {
        figureObject.remove(cylinder_f);
        
        $('#cylinder_check').prop('checked', false);
        $('#cylinder_check').attr('disabled', true);
        $('#cylinder_check').parent().find('input[type=range]').attr('disabled', false);
    }

    // NOTE:     Cylinder_figure prototype showRadius *FUNCTION*
    /**
     * SHOWRADIUS.
     */
    Cylinder_figure.prototype.showRadius = function () {
        if (typeof cylinder_radius != "object") {
            this.radiusGeometry = new THREE.Geometry();
            this.radiusGeometry.vertices.push(
                new THREE.Vector3(0, -cylinder_f.height * 0.5, 0), 
                new THREE.Vector3(cylinder_f.rBottom, -cylinder_f.height * 0.5, 0),
                new THREE.Vector3(0, -cylinder_f.height * 0.5 + 1, 0), 
                new THREE.Vector3(cylinder_f.rBottom, -cylinder_f.height * 0.5 + 1, 0), 
                new THREE.Vector3(0, -cylinder_f.height * 0.5, 1), 
                new THREE.Vector3(cylinder_f.rBottom, -cylinder_f.height * 0.5, 1)
            );
            
            cylinder_radius = new THREE.Line(this.radiusGeometry, new THREE.LineBasicMaterial({
                color: 0xE16FF5,
                linewidth: 10
            }));
            
            cylinder_f.add(cylinder_radius);
        } else {
            if (typeof cylinder_radius == "object")
                cylinder_f.add(cylinder_radius);
            
            return false;
        }
    }

    // NOTE:     Cylinder_figure prototype hideRadius *FUNCTION*
    /**
     * HIDERADIUS.
     */
    Cylinder_figure.prototype.hideRadius = function () {
        cylinder_f.remove(cylinder_radius);
    }

    // NOTE:     Cylinder_figure prototype showHeight *FUNCTION*
    /**
     * SHOWHEIGHT.
     */
    Cylinder_figure.prototype.showHeight = function () {
        if (typeof cylinder_height != "object") {
            this.heightGeometry = new THREE.Geometry();
            this.heightGeometry.vertices.push(
                new THREE.Vector3(0, -cylinder_f.height * 0.5, 0), 
                new THREE.Vector3(0, cylinder_f.height * 0.5, 0), 
                new THREE.Vector3(1, -cylinder_f.height * 0.5, 0), 
                new THREE.Vector3(1, cylinder_f.height * 0.5, 0), 
                new THREE.Vector3(0, -cylinder_f.height * 0.5, 1), 
                new THREE.Vector3(0, cylinder_f.height * 0.5, 1)
            );
            
            cylinder_height = new THREE.Line(this.heightGeometry, new THREE.LineBasicMaterial({
                color: 0xE16FF5,
                linewidth: 10
            }));
            
            cylinder_f.add(cylinder_height);
        } else {
            if (typeof cylinder_height == "object")
                cylinder_f.add(cylinder_height);

            return false;
        }
    }

    // NOTE:     Cylinder_figure prototype hideHeight *FUNCTION*
    /**
     * HIDEHEIGHT.
     */
    Cylinder_figure.prototype.hideHeight = function () {
        cylinder_f.remove(cylinder_height);
    }

    // NOTE:     Cylinder_figure prototype changeOpacity *FUNCTION*
    /**
     * CHANGEOPACITY.
     *
     * @param {Float} value Opacity. (REQUIRED)
     */
    Cylinder_figure.prototype.changeOpacity = function (value) {
        cylinder_f.material.opacity = value;
    }

    // NOTE:     figureObject changeWireFrame *FUNCTION*
    /**
     * CHANGEWIREFRAME.
     *
     * @param {boolean} wireframeType Use wireframe?. (REQUIRED)
     */
    figureObject.changeWireFrame = function (wireframeType) {
        this.children.forEach(function (element) {
            if (wireframeType) {
                element.material = new THREE.MeshBasicMaterial({
                    color: 0x00ff00,
                    transparent: element.material.transparent,
                    opacity: element.material.opacity
                });
                
                element.material.wireframe = wireframeType;
                
                return false;
            }
            else {
                element.material = new THREE.MeshLambertMaterial({
                    color: 0x00ff00,
                    transparent: element.material.transparent,
                    opacity: element.material.opacity
                });
                
                element.material.wireframe = wireframeType;
                
                return false;
            }
        });

    }

    // NOTE:     figureObject addLights *FUNCTION*
    /**
     * ADDLIGHTS.
     */
    figureObject.addLights = function () {
        scene.figureLights = new THREE.SpotLight(0xffffff);
        scene.figureLights.clone(camera.position);
        
        scene.add(scene.figureLights);
        
        this.updatePos = function (thisfunc) {
            scene.figureLights.position.set(camera.position.x, camera.position.y, camera.position.z);
            scene.figureLights.target.position.set(figureObject.position.x, figureObject.position.y, figureObject.position.z);
        }
        
        animperfunc.push(this.updatePos);
        
        return scene.figureLights;
    }

    figureObject.addLights();





    //================================================== JQUERY =============================================================

    //================================================== JQUERY =============================================================

    function updateSceneSize() {
        camera.aspect = $('#canvasInner').width() / $('#canvasInner').height();
        
        camera.updateProjectionMatrix();
        
        renderer.setSize($('#canvasInner').width(), $('#canvasInner').height());
        
        renderer.render(scene, camera);
    }

    $(window).on('resize', updateSceneSize);

    $('a.figureAdd').on('click', function () {
        $(this).siblings('input[type="checkbox"]').attr('disabled', false);
    });

    $('a.close_switcher').on('click', function () {
        var scn = $(this).parent().parent();
        
        if (scn.hasClass('opened')) {
            scn.css({
                'min-height': 0,
                'padding':0
            });
            
            scn.animate({
                height: 10
            }, "fast")
                .removeClass('opened');
            
            scn.find('div').find('*').not('.close_switcher').not('.close_switcher *').css("display", "none");
        } 
        else {
            scn.animate({
                height: 320
            }, "fast", function() {
                scn.css({
                    height: "auto",
                    minHeight: 320,
                    padding: '20px 0'
                });
            }).addClass('opened');
            
            scn.find('div').find('*').not('.close_switcher').fadeIn("fast", function() {
                scn.find(' > div > div').css('display', 'flex');
            });
        }
        
        return false;
    });

    $('span input[type=range]').on('change', function () {
        switch ($(this).parent().attr('class')) {
            case "sphere":
                figures['sphere'].changeOpacity($(this).val() / 100);
                break;
            case "cube":
                figures['cube'].changeOpacity($(this).val() / 100);
                break;
            case "cylinder":
                figures['cylinder'].changeOpacity($(this).val() / 100);
                break;
        }
    });

    stereo3.mat = false;

    $('#materialCh').on('click', function () {
        if (stereo3.mat) {
            figureObject.changeWireFrame(true);
            
            $(this).css('opacity', 0.6);
            
            stereo3.mat = false;
        } else {
            figureObject.changeWireFrame(false);
            
            $(this).css('opacity', 1);
            
            stereo3.mat = true;
        }
    });