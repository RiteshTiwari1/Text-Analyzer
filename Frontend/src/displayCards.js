// import React from 'react';
// import { useLocation } from 'react-router-dom';

// function DisplayCards() {
//   const location = useLocation();
//   const responseData = location.state?.responseData;
//   console.log(responseData);
//   return (
    
//     <div>

//       {/* Use responseData in your component */}
//     </div>
//   );
// }

// export default DisplayCards;


import React from 'react';
import './DisplayCards.css';
import { useLocation, Link } from 'react-router-dom';


function DisplayCards() {
  const location = useLocation();
  const responseData = location.state?.responseData;

  // Check if responseData is defined
  if (!responseData) {
    return (
      <div>
        <p>No data available.</p>
      </div>
    );
  }

  // Destructure topWords and topCoWords from responseData
  const { topOccurringWords, topCoOccurringWords } = responseData;

  return (
    <div>
      <h1>Top 5 Mostly Occurring Words</h1>
      <div className="card-container">
      {topOccurringWords &&
        topOccurringWords.map((word, index) => (
          <div className="card" key={index}>
            <h3> {index+1}</h3>
            <h3> {word}</h3>
          </div>
      ))}

      </div>
      
      <h1>Top 5 Mostly Co-Occurring Words</h1>
      <div className="card-container">
      {topCoOccurringWords &&
        topCoOccurringWords.map((word, index) => (
          <div className="card" key={index}>
            <h3> {index+1}</h3>
            <h3> {word}</h3>
          </div>
      ))}
      </div>

          {console.log(responseData)}
      <Link to={{ pathname: '/search', state: { responseData } }}>
        <button className="search-button">Search Words</button>
      </Link>

    </div>
  );
}

export default DisplayCards;
