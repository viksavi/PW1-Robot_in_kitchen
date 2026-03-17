import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

//comment the code

function makeWall(scene, texture, color, x, y, z, materialType = 'basic') { // function to create walls
    const wall_g = new THREE.BoxGeometry(0.3, 6, 10);
    const wall_m = materialType === 'standard' //a change to use StandardMaterial for casting shadows in exercise3
        ? new THREE.MeshStandardMaterial({ color, map: texture })
        : new THREE.MeshBasicMaterial({ color, map: texture });
    const wall = new THREE.Mesh( wall_g, wall_m );
    wall.position.x = x
    wall.position.y = y
    wall.position.z = z
    scene.add( wall );
    return wall;
}

function makeKitchenCounter(scene, geometry, texture, x, y, z, materialType = 'basic') { // function to create kitchen counter
    const counter_m = materialType === 'standard' //a change to use StandardMaterial for casting shadows in exercise3
        ? new THREE.MeshStandardMaterial({ color: 0xFFFFFF, map: texture })
        : new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: texture });
    const counter = new THREE.Mesh( geometry, counter_m );
    counter.position.x = x
    counter.position.y = y
    counter.position.z = z
    scene.add( counter );
    return counter;
}

function makeFloor(scene, texture, materialType = 'basic') { // function to create floor
    const floor_g = new THREE.PlaneGeometry( 10, 10 );
    const floor_m = materialType === 'standard' //a change to use StandardMaterial for casting shadows in exercise3
        ? new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide })
        : new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const floor = new THREE.Mesh( floor_g, floor_m );
    floor.rotation.x = -Math.PI / 2;
    scene.add( floor );
    return floor;
}

function makeCup(scene, geometry, material, x, y, z) { // function to create cup
    const cup = new THREE.Mesh( geometry, material );
    cup.position.x = x
    cup.position.y = y
    cup.position.z = z
    scene.add( cup );
    return cup;
}

function makePlate(scene, geometry, x, y, z, materialType = 'basic') { // function to create plate
    const plate_m = materialType === 'standard' //a change to use StandardMaterial for casting shadows in exercise3
        ? new THREE.MeshStandardMaterial({color: 0xACB4B9})
        : new THREE.MeshBasicMaterial({color: 0xACB4B9 });
    const plate = new THREE.Mesh( geometry, plate_m );
    plate.position.x = x
    plate.position.y = y
    plate.position.z = z
    scene.add( plate );
    return plate;
}

function createAmbientLight(scene) { // function to create ambient light
    const color = 0xFFFFFF;
    const intensity = 0.8;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
    return light;
}

function createPointLight(scene) { // function to create point light
    const color = 0xfff8e5;
    const intensity = 86;
    const distance = 12;
    const light = new THREE.PointLight(color, intensity, distance);
    light.position.set(0, 8, 0);
    light.castShadow = true;
    light.shadow.bias = 0.001; // to reduce shadow acne
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.radius = 20;        // higher = softer edges
    light.shadow.blurSamples = 25;  // higher = smoother blur, more GPU cost
    scene.add(light);
    return light;
}

