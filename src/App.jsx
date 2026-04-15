import "./App.css";
import LandingPage from "./unAuth/components/LandingPage";
import "./firebase";


function App() {
  return (
    <div className="app__shell">
      <LandingPage />
    </div>
  );
}

export default App;
