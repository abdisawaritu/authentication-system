import { useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const [currentPage, setCurrentPage] = useState("register");

  if (currentPage === "login") {
    return <Login onSwitchToRegister={() => setCurrentPage("register")} />;
  }

  return <Register onSwitchToLogin={() => setCurrentPage("login")} />;
}

export default App;