function addGUI(scene, ambientLight, pointLight, cup, plate) { // function to add GUI controls for lights and materials
    const gui = new GUI();
    const ambientLightF = gui.addFolder('Ambient Light');
    ambientLightF.addColor(ambientLight, 'color');
    ambientLightF.add(ambientLight, 'intensity', 0, 2);

    const pointLightF = gui.addFolder('Point Light');
    pointLightF.addColor(pointLight, 'color');
    pointLightF.add(pointLight, 'intensity', 0, 300);
    pointLightF.add(pointLight, 'distance', 0, 20)
    pointLightF.add(pointLight.position, 'x', -10, 10);
    pointLightF.add(pointLight.position, 'y', 0, 10);
    pointLightF.add(pointLight.position, 'z', -10, 10);
    pointLightF.add(pointLight.shadow, 'bias', -0.01, 0.01, 0.001).name('Shadow bias');
    const mapSizes = [256, 512, 1024, 2048, 4096]; // to keep the power of 2 constraint for shadow map sizes
    pointLightF.add(pointLight.shadow.mapSize, 'width', mapSizes)
        .name('mapSize width')
        .onChange(() => { // to dispose the old shadow map and create a new one with the updated size
            pointLight.shadow.map.dispose();
            pointLight.shadow.map = null;
        });

    pointLightF.add(pointLight.shadow.mapSize, 'height', mapSizes)
        .name('mapSize height')
        .onChange(() => {
            pointLight.shadow.map.dispose();
            pointLight.shadow.map = null;
        });

    const plateF = gui.addFolder("Objects");
    plateF.add(cup.material, 'roughness', 0, 1).name('Cup material roughness');
    plateF.add(cup.material, 'transmission', 0, 1).name('Cup material transmission');
    plateF.add(cup.material, 'thickness', 0, 1).name('Cup material thickness');
    plateF.addColor(plate.material, 'color').name('Plate color');  
}

function makeWheel(scene, x, y,z) {
    const wheel = new THREE.Group();
    const tire_g = new THREE.CylinderGeometry( 0.58, 0.58, 0.2, 20 );
    const tire_m = new THREE.MeshStandardMaterial( { color: 0x333333, metalness: 0.6, roughness: 0.5  } );
    const tire = new THREE.Mesh( tire_g, tire_m );
    tire.rotation.z = Math.PI / 2;
    tire.position.set(x, y, z);
    wheel.add(tire);

    const disk_g = new THREE.CylinderGeometry( 0.35, 0.35, 0.21, 20 );
    const disk_m = new THREE.MeshStandardMaterial( { color: 0xa6a6a6, metalness: 0.8, roughness: 0.3  } );
    const disk = new THREE.Mesh( disk_g, disk_m );
    disk.rotation.z = Math.PI / 2;
    disk.position.set(x, y, z);
    wheel.add(disk);

    scene.add(wheel);
    return wheel;
}

function makeGripper(x, y, z, material) {
    const gripper = new THREE.Group();
    gripper.position.set(x, y, z);
    const palm_g = new THREE.SphereGeometry(0.2, 20, 20);
    const palm = new THREE.Mesh( palm_g, material );
    palm.position.set(0, 0, 0);
    gripper.add(palm);

    const finger_g = new THREE.CylinderGeometry(0.07, 0.07, 0.4, 20);
    const finger1 = new THREE.Mesh( finger_g, material );
    finger1.position.set(- 0.1, - 0.3, 0);
    gripper.add(finger1);

    const finger2 = new THREE.Mesh( finger_g, material );
    finger2.position.set(0.1, - 0.3, 0);
    gripper.add(finger2);

    return gripper;
}

function makeArm(x, y, z, material) {
    const shoulder_j = new THREE.Group(); // to handle the pivots
    const shoulder_g = new THREE.SphereGeometry( 0.3, 20, 20 );
    const shoulder = new THREE.Mesh( shoulder_g, material );
    shoulder.position.set(0, 0, 0);
    shoulder_j.position.set(x, y, z);
    shoulder_j.add(shoulder);

    const upperArm_g = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 20);
    const upperArm = new THREE.Mesh( upperArm_g, material );
    upperArm.position.set(0, -0.5, 0);
    shoulder_j.add(upperArm);

    const elbow_j = new THREE.Group(); 
    elbow_j.position.set(0, -1.1, 0);
    const elbow_g = new THREE.SphereGeometry( 0.25, 20, 20 );
    const elbow = new THREE.Mesh( elbow_g, material );
    elbow.position.set(0, 0, 0);
    elbow_j.add(elbow);
    shoulder_j.add(elbow_j);
    
    const lowerArm_g = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 20);
    const lowerArm = new THREE.Mesh( lowerArm_g, material );
    lowerArm.position.set(0, -0.5, 0);
    elbow_j.add(lowerArm);
    
    const gripper = makeGripper(0, -1, 0, material);
    elbow_j.add(gripper);

    shoulder_j.position.set(x, y, z);

    // for debugging the pivots
    shoulder_j.add(new THREE.AxesHelper(1));
    elbow_j.add(new THREE.AxesHelper(0.8));
    gripper.add(new THREE.AxesHelper(0.5));
    
    return { shoulder_j, elbow_j, gripper };
}

