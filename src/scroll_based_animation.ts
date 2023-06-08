import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'dat.gui'
import { gsap } from 'gsap'

const gui = new GUI()

const scene = new Three.Scene()

const camera = new Three.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 6

const canvas = document.querySelector('canvas.webgl')!
const renderer = new Three.WebGLRenderer({ canvas, antialias: true, alpha: true })

// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

//document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

const parameters = {
  materialColor: '#ffeded',
}

/**
 * @Objects
 */
// Texture
const textureLoader = new Three.TextureLoader()
const gradientTexture = textureLoader.load('/src/assets/textures/gradients/3.jpg')
gradientTexture.magFilter = Three.NearestFilter

/**
 * @Material
 */
const material = new Three.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
})

/**
 * @Objects
 */
const objectsDistance = 4
const mesh1 = new Three.Mesh(new Three.TorusGeometry(1, 0.4, 16, 60), material)
const mesh2 = new Three.Mesh(new Three.ConeGeometry(1, 2, 32), material)
const mesh3 = new Three.Mesh(new Three.TorusKnotGeometry(0.8, 0.35, 100, 16), material)

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

mesh1.position.y = -objectsDistance * 0
mesh2.position.y = -objectsDistance * 1
mesh3.position.y = -objectsDistance * 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * @Lights
 */
const directionalLight = new Three.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * @Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount + 3)

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10
  positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new Three.BufferGeometry()
particlesGeometry.setAttribute('position', new Three.BufferAttribute(positions, 3))

/**
 * @Material
 */
const particlesMaterial = new Three.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: textureLoader as unknown as boolean,
  size: 0.03,
})

const particles = new Three.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

const cameraGroup = new Three.Group()
cameraGroup.add(camera)
scene.add(cameraGroup)

gui.addColor(parameters, 'materialColor').onChange(() => {
  material.color.set(parameters.materialColor)
  particlesMaterial.color.set(parameters.materialColor)
})

/**
 * @Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
  scrollY = window.scrollY
  const newSection = Math.round(scrollY / window.innerHeight)

  if (newSection !== currentSection) {
    currentSection = newSection

    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: 'power2.inOut',
      x: '+=6',
      y: '+=3',
      z: '+=1.5',
    })
  }
})

/**
 * @Cursor
 */
const cursor = {
  x: 0,
  y: 0,
}

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / window.innerWidth - 0.5
  cursor.y = 0.5 - event.clientY / window.innerHeight
})

console.log(window.innerHeight)

const clock = new Three.Clock()
let previousTime = 0

const tick = () => {
  // controls.update()
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Animate camera
  camera.position.y = (-scrollY / window.innerHeight) * objectsDistance

  const parallaxX = cursor.x * 0.5
  const parallaxY = cursor.y * 0.5
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

  // Animate Meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1
    mesh.rotation.y += deltaTime * 0.2
  }

  renderer.render(scene, camera)

  requestAnimationFrame(tick)
}

tick()
