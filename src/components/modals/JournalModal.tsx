/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { X, Edit3, Trash2, Heart } from 'lucide-react';
import { DramaEntry } from '../../types';
import { RichTextContent } from '../editor/RichTextEditor';

interface JournalModalProps {
  entry: DramaEntry;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function JournalModal({ entry, onClose, onEdit, onDelete }: JournalModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-start md:items-center justify-center bg-on-background/40 backdrop-blur-md p-0 md:p-4 overflow-y-auto" onClick={onClose}>
      <motion.div
        layoutId={`poster-${entry.id}`}
        className="relative w-full md:max-w-6xl md:aspect-[16/10] min-h-screen md:min-h-0 bg-surface-container-low rounded-none md:rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden paper-texture"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 手机端顶部操作按钮 */}
        <div className="md:hidden absolute top-4 left-4 right-4 flex justify-between z-10">
          {/* 左侧返回按钮 */}
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow-sm"
            title="返回"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
          {/* 右侧操作按钮 */}
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow-sm"
              title="编辑"
            >
              <Edit3 className="w-5 h-5 text-on-surface-variant" />
            </button>
            <button
              onClick={onDelete}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow-sm"
              title="删除"
            >
              <Trash2 className="w-5 h-5 text-error" />
            </button>
          </div>
        </div>

        {/* Poster Section - 手机端顶部，电脑端左侧 */}
        <section className="w-full md:flex-1 p-4 md:p-12 flex flex-col items-center justify-center relative md:border-r border-outline/20">
          <div className="relative w-full max-w-[200px] md:max-w-sm aspect-[3/4] bg-surface-container-high rounded-sm shadow-xl p-2 md:p-3 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
            <img src={entry.poster} alt={entry.title} className="w-full h-full object-cover rounded-sm grayscale-[10%]" referrerPolicy="no-referrer" />
          </div>
        </section>

        {/* Journal Spine - 仅电脑端显示 */}
        <div className="hidden md:flex w-10 journal-spine flex-col justify-between py-12">
          {[...Array(3)].map((_, i) => <div key={i} className="w-full h-px bg-on-surface/5"></div>)}
        </div>

        {/* Content Section */}
        <section className="flex-1 p-4 md:p-16 flex flex-col relative overflow-y-auto">
          {/* 电脑端操作按钮 */}
          <div className="hidden md:flex absolute top-6 right-8 gap-3">
            <button
              onClick={onEdit}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
              title="编辑"
            >
              <Edit3 className="w-5 h-5 text-on-surface-variant" />
            </button>
            <button
              onClick={onDelete}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error/10 transition-colors"
              title="删除"
            >
              <Trash2 className="w-5 h-5 text-error" />
            </button>
          </div>

          <header className="mb-6 md:mb-10">
            <div className="flex items-center gap-4 mb-2">
              <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">{entry.status === 'completed' ? '已看完' : '在看'}</span>
            </div>
            <div className="flex items-center gap-3 mb-2 md:mb-4">
              <h1 className="font-serif text-3xl md:text-5xl text-on-background leading-tight">
                {entry.title}
              </h1>
              {entry.watchCount > 1 && (
                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-bold">×{entry.watchCount}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
              {entry.tags.map(tag => (
                <span key={tag} className="bg-white border border-outline/20 px-2 md:px-3 py-1 text-xs rounded-sm shadow-sm">{tag}</span>
              ))}
              <span className="bg-primary/5 border border-primary/20 px-2 md:px-3 py-1 text-xs rounded-sm shadow-sm text-primary font-bold">{entry.platform}</span>
            </div>
            <div className="mt-3 md:mt-4 text-xs md:text-sm text-on-surface-variant space-y-1">
              <div><span className="font-bold opacity-60">主演：</span>{entry.actors.join(' / ')}</div>
              <div><span className="font-bold opacity-60">播出：</span>{entry.releaseDate}</div>
              <div><span className="font-bold opacity-60">首次观看：</span>{entry.firstEncounter || '未记录'}</div>
              {/* 分���进度 */}
              {entry.status === 'watching' && entry.totalEpisodes && entry.totalEpisodes > 0 && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold opacity-60">观看进度：</span>
                    <span className="text-primary font-bold">{entry.currentEpisode || 0} / {entry.totalEpisodes} 集</span>
                  </div>
                  <div className="mt-1.5 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, ((entry.currentEpisode || 0) / entry.totalEpisodes) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </header>

          <article className="flex-grow space-y-6 md:space-y-8">
            <section className="space-y-2 md:space-y-3">
              <h3 className="text-xs font-bold text-primary tracking-[0.2em] uppercase">剧情简介</h3>
              <p className="text-on-surface-variant leading-relaxed text-xs md:text-sm opacity-80">
                {entry.summary}
              </p>
            </section>

            <section className="space-y-3 md:space-y-4">
              <h3 className="text-xs font-bold text-primary tracking-[0.2em] uppercase">个人总结</h3>
              <div className="text-on-surface/80">
                <RichTextContent content={entry.reflection} />
                <p className="mt-4 md:mt-8 text-right pr-4 italic text-on-surface-variant">— 拾光者</p>
              </div>
            </section>
          </article>

          <footer className="mt-6 md:mt-12 pt-4 md:pt-8 border-t border-outline/20 flex items-center">
            {entry.isMustWatch && (
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-primary flex items-center justify-center">
                  <Heart className="w-3 h-3 md:w-4 md:h-4 text-primary fill-current" />
                </div>
                <span className="text-xs md:text-sm text-on-surface-variant">必看推荐</span>
              </div>
            )}
          </footer>
        </section>
      </motion.div>
    </div>
  );
}
