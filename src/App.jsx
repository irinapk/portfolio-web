import { Route, Routes } from "react-router";
import Home from "./site/Home.jsx";

// The 2026 redesign is a single page; project details open in a modal instead of /project.
function App() {
  return (
    <Routes>
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