function makeRobot(scene) { // function to create a robot
    // body
    const robot = new THREE.Group();
    const robot_m = new THREE.MeshStandardMaterial( { color: 0xa6a6a6, metalness: 0.6, roughness: 0.5 } );
    const body_g = new THREE.CylinderGeometry( 0.9, 0.6, 1.7, 35,  );
    const body = new THREE.Mesh( body_g, robot_m );
    body.position.y = 2;
    robot.add(body);

    // neck
    const neck_g = new THREE.CylinderGeometry( 0.25, 0.25, 0.25, 20 );
    const neck = new THREE.Mesh( neck_g, robot_m );
    neck.position.y = 2.95;
    robot.add(neck);
    
    // head
    const head_g = new RoundedBoxGeometry(1.4, 0.9, 0.8, 8, 0.25);
    const head = new THREE.Mesh( head_g, robot_m );
    head.position.y = 3.5;
    robot.add(head);

    // wheel for legs
    const wheel1 = makeWheel(scene, -0.5, 0.58, 0);
    const wheel2 = makeWheel(scene, 0.5, 0.58, 0);
    robot.add(wheel1);
    robot.add(wheel2);

    // hand with child objects
    const arm1 = makeArm( -1.15, 2.65, 0, robot_m);
    const arm2 = makeArm(1.15, 2.65, 0, robot_m);
    robot.add(arm1.shoulder_j);
    robot.add(arm2.shoulder_j);

    // rotations tests
    arm1.shoulder_j.rotation.y = 0.5; // whole arm 
    arm1.elbow_j.rotation.z = -0.8;   // forearm + gripper
    arm1.gripper.rotation.x = -0.3;    // only gripper
    scene.add( robot );
}

//renderer setup function
function rendererSetup(renderer, scene, camera) {
    function animate( time ) {
        renderer.render( scene, camera);
    }
    renderer.setAnimationLoop( animate );
}

function setUpShadows(renderer, floor, cup, plate, kitchenCounter, walls) { // function to set up shadows for the scene
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    floor.receiveShadow = true;
    cup.castShadow = true;
    plate.castShadow = true;
    kitchenCounter.forEach(counter => {
        counter.receiveShadow = true;
    });
    walls.forEach(wall => {
        wall.receiveShadow = true;
    });
}

