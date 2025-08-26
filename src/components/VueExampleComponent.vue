<template>
  <div>
    <h1>{{ t("vue-basic.title") }}</h1>
    <div>
      <DrawingApp
          ref="drawingAppRef"
          :width="300"
          :height="300"
          @state-save="handleStateSave"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import DrawingApp from "./DrawingApp.vue";
import {useI18n} from 'vue-i18n'
import {ComfyApp} from '@comfyorg/comfyui-frontend-types'

declare global {
  interface Window {
    app?: ComfyApp
  }
}

const {t} = useI18n()
const drawingAppRef = ref<InstanceType<typeof DrawingApp> | null>(null);
const canvasDataURL = ref<string | null>(null);

const {widget} = defineProps<{
  widget: ComponentWidget<string[]>
}>()

const node = widget.node

function handleStateSave(dataURL: string) {
  canvasDataURL.value = dataURL;

  console.log("canvas state saved:", dataURL.substring(0, 50) + "...");
}

async function uploadTempImage(imageData: string, prefix: string) {
  try {
    if (!window.app?.api) {
      throw new Error('ComfyUI API not available')
    }

    const blob = await fetch(imageData).then((r) => r.blob())
    const name = `${prefix}_${Date.now()}.png`
    const file = new File([blob], name)

    const body = new FormData()
    body.append('image', file)
    body.append('subfolder', 'threed')
    body.append('type', 'temp')

    console.log('Vue Component: Using window.app.api.fetchApi')

    const resp = await window.app.api.fetchApi('/upload/image', {
      method: 'POST',
      body
    })

    return resp.json()
  } catch (error) {
    console.error('Vue Component: Error uploading image:', error)
    throw error
  }
}

onMounted(() => {
  widget.serializeValue = async (node, index) => {
    try {
      console.log("Vue Component: inside vue serializeValue")
      console.log("node", node)
      console.log("index", index)

      const canvasData = canvasDataURL.value

      if (!canvasData) {
        console.warn('Vue Component: No canvas data available')
        return {image: null}
      }

      const data = await uploadTempImage(canvasData, "test_vue_basic")

      return {
        image: `threed/${data.name} [temp]`
      }
    } catch (error) {
      console.error('Vue Component: Error in serializeValue:', error)
      return {image: null}
    }
  }
})
</script>

<style scoped>
</style>