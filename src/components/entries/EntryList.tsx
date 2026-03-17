/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, History } from 'lucide-react';
import { DramaEntry } from '../../types';
import { DiaryEntryCard } from './DiaryEntryCard';

interface EntryListProps {
  entries: DramaEntry[];
  activeStatus: 'watching' | 'completed' | 'planned';
  sortMode: 'rating' | 'year';
  searchQuery: string;
  searchResults: DramaEntry[];
  onStatusChange: (status: 'watching' | 'completed' | 'planned') => void;
  onSortModeChange: () => void;
  onEntryClick: (entry: DramaEntry) => void;
}

export function EntryList({
  entries,
  activeStatus,
  sortMode,
  searchQuery,
  searchResults,
  onStatusChange,
  onSortModeChange,
  onEntryClick
}: EntryListProps) {
  // 当有搜索词时，显示搜索结果（不受状态标签限制）
  if (searchQuery.trim()) {
    if (searchResults.length === 0) {
      return (
        <div className="text-center py-20 bg-surface-container-low rounded-xl border border-dashed border-outline/20">
          <p className="text-on-surface-variant opacity-60 italic">
            没有找到 "{searchQuery}" 相关的剧集
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 min-[600px]:grid-cols-3 min-[900px]:grid-cols-4 min-[1200px]:grid-cols-5 min-[1500px]:grid-cols-6 gap-4">
        {searchResults.map((entry) => (
          <DiaryEntryCard
            key={entry.id}
            entry={entry}
            onClick={() => onEntryClick(entry)}
          />
        ))}
      </div>
    );
  }

  // 无搜索词时，按状态标签显示
  const statusEntries = entries.filter(e => e.status === activeStatus);

  if (statusEntries.length === 0) {
    return (
      <div className="text-center py-20 bg-surface-container-low rounded-xl border border-dashed border-outline/20">
        <p className="text-on-surface-variant opacity-60 italic">
          {activeStatus === 'watching' ? '没有正在追的剧' :
           activeStatus === 'completed' ? '还没有看完的剧' : '还没有想看的剧'}
        </p>
      </div>
    );
  }

  // 在看和想看：简单列表，按添加时间倒序
  if (activeStatus !== 'completed') {
    return (
      <div className="grid grid-cols-2 min-[600px]:grid-cols-3 min-[900px]:grid-cols-4 min-[1200px]:grid-cols-5 min-[1500px]:grid-cols-6 gap-4">
        {statusEntries.map((entry) => (
          <DiaryEntryCard
            key={entry.id}
            entry={entry}
            onClick={() => onEntryClick(entry)}
          />
        ))}
      </div>
    );
  }

  // 已看完：根据排序模式显示
  if (sortMode === 'rating') {
    // 按喜爱程度排序
    const sortedByRating = [...statusEntries].sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      // 评分相同则按添加时间倒序
      return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
    });

    return (
      <div className="grid grid-cols-2 min-[600px]:grid-cols-3 min-[900px]:grid-cols-4 min-[1200px]:grid-cols-5 min-[1500px]:grid-cols-6 gap-4">
        {sortedByRating.map((entry, index) => (
          <DiaryEntryCard
            key={entry.id}
            entry={entry}
            rank={index + 1}
            onClick={() => onEntryClick(entry)}
          />
        ))}
      </div>
    );
  } else {
    // 按年份分组
    const groupedByYear = statusEntries.reduce((acc, entry) => {
      const year = entry.firstEncounter?.split('-')[0] || entry.date?.split('年')[0] || '未知';
      if (!acc[year]) acc[year] = [];
      acc[year].push(entry);
      return acc;
    }, {} as Record<string, DramaEntry[]>);

    // 按年份降序排列
    const sortedYears = Object.keys(groupedByYear).sort((a, b) => b.localeCompare(a));

    return (
      <div className="space-y-8">
        {sortedYears.map(year => (
          <section key={year}>
            <h2 className="font-serif text-lg md:text-xl text-on-surface mb-4 flex items-center gap-2">
              {year}年
              <span className="text-sm font-sans text-on-surface-variant opacity-60">
                ({groupedByYear[year].length}部)
              </span>
            </h2>
            <div className="grid grid-cols-2 min-[600px]:grid-cols-3 min-[900px]:grid-cols-4 min-[1200px]:grid-cols-5 min-[1500px]:grid-cols-6 gap-4">
              {groupedByYear[year]
                .sort((a, b) => new Date(b.firstEncounter || b.date || '').getTime() - new Date(a.firstEncounter || a.date || '').getTime())
                .map((entry) => (
                  <DiaryEntryCard
                    key={entry.id}
                    entry={entry}
                    onClick={() => onEntryClick(entry)}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>
    );
  }
}

interface EntryHeaderProps {
  entries: DramaEntry[];
  activeStatus: 'watching' | 'completed' | 'planned';
  sortMode: 'rating' | 'year';
  onStatusChange: (status: 'watching' | 'completed' | 'planned') => void;
  onSortModeChange: () => void;
}

export function EntryHeader({
  entries,
  activeStatus,
  sortMode,
  onStatusChange,
  onSortModeChange
}: EntryHeaderProps) {
  return (
    <header className="mb-6">
      {/* 状态标签切换 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        {/* 状态标签组 - 顺序：已看完、在看、想看 */}
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => onStatusChange('completed')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeStatus === 'completed'
                ? 'bg-primary text-on-primary shadow-md'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            已看完 <span className="opacity-80">({entries.filter(e => e.status === 'completed').length})</span>
          </button>
          <button
            onClick={() => onStatusChange('watching')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeStatus === 'watching'
                ? 'bg-primary text-on-primary shadow-md'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            在看 <span className="opacity-80">({entries.filter(e => e.status === 'watching').length})</span>
          </button>
          <button
            onClick={() => onStatusChange('planned')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeStatus === 'planned'
                ? 'bg-primary text-on-primary shadow-md'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            想看 <span className="opacity-80">({entries.filter(e => e.status === 'planned').length})</span>
          </button>
        </div>

        {/* 排序切换按钮 - 仅在"已看完"状态显示 */}
        {activeStatus === 'completed' && (
          <button
            onClick={onSortModeChange}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant text-xs font-medium hover:bg-surface-container-high transition-colors"
          >
            {sortMode === 'rating' ? (
              <>
                <Star className="w-4 h-4" />
                按喜爱排序
              </>
            ) : (
              <>
                <History className="w-4 h-4" />
                按年份分组
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
