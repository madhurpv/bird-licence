import { useState } from "react";
import Header from "./components/Header";
import MainPage from "./components/MainPage";
import "./App.css";

export default function App() {
  const [theme, setTheme] = useState("dark");

  return (
    <div className={`app ${theme}`} data-theme={theme}>
      <Header theme={theme} setTheme={setTheme} />
      <MainPage />
    </div>
  );
}