import React from "./core/React.js";

function Foo() {
    console.log('rerender')
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState("bar");
  const handleClick = () => {
    setCount((e) => e + 1);
  };
  const handleClick2 = () => {
    setBar("barbar");
  };

  React.useEffect(() => {
    console.log('init')
    return () => {
        console.log('clean 0')
    }
  }, [])
  React.useEffect(() => {
    console.log('update', count)
    return () => {
        console.log('clean 1')
    }
  }, [count])
  return (
    <div>
      {count}
      <button onClick={handleClick}> click</button>
      <div>{bar}</div>
      <button onClick={handleClick2}> click</button>
    </div>
  );
}

function App() {
  return (
    <div>
      <Foo />
    </div>
  );
}
export default App;
