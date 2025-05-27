import React, { useState, useEffect } from 'react';

const PhoneticsComponent = () => {
  const [inputText, setInputText] = useState('');
  const [phoneticText, setPhoneticText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dictionary, setDictionary] = useState(null);

  // Load the dictionary on component mount
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://raw.githubusercontent.com/aparrish/pronouncingjs/main/pronouncing.json');
        const data = await response.json();
        setDictionary(data);
      } catch (err) {
        setError('Failed to load phonetic dictionary');
        console.error('Dictionary load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDictionary();
  }, []);

  const convertToPhonetics = (word) => {
    if (!dictionary) return word;
    
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanWord) return word;
    
    // Get the first pronunciation if available
    return dictionary[cleanWord]?.[0] || word;
  };

  const handleConvert = () => {
    if (!inputText.trim()) {
      setError('Please enter some text');
      return;
    }

    if (!dictionary) {
      setError('Phonetic dictionary not loaded yet');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const words = inputText.split(/\s+/);
      const phoneticWords = words.map(word => convertToPhonetics(word));
      setPhoneticText(phoneticWords.join(' '));
    } catch (err) {
      setError('Failed to convert text to phonetics');
      console.error('Conversion error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        English to Phonetics Converter
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {isLoading && !phoneticText && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            Loading phonetic dictionary...
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-2">
            English Text
          </label>
          <textarea
            id="inputText"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter English words or sentences..."
            disabled={!dictionary}
          />
        </div>

        <div className="flex space-x-3 mb-4">
          <button
            onClick={handleConvert}
            disabled={isLoading || !dictionary}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isLoading || !dictionary ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isLoading ? 'Converting...' : 'Convert to Phonetics'}
          </button>
          <button
            onClick={() => {
              setInputText('');
              setPhoneticText('');
              setError(null);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mt-6">
          <label htmlFor="phoneticText" className="block text-sm font-medium text-gray-700 mb-2">
            Phonetic Transcription (ARPAbet)
          </label>
          <div
            id="phoneticText"
            className="w-full px-3 py-2 min-h-[100px] border border-gray-300 rounded-md bg-gray-50 font-mono"
          >
            {phoneticText || 'Phonetic transcription will appear here...'}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Note: This uses the CMU Pronouncing Dictionary (ARPAbet notation)
          </p>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>This converter uses the CMU Pronouncing Dictionary with over 134,000 words.</p>
        <p className="mt-1">Proper nouns and some specialized vocabulary may not be available.</p>
      </div>
    </div>
  );
};

export default PhoneticsComponent;