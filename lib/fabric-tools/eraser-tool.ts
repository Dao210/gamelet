import * as fabric from 'fabric'

/**
 * Eraser Tool - 橡皮擦工具
 * 使用 Fabric.js 的 EraserBrush 实现
 */
export class EraserTool {
  private canvas: fabric.Canvas
  private width: number = 10

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas
  }

  /**
   * 激活橡皮擦工具
   */
  activate() {
    this.canvas.isDrawingMode = true

    // 使用 PencilBrush 配合 globalCompositeOperation 实现橡皮擦
    const eraser = new fabric.PencilBrush(this.canvas)
    eraser.width = this.width
    eraser.color = 'rgba(0,0,0,1)' // 颜色不重要，因为会被 composite operation 覆盖

    this.canvas.freeDrawingBrush = eraser

    // 设置橡皮擦模式
    // @ts-ignore - Fabric.js 类型定义可能不完整
    if (this.canvas.freeDrawingBrush) {
      // @ts-ignore
      this.canvas.freeDrawingBrush.globalCompositeOperation = 'destination-out'
    }
  }

  /**
   * 停用橡皮擦工具
   */
  deactivate() {
    this.canvas.isDrawingMode = false
    this.canvas.freeDrawingBrush = null as any
  }

  /**
   * 设置橡皮擦大小
   */
  setWidth(width: number) {
    this.width = Math.max(1, Math.min(100, width))
    if (this.canvas.isDrawingMode && this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.width = this.width
    }
  }

  /**
   * 获取当前配置
   */
  getConfig() {
    return {
      width: this.width
    }
  }

  /**
   * 清空整个画布
   */
  clearAll() {
    const objects = this.canvas.getObjects()
    // 保留背景层对象
    const objectsToRemove = objects.filter(obj => {
      // @ts-ignore
      return obj.layerId !== 'bg-layer'
    })

    objectsToRemove.forEach(obj => {
      this.canvas.remove(obj)
    })

    this.canvas.renderAll()
  }
}
