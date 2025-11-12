'use client';

import { useEffect, useRef, useState } from 'react';
import { useGardenStore } from '@/lib/garden-store';

interface DrawingCanvasProps {
  tool?: 'pen' | 'eraser';
  color?: string;
  brushSize?: number;
  width?: number;
  height?: number;
  onSave?: (imageData: string) => void;
  className?: string;
}

export default function DrawingCanvas({
  tool = 'pen',
  color = '#000000',
  brushSize = 3,
  width = 400,
  height = 400,
  onSave,
  className = ''
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const {
    drawingState,
    updateDrawingState,
    saveDrawingStep,
    clearCanvas
  } = useGardenStore();

  // 初始化画布
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    canvas.width = width;
    canvas.height = height;

    // 设置白色背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // 设置默认画笔属性
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;

    setContext(ctx);

    return () => {
      setContext(null);
    };
  }, [width, height]);

  // 更新画笔属性
  useEffect(() => {
    if (!context) return;

    if (tool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.lineWidth = brushSize * 2; // 橡皮擦稍大一些
    } else {
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = color;
      context.lineWidth = brushSize;
    }
  }, [tool, color, brushSize, context]);

  // 获取鼠标或触摸位置
  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  // 开始绘制
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!context) return;

    const { x, y } = getPosition(e);

    setIsDrawing(true);
    updateDrawingState({ isDrawing: true });

    // 保存当前状态到历史
    const imageData = canvasRef.current?.toDataURL();
    if (imageData) {
      saveDrawingStep(imageData);
    }

    context.beginPath();
    context.moveTo(x, y);
    e.preventDefault();
  };

  // 绘制
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;

    const { x, y } = getPosition(e);

    context.lineTo(x, y);
    context.stroke();
    e.preventDefault();
  };

  // 停止绘制
  const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;

    setIsDrawing(false);
    updateDrawingState({ isDrawing: false });

    // 通知外部保存
    if (onSave) {
      const imageData = canvasRef.current?.toDataURL();
      if (imageData) {
        onSave(imageData);
      }
    }

    e.preventDefault();
  };

  // 撤销
  const undo = () => {
    const historyStep = drawingState.historyStep;
    if (historyStep > 0 && context && canvasRef.current) {
      const previousState = drawingState.history[historyStep - 1];
      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, width, height);
        context.drawImage(img, 0, 0);
      };
      img.src = previousState;
    }
  };

  // 重做
  const redo = () => {
    const historyStep = drawingState.historyStep;
    if (historyStep < drawingState.history.length - 1 && context && canvasRef.current) {
      const nextState = drawingState.history[historyStep + 1];
      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, width, height);
        context.drawImage(img, 0, 0);
      };
      img.src = nextState;
    }
  };

  // 清空画布
  const handleClear = () => {
    if (!context || !canvasRef.current) return;

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    clearCanvas();

    if (onSave) {
      onSave(canvasRef.current.toDataURL());
    }
  };

  return (
    <div className={`relative bg-white rounded-lg ${className}`}>
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-300 rounded-lg cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {/* 快捷操作按钮 */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={undo}
          disabled={drawingState.historyStep <= 0}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          title="撤销"
        >
          ↶
        </button>
        <button
          onClick={redo}
          disabled={drawingState.historyStep >= drawingState.history.length - 1}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          title="重做"
        >
          ↷
        </button>
        <button
          onClick={handleClear}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          title="清空"
        >
          🗑️
        </button>
      </div>

      {/* 绘画状态指示器 */}
      {isDrawing && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white rounded text-xs">
          正在绘制...
        </div>
      )}
    </div>
  );
}