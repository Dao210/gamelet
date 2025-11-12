'use client';

import { useState } from 'react';
import { useGardenStore } from '@/lib/garden-store';

interface PlantCreationFormProps {
  imageData: string;
  onSuccess: () => void;
}

export default function PlantCreationForm({
  imageData,
  onSuccess
}: PlantCreationFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createPlant } = useGardenStore();

  // 预设的植物标签
  const presetTags = [
    '写实', '抽象', '可爱', '怪诞', '极简',
    '热带', '沙漠', '森林', '海洋', '科幻',
    '花朵', '树木', '仙人掌', '蕨类', '蘑菇'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('请给你的植物取个名字');
      return;
    }

    setIsSubmitting(true);

    try {
      await createPlant({
        name: name.trim(),
        description: description.trim() || undefined,
        imageData,
        tags: tags.length > 0 ? tags : undefined
      });

      // 重置表单
      setName('');
      setDescription('');
      setTags([]);
      setTagInput('');

      // 调用成功回调
      onSuccess();
    } catch (err) {
      setError('创建植物失败，请重试');
      console.error('Failed to create plant:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 植物名称 */}
      <div>
        <label htmlFor="plant-name" className="block text-sm font-medium text-gray-700 mb-1">
          🌱 植物名称 *
        </label>
        <input
          id="plant-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="给你的植物起个独特的名字"
          maxLength={50}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          required
        />
        <div className="text-xs text-gray-500 mt-1">
          {name.length}/50 字符
        </div>
      </div>

      {/* 植物描述 */}
      <div>
        <label htmlFor="plant-description" className="block text-sm font-medium text-gray-700 mb-1">
          📝 植物描述 (可选)
        </label>
        <textarea
          id="plant-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="描述一下你的创作灵感..."
          maxLength={200}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
        />
        <div className="text-xs text-gray-500 mt-1">
          {description.length}/200 字符
        </div>
      </div>

      {/* 标签 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          🏷️ 标签 (最多5个)
        </label>

        {/* 当前标签 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-green-900 focus:outline-none"
                  title="移除标签"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* 标签输入 */}
        <div className="relative">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagInputKeyPress}
            placeholder="输入标签后按回车添加"
            maxLength={20}
            disabled={tags.length >= 5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {tags.length >= 5 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              已满
            </div>
          )}
        </div>

        {/* 预设标签 */}
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">快速添加:</p>
          <div className="flex flex-wrap gap-1">
            {presetTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                disabled={tags.includes(tag) || tags.length >= 5}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 预览图片 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          👁️ 预览
        </label>
        <div className="border-2 border-gray-200 rounded-lg p-2 bg-gray-50">
          <img
            src={imageData}
            alt="植物预览"
            className="w-full h-32 object-contain rounded"
          />
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={isSubmitting || !name.trim()}
        className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <>
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            正在种植...
          </>
        ) : (
          '🌱 种植植物'
        )}
      </button>

      {/* 提示 */}
      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
        <div className="font-medium mb-1">✨ 完成后，你的植物将:</div>
        <ul className="space-y-1">
          <li>• 获得初始生命力 (Level 0)</li>
          <li>• 加入全球藤架社区</li>
          <li>• 开始收集点赞，逐渐成长</li>
          <li>• 解锁更多炫酷的动画效果</li>
        </ul>
      </div>
    </form>
  );
}