<template>
  <div class="toolbar">
    <Button
        v-tooltip="{ value: t('vue-basic.pen-tooltip'), showDelay: 300 }"
        :class="{ active: currentTool === 'pen' }"
        @click="setTool('pen')">{{ t("vue-basic.pen") }}
    </Button>
    <Button @click="clearCanvas">{{ t("vue-basic.clear-canvas") }}</Button>
  </div>

  <div class="color-picker">
    <Button v-for="(color, index) in colors"
            :key="index"
            :class="{ 'color-button': true, 'active': currentColor === color }"
            @click="selectColor(color)"
            type="button"
            :title="color">
      <i class="pi pi-circle-fill" :style="{ color: color }"></i>
    </Button>
  </div>

  <div class="size-slider">
    <label>{{ t("vue-basic.brush-size") }}: {{ brushSize }}px</label>
    <input type="range" min="1" max="50" :value="brushSize" @change="updateBrushSize($event)">
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { ref, defineProps, defineEmits } from 'vue';
import {useI18n} from "vue-i18n";

const { t } = useI18n()

interface Props {
  colors?: string[];
  initialColor?: string;
  initialBrushSize?: number;
  initialTool?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'tool-change': [tool: string];
  'color-change': [color: string];
  'canvas-clear': [];
  'brush-size-change': [size: number];
}>();

const colors = props.colors || ['#000000', '#ff0000', '#0000ff', '#69a869', '#ffff00', '#ff00ff', '#00ffff'];
const currentColor = ref(props.initialColor || '#000000');
const brushSize = ref(props.initialBrushSize || 5);
const currentTool = ref(props.initialTool || 'pen');

function setTool(tool: string): void {
  currentTool.value = tool;
  emit('tool-change', tool);
}

function selectColor(color: string): void {
  currentColor.value = color;
  emit('color-change', color);
}

function clearCanvas(): void {
  emit('canvas-clear');
}

function updateBrushSize(event: Event): void {
  const target = event.target as HTMLInputElement;
  brushSize.value = Number(target.value);
  emit('brush-size-change', brushSize.value);
}
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

button {
  padding: 8px 16px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
}

button.active {
  background-color: #2E7D32;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 15px;
  align-items: center;
}

.color-button {
  background: none;
  border: 2px solid transparent;
  padding: 4px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: outline 0.2s ease, transform 0.2s ease;
  line-height: 1;
}

.color-button i {
  font-size: 1.8em;
  display: block;
  -webkit-text-stroke: 1px rgba(0, 0, 0, 0.1);
  text-stroke: 1px rgba(0, 0, 0, 0.1);
}

.color-button.active {
  outline: 3px solid #0056b3;
  outline-offset: 2px;

}

.color-button:not(.active):hover {
   outline: 2px solid #ddd;
   outline-offset: 2px;
}

.size-slider {
  margin-bottom: 15px;
}

.size-slider label {
  display: block;
  margin-bottom: 5px;
}

.size-slider input {
  width: 100%;
  max-width: 300px;
}
</style>