<template>
  <div class="drawing-board">
    <div class="canvas-container">
      <canvas
        ref="canvas"
        :width="width"
        :height="height"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="stopDrawing">
      </canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, defineProps, defineEmits, defineExpose } from 'vue';

interface Props {
  width?: number;
  height?: number;
  initialColor?: string;
  initialBrushSize?: number;
}

const props = defineProps<Props>();

const width = props.width || 800;
const height = props.height || 500;
const initialColor = props.initialColor || '#000000';
const initialBrushSize = props.initialBrushSize || 5;

const emit = defineEmits<{
  'mounted': [canvas: HTMLCanvasElement];
  'drawing-start': [data: { x: number; y: number; tool: string }];
  'drawing': [data: { x: number; y: number; tool: string }];
  'drawing-end': [];
  'state-save': [data: string];
  'canvas-clear': [];
}>();

const isDrawing = ref(false);
const lastX = ref(0);
const lastY = ref(0);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const isEraser = ref(false);
const brushSize = ref(initialBrushSize);
const currentColor = ref(initialColor);
const canvasData = ref<string | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d');
    setupCanvas();

    nextTick(() => {
      if (canvas.value) {
        emit('mounted', canvas.value);
      }
    });
  }
});

function setupCanvas(): void {
  if (!ctx.value) return;

  ctx.value.fillStyle = "#ffffff";
  ctx.value.fillRect(0, 0, width, height);

  updateBrushStyle();
  saveState();
}

function updateBrushStyle(): void {
  if (!ctx.value) return;

  if (isEraser.value) {
    ctx.value.globalCompositeOperation = 'destination-out';
    ctx.value.strokeStyle = 'rgba(0,0,0,1)';
  } else {
    ctx.value.globalCompositeOperation = 'source-over';
    ctx.value.strokeStyle = currentColor.value;
  }
  ctx.value.lineWidth = brushSize.value;
  ctx.value.lineJoin = 'round';
  ctx.value.lineCap = 'round';
}

interface Coordinates {
  offsetX: number;
  offsetY: number;
}

function startDrawing(event: MouseEvent | TouchEvent): void {
  isDrawing.value = true;
  const { offsetX, offsetY } = getCoordinates(event);
  lastX.value = offsetX;
  lastY.value = offsetY;

  if (!ctx.value) return;

  ctx.value.beginPath();
  ctx.value.moveTo(lastX.value, lastY.value);

  ctx.value.arc(lastX.value, lastY.value, brushSize.value / 2, 0, Math.PI * 2);
  ctx.value.fill();

  emit('drawing-start', {
    x: offsetX,
    y: offsetY,
    tool: isEraser.value ? 'eraser' : 'pen'
  });
}

function draw(event: MouseEvent | TouchEvent): void {
  if (!isDrawing.value || !ctx.value) return;

  const { offsetX, offsetY } = getCoordinates(event);

  ctx.value.beginPath();
  ctx.value.moveTo(lastX.value, lastY.value);
  ctx.value.lineTo(offsetX, offsetY);
  ctx.value.stroke();

  lastX.value = offsetX;
  lastY.value = offsetY;

  emit('drawing', {
    x: offsetX,
    y: offsetY,
    tool: isEraser.value ? 'eraser' : 'pen'
  });
}

function stopDrawing(): void {
  if (isDrawing.value) {
    isDrawing.value = false;
    saveState();

    emit('drawing-end');
  }
}

function getCoordinates(event: MouseEvent | TouchEvent): Coordinates {
  let offsetX = 0;
  let offsetY = 0;

  if ('touches' in event) {
    event.preventDefault();
    if (canvas.value) {
      const rect = canvas.value.getBoundingClientRect();
      offsetX = event.touches[0].clientX - rect.left;
      offsetY = event.touches[0].clientY - rect.top;
    }
  } else {
    offsetX = (event as MouseEvent).offsetX;
    offsetY = (event as MouseEvent).offsetY;
  }

  return { offsetX, offsetY };
}

function handleTouchStart(event: TouchEvent): void {
  event.preventDefault();
  const touch = event.touches[0];
  const touchEvent = {
    touches: [touch]
  } as TouchEvent;
  startDrawing(touchEvent);
}

function handleTouchMove(event: TouchEvent): void {
  event.preventDefault();
  if (!isDrawing.value) return;

  const touch = event.touches[0];
  const touchEvent = {
    touches: [touch]
  } as TouchEvent;
  draw(touchEvent);
}

function setTool(tool: string): void {
  isEraser.value = tool === 'eraser';
  updateBrushStyle();
}

function setColor(color: string): void {
  currentColor.value = color;
  updateBrushStyle();
}

function setBrushSize(size: number): void {
  brushSize.value = size;
  updateBrushStyle();
}

function clearCanvas(): void {
  if (!ctx.value) return;

  ctx.value.fillStyle = "#ffffff";
  ctx.value.fillRect(0, 0, width, height);
  updateBrushStyle();
  saveState();

  emit('canvas-clear');
}

function saveState(): void {
  if (!canvas.value) return;

  canvasData.value = canvas.value.toDataURL('image/png');

  if (canvasData.value) {
    emit('state-save', canvasData.value);
  }
}

async function getCurrentCanvasData(): Promise<string> {
  if (!canvas.value) {
    throw new Error("Canvas is unable to get current data");
  }

  if (canvasData.value) {
    return canvasData.value;
  }

  return canvas.value.toDataURL('image/png');
}

defineExpose({
  setTool,
  setColor,
  setBrushSize,
  clearCanvas,
  getCurrentCanvasData
});
</script>

<style scoped>
.drawing-board {
  font-family: Arial, sans-serif;
  max-width: 100%;
}

.canvas-container {
  position: relative;
  margin-top: 20px;
}

canvas {
  border: 1px solid #ccc;
  cursor: crosshair;
  background-color: white;
  max-width: 100%;
}
</style>