import * as THREE from 'https://unpkg.com/three@0.142.0/build/three.module.js';
import {GLTFLoader} from './three.js-master/three.js-master/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from './three.js-master/three.js-master/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from './node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './node_modules/three/examples/jsm/postprocessing/RenderPass.js';

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()


const loader = new GLTFLoader()
loader.load('assets/wizard.glb', function(glb){
    glb.scene.traverse( function( child ) {

        if ( child.isMesh ) {

            child.material.shading = THREE.SmoothShading;
            child.castShadow = true;
            child.receiveShadow = true;
        }


    } );
    console.log(glb)
    const root = glb.scene;
    root.scale.set(1.9,0.35,1)
    scene.add(root);
}, function(xhr){
    console.log((xhr.loaded/xhr.total * 100) + "% loaded")
}, function(error){
    console.log('An error occured')
})




//Boiler Plate Cod

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 100)
camera.position.set(0,.6,2);
camera.near = 0.01;
camera.lookAt(scene.position); //add this line
scene.add(camera)
var container = document.getElementById( 'intro' );
document.body.appendChild( container );
const renderer = new THREE.WebGL1Renderer({
    canvas: canvas
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate = true
controls.autoRotateSpeed = 1


renderer.setSize(window.innerWidth, window.innerHeight)

window.addEventListener('resize', function(){
    var width = window.innerWidth
    var height = window.innerHeight
    renderer.setSize( width, height )
    camera.aspect = width / height 
    camera.updateProjectionMatrix()
})


const light = new THREE.AmbientLight(0xffffff, 1.5)
const dirlight = new THREE.DirectionalLight(0xfffff0, 0.5)

dirlight.position.set(1, 2, 1)


scene.add(dirlight, light)

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaOutput = true
renderer.render(scene, camera)
renderer.setClearColor( 0x000000, 0 );
renderer.castShadow = true;
renderer.recieveShadow = true;
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap;

container.appendChild( renderer.domElement );

const composer = new EffectComposer( renderer );
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

function animate(){
    controls.update()
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    composer.render();
}

animate()

const hamburger = document.querySelector('.hamburger');


hamburger.addEventListener('click', function () {
    this.classList.toggle('is-active');
})
