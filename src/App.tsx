import {useState} from "react";
import "@app/App.scss";
import {Navbar} from "./components/ui/Navbar";
import {Tabs} from "./components/ui/Tabs";

export enum Tab {
  FIRST = "FIRST",
  SECOND = "SECOND",
  THIRD = "THIRD",
}

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.FIRST);
  return (
    <div className="wrapper">
      <Navbar currentTab={currentTab} setTab={setCurrentTab} />
      <main className="container">
        <Tabs currentTab={currentTab} />
      </main>
    </div>
  );
}

export default App;
