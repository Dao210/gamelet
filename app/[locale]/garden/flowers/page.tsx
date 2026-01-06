'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

/**
 * 花朵类型枚举
 */
enum FlowerType {
  Rose = 'rose',
  Daisy = 'daisy',
  CherryBlossom = 'cherry',
  Sunflower = 'sunflower',
  Tulip = 'tulip'
}

/**
 * 花朵类 - 封装单朵花的绘制和动效
 */
class Flower {
  p: any; // p5 instance
  x: number; // 花朵底部 x 坐标
  y: number; // 花朵底部 y 坐标
  height: number; // 茎的高度
  flowerType: FlowerType; // 花朵类型
  petalColor!: any; // p5.Color // 花瓣颜色（在构造函数中初始化）
  centerColor!: any; // p5.Color // 花蕊颜色（在构造函数中初始化）
  stemColor!: any; // p5.Color // 茎的颜色（在构造函数中初始化）
  leafColor!: any; // p5.Color // 叶子颜色（在构造函数中初始化）
  segments: number; // 茎的分段数
  swaySpeed: number; // 摇曳速度
  swayAmplitude: number; // 摇曳幅度
  windInfluence: number; // 受风力影响的程度
  petalCount!: number; // 花瓣数量（在构造函数中初始化）
  bloomProgress: number; // 绽放进度 (0-1)
  targetBloomProgress: number; // 目标绽放进度
  leafCount: number; // 叶子数量
  leaves: Array<{ x: number; y: number; angle: number; size: number }>; // 叶子数据

  constructor(p: any, x: number, canvasHeight: number) {
    this.p = p;
    this.x = x;
    this.y = canvasHeight;
    this.height = p.random(80, 180);

    // 随机选择花朵类型
    const types = Object.values(FlowerType);
    this.flowerType = types[Math.floor(p.random(types.length))];

    // 初始化颜色（根据花朵类型）
    this.initColors();

    // 物理属性
    this.segments = 12;
    this.swaySpeed = p.random(0.008, 0.02);
    this.swayAmplitude = p.random(8, 20);
    this.windInfluence = p.random(0.3, 0.8);

    // 花瓣属性（根据类型）
    this.initPetalProperties();

    // 绽放动画
    this.bloomProgress = 0;
    this.targetBloomProgress = 1;

    // 叶子
    this.leafCount = Math.floor(p.random(2, 5));
    this.leaves = [];
    for (let i = 0; i < this.leafCount; i++) {
      this.leaves.push({
        x: p.random(-20, 20),
        y: p.random(this.height * 0.3, this.height * 0.7),
        angle: p.random(-p.QUARTER_PI, p.QUARTER_PI),
        size: p.random(15, 30)
      });
    }
  }

  /**
   * 根据花朵类型初始化颜色
   */
  private initColors() {
    const p = this.p;

    switch (this.flowerType) {
      case FlowerType.Rose:
        // 玫瑰：红色系
        this.petalColor = p.color(p.random(180, 255), p.random(50, 100), p.random(80, 120));
        this.centerColor = p.color(255, 200, 150);
        break;
      case FlowerType.Daisy:
        // 雏菊：白色花瓣，黄色花蕊
        this.petalColor = p.color(250, 250, 255);
        this.centerColor = p.color(255, 220, 50);
        break;
      case FlowerType.CherryBlossom:
        // 樱花：粉色系
        this.petalColor = p.color(255, p.random(200, 230), p.random(200, 230));
        this.centerColor = p.color(255, 180, 200);
        break;
      case FlowerType.Sunflower:
        // 向日葵：黄色花瓣，深棕色花蕊
        this.petalColor = p.color(255, 200, 50);
        this.centerColor = p.color(100, 60, 20);
        break;
      case FlowerType.Tulip:
        // 郁金香：多彩
        const hue = p.random(360);
        this.petalColor = p.color(
          p.map(hue, 0, 360, 200, 255),
          p.map(hue, 0, 360, 100, 200),
          p.map(hue, 0, 360, 150, 255)
        );
        this.centerColor = p.color(50, 50, 50);
        break;
    }

    this.stemColor = p.color(p.random(30, 60), p.random(120, 180), p.random(40, 80));
    this.leafColor = p.color(p.random(40, 80), p.random(140, 200), p.random(50, 100));
  }

