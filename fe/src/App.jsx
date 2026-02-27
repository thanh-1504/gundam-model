import { useEffect } from "react";

function App() {
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:3000");
      const data = await response.json();
      console.log(data);
    }
    fetchData();
  }, []);

  return (
    <>
      <h1>Hello World with Vite</h1>
    </>
  );
}

export default App;
