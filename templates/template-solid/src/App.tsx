import { Component } from "solid-js";
import { Routes, Route } from "solid-app-router";

function HelloWorld() {
  return (
    <div>
      <p>Hello, World!</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HelloWorld />} />
    </Routes>
  );
}
