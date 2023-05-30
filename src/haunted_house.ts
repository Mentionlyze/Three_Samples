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

/**
 * @Textures
 */
const textureLoader = new Three.TextureLoader()

const doorColorTexture = textureLoader.load('/src/assets/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/src/assets/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/src/assets/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/src/assets/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/src/assets/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/src/assets/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/src/assets/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/src/assets/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/src/assets/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/src/assets/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/src/assets/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/src/assets/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/src/assets/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/src/assets/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/src/assets/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = Three.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = Three.RepeatWrapping
grassNormalTexture.wrapS = Three.RepeatWrapping
grassRoughnessTexture.wrapS = Three.RepeatWrapping

grassColorTexture.wrapT = Three.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = Three.RepeatWrapping
grassNormalTexture.wrapT = Three.RepeatWrapping
grassRoughnessTexture.wrapT = Three.RepeatWrapping

/**
 * @House
 */
const house = new Three.Group()
scene.add(house)

/**
 * @Wall
 */
const walls = new Three.Mesh(
  new Three.BoxGeometry(4, 2.5, 4),
  new Three.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
)
walls.castShadow = true
walls.geometry.setAttribute('uv2', new Three.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = 1.25
house.add(walls)

/**
 * @Roof
 */
const roof = new Three.Mesh(new Three.ConeGeometry(3.5, 1, 4), new Three.MeshStandardMaterial({ color: '#b35f45' }))
roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 0.5
house.add(roof)

/**
 * @Door
 */
const door = new Three.Mesh(
  new Three.PlaneGeometry(2, 2, 100, 100),
  new Three.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
)
door.geometry.setAttribute('uv2', new Three.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = 1
door.position.z = 2 + 0.01
scene.add(door)

/**
 * @Bushes
 */
const bushGeometry = new Three.SphereGeometry(1, 16, 16)
const bushMaterial = new Three.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new Three.Mesh(bushGeometry, bushMaterial)
bush1.castShadow = true
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new Three.Mesh(bushGeometry, bushMaterial)
bush2.castShadow = true
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new Three.Mesh(bushGeometry, bushMaterial)
bush3.castShadow = true
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new Three.Mesh(bushGeometry, bushMaterial)
bush4.castShadow = true
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

/**
 * @Graves
 */
const graves = new Three.Group()
scene.add(graves)

const graveGeometry = new Three.BoxGeometry(0.6, 0.8, 0.1)
const graveMaterial = new Three.MeshStandardMaterial({ color: '#727272' })

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2
  const radius = 3 + Math.random() * 6
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  // create the mesh
  const grave = new Three.Mesh(graveGeometry, graveMaterial)
  grave.castShadow = true

  // position
  grave.position.set(x, 0.3, z)

  // rotation
  grave.rotation.z = (Math.random() - 0.5) * 0.4
  grave.rotation.y = (Math.random() - 0.5) * 0.4

  // add to the graves container
  graves.add(grave)
}

const floor = new Three.Mesh(
  new Three.PlaneGeometry(20, 20),
  new Three.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
)

floor.receiveShadow = true
// floor.material.side = Three.DoubleSide
floor.geometry.setAttribute('uv2', new Three.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * @AmbientLight
 */
const ambientLight = new Three.AmbientLight('#b9d5ff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

/**
 * @DirectionLight
 */
const moonLight = new Three.DirectionalLight('#b9d5ff', 0.3)
moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15
moonLight.position.set(4, 5, -2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new Three.PointLight('#ff7d46', 1, 7)
doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

/**
 * Ghosts
 */
const ghost1 = new Three.PointLight('#ff00ff', 3, 3)
ghost1.castShadow = true
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7
scene.add(ghost1)

const ghost2 = new Three.PointLight('#00ffff', 3, 3)
ghost2.castShadow = true
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7
scene.add(ghost2)

const ghost3 = new Three.PointLight('#ff7800', 3, 3)
ghost3.castShadow = true
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7
scene.add(ghost3)

/**
 * Fog
 */
const fog = new Three.Fog('#262837', 1, 15)
// scene.fog = fog

renderer.shadowMap.enabled = true
renderer.shadowMap.type = Three.PCFSoftShadowMap
renderer.setClearColor('#262837')

const clock = new Three.Clock()

const tick = () => {
  controls.update()

  const elapsedTime = clock.getElapsedTime()

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  // ghost1.position.y = Math.sin(elapsedTime * 3)

  const ghost2Angle = -elapsedTime * 0.32
  ghost2.position.x = Math.cos(ghost2Angle) * 5
  ghost2.position.z = Math.sin(ghost2Angle) * 5
  // ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

  const ghost3Angle = -elapsedTime * 0.18
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
  // ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

  renderer.render(scene, camera)

  requestAnimationFrame(tick)
}

tick()
