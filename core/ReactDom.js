import { render } from "./React.js";
const ReactDOM = {
  createElement: (container) => {
    return {
      render: (dom) => {
        render(dom, container);
      },
    };
  },
};

export default ReactDOM;
