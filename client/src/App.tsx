import { Route, Routes } from "react-router-dom";
import { AdminPage } from "./pages/AdminPage";
import { CoolStuffPage } from "./pages/CoolStuffPage";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/cool-stuff" element={<CoolStuffPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
