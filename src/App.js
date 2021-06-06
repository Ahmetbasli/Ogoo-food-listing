import "./App.css";
//import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import FoodTable from "./FoodTable.js";

function App() {
  return (
    <div className="App">
      <h1>Welcome to Ogoo 😉</h1>
      <FoodTable />
    </div>
  );
}

export default App;
