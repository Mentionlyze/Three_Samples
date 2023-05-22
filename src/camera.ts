import * as Three from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const cursor = { x: 0, y: 0 }

window.addEventListener('mousemove', (event) => {
  cursor.x = (event.clientX / window.innerWidth) * 2 - 1
  cursor.y = 1 - (event.clientY / window.innerHeight) * 2

  console.log(cursor)
})

const scene = new Three.Scene()
const axesHelper = new Three.AxesHelper(5)
// scene.add(axesHelper)
const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

camera.position.z = 5

const renderer = new Three.WebGLRenderer({ antialias: true })

const controls = new OrbitControls(camera, renderer.domElement)

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

const geometry = new Three.BoxGeometry(1, 1, 1, 3, 4, 5)
const material = new Three.MeshBasicMaterial({ color: 0xffff3355 })
const mesh = new Three.Mesh(geometry, material)
const group = new Three.Group()
group.add(mesh)

scene.add(group)

const clock = new Three.Clock()

function tick() {
  const elapseTime = clock.getElapsedTime()

  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 5
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 5
  // camera.position.y = cursor.y * 5

  // camera.lookAt(mesh.position)

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
