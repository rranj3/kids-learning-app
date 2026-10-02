'use client';

import { useState, useEffect } from 'react';
import { Child, AgeBand } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { AGE_BANDS, storage } from '@/lib/utils';

interface ProfileSelectorProps {
  onSelectChild: (child: Child) => void;
}

export default function ProfileSelector({ onSelectChild }: ProfileSelectorProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAgeBand, setNewChildAgeBand] = useState<AgeBand>('K-G2');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChildren();
  }, []);

  async function loadChildren() {
    try {
      setIsLoading(true);
      const data = await apiClient.getChildren();
      setChildren(data.children || []);

      // Auto-select first child if exists
      if (data.children && data.children.length > 0) {
        const savedChildId = storage.getChildId();
        const childToSelect = data.children.find((c: Child) => c.id === savedChildId) || data.children[0];
        onSelectChild(childToSelect);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profiles');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateChild(e: React.FormEvent) {
    e.preventDefault();
    if (!newChildName.trim()) return;

    try {
      setIsCreating(true);
      const newChild = await apiClient.createChild(newChildName, newChildAgeBand);
      setChildren([...children, newChild]);
      setNewChildName('');
      setNewChildAgeBand('K-G2');
      onSelectChild(newChild);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setIsCreating(false);
    }
  }

  function handleSelectChild(child: Child) {
    storage.setChildId(child.id);
    onSelectChild(child);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-600 text-lg font-semibold">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-700 mb-2">🎓 Shreya's Learning World</h1>
          <p className="text-xl text-indigo-600">Select a learner to get started</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Child profiles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => handleSelectChild(child)}
              className="group p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer text-left"
            >
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                {child.profile_picture_url ? '👧' : '😊'}
              </div>
              <h2 className="text-2xl font-bold text-indigo-700 mb-1">{child.name}</h2>
              <p className="text-indigo-600 font-semibold">
                {AGE_BANDS[child.age_band as AgeBand]?.label}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {AGE_BANDS[child.age_band as AgeBand]?.description}
              </p>
            </button>
          ))}
        </div>

        {/* Create new profile form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">Add New Learner</h2>
          <form onSubmit={handleCreateChild} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Child's Name
              </label>
              <input
                type="text"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="Enter name (e.g., Shreya)"
                className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-600 text-lg"
                disabled={isCreating}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age Group
              </label>
              <select
                value={newChildAgeBand}
                onChange={(e) => setNewChildAgeBand(e.target.value as AgeBand)}
                className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-600 text-lg"
                disabled={isCreating}
              >
                {Object.entries(AGE_BANDS).map(([band, info]) => (
                  <option key={band} value={band}>
                    {info.label} ({info.ageRange})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isCreating || !newChildName.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              {isCreating ? 'Creating...' : '➕ Add New Learner'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