  /**
   * 根据花朵类型初始化花瓣属性
   */
  private initPetalProperties() {
    const p = this.p;

    switch (this.flowerType) {
      case FlowerType.Rose:
        this.petalCount = Math.floor(p.random(12, 18));
        break;
      case FlowerType.Daisy:
        this.petalCount = Math.floor(p.random(20, 30));
        break;
      case FlowerType.CherryBlossom:
        this.petalCount = Math.floor(p.random(5, 8));
        break;
      case FlowerType.Sunflower:
        this.petalCount = Math.floor(p.random(20, 28));
        break;
      case FlowerType.Tulip:
        this.petalCount = Math.floor(p.random(6, 8));
        break;
    }
  }

  /**
   * 绘制茎部（分段曲线，支持摇曳）
   */
  private drawStem(windForce: number) {
    const p = this.p;

    p.stroke(this.stemColor);
    p.strokeWeight(3);
    p.noFill();

    p.beginShape();
    // 从底部到顶部逐段绘制
    for (let i = 0; i <= this.segments; i++) {
      const t = p.frameCount * this.swaySpeed + i * 0.2;
      const baseSway = p.sin(t) * this.swayAmplitude * (i / this.segments);
      const windSway = windForce * this.windInfluence * (i / this.segments);
      const y = this.y - (i / this.segments) * this.height;
      p.vertex(this.x + baseSway + windSway, y);
    }
    p.endShape();
  }

  /**
   * 绘制叶子
   */
  private drawLeaves(windForce: number) {
    const p = this.p;

    this.leaves.forEach(leaf => {
      const stemTopIndex = this.segments - 1;
      const t = p.frameCount * this.swaySpeed + (leaf.y / this.height) * this.segments * 0.2;
      const baseSway = p.sin(t) * this.swayAmplitude * (leaf.y / this.height);
      const windSway = windForce * this.windInfluence * (leaf.y / this.height);
      const leafBaseX = this.x + baseSway + windSway;
      const leafBaseY = this.y - leaf.y;

      p.push();
      p.translate(leafBaseX, leafBaseY);
      p.rotate(leaf.angle + windForce * 0.1);

      p.fill(this.leafColor);
      p.noStroke();

      // 绘制叶子（椭圆形状）
      p.beginShape();
      p.vertex(0, 0);
      (p.bezierVertex as any)(
        leaf.size * 0.5, -leaf.size * 0.3,
        leaf.size, -leaf.size * 0.2,
        leaf.size, 0
      );
      (p.bezierVertex as any)(
        leaf.size, leaf.size * 0.2,
        leaf.size * 0.5, leaf.size * 0.3,
        0, 0
      );
      p.endShape(p.CLOSE);

      p.pop();
    });
  }

  /**
   * 绘制花瓣
   */
  private drawPetals(flowerX: number, flowerY: number) {
    const p = this.p;
    const petalLength = 25 * this.bloomProgress;
    const petalWidth = 15 * this.bloomProgress;

    p.fill(this.petalColor);
    p.noStroke();

    for (let i = 0; i < this.petalCount; i++) {
      const angle = (p.TWO_PI / this.petalCount) * i;

      p.push();
      p.translate(flowerX, flowerY);
      p.rotate(angle);

      // 根据花朵类型绘制不同的花瓣
      switch (this.flowerType) {
        case FlowerType.Rose:
          // 玫瑰：多层花瓣
          this.drawRosePetal(petalLength, petalWidth);
          break;
        case FlowerType.Daisy:
          // 雏菊：细长花瓣
          this.drawDaisyPetal(petalLength * 1.2, petalWidth * 0.6);
          break;
        case FlowerType.CherryBlossom:
          // 樱花：圆形花瓣
          this.drawCherryPetal(petalLength * 0.8, petalWidth * 0.8);
          break;
        case FlowerType.Sunflower:
          // 向日葵：宽花瓣
          this.drawSunflowerPetal(petalLength * 1.3, petalWidth);
          break;
        case FlowerType.Tulip:
          // 郁金香：U型花瓣
          this.drawTulipPetal(petalLength, petalWidth * 1.2);
          break;
      }

      p.pop();
    }
  }

  /**
   * 玫瑰花瓣
   */
  private drawRosePetal(length: number, width: number) {
    const p = this.p;
    p.beginShape();
    p.vertex(0, 0);
    (p.bezierVertex as any)(width * 0.5, -length * 0.3, width, -length * 0.5, width * 0.8, -length);
    (p.bezierVertex as any)(width * 0.3, -length * 0.9, -width * 0.3, -length * 0.9, -width * 0.8, -length);
    (p.bezierVertex as any)(-width, -length * 0.5, -width * 0.5, -length * 0.3, 0, 0);
    p.endShape(p.CLOSE);
  }

