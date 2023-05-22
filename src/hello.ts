import * as Three from 'three'
import gsap from 'gsap'

const scene = new Three.Scene()
const axesHelper = new Three.AxesHelper(5)
scene.add(axesHelper)
const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5
const renderer = new Three.WebGLRenderer({ antialias: true })

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

const geometry = new Three.BoxGeometry()
const material = new Three.MeshBasicMaterial({ color: 0xffff3355 })
const mesh = new Three.Mesh(geometry, material)
const group = new Three.Group()
group.add(mesh)

const mesh2 = new Three.Mesh(new Three.SphereGeometry(0.6), new Three.MeshBasicMaterial({ color: 0x007733 }))
mesh2.position.x = 3
group.add(mesh2)

scene.add(group)

const clock = new Three.Clock()

gsap.to(mesh.position, {
  duration: 1,
  delay: 1,
  x: 2,
})
gsap.to(mesh.position, {
  duration: 1,
  delay: 2,
  x: 0,
})

function tick() {
  const elapseTime = clock.getElapsedTime()

  // mesh.position.x = Math.sin(elapseTime)
  // mesh.position.y = Math.cos(elapseTime)

  camera.lookAt(mesh.position)

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