// Exercise 1
function ex1({ materialType = 'basic' } = {})
{
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera.position.set(
        -0.5, 
            4.618783233982036, 
        -2
    );
    camera.rotation.set(
        -2.729603214687784, 
        -0.5377845374233825, 
        -2.9213771464536613,
        'XYZ'
    );

    // creating floor texture and floor
    const loader = new THREE.TextureLoader();
    const floor_txt = loader.load( '../textures/1-fine-wood-seamless.jpg' );
    floor_txt.colorSpace = THREE.SRGBColorSpace;
    floor_txt.wrapS = THREE.RepeatWrapping; // to repeat the texture tiles on the floor
    floor_txt.wrapT = THREE.RepeatWrapping;
    floor_txt.repeat.set(10, 4); // number of times the texture is repeated on the floor
    const floor = makeFloor(scene, floor_txt, materialType);
    scene.add(floor);

    const wall_txt = loader.load( '../textures/wallpaper.jpg' );
    wall_txt.colorSpace = THREE.SRGBColorSpace;
    const walls = [ 
        makeWall(scene, wall_txt, 0xFFFFFF, 5, 3, 0, materialType),
        makeWall(scene, wall_txt, 0xFFFFFF, 0, 3, 5, materialType)
    ]; // creating walls
    walls[1].rotation.y = Math.PI / 2

    // creating kitchen counter
    const geometry_c1 = new THREE.BoxGeometry(2, 2.5, 2); 
    const geometry_c2 = new THREE.BoxGeometry(3, 2.5, 2);
    const geometry_c3 = new THREE.BoxGeometry(2.5, 2.5, 2);
    const counter_down_txt = loader.load( '../textures/counter_down.jpg' );
    counter_down_txt.colorSpace = THREE.SRGBColorSpace;

    const geometry_c1_up = new THREE.BoxGeometry(2, 0.1, 2.3);
    const geometry_c2_up = new THREE.BoxGeometry(2.9, 0.1, 2.3);
    const geometry_c3_up = new THREE.BoxGeometry(2.5, 0.1, 2.3);
    const counter_up_txt = loader.load( '../textures/counter_up.jpg' );
    counter_up_txt.colorSpace = THREE.SRGBColorSpace;

    const kitchenCounter = [
        makeKitchenCounter(scene, geometry_c1, counter_down_txt, 4, 1.25, 4, materialType ),
        makeKitchenCounter(scene, geometry_c2, counter_down_txt, 1.5, 1.25, 4, materialType ),
        makeKitchenCounter(scene, geometry_c3, counter_down_txt, -1, 1.25, 4, materialType ),
        makeKitchenCounter(scene, geometry_c1_up, counter_up_txt, 4, 2.5, 4, materialType ),
        makeKitchenCounter(scene, geometry_c2_up, counter_up_txt, 1.6, 2.5, 4, materialType ),
        makeKitchenCounter(scene, geometry_c3_up, counter_up_txt, -1, 2.5, 4, materialType ),
    ];

    // creating cup 
    const cup_g = new THREE.CylinderGeometry( 0.25, 0.15, 0.5, 8 );
    const cup_m = new THREE.MeshPhysicalMaterial({  
        roughness: 0.1,  
        transmission: 1,  
        thickness: 0.1, 
        color: 0xB8D6DE,
        ior: 1.5
    });
    const cup = makeCup(scene, cup_g, cup_m, 0, 2.8, 4);
    scene.add( cup );

    // creating plate
    const plate_g = new THREE.CylinderGeometry( 0.5, 0.3, 0.1, 17 );
    const plate_m = new THREE.MeshBasicMaterial({  color: 0xACB4B9 });
    const plate = makePlate(scene, plate_g, -1, 2.6, 4, materialType);
    scene.add( plate );

    return { scene, camera, renderer, cup, plate, floor, walls, kitchenCounter };
}

export function main_ex1() {
    const { scene, camera, renderer } = ex1({ materialType: 'basic' });
    rendererSetup(renderer, scene, camera);
}

// Exercise 3
function ex3() {
    const { scene, camera, renderer, cup, plate, floor, walls, kitchenCounter } = ex1({ materialType: 'standard' });
    const controls = new OrbitControls( camera, renderer.domElement );
    setUpShadows(renderer, floor, cup, plate, kitchenCounter, walls);
    const ambientLight = createAmbientLight(scene);
    const pointLight = createPointLight(scene);
    addGUI(scene, ambientLight, pointLight, cup, plate);
    return { scene, camera, renderer };
}

export function main_ex3() {
    const { scene, camera, renderer} = ex3();
    rendererSetup(renderer, scene, camera);
}

// Exercise 2
function ex2() {
    const { scene, camera, renderer } = ex1({ materialType: 'basic' });
    return { scene, camera, renderer };
}

export function main_ex2() {
    const { scene, camera, renderer} = ex2();
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr', (envMap) => { //change it to my custom one
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = envMap; // applies to all metallic materials
    });
    const controls = new OrbitControls( camera, renderer.domElement );
    makeRobot(scene);
    
    rendererSetup(renderer, scene, camera);
}