  /**
   * 雏菊花瓣
   */
  private drawDaisyPetal(length: number, width: number) {
    const p = this.p;
    p.beginShape();
    p.vertex(0, 0);
    (p.bezierVertex as any)(width * 0.3, -length * 0.5, width * 0.5, -length * 0.8, width * 0.2, -length);
    (p.bezierVertex as any)(-width * 0.2, -length * 0.8, -width * 0.3, -length * 0.5, 0, 0);
    p.endShape(p.CLOSE);
  }

  /**
   * 樱花花瓣
   */
  private drawCherryPetal(length: number, width: number) {
    const p = this.p;
    p.ellipse(width * 0.5, -length * 0.5, width, length);
  }

  /**
   * 向日葵花瓣
   */
  private drawSunflowerPetal(length: number, width: number) {
    const p = this.p;
    p.beginShape();
    p.vertex(0, 0);
    (p.bezierVertex as any)(width * 0.8, -length * 0.3, width * 1.2, -length * 0.7, width * 0.5, -length);
    (p.bezierVertex as any)(-width * 0.3, -length * 0.8, -width * 0.5, -length * 0.3, 0, 0);
    p.endShape(p.CLOSE);
  }

  /**
   * 郁金香花瓣
   */
  private drawTulipPetal(length: number, width: number) {
    const p = this.p;
    p.beginShape();
    p.vertex(0, 0);
    (p.bezierVertex as any)(width * 0.8, -length * 0.2, width * 0.9, -length * 0.6, width * 0.5, -length);
    (p.bezierVertex as any)(width * 0.1, -length * 0.95, -width * 0.1, -length * 0.95, -width * 0.5, -length);
    (p.bezierVertex as any)(-width * 0.9, -length * 0.6, -width * 0.8, -length * 0.2, 0, 0);
    p.endShape(p.CLOSE);
  }

  /**
   * 绘制花蕊
   */
  private drawCenter(flowerX: number, flowerY: number) {
    const p = this.p;
    const centerSize = 12 * this.bloomProgress;

    p.fill(this.centerColor);
    p.noStroke();
    p.circle(flowerX, flowerY, centerSize);

    // 花蕊细节
    if (this.bloomProgress > 0.5) {
      p.fill(0, 0, 0, 50);
      p.circle(flowerX, flowerY, centerSize * 0.6);
    }
  }

  /**
   * 更新绽放动画
   */
  updateBloom() {
    // 平滑过渡到目标绽放进度
    this.bloomProgress += (this.targetBloomProgress - this.bloomProgress) * 0.1;
  }

  /**
   * 触发绽放动画
   */
  triggerBloom() {
    this.targetBloomProgress = 1;
    // 改变颜色（随机微调）
    this.petalColor = this.p.color(
      this.p.red(this.petalColor) + this.p.random(-20, 20),
      this.p.green(this.petalColor) + this.p.random(-20, 20),
      this.p.blue(this.petalColor) + this.p.random(-20, 20)
    );
  }

  /**
   * 检查点击是否命中花朵
   */
  checkClick(mouseX: number, mouseY: number, windForce: number): boolean {
    const p = this.p;

    // 计算花朵顶部位置
    const stemTopIndex = this.segments - 1;
    const t = p.frameCount * this.swaySpeed + stemTopIndex * 0.2;
    const baseSway = p.sin(t) * this.swayAmplitude;
    const flowerX = this.x + baseSway + windForce * this.windInfluence;
    const flowerY = this.y - this.height;

    // 检查距离（花朵区域约半径40像素）
    const dist = p.dist(mouseX, mouseY, flowerX, flowerY);
    return dist < 50;
  }

  /**
   * 绘制完整花朵
   */
  draw(windForce: number) {
    // 更新绽放动画
    this.updateBloom();

    // 绘制茎
    this.drawStem(windForce);

    // 绘制叶子
    this.drawLeaves(windForce);

    // 计算花朵顶部位置
    const stemTopIndex = this.segments - 1;
    const t = this.p.frameCount * this.swaySpeed + stemTopIndex * 0.2;
    const baseSway = this.p.sin(t) * this.swayAmplitude;
    const windSway = windForce * this.windInfluence;
    const flowerX = this.x + baseSway + windSway;
    const flowerY = this.y - this.height;

    // 绘制花瓣
    this.drawPetals(flowerX, flowerY);

    // 绘制花蕊
    this.drawCenter(flowerX, flowerY);
  }
}

