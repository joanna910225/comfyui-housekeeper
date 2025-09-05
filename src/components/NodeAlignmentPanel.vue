<template>
  <div 
    v-if="showPanel" 
    class="node-alignment-panel"
    :class="{ 'panel-visible': isVisible }"
  >
    <div class="panel-header">
      <i class="pi pi-th-large"></i>
      {{ t("alignment.title") }}
    </div>

    <div class="alignment-buttons">
      <Button
        v-for="alignment in alignmentTypes"
        :key="alignment.type"
        @click="alignNodes(alignment.type)"
        :disabled="selectedNodeCount < 2"
        :title="t(`alignment.${alignment.type}Tooltip`)"
        class="align-button"
        :class="`align-${alignment.type}`"
        size="small"
      >
        <i :class="alignment.icon"></i>
        <span>{{ t(`alignment.${alignment.type}`) }}</span>
      </Button>
    </div>

    <div class="panel-info">
      <div class="info-text">
        <span v-if="selectedNodeCount === 0">{{ t("alignment.selectMultiple") }}</span>
        <span v-else-if="selectedNodeCount === 1">{{ t("alignment.selectAdditional") }}</span>
        <span v-else>{{ t("alignment.ready", { count: selectedNodeCount }) }}</span>
      </div>
      
      <div class="keyboard-hints">
        <small>{{ t("alignment.keyboardHint") }}</small>
      </div>
    </div>

    <div v-if="lastMessage" class="message-toast" :class="messageType">
      {{ lastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import { ComfyApp } from '@comfyorg/comfyui-frontend-types'

declare global {
  interface Window {
    app?: ComfyApp
  }
}

const { t } = useI18n()

// Reactive state
const showPanel = ref(false)
const isVisible = ref(false)
const selectedNodes = ref<any[]>([])
const lastMessage = ref('')
const messageType = ref('info')

// Computed properties
const selectedNodeCount = computed(() => selectedNodes.value.length)

// Alignment configuration
const alignmentTypes = [
  { type: 'left', icon: 'pi pi-align-left' },
  { type: 'right', icon: 'pi pi-align-right' },
  { type: 'top', icon: 'pi pi-arrow-up' },
  { type: 'bottom', icon: 'pi pi-arrow-down' }
]

// Methods
const updateSelectedNodes = () => {
  if (!window.app?.graph) return
  
  const allNodes = Object.values(window.app.graph._nodes || {})
  selectedNodes.value = allNodes.filter((node: any) => node && node.is_selected)
  
  const hasSelectedNodes = selectedNodes.value.length > 1
  
  if (hasSelectedNodes && !showPanel.value) {
    showPanel.value = true
    setTimeout(() => { isVisible.value = true }, 10)
  } else if (!hasSelectedNodes && showPanel.value) {
    isVisible.value = false
    setTimeout(() => { showPanel.value = false }, 300)
  }
}

const alignNodes = (alignmentType: string) => {
  if (selectedNodes.value.length < 2) {
    showMessage(t("alignment.needTwoNodes"), "warning")
    return
  }

  try {
    let referenceValue: number

    switch (alignmentType) {
      case 'left':
        referenceValue = Math.min(...selectedNodes.value.map((node: any) => node.pos[0]))
        selectedNodes.value.forEach((node: any) => {
          node.pos[0] = referenceValue
        })
        break
        
      case 'right':
        referenceValue = Math.max(...selectedNodes.value.map((node: any) => node.pos[0] + node.size[0]))
        selectedNodes.value.forEach((node: any) => {
          node.pos[0] = referenceValue - node.size[0]
        })
        break
        
      case 'top':
        referenceValue = Math.min(...selectedNodes.value.map((node: any) => node.pos[1]))
        selectedNodes.value.forEach((node: any) => {
          node.pos[1] = referenceValue
        })
        break
        
      case 'bottom':
        referenceValue = Math.max(...selectedNodes.value.map((node: any) => node.pos[1] + node.size[1]))
        selectedNodes.value.forEach((node: any) => {
          node.pos[1] = referenceValue - node.size[1]
        })
        break
    }

    // Mark canvas as dirty to trigger redraw
    if (window.app?.canvas) {
      window.app.canvas.setDirtyCanvas(true, true)
    }
    
    showMessage(t("alignment.success", { 
      count: selectedNodes.value.length, 
      direction: t(`alignment.${alignmentType}`) 
    }), "success")
    
  } catch (error) {
    console.error("Alignment error:", error)
    showMessage(t("alignment.error"), "error")
  }
}

const showMessage = (text: string, type: string = "info") => {
  lastMessage.value = text
  messageType.value = type
  
  setTimeout(() => {
    lastMessage.value = ''
  }, 3000)
}

const handleKeyboard = (e: KeyboardEvent) => {
  if (!(e.ctrlKey || e.metaKey) || !e.shiftKey) return
  
  switch(e.key) {
    case "ArrowLeft":
      e.preventDefault()
      alignNodes("left")
      break
    case "ArrowRight":
      e.preventDefault()
      alignNodes("right")
      break
    case "ArrowUp":
      e.preventDefault()
      alignNodes("top")
      break
    case "ArrowDown":
      e.preventDefault()
      alignNodes("bottom")
      break
  }
}

// Lifecycle
onMounted(() => {
  // Set up canvas monitoring
  const setupCanvasMonitoring = () => {
    if (!window.app?.canvas) {
      setTimeout(setupCanvasMonitoring, 100)
      return
    }

    // Monitor canvas changes
    const originalSetDirtyCanvas = window.app.canvas.setDirtyCanvas
    window.app.canvas.setDirtyCanvas = (...args: any[]) => {
      originalSetDirtyCanvas.apply(window.app.canvas, args)
      updateSelectedNodes()
    }

    // Monitor canvas clicks
    if (window.app.canvas.canvas) {
      window.app.canvas.canvas.addEventListener("click", () => {
        setTimeout(updateSelectedNodes, 10)
      })
    }
  }

  setupCanvasMonitoring()
  
  // Add keyboard listeners
  document.addEventListener("keydown", handleKeyboard)
})

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyboard)
})

