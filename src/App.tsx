import { useEffect } from 'react';
import Layout from "./components/Layout";
import { useStore } from "./store/useStore";

function App() {
  const fetchProjects = useStore((state) => state.fetchProjects);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return <Layout />;
}

export default App;
