import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SearchWordsButton from './SearchWordsButton';
import FileUploadComponent from './textFiles'
import Cards from "./displayCards";


function App() {
    return (
      <Router>
        <div>
          <Switch>
            {/* Define your routes here */}
            <Route path="/" exact component={FileUploadComponent} />
            <Route path="/DisplayCards" component={Cards} />
            <Route path="/search" component={SearchWordsButton} />
          </Switch>
        </div>
      </Router>
    );
  }
  
  export default App;
  

ReactDOM.render(<App/>,document.getElementById("root"));