// Watch for changes and update initially
watch(() => window.app?.graph, updateSelectedNodes, { immediate: true })
</script>

<style scoped>
.node-alignment-panel {
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(40, 40, 40, 0.95);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 12px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 220px;
  backdrop-filter: blur(10px);
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.node-alignment-panel.panel-visible {
  opacity: 1;
  transform: translateX(0);
}

.panel-header {
  color: var(--text-color);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.alignment-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.align-button {
  min-height: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  transition: all 0.2s ease;
}

.align-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.align-button i {
  font-size: 16px;
}

.align-left {
  border-left: 3px solid var(--primary-color);
}

.align-right {
  border-right: 3px solid var(--primary-color);
}

.align-top {
  border-top: 3px solid var(--primary-color);
}

.align-bottom {
  border-bottom: 3px solid var(--primary-color);
}

.panel-info {
  background: rgba(60, 60, 60, 0.8);
  border-radius: 6px;
  padding: 10px;
  font-size: 12px;
  color: var(--text-color-secondary);
  text-align: center;
}

.info-text {
  margin-bottom: 6px;
  font-weight: 500;
}

.keyboard-hints {
  color: var(--text-color-secondary);
  font-size: 10px;
  opacity: 0.8;
}

.message-toast {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  animation: slideInUp 0.3s ease;
}

.message-toast.success {
  background: var(--green-500);
  color: white;
}

.message-toast.warning {
  background: var(--orange-500);
  color: white;
}

.message-toast.error {
  background: var(--red-500);
  color: white;
}

.message-toast.info {
  background: var(--blue-500);
  color: white;
}

@keyframes slideInUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
