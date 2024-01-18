import React from "./core/React.js";

const Count = ({ num }) => {
    const handleClick = () => {
        console.log('click')
    }
  return <div onClick={() => handleClick()}>count: {num}</div>;
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
