import React from "./React.js";
const ReactDOM = {
  createRoot: (container) => {
    return {
      render: (dom) => {
        React.render(dom, container);
      },
    };
  },
};

export default ReactDOM;
