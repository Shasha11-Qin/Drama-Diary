/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, LogOut } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface NavbarProps {
  user: User | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLogout: () => void;
}

export function Navbar({ user, searchQuery, onSearchChange, onLogout }: NavbarProps) {
  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md px-4 py-3 border-b border-outline/10">
      {/* 桌面端导航 */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-serif text-2xl font-bold text-primary tracking-tight">Drama Diary</h1>
          <span className="font-serif text-lg text-outline ml-2 opacity-60">剧影日记</span>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-2.5">
            <Search className="w-4 h-4 text-gray-400 mr-2.5" />
            <input
              type="text"
              placeholder="搜索你的档案..."
              className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 w-full text-gray-700 placeholder:text-gray-400 text-sm"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onLogout}
            className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant flex items-center gap-2"
            title="退出登录"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-container-high bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        </div>
      </div>

      {/* 移动端导航 */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl font-bold text-primary tracking-tight">Drama Diary</h1>
            <span className="font-serif text-sm text-outline opacity-60">剧影日记</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant"
              title="退出登录"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full border-2 border-surface-container-high bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-xs">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
        {/* 移动端搜索框 */}
        <div className="relative flex items-center bg-gray-100 rounded-full px-3 py-2">
          <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="搜索你的档案..."
            className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 w-full text-gray-700 placeholder:text-gray-400 text-sm"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </nav>
  );
}
