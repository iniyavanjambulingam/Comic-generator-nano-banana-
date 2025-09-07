
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ComicForm from './components/ComicForm';
import Loader from './components/Loader';
import ComicDisplay from './components/ComicDisplay';
import { preprocessStory, generateCharacterCard, generateComicPanel } from './services/geminiService';
import type { ComicFormState } from './types';

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [characterCard, setCharacterCard] = useState<string | null>(null);
  const [panelImages, setPanelImages] = useState<string[]>([]);

  const handleGenerateComic = useCallback(async (data: ComicFormState) => {
    setIsLoading(true);
    setError(null);
    setCharacterCard(null);
    setPanelImages([]);

    try {
      setLoadingMessage('Step 1/3: Preprocessing story...');
      const panelsData = preprocessStory(data.story, data.panels);
      if(panelsData.length === 0) {
        throw new Error("Your story seems too short. Please provide at least one complete sentence.");
      }

      setLoadingMessage('Step 2/3: Generating character sheet...');
      const card = await generateCharacterCard(data.story, data.style);
      setCharacterCard(card);
      
      setLoadingMessage('Step 3/3: Generating comic panels...');
      const generatedPanels: string[] = [];
      for (let i = 0; i < panelsData.length; i++) {
        setLoadingMessage(`Step 3/3: Generating panel ${i + 1} of ${panelsData.length}...`);
        const panelImage = await generateComicPanel(panelsData[i], data.style, card);
        generatedPanels.push(panelImage);
        setPanelImages([...generatedPanels]);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <main className="container mx-auto">
        <Header />
        <section className="mt-8 bg-gray-800/40 p-6 md:p-8 rounded-xl border border-gray-700">
          <ComicForm onSubmit={handleGenerateComic} isLoading={isLoading} />
        </section>

        <section className="mt-12">
          {isLoading && <Loader message={loadingMessage} />}
          {error && (
            <div className="text-center p-4 bg-red-900/50 border border-red-500 rounded-lg">
              <p className="font-bold">Generation Failed</p>
              <p className="text-red-300">{error}</p>
            </div>
          )}
          {!isLoading && !error && (characterCard || panelImages.length > 0) && (
            <ComicDisplay characterCard={characterCard} panelImages={panelImages} />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
