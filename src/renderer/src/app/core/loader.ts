import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { fbx } from '../../store/fbx'
export class Loader extends FBXLoader {
  private fbxLoader: FBXLoader
  private loadedFBX: { [key: string]: any }
  get getLoadedFBX() {
    return this.loadedFBX
  }

  constructor() {
    super()
    this.fbxLoader = new FBXLoader()
    this.loadedFBX = {}
  }
  async loadFBX(path: string, name: string) {
    this.fbxLoader.load(
      path,
      (object) => {
        fbx.load[name] = object.clone()
        console.warn(object)
        fbx.loading = false
      },
      (xhr) => {
        console.log(`[${name}]` + (xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.log(error)
      }
    )
  }
}
