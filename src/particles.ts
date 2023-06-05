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

const textureLoader = new Three.TextureLoader()
const particleTexture = textureLoader.load('/src/assets/textures/particles/1.png')

/**
 * @Particles
 * Geometry
 */
const particlesGeometry = new Three.BufferGeometry()
const count = 50000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10
  colors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new Three.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new Three.BufferAttribute(colors, 3))

/**
 * @Particles
 * Material
 */
const particleMaterial = new Three.PointsMaterial()

particleMaterial.size = 0.1
particleMaterial.sizeAttenuation = true

particleMaterial.color = new Three.Color('#ff88cc')

particleMaterial.transparent = true
particleMaterial.alphaMap = particleTexture
particleMaterial.depthWrite = false
particleMaterial.blending = Three.AdditiveBlending
particleMaterial.vertexColors = true

/**
 * @Points
 */
const particles = new Three.Points(particlesGeometry, particleMaterial)
scene.add(particles)

const clock = new Three.Clock()

const tick = () => {
  controls.update()

  const elapsedTime = clock.getElapsedTime()

  // Update positions
  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    const x = particlesGeometry.attributes.position.array[i3]
    // particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
  }

  particlesGeometry.attributes.position.needsUpdate = true

  renderer.render(scene, camera)

  requestAnimationFrame(tick)
}

tick()
