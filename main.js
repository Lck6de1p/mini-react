import ReactDOM from "./core/ReactDom.js";
import { createElement } from "./core/React.js";
const App = createElement("div", { id: "app" }, "hi", "react");
ReactDOM.createElement(document.querySelector("#root")).render(App);
