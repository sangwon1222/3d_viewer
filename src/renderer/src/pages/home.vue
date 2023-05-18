<script setup lang="ts" scoped>
import { onMounted, ref } from 'vue'
import { Application } from '../app/core/app'
import { fbx } from '../store/fbx'
import { reactive, computed } from 'vue'

const canvasRef = ref(null)
let app = null
const state = reactive({
  isLoading: computed(() => (fbx.loading ? 'true' : 'false'))
})
onMounted(() => {
  app = new Application({ view: canvasRef.value })
})
const upload = async (e) => {
  // const path = e.target.files[0].path
  // const url = URL.createObjectURL(e.target.files[0])
  // await app._scene.loader.loadFBX(url)
  const blob = new Blob([e.target.files[0]])
  const url = URL.createObjectURL(blob)
  fbx.loading = true
  await app._scene.loader.loadFBX(url, e.target.files[0].name)
  console.log('load end')
  console.log(fbx)
}
const test = () => {
  console.log(fbx.load)
  console.log(fbx.load['light001.FBX'])
  console.log(app._scene)
  console.log(app._scene.add)
  app._scene.add(fbx.load['chair001.FBX'])
}
</script>

<template>
  <canvas ref="canvasRef" />
  <div class="text-white bg-black fixed top-10">
    {{ `${state.isLoading}` }}
  </div>
  <button class="text-white bg-black fixed top-20" @click="test">TEST</button>
  <input
    type="file"
    class="fixed top-0 left-0 border w-220 h-10 bg-white text-black opacity-80 rounded overflow-hidden"
    accept="image/fbx"
    @change="upload"
  />
</template>
