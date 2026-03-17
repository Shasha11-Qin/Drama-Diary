/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Edit3 } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthForm } from './components/auth/AuthForm';
import { Navbar } from './components/layout/Navbar';
import { EntryHeader, EntryList } from './components/entries/EntryList';
import { EntryModal } from './components/modals/EntryModal';
import { JournalModal } from './components/modals/JournalModal';
import { useAuth } from './hooks/useAuth';
import { useEntries } from './hooks/useEntries';
import { useSearch } from './hooks/useSearch';
import { DramaEntry } from './types';

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const { user, authChecked, handleLogout } = useAuth();
  const { entries, loading, saving, fetchEntries, saveEntry, deleteEntry, setEntries } = useEntries(user, authChecked);
  const { searchQuery, setSearchQuery, searchResults } = useSearch(entries);
  
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DramaEntry | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<DramaEntry | null>(null);
  const [activeStatus, setActiveStatus] = useState<'watching' | 'completed' | 'planned'>('completed');
  const [sortMode, setSortMode] = useState<'rating' | 'year'>('rating');

  // 用户登录后加载数据
  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user, fetchEntries]);

  // 弹窗打开时禁止背景滚动
  useEffect(() => {
    if (isEntryModalOpen || selectedEntry) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isEntryModalOpen, selectedEntry]);

  const handleSaveEntry = async (entry: DramaEntry) => {
    await saveEntry(entry);
    setIsEntryModalOpen(false);
    setEditingEntry(null);
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('确定要删除这条记录吗？此操作无法撤销。')) return;
    
    try {
      await deleteEntry(id);
      setSelectedEntry(null);
    } catch {
      alert('删除失败，请重试');
    }
  };

  const handleOpenAddModal = () => {
    setEditingEntry(null);
    setIsEntryModalOpen(true);
  };

  const handleOpenEditModal = () => {
    if (selectedEntry) {
      setEditingEntry(selectedEntry);
      setIsEntryModalOpen(true);
      setSelectedEntry(null);
    }
  };

  const handleCloseEntryModal = () => {
    setIsEntryModalOpen(false);
    setEditingEntry(null);
  };

  const handleSortModeChange = () => {
    setSortMode(prev => prev === 'rating' ? 'year' : 'rating');
  };

  // 加载状态
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 未登录状态
  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Top Navigation */}
      <Navbar 
        user={user} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
        <EntryHeader
          entries={entries}
          activeStatus={activeStatus}
          sortMode={sortMode}
          onStatusChange={setActiveStatus}
          onSortModeChange={handleSortModeChange}
        />

        <EntryList
          entries={entries}
          activeStatus={activeStatus}
          sortMode={sortMode}
          searchQuery={searchQuery}
          searchResults={searchResults}
          onStatusChange={setActiveStatus}
          onSortModeChange={handleSortModeChange}
          onEntryClick={setSelectedEntry}
        />
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={handleOpenAddModal}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-primary-container text-on-primary rounded-xl flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
      >
        <Edit3 className="w-7 h-7" />
      </button>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {isEntryModalOpen && (
          <EntryModal 
            onClose={handleCloseEntryModal}
            onSave={handleSaveEntry}
            initialData={editingEntry || undefined}
            isSaving={saving}
          />
        )}
        {selectedEntry && (
          <JournalModal
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            onEdit={handleOpenEditModal}
            onDelete={() => handleDeleteEntry(selectedEntry.id)}
          />
        )}
      </AnimatePresence>

      {/* Subtle Background Tint */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-tr from-primary/5 to-transparent mix-blend-multiply z-0"></div>
    </div>
  );
}
