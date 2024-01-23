import React from "./core/React.js";

let count = 0;
const Count = ({ num }) => {
    const handleClick = () => {
        console.log('click')
        count++
        React.update();
    }
  return <div onClick={() => handleClick()}>count: {count}</div>;
};

const CountContainer = ({ num }) => {
  return <Count num={num} />;
};

function App() {
    return <div>
        <div>hi</div>
        <div>mini</div>
      <CountContainer num={1} />
      {/* <CountContainer num={2} /> */}
    </div>;
}
export default App;
