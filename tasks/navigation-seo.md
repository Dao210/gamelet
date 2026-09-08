# Header / Footer 导航优化

日期：2026-09-08。状态：本地实现、生产构建及浏览器验收完成，尚未部署到线上。

## 导航与 SEO

- 页头直接提供全部游戏、Patches、Nerdle，另设更多游戏和玩法指南，共 13 个内容目标。
- 页脚按逻辑与数字、文字空间与策略、玩法与练习、站点信息分组，覆盖 23 个不同目标。
- Patches 玩法、策略和三个难度页面进入全站内链；Pulsefront 等现有游戏有明确入口。
- 链接文字对应实际内容，移除指向关于页的“常见问题”重复入口，以及指向 GitHub 首页的占位链接。Nerdle 提示页标为解题技巧，不宣称提供官方每日答案。
- 桌面和手机使用同一套初始 HTML 链接；下拉内容使用原生 details / summary。页脚无需等待滚动动画即可显示。
- 语言切换为带 href、hreflang、lang 的真实链接，指向当前路径的对应语言版本，仅展示五种公开语言。
- 继续使用现有 Next.js、next-intl、路由和布局。导航链接配置集中在 lib/site-navigation.ts，不涉及游戏引擎、题库或数据库。

实现参考 [Google 的链接最佳实践](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)：可解析的 href、清晰准确的锚文本，以及有用的站内链接。实际收录、排名和搜索流量需上线后观察。

## 性能与交互

- Navigation、Footer、LanguageSelector 不再直接依赖 framer-motion；下拉使用浏览器原生行为和少量 CSS。
- 游戏、指南及语言导航禁用自动预取，减少进入页面时的额外路由加载；品牌 Logo 继续复用原组件。
- 菜单支持 Escape、焦点回退、点击外部关闭和页面切换后关闭；使用 aria-current 标识当前页面。
- 新增 @types/react-dom 开发类型依赖，用于服务端 HTML 回归测试，无新增运行时依赖。
- 本次未测量真实用户的 LCP、INP、CLS，不将代码精简等同于具体性能分数提升。

## 验证

| 检查 | 结果 |
| --- | --- |
| pnpm test --runInBand | 22 个测试套件、258 项通过，其中新增导航测试 7 项 |
| pnpm type-check | 通过 |
| pnpm lint | 0 错误，28 条既有警告 |
| pnpm i18n:check | 通过，五种公开语言覆盖率 100%；未公开语言沿用现有回退机制 |
| pnpm build | 通过 |
| 生产预览 HTTP 与 HTML 巡检 | 23 个目标 × 5 种语言，共 115 页，全部 HTTP 200，无跳转 |
| 初始 HTML | 每页包含 13 个主导航目标、23 个不同页脚目标、五个同路径语言链接 |
| 页面 SEO 元数据 | 115 页的自身 canonical 和五种语言 alternate 均匹配现有配置 |
| 浏览器 | 桌面中文 header、德语 footer、指南跳转、页头及页脚语言切换、390px 菜单、320px 德语长文案无横向溢出、Escape 关闭和焦点回退通过；生产首页已确认 |

本地生产预览：http://127.0.0.1:3001/zh
