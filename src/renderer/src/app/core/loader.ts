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
  async loadFBX(url: string, name: string) {
    return new Promise((resolve, _reject) => {
      console.log(url)
      this.fbxLoader.load(
        url,
        (object) => {
          object.name = 'model'
          fbx.load[name.toLowerCase()] = object.clone()
          console.error(fbx.load[name.toLowerCase()])
          console.error(object)
          fbx.loading = false
          resolve(1)
        },
        (xhr) => {
          console.log(`[${name}]` + (xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
          console.log(error)
          resolve(-1)
        }
      )
    })
  }
}
