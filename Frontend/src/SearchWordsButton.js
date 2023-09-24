import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function SearchWordsButton() {
  const location = useLocation();
  const { responseData } = location.state || {};
  const [searchWord, setSearchWord] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [showAllWords, setShowAllWords] = useState(false);

  const handleSearch = () => {
    if (responseData && responseData.wordFrequency) {
      const frequency = responseData.wordFrequency[searchWord];
      if (frequency !== undefined) {
        setSearchResult(`${searchWord}: ${frequency}`);
      } else {
        setSearchResult('Word not found');
      }
    }
  };

  const handleShowAllWords = () => {
    setShowAllWords((prevShowAllWords) => !prevShowAllWords);
  };

  return (
    <div>
      <h1>Word Frequency</h1>
      <input
        type="text"
        placeholder="Enter word"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
      />
      <button onClick={handleSearch} disabled={showAllWords}>
        Search
      </button>
      <button onClick={handleShowAllWords}>
        {showAllWords ? 'Hide All Words' : 'Show All Words'}
      </button>
      <ul>
        {showAllWords
          ? Object.keys(responseData.wordFrequency).map((word) => (
              <li key={word}>
                <strong>{word}:</strong> {responseData.wordFrequency[word]}
              </li>
            ))
          : searchResult ? (
              <li>{searchResult}</li>
            ) : (
              <li>Please Write any word.</li>
            )}
      </ul>
    </div>
  );
}

export default SearchWordsButton;
