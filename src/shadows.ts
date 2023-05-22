import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'dat.gui'

const gui = new GUI()

const scene = new Three.Scene()

const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

const renderer = new Three.WebGLRenderer({ antialias: true })

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

const textureLoader = new Three.TextureLoader()
const backedShadow = textureLoader.load('/src/assets/textures/backedShadow.jpg')
const simpleShadow = textureLoader.load('/src/assets/textures/simpleShadow.jpg')

const ambientLight = new Three.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

const directionalLight = new Three.DirectionalLight(0x00fffc, 0.3)

directionalLight.castShadow = false
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.near = 6
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2

directionalLight.position.set(2, 2, -1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(directionalLight)

const directionalLightCameraHelper = new Three.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

// Spot light
const spotLight = new Three.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3)
spotLight.castShadow = false

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024

spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

spotLight.shadow.camera.fov = 30

spotLight.position.set(0, 2, 2)
scene.add(spotLight)
scene.add(spotLight.target)

const spotLightCameraHelper = new Three.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)

// Point light
const pointLight = new Three.PointLight(0xffffff, 0.3)

pointLight.castShadow = false

pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024

pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

pointLight.position.set(-1, 1, 0)
scene.add(pointLight)

const pointLightCameraHelper = new Three.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)

const material = new Three.MeshStandardMaterial()
material.roughness = 0.4
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)
material.side = Three.DoubleSide

const sphere = new Three.Mesh(new Three.SphereGeometry(0.5, 32, 32), material)
sphere.castShadow = true

const plane = new Three.Mesh(new Three.PlaneGeometry(5, 5), material)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5

const sphereShadow = new Three.Mesh(
  new Three.PlaneGeometry(1.5, 1.5),
  new Three.MeshStandardMaterial({ color: 0x000000, transparent: true, alphaMap: simpleShadow })
)
sphereShadow.rotation.x = -Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01

scene.add(sphere, sphereShadow, plane)

const clock = new Three.Clock()

renderer.shadowMap.enabled = true
renderer.shadowMap.type = Three.PCFSoftShadowMap

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update the sphere
  sphere.position.x = Math.cos(elapsedTime) * 1.5
  sphere.position.z = Math.sin(elapsedTime) * 1.5
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

  // Update the shadow
  sphereShadow.position.x = sphere.position.x
  sphereShadow.position.z = sphere.position.z
  sphereShadow.material.opacity = (1 - Math.abs(sphere.position.y)) * 0.3

  controls.update()

  renderer.render(scene, camera)

  requestAnimationFrame(tick)
}

tick()
