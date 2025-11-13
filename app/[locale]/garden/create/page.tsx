'use client';

import { useState } from 'react';
import DrawingCanvas from '@/components/garden/canvas/DrawingCanvas';
import ToolBar from '@/components/garden/canvas/ToolBar';
import PlantCreationForm from '@/components/garden/plant/PlantCreationForm';

export default function CreatePlantPage() {
  const [canvasData, setCanvasData] = useState<string | null>(null);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);

  const handleCanvasSave = (imageData: string) => {
    setCanvasData(imageData);
  };

  const handleToolChange = (tool: 'pen' | 'eraser') => {
    setCurrentTool(tool);
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
  };

  const handleBrushSizeChange = (size: number) => {
    setBrushSize(size);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          🎨 创作你的植物
        </h2>
        <p className="text-gray-600 mb-6">
          发挥你的创意，绘制一幅独特的植物涂鸦。完成后，它将成为全球藤架中的一员！
        </p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧：绘画区域 */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-xl p-4">
              <DrawingCanvas
                tool={currentTool}
                color={currentColor}
                brushSize={brushSize}
                onSave={handleCanvasSave}
              />
            </div>
          </div>

          {/* 右侧：工具栏和表单 */}
          <div className="space-y-6">
            {/* 工具栏 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                🛠️ 绘画工具
              </h3>
              <ToolBar
                currentTool={currentTool}
                currentColor={currentColor}
                brushSize={brushSize}
                onToolChange={handleToolChange}
                onColorChange={handleColorChange}
                onBrushSizeChange={handleBrushSizeChange}
              />
            </div>

            {/* 植物信息表单 */}
            {canvasData && (
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-green-700 mb-3">
                  🌱 植物信息
                </h3>
                <PlantCreationForm
                  imageData={canvasData}
                  onSuccess={() => {
                    // 成功创建后的处理逻辑
                    window.location.href = '/garden';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 创作提示 */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          💡 创作小贴士
        </h3>
        <ul className="space-y-2 text-blue-700">
          <li>• 想象你心中的理想植物，自由发挥创意</li>
          <li>• 使用不同的颜色让植物更加生动</li>
          <li>• 简单的线条也能创造出独特的风格</li>
          <li>• 完成后记得给你的植物取个名字</li>
        </ul>
      </div>
    </div>
  );
}