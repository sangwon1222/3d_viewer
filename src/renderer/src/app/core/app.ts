import * as THREE from 'three'
import { Stage } from './stage'
import { MouseWheelInputEvent } from 'electron/renderer'

export class Application {
  private readonly canvas: HTMLCanvasElement
  private readonly renderer: THREE.WebGLRenderer
  private scene: Stage
  get _scene(): Stage {
    return this.scene
  }
  private mIsCameraMove = false

  constructor({ view }: { view: HTMLCanvasElement }) {
    this.canvas = view
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.canvas.style.backgroundColor = '#000000'

    this.scene = new Stage()

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
    this.renderer.setClearColor(0x000000, 1)
    this.renderer.setSize(this.canvas.width, this.canvas.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.shadowMap.enabled = true

    window.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })

    this.canvas.addEventListener('pointerdown', (evt) => {
      if (evt.button === 0) this.mIsCameraMove = true
    })

    this.canvas.addEventListener('pointermove', (evt) => {
      if (this.mIsCameraMove) this.moveCamera(evt)
    })
    this.canvas.addEventListener('pointerup', (evt) => {
      if (evt.button === 0) this.mIsCameraMove = false
    })
    this.canvas.addEventListener('pointerout', (evt) => {
      if (evt.button === 0) this.mIsCameraMove = false
      //## 좌클릭 evt.button =0
      //## 우클릭 evt.button =2
    })
    this.canvas.addEventListener('mousewheel', (evt: any) => {
      const z = this.scene.camera.getCamera().position.z
      if (z > -30) {
        this.scene.camera.getCamera().position.z = -30
        return
      }
      if (z < -100) {
        this.scene.camera.getCamera().position.z = -100
        return
      }
      switch (evt.deltaY) {
        case 100:
          this.scene.camera.getCamera().position.z += 10
          break
        case -100:
          this.scene.camera.getCamera().position.z -= 10
          break
      }
    })

    this.loop()

    window.addEventListener(
      'resize',
      () => {
        const camera = this.scene.camera.getCamera() as THREE.PerspectiveCamera
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.render()
      },
      false
    )
  }

  private moveCamera({ movementX, movementY }) {
    const { camera } = this.scene
    const direction = new THREE.Vector3()
    camera.getWorldDirection(direction)

    // 카메라가 바라보는 곳의 좌표 구하기
    const target = new THREE.Vector3()
    target.copy(camera.position).add(direction.multiplyScalar(900)) // 100은 거리입니다.

    this.scene.camera.setYawPitchDelta(movementX * 0.5, movementY * 0.5)
  }

  private loop = () => {
    requestAnimationFrame(this.loop)

    this.render()
  }

  render = () => {
    this.renderer.render(this.scene, this.scene.camera.getCamera())
  }
}
