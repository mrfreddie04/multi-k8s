import { BrowserRouter, Routes, Route , Link} from 'react-router-dom';
import Fib from "./Fib";
import OtherPage from "./OtherPage";
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Fib Calculator v2</h1>
          <Link to="/">Home</Link>
          <Link to="/other-page">Other Page</Link>
        </header>
        <Routes>
          <Route path="/" element={<Fib/>}></Route>
          <Route path="/other-page" element={<OtherPage/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;