import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import castleVertex from './shaders/castle/vertex.glsl'
import castleFragment from './shaders/castle/fragment.glsl'
import GUI from 'lil-gui'


/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)



/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */


/**
 * Model
 */
const dayBake = textureLoader.load('textures/dayBake.jpg')
dayBake.flipY = false
const nightBake = textureLoader.load('textures/nightBake.jpg')
nightBake.flipY = false

const castleMaterial = new THREE.ShaderMaterial({
    vertexShader: castleVertex,
    fragmentShader: castleFragment,
    uniforms: {
        'uDay': new THREE.Uniform(dayBake),
        'uNight': new THREE.Uniform(nightBake),
        'uProgress': new THREE.Uniform(0)
    }
})

const doorMaterial = new THREE.MeshBasicMaterial({

})

// const shieldMaterial = new THREE.MeshBasicMaterial({
//     wireframe: true
// })

const ballMaterial = new THREE.MeshBasicMaterial({
    color: 'grey'
})

// let cannon
let rotator
let model
gltfLoader.load(
    'models/baked.glb',
    (gltf) => {
        model = gltf.scene
        // console.log(model.children)
        

        const castle = gltf.scene.children.find(child => child.name === 'Castle')
        rotator = gltf.scene.children.find(child => child.name === 'Rotator')
        // cannon = gltf.scene.children.find(child => child.name === 'Cannon')
        const window = gltf.scene.children.find(child => child.name === 'Window')
        const door = gltf.scene.children.find(child => child.name === 'Door')
        const balls = gltf.scene.children.find(child => child.name === 'Balls')
        // const cannonBall = gltf.scene.children.find(child => child.name === 'CannonBall')
        const bA = gltf.scene.children.find(child => child.name === 'BA')
        const bB = gltf.scene.children.find(child => child.name === 'BB')
        const bC = gltf.scene.children.find(child => child.name === 'BC')
        const catA = gltf.scene.children.find(child => child.name === 'CatA')
        const catB = gltf.scene.children.find(child => child.name === 'CatB')
        const catC = gltf.scene.children.find(child => child.name === 'CatC')
        
        castle.material = castleMaterial
        rotator.material = castleMaterial
        catA.material = castleMaterial
        catB.material = castleMaterial
        catC.material = castleMaterial
        // cannon.material = castleMaterial
        window.material = doorMaterial
        door.material = doorMaterial
        balls.material = ballMaterial
        // cannonBall.material = ballMaterial
        bA.material = ballMaterial
        bB.material = ballMaterial
        bC.material = ballMaterial

        gltf.scene.position.y = -1.5
        scene.add(gltf.scene)
    }
)

// Too Close

function lerpAngle(a, b, t) {
    const delta = ((((b - a) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI
    return a + delta * t
}

// gui
gui.add(castleMaterial.uniforms.uProgress, 'value').min(0).max(1).step(0.001).name('uProgress')


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// window.addEventListener( 'pointermove', onPointerMove )

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(9.13, 4.73, -13.36)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.target.y = 3.5
controls.enableDamping = true
controls.maxDistance = 30
controls.minDistance = 10
controls.maxTargetRadius = 6
controls.panSpeed = 0.75
controls.maxAzimuthAngle =  -Math.PI / 2.25
controls.minAzimuthAngle = Math.PI / 2.25
controls.minPolarAngle = Math.PI / 7
controls.maxPolarAngle = Math.PI / 2

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
// let previousTime = 0

const tick = () =>
{    
    // ElapsedTime
    const elapsedTime = clock.getElapsedTime()
    // const deltaTime = elapsedTime - previousTime
    // previousTime = elapsedTime
    
    // Update controls
    controls.update()
    
    

     if(model && rotator){

        // rotator position
        const rotatorPosition = new THREE.Vector3()
        rotatorPosition.copy(rotator.position)

        // camera position
        const targetPoint = new THREE.Vector3()
        targetPoint.copy(camera.position)

        // distance to camera
        const distanceToCamera = targetPoint.sub(rotatorPosition).normalize()

        // angle
        let targetRotY = Math.atan2(distanceToCamera.x, distanceToCamera.z)

        // rotate it
        targetRotY += Math.PI

        // lerp
        rotator.rotation.y = lerpAngle(rotator.rotation.y, targetRotY, 0.04)
    }
    
    // Render
    renderer.render(scene, camera)   

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()