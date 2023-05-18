import * as THREE from 'three'

export class Camera extends THREE.Object3D {
  private mCamera: THREE.Camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000)

  pitch = 14
  yaw = 216

  getCamera() {
    return this.mCamera
  }

  constructor(w: number, h: number) {
    super()
    this.mCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.mCamera.position.set(0.8, 1.4, 1.0)
    // this.mCamera = new THREE.PerspectiveCamera(45, w / h, 0.1, 10000)
    this.add(this.mCamera)
    this.mCamera.position.z = -100
    this.mCamera.lookAt(0, 0, 0)

    this.setRotationFromEuler(
      new THREE.Euler(
        THREE.MathUtils.degToRad(this.pitch),
        THREE.MathUtils.degToRad(this.yaw),
        0,
        'ZYX'
      )
    )

    this.position.set(0, 0, 0)
  }

  setYawPitchDelta(yaw: number, pitch: number) {
    this.yaw -= yaw / 2
    this.pitch += pitch / 2

    if (this.pitch < 0) this.pitch = 0
    if (this.pitch > 90) this.pitch = 90

    this.setRotationFromEuler(
      new THREE.Euler(
        THREE.MathUtils.degToRad(this.pitch),
        THREE.MathUtils.degToRad(this.yaw),
        0,
        'ZYX'
      )
    )
  }
}