export default function FlowersPage() {
  const t = useTranslations('flowersPage');
  const p5InstanceRef = useRef<any>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 确保 p5 只在客户端加载
    if (typeof window === 'undefined') return;
    if (p5InstanceRef.current || !canvasContainerRef.current) return;

    // 动态导入 p5
    import('p5').then((p5Module) => {
      const p5Constructor = p5Module.default || p5Module;

    const sketch = (p: any) => {
      // 花朵数组
      let flowers: Flower[] = [];

      // 风场参数
      let windForce = 0;
      let mouseInfluence = 0;

      // 花朵数量
      const flowerCount = 40;

      p.setup = () => {
        const container = canvasContainerRef.current;
        if (!container) return;

        const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
        canvas.parent(container);

        // 批量生成花朵（横向随机分布）
        for (let i = 0; i < flowerCount; i++) {
          const x = p.random(50, p.width - 50);
          flowers.push(new Flower(p, x, p.height));
        }
      };

      p.draw = () => {
        // 清空画布
        p.clear();

        // 绘制背景（渐变天空）
        drawBackground(p);

        // 计算风力（鼠标影响）
        const targetWindForce = (p.mouseX - p.width / 2) * 0.1;
        windForce += (targetWindForce - windForce) * 0.05;

        // 绘制所有花朵
        // 按Y坐标排序，实现简单的深度排序
        flowers.forEach(flower => {
          flower.draw(windForce);
        });

        // 绘制风场提示（可选）
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          drawWindIndicator(p, windForce);
        }
      };

      /**
       * 绘制背景
       */
      const drawBackground = (p: any) => {
        // 天空渐变
        const ctx = p.drawingContext as CanvasRenderingContext2D;
        const gradient = ctx.createLinearGradient(0, 0, 0, p.height);
        gradient.addColorStop(0, '#e0f7fa');
        gradient.addColorStop(0.5, '#f0f9ff');
        gradient.addColorStop(1, '#fef3c7');

        ctx.fillStyle = gradient;
        p.rect(0, 0, p.width, p.height);

        // 地面
        p.fill(134, 185, 136);
        p.noStroke();
        p.rect(0, p.height - 30, p.width, 30);
      };

      /**
       * 绘制风力指示器
       */
      const drawWindIndicator = (p: any, force: number) => {
        const arrowLength = force * 5;
        const arrowY = 50;

        p.stroke(100, 150, 200, 150);
        p.strokeWeight(2);
        p.fill(100, 150, 200, 150);

        p.push();
        p.translate(p.width / 2, arrowY);

        // 箭头
        p.line(0, 0, arrowLength, 0);
        if (Math.abs(arrowLength) > 5) {
          const direction = arrowLength > 0 ? 1 : -1;
          p.triangle(
            arrowLength, 0,
            arrowLength - 10 * direction, -5,
            arrowLength - 10 * direction, 5
          );
        }

        p.pop();

        // 文字提示
        p.fill(100, 150, 200);
        p.noStroke();
        p.textSize(14);
        p.textAlign(p.CENTER);
        p.text('Wind', p.width / 2, arrowY + 20);
      };

      /**
       * 鼠标点击事件
       */
      p.mousePressed = () => {
        // 检查是否点击了花朵
        for (let flower of flowers) {
          if (flower.checkClick(p.mouseX, p.mouseY, windForce)) {
            flower.triggerBloom();
            break; // 只触发一朵花
          }
        }
      };

      /**
       * 窗口大小调整
       */
      p.windowResized = () => {
        const container = canvasContainerRef.current;
        if (!container) return;
        p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      };
    };

    // 创建 p5 实例
    p5InstanceRef.current = new p5Constructor(sketch);

    // 清理副作用
    return () => {
      p5InstanceRef.current?.remove();
      p5InstanceRef.current = null;
    };
    });
  }, []);

  return (
    <div className="w-full min-h-screen">
      {/* Header */}
      <div className="text-center py-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
          {t('subtitle')}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('description')}
        </p>
      </div>

      {/* Instructions */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            {t('instructionsTitle')}
          </h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="mr-2">🌬️</span>
              <span>{t('instructions.wind')}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🌸</span>
              <span>{t('instructions.click')}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div
          ref={canvasContainerRef}
          className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden"
          style={{ height: '600px' }}
        />
      </div>

      {/* Footer Info */}
      <div className="text-center pb-8 px-4">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {t('technology').split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < 2 && <br />}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
