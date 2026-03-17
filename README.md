# Drama Diary 

一个用于记录剧集/电影观看体验的个人日记应用。

[→ 在线访问](https://your-vercel-url.vercel.app) (Vercel 部署)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)

## 功能特性

- 📧 邮箱注册、登录、退出（Supabase Auth）
- 📝 新增 / 编辑 / 删除影视条目
- 🏷️ 按状态管理条目：`watching`（在看）、`completed`（已看完）、`planned`（想看）
- 🔍 条目搜索与筛选（关键字）
- 📊 按评分或年份排序展示
- 🎬 集成 TMDB 搜索，自动填充影视信息（海报、类型、演员等）
- 💾 记住账号功能，一键填充邮箱

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite 6 |
| 样式 | Tailwind CSS 4 |
| 后端服务 | Supabase（认证 + 数据存储） |
| 影视数据 | TMDB API |
| 图标 | Lucide React |
| 动画 | Motion |

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/drama-diary.git
cd drama-diary
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入你的密钥：

```bash
cp .env.example .env.local
```

需要配置的变量：
- `VITE_SUPABASE_URL` - Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY` - Supabase 匿名密钥
- `VITE_TMDB_API_KEY` - TMDB API 密钥

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 构建生产版本

```bash
npm run build
```

## 部署到 Vercel

### 一键部署

点击下方按钮将项目部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/drama-diary)

### 手动部署

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 创建新项目
3. 导入 GitHub 仓库
4. 配置环境变量（在 Vercel Dashboard → Settings → Environment Variables 中添加）
5. 部署

## 数据库配置

在 Supabase 中创建 `dramas` 表：

```sql
create table dramas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  poster text,
  rating integer default 0,
  tags text[] default '{}',
  actors text[] default '{}',
  platform text,
  summary text,
  reflection text,
  date text,
  release_date text,
  watch_count integer default 1,
  first_encounter text,
  completion_date text,
  status text default 'completed',
  is_must_watch boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 启用行级安全
alter table dramas enable row level security;

-- 创建策略：用户只能访问自己的数据
create policy "Users can only access their own dramas"
  on dramas
  for all
  using (auth.uid() = user_id);
```

## 项目结构

```
src/
├── components/
│   ├── ErrorBoundary.tsx
│   ├── auth/
│   │   └── AuthForm.tsx
│   ├── entries/
│   │   ├── DiaryEntryCard.tsx
│   │   └── EntryList.tsx
│   ├── layout/
│   │   └── Navbar.tsx
│   └── modals/
│       ├── EntryModal.tsx
│       └── JournalModal.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useEntries.ts
│   └── useSearch.ts
├── supabase.ts
├── tmdb.ts
├── types.ts
├── App.tsx
└── main.tsx
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

[MIT](LICENSE)

## 感谢

- [TMDB](https://www.themoviedb.org/) - 影视数据 API
- [Supabase](https://supabase.com/) - 后端服务
- [Vercel](https://vercel.com/) - 托管和部署
