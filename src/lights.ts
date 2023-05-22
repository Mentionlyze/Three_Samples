import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

const gui = new GUI()

const scene = new Three.Scene()

const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

camera.position.z = 5

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

const ambientLight = new Three.AmbientLight()
ambientLight.color = new Three.Color(0xffffff)
ambientLight.intensity = 0.5
scene.add(ambientLight)

const directionalLight = new Three.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

const hemisphereLight = new Three.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)

const pointLight = new Three.PointLight(0xff9000, 0.5, 10, 2)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

const rectAreaLight = new Three.RectAreaLight(0x4e00ff, 2, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new Three.Vector3())
scene.add(rectAreaLight)

const spotLight = new Three.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

spotLight.target.position.x = -0.75
scene.add(spotLight.target)

// Helpers
const hemisphereLightHelper = new Three.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new Three.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new Three.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new Three.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

const material = new Three.MeshStandardMaterial()
material.side = Three.DoubleSide
material.roughness = 0.4

const sphere = new Three.Mesh(new Three.SphereGeometry(0.5, 32, 32), material)

sphere.position.x = -1.5

const cube = new Three.Mesh(new Three.BoxGeometry(0.75, 0.75, 0.75), material)
cube.position.x = 1.5

const torus = new Three.Mesh(new Three.TorusGeometry(0.3, 0.2, 32, 64), material)

const plane = new Three.Mesh(new Three.PlaneGeometry(5, 5), material)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65

scene.add(sphere, cube, torus, plane)

const clock = new Three.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime
  cube.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  cube.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  // Update controls
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
