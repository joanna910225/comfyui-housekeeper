<template>
  <div class="drawing-app">
    <ToolBar
      :colors="availableColors"
      :initialColor="initialColor"
      :initialBrushSize="initialBrushSize"
      @tool-change="handleToolChange"
      @color-change="handleColorChange"
      @brush-size-change="handleBrushSizeChange"
      @canvas-clear="handleCanvasClear"
    />

    <DrawingBoard
      ref="drawingBoard"
      :width="width"
      :height="height"
      :initialColor="initialColor"
      :initialBrushSize="initialBrushSize"
      @drawing-start="onDrawingStart"
      @drawing="onDrawing"
      @drawing-end="onDrawingEnd"
      @state-save="onStateSave"
      @mounted="onDrawingBoardMounted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, defineExpose } from 'vue';
import ToolBar from './ToolBar.vue';
import DrawingBoard from './DrawingBoard.vue';

interface Props {
  width?: number;
  height?: number;
  initialColor?: string;
  initialBrushSize?: number;
  availableColors?: string[];
}

const props = defineProps<Props>();

const width = props.width || 800;
const height = props.height || 500;
const initialColor = props.initialColor || '#000000';
const initialBrushSize = props.initialBrushSize || 5;
const availableColors = props.availableColors || ['#000000', '#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ff00ff', '#00ffff'];

const emit = defineEmits<{
  'tool-change': [tool: string];
  'color-change': [color: string];
  'brush-size-change': [size: number];
  'drawing-start': [data: any];
  'drawing': [data: any];
  'drawing-end': [];
  'state-save': [data: string];
  'mounted': [canvas: HTMLCanvasElement];
}>();

const drawingBoard = ref<InstanceType<typeof DrawingBoard> | null>(null);

const lastCanvasData = ref<string | null>(null);

function handleToolChange(tool: string): void {
  drawingBoard.value?.setTool(tool);
  emit('tool-change', tool);
}

function handleColorChange(color: string): void {
  drawingBoard.value?.setColor(color);
  emit('color-change', color);
}

function handleBrushSizeChange(size: number): void {
  drawingBoard.value?.setBrushSize(size);
  emit('brush-size-change', size);
}

function handleCanvasClear(): void {
  drawingBoard.value?.clearCanvas();
}

function onDrawingStart(data: any): void {
  emit('drawing-start', data);
}

function onDrawing(data: any): void {
  emit('drawing', data);
}

function onDrawingEnd(): void {
  emit('drawing-end');
}

function onStateSave(data: string): void {
  lastCanvasData.value = data;
  emit('state-save', data);
}

function onDrawingBoardMounted(canvas: HTMLCanvasElement): void {
  emit('mounted', canvas);
}

async function getCanvasData(): Promise<string> {
  if (lastCanvasData.value) {
    return lastCanvasData.value;
  }

  if (drawingBoard.value) {
    try {
      return await drawingBoard.value.getCurrentCanvasData();
    }
    catch (error) {
      console.error("unable to get canvas data:", error);
      throw new Error("unable to get canvas data");
    }
  }

  throw new Error("get canvas data failed");
}

defineExpose({
  getCanvasData
});
</script>

<style scoped>
.drawing-app {
  font-family: Arial, sans-serif;
  max-width: 100%;
}
</style>