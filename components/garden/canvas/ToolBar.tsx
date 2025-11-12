'use client';

import { useState } from 'react';
import { ChromePicker } from 'react-color';

interface ToolBarProps {
  currentTool: 'pen' | 'eraser';
  currentColor: string;
  brushSize: number;
  onToolChange: (tool: 'pen' | 'eraser') => void;
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
}

export default function ToolBar({
  currentTool,
  currentColor,
  brushSize,
  onToolChange,
  onColorChange,
  onBrushSizeChange
}: ToolBarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  // 预设颜色
  const presetColors = [
    '#000000', // 黑色
    '#FF0000', // 红色
    '#00FF00', // 绿色
    '#0000FF', // 蓝色
    '#FFFF00', // 黄色
    '#FF00FF', // 紫色
    '#00FFFF', // 青色
    '#FFA500', // 橙色
    '#800080', // 深紫色
    '#FFC0CB', // 粉色
  ];

  const tools = [
    { id: 'pen', name: '画笔', icon: '✏️' },
    { id: 'eraser', name: '橡皮擦', icon: '🧹' },
  ];

  const brushSizes = [
    { size: 1, label: '细', preview: 1 },
    { size: 3, label: '中', preview: 3 },
    { size: 5, label: '粗', preview: 5 },
    { size: 8, label: '特粗', preview: 8 },
    { size: 12, label: '最粗', preview: 12 },
  ];

  return (
    <div className="space-y-4">
      {/* 工具选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🛠️ 工具
        </label>
        <div className="flex gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id as 'pen' | 'eraser')}
              className={`flex-1 px-3 py-2 rounded-lg border-2 transition-colors ${
                currentTool === tool.id
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
              title={tool.name}
            >
              <span className="text-xl">{tool.icon}</span>
              <div className="text-xs mt-1">{tool.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 画笔大小 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📏 画笔大小: {brushSize}px
        </label>
        <div className="space-y-2">
          {brushSizes.map((brush) => (
            <button
              key={brush.size}
              onClick={() => onBrushSizeChange(brush.size)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border-2 transition-colors ${
                brushSize === brush.size
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
            >
              <span className="text-sm">{brush.label}</span>
              <div className="flex items-center gap-2">
                <div
                  className="rounded-full bg-gray-800"
                  style={{
                    width: `${brush.preview}px`,
                    height: `${brush.preview}px`,
                    minWidth: `${brush.preview}px`,
                    minHeight: `${brush.preview}px`
                  }}
                />
                <span className="text-xs text-gray-500">{brush.size}px</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 颜色选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🎨 颜色
        </label>

        {/* 当前颜色显示 */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
            style={{ backgroundColor: currentColor }}
            title="点击选择颜色"
          />
          <span className="text-sm text-gray-600 font-mono">
            {currentColor.toUpperCase()}
          </span>
        </div>

        {/* 颜色选择器 */}
        {showColorPicker && (
          <div className="mb-3 p-3 bg-white border-2 border-gray-300 rounded-lg shadow-lg">
            <ChromePicker
              color={currentColor}
              onChange={(color) => onColorChange(color.hex)}
              disableAlpha
            />
            <button
              onClick={() => setShowColorPicker(false)}
              className="mt-2 w-full px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
            >
              关闭
            </button>
          </div>
        )}

        {/* 预设颜色 */}
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className={`w-full aspect-square rounded-lg border-2 cursor-pointer hover:scale-110 transition-transform ${
                currentColor === color ? 'border-green-500' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* 使用提示 */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <div className="font-medium mb-1">💡 使用提示:</div>
        <ul className="space-y-1">
          <li>• 在画布上按住鼠标拖动即可绘制</li>
          <li>• 使用橡皮擦工具可以擦除内容</li>
          <li>• 支持触屏设备的手指绘制</li>
          <li>• 点击颜色块可以快速切换颜色</li>
        </ul>
      </div>
    </div>
  );
}