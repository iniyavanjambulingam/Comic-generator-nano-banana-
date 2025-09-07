
import React, { useState } from 'react';
import type { ComicFormState } from '../types';
import { ComicStyle, Language } from '../types';
import { LANGUAGES, STYLES, PANEL_OPTIONS } from '../constants';

interface ComicFormProps {
  onSubmit: (data: ComicFormState) => void;
  isLoading: boolean;
}

const ComicForm: React.FC<ComicFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ComicFormState>({
    story: '',
    language: Language.English,
    style: ComicStyle.Manga,
    panels: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'panels' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.story.trim()) {
      alert("Please enter a story.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      <div>
        <label htmlFor="story" className="block text-sm font-medium text-gray-300 mb-2">
          Story (1-4 sentences)
        </label>
        <textarea
          id="story"
          name="story"
          value={formData.story}
          onChange={handleChange}
          rows={4}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          placeholder="e.g., A brave knight finds a lost dragon in the forest. They become friends and fly to a castle in the clouds."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
            Language
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          >
            {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-2">
            Style
          </label>
          <select
            id="style"
            name="style"
            value={formData.style}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          >
            {STYLES.map(style => <option key={style} value={style}>{style}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="panels" className="block text-sm font-medium text-gray-300 mb-2">
            Panels
          </label>
          <select
            id="panels"
            name="panels"
            value={formData.panels}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          >
            {PANEL_OPTIONS.map(num => <option key={num} value={num}>{num}</option>)}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? 'Generating...' : 'Generate Comic'}
      </button>
    </form>
  );
};

export default ComicForm;
