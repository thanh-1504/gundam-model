import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("https://gundam-model.onrender.com/");
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, []);
  console.log(data.data);

  return (
    <>
      <h1>Hello World with Vite</h1>
      {data?.data?.length > 0 &&
        data.data.map((item) => {
          return <p>{item.name}</p>;
        })}
    </>
  );
}

export default App;
