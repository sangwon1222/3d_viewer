import * as THREE from 'three'
import { Camera } from '../object/camera'
import { Loader } from './loader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { fbx } from '../../store/fbx'

export class Stage extends THREE.Scene {
  private static handle: Stage
  get _handle(): Stage {
    return Stage.handle ? Stage.handle : new Stage()
  }

  private mCamera: Camera = new Camera(800, 600)
  get camera() {
    return this.mCamera
  }

  private mCharacterPool = new THREE.Object3D()
  get characterLayer() {
    return this.mCharacterPool
  }

  private mRaycaster = new THREE.Raycaster()
  private mLoader = new FBXLoader()
  get loader(): FBXLoader {
    return this.mLoader
  }

  constructor(w = 800, h = 600) {
    super()
    Stage.handle = this
    this.mCamera = new Camera(w, h)
    this.add(this.mCamera)
    this.add(new THREE.AxesHelper(5))

    this.createLight()
    this.createGround()

    this.mLoader = new FBXLoader()
    this.mLoader.load(
      // '../../light001.FBX',
      '../../chair001.FBX',
      (object) => {
        // object.traverse(function (child) {
        //   if ((child as THREE.Mesh).isMesh) {
        //     if ((child as THREE.Mesh).material) {
        //       ;((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
        //     }
        //   }
        // })
        // object.scale.set(0.8, 0.8, 0.8)
        object.name = 'model'
        this.add(object)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async createLight() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5) // soft white light

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
    dirLight.position.set(-120, 100, -120)
    dirLight.shadow.camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 1, 1000)
    dirLight.shadow.mapSize.set(1024, 1024)

    const spotLight = new THREE.SpotLight(0xffffff, 0.5)
    spotLight.position.set(-300, 500, -400)
    spotLight.angle = Math.PI / 5
    spotLight.penumbra = 0.2
    spotLight.castShadow = true
    spotLight.shadow.camera = new THREE.PerspectiveCamera(50, 1, 3, 100)
    spotLight.shadow.mapSize.set(1024, 1024)

    this.add(ambientLight, dirLight, spotLight)
  }

  async createGround() {
    const geometry = new THREE.PlaneGeometry(1000, 1000, 1, 1)
    const material = new THREE.MeshPhongMaterial({
      color: 0x30332e,
      shininess: 10
    })
    const ground = new THREE.Mesh(geometry, material)

    ground.rotation.x = -Math.PI / 2
    ground.scale.multiplyScalar(3)
    ground.receiveShadow = true
    this.add(ground)
  }

  async onPointerUp(evt: MouseEvent) {
    this.mCamera.getCamera().updateMatrixWorld()

    const { target, offsetX, offsetY } = evt
    const { width, height } = target as HTMLCanvasElement
    const x = (offsetX - width * 0.5) / (width * 0.5)
    const y = -(offsetY - height * 0.5) / (height * 0.5)
    const pointer = new THREE.Vector2(x, y)

    this.mRaycaster = new THREE.Raycaster()
    this.mRaycaster.setFromCamera(pointer, this.mCamera.getCamera())
  }
}
