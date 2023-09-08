<script setup lang="ts" scoped>
import { onMounted, ref } from 'vue'
import { Application } from '../app/core/app'
import { reactive } from 'vue'
import { debounce } from 'lodash-es'
import { Stage } from '../app/core/stage'
import { Loader } from '../app/core/loader'
import { fbx } from '../store/fbx'
import { Object3D } from 'three'

const canvasRef = ref(null)
const editTollRef = ref(null)

let app = null
const state = reactive({
  isFold: false
})
onMounted(() => {
  app = new Application({ view: canvasRef.value })
  editTollRef.value.classList.add(state.isFold ? '-top-100' : 'top-0')
})
const upload = async (e) => {
  const name = e.target.files[0].name.toLowerCase().split('.')[0]
  const path = e.target.files[0].path
  const url = URL.createObjectURL(e.target.files[0])
  const scene = app._scene as Stage
  const loader = scene.loader as Loader

  for (let i = 0; i < scene.children.length; i++) {
    const obj = scene.children[i]
    if (obj.name === 'model') scene.remove(obj)
  }

  console.log(loader)
  await loader.loadFBX(url, name)
  // scene.add(fbx.load[name])
  const object = fbx.load[name] as Object3D
  console.log(object.clone())
  scene.add(object)
}

const fold = debounce(() => (state.isFold = !state.isFold), 250, { leading: true, trailing: false })
</script>

<template>
  <button
    class="fixed top-10 right-10 z-90 text-30 duration-500"
    :class="state.isFold ? 'rotate-[180deg]' : 'rotate-[0]'"
    @click="fold"
  >
    <p>👆</p>
  </button>
  <div
    ref="editTollRef"
    class="fixed overflow-hidden duration-500 text-white bg-main w-full p-10"
    :class="state.isFold ? '-top-100' : 'top-0'"
  >
    <input type="file" accept="image/fbx" @change="upload" />
  </div>

  <canvas ref="canvasRef" class="h-full w-full" />
</template>
