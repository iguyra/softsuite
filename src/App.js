import logo from "./logo.svg";
// import "./App.css";
import "./assets/scss/main.scss";
// import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./Components/Header";
import SideBar from "./Components/Layouts/SideBar";
import Search from "./Components/Search";
import { TableList } from "./Components/Layouts/TableList";
import Elements from "./Pages/ELements";

function App() {
  return (
    <div className="App">
      <Header />

      <div className="app-container">
        <SideBar />

        <Elements />
      </div>
    </div>
  );
}

export default App;
