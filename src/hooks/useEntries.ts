/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabase';
import { DramaEntry } from '../types';
import type { User } from '@supabase/supabase-js';

export function useEntries(user: User | null, authChecked: boolean) {
  const [entries, setEntries] = useState<DramaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 当认证状态确认后，如果用户未登录，停止加载
  useEffect(() => {
    if (authChecked && !user) {
      setLoading(false);
    }
  }, [authChecked, user]);

  const fetchEntries = useCallback(async () => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dramas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // 转换数据库字段到前端格式
      const formattedData: DramaEntry[] = (data || []).map(item => ({
        id: item.id,
        userId: item.user_id,
        title: item.title,
        poster: item.poster || '',
        rating: item.rating || 0,
        tags: item.tags || [],
        actors: item.actors || [],
        platform: item.platform || '',
        summary: item.summary || '',
        reflection: item.reflection || '',
        date: item.date || '',
        releaseDate: item.release_date || '',
        watchCount: item.watch_count || 1,
        firstEncounter: item.first_encounter,
        completionDate: item.completion_date,
        status: item.status || 'completed',
        isMustWatch: item.is_must_watch || false,
      }));

      setEntries(formattedData);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveEntry = useCallback(async (entry: DramaEntry) => {
    if (!user) return;
    setSaving(true);

    try {
      // 转换前端字段到数据库格式
      const dbData = {
        user_id: user.id,
        title: entry.title,
        poster: entry.poster,
        rating: entry.rating,
        tags: entry.tags,
        actors: entry.actors,
        platform: entry.platform,
        summary: entry.summary,
        reflection: entry.reflection,
        date: entry.date,
        release_date: entry.releaseDate,
        watch_count: entry.watchCount,
        first_encounter: entry.firstEncounter,
        completion_date: entry.completionDate,
        status: entry.status,
        is_must_watch: entry.isMustWatch,
      };

      if (entry.id) {
        const { error } = await supabase
          .from('dramas')
          .update(dbData)
          .eq('id', entry.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('dramas')
          .insert([dbData]);

        if (error) throw error;
      }

      // 重新获取数据
      await fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  }, [user, fetchEntries]);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('dramas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 重新获取数据
      await fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  }, [fetchEntries]);

  return {
    entries,
    loading,
    saving,
    fetchEntries,
    saveEntry,
    deleteEntry,
    setEntries
  };
}
