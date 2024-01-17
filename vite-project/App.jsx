import React from "./core/React.js";

const Count = ({ num }) => {
  return <div>count: {num}</div>;
};

const CountContainer = ({ num }) => {
  return <Count num={num} />;
};

function App() {
    return <div>
        <div>hi</div>
        <div>mini</div>
      <CountContainer num={1} />
      <CountContainer num={2} />
    </div>;
}
export default App;
