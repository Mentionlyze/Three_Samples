import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'dat.gui'

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

const ambientLight = new Three.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const material = new Three.MeshStandardMaterial()
material.roughness = 0.4
material.side = Three.DoubleSide

const sphere = new Three.Mesh(new Three.SphereGeometry(0.5, 32, 32), material)

const plane = new Three.Mesh(new Three.PlaneGeometry(5, 5), material)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65

scene.add(sphere, plane)

const clock = new Three.Clock()

const tick = () => {
  controls.update()

  renderer.render(scene, camera)

  requestAnimationFrame(tick)
}

tick()
