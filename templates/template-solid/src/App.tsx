import { Component } from "solid-js";
import { Routes, Route } from "solid-app-router";

const HelloWorld: Component = () => {
  return (
    <div>
      <p>Hello, World!</p>
    </div>
  );
};

const App: Component = () => {
  return (
    <Routes>
      <Route path="/" element={<HelloWorld />} />
    </Routes>
  );
};

export default App;
