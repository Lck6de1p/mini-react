import React from "./core/React.js";

let count = 0;
let count2 = 0;

function Foo() {
    console.log('foo render')
    const update = React.update();

    const handleClick = () => {
        count++;
        update();
    }
    return <div>{count}<button onClick={handleClick}> click</button></div>
}

function Bar() {
    const update = React.update();
    console.log('Bar render')
    const handleClick = () => {
        count2++;
        update();
    }
    return <div>{count2}<button onClick={handleClick}> click</button></div>
}

function App() {
  
    return <div>
       <Foo />
       <Bar />
    </div>;
}
export default App;
