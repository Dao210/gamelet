import * as fabric from 'fabric'
import type { BrushType } from '../fabric-store'

/**
 * Brush Tool - 画笔工具
 * 支持多种画笔类型和属性配置
 */
export class BrushTool {
  private canvas: fabric.Canvas
  private color: string = '#000000'
  private width: number = 5
  private opacity: number = 1
  private brushType: BrushType = 'pen'

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas
  }

  /**
   * 激活画笔工具
   */
  activate() {
    this.canvas.isDrawingMode = true
    this.updateBrush()
  }

  /**
   * 停用画笔工具
   */
  deactivate() {
    this.canvas.isDrawingMode = false
    this.canvas.freeDrawingBrush = null as any
  }

  /**
   * 更新画笔配置
   */
  private updateBrush() {
    let brush: fabric.BaseBrush

    switch (this.brushType) {
      case 'pencil':
        brush = new fabric.PencilBrush(this.canvas)
        break
      case 'pen':
      default:
        brush = new fabric.PencilBrush(this.canvas)
        break
      // 其他画笔类型可以后续添加
      // case 'brush':
      // case 'airbrush':
      // case 'watercolor':
    }

    brush.color = this.color
    brush.width = this.width

    // 设置不透明度需要转换颜色格式
    if (this.opacity < 1) {
      const rgb = this.hexToRgb(this.color)
      if (rgb) {
        brush.color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.opacity})`
      }
    }

    this.canvas.freeDrawingBrush = brush
  }

  /**
   * 设置画笔颜色
   */
  setColor(color: string) {
    this.color = color
    if (this.canvas.isDrawingMode && this.canvas.freeDrawingBrush) {
      this.updateBrush()
    }
  }

  /**
   * 设置画笔大小
   */
  setWidth(width: number) {
    this.width = Math.max(1, Math.min(100, width))
    if (this.canvas.isDrawingMode && this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.width = this.width
    }
  }

  /**
   * 设置画笔不透明度 (0-1)
   */
  setOpacity(opacity: number) {
    this.opacity = Math.max(0, Math.min(1, opacity))
    if (this.canvas.isDrawingMode) {
      this.updateBrush()
    }
  }

  /**
   * 设置画笔类型
   */
  setBrushType(type: BrushType) {
    this.brushType = type
    if (this.canvas.isDrawingMode) {
      this.updateBrush()
    }
  }

  /**
   * 获取当前配置
   */
  getConfig() {
    return {
      color: this.color,
      width: this.width,
      opacity: this.opacity,
      type: this.brushType
    }
  }

  /**
   * HEX to RGB 转换
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null
  }
}
