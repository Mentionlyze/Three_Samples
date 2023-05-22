import * as Three from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'dat.gui'

const cursor = { x: 0, y: 0 }

window.addEventListener('mousemove', (event) => {
  cursor.x = (event.clientX / window.innerWidth) * 2 - 1
  cursor.y = 1 - (event.clientY / window.innerHeight) * 2

  // console.log(cursor)
})

const gui = new GUI()

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

const loadingManager = new Three.LoadingManager()

loadingManager.onStart = () => {
  console.log('start')
}

loadingManager.onLoad = () => {
  console.log('load')
}

loadingManager.onProgress = () => {
  console.log('progress')
}

loadingManager.onError = () => {
  console.log('error')
}

const textureLoader = new Three.TextureLoader(loadingManager)
const cubeTextureLoader = new Three.CubeTextureLoader(loadingManager)

const colorTexture = textureLoader.load('/src/assets/textures/door/color.jpg')
colorTexture.colorSpace = Three.SRGBColorSpace
const alphaTexture = textureLoader.load('/src/assets/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/src/assets/textures/door/height.jpg')
const normalTexture = textureLoader.load('/src/assets/textures/door/normal.jpg')
const ambientTexture = textureLoader.load('/src/assets/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/src/assets/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/src/assets/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/src/assets/textures/matcaps/3.png')
const gradientTexture = textureLoader.load('/src/assets/textures/gradients/3.jpg')

gradientTexture.minFilter = Three.NearestFilter
gradientTexture.magFilter = Three.NearestFilter
gradientTexture.generateMipmaps = false

const environmentMapTexture = cubeTextureLoader.load([
  '/src/assets/textures/environmentMaps/3/px.jpg',
  '/src/assets/textures/environmentMaps/3/nx.jpg',
  '/src/assets/textures/environmentMaps/3/py.jpg',
  '/src/assets/textures/environmentMaps/3/ny.jpg',
  '/src/assets/textures/environmentMaps/3/pz.jpg',
  '/src/assets/textures/environmentMaps/3/nz.jpg',
])

//const geometry = new Three.BoxGeometry(1, 1, 1, 3, 4, 5)
const geometry = new Three.TorusGeometry(0.5)
console.log(geometry.attributes.uv)
//const material = new Three.MeshBasicMaterial({ map: normalTexture })
//const material = new Three.MeshMatcapMaterial({ matcap: matcapTexture})
//const material = new Three.MeshNormalMaterial()
//const material = new Three.MeshDepthMaterial()
//const material = new Three.MeshLambertMaterial()
//const material = new Three.MeshPhongMaterial()
//const material = new Three.MeshToonMaterial()
const material = new Three.MeshStandardMaterial()

material.side = Three.DoubleSide
material.transparent = true

//material.shininess = 100
//material.gradientMap = gradientTexture
material.roughness = 1
material.metalness = 0
// material.map = colorTexture
// material.aoMap = ambientTexture
// material.aoMapIntensity = 1
// material.displacementMap = heightTexture
// material.displacementScale = 0.01
// material.roughnessMap = roughnessTexture
// material.metalnessMap = metalnessTexture
// material.normalMap = normalTexture
// material.normalScale.set(0.1, 0.1)
// material.alphaMap = alphaTexture

material.envMap = environmentMapTexture

gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)
gui.add(material, 'aoMapIntensity').min(1).max(10).step(0.001)
gui.add(material, 'displacementScale').min(0).max(1).step(0.001)

const cube = new Three.Mesh(geometry, material)
cube.geometry.setAttribute('uv2', new Three.BufferAttribute(cube.geometry.attributes.uv.array, 2))

const plane = new Three.Mesh(new Three.PlaneGeometry(1, 1, 100, 100), material)
plane.geometry.setAttribute('uv2', new Three.BufferAttribute(plane.geometry.attributes.uv.array, 2))
plane.position.x = 3

const sphere = new Three.Mesh(new Three.SphereGeometry(0.7, 64, 64), material)
sphere.geometry.setAttribute('uv2', new Three.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
sphere.position.x = -3

const group = new Three.Group()
group.add(cube, plane, sphere)

scene.add(group)

const ambientLight = new Three.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

const pointLight = new Three.PointLight(0xffffff, 0.7)
pointLight.position.x = 2
pointLight.position.y = 5
pointLight.position.z = 7
scene.add(pointLight)

material.needsUpdate = true

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
