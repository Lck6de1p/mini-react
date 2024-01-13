const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "string" ? createTextNode(child) : child
      ),
    },
  };
};

const createTextNode = (val) => {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: val,
      children: [],
    },
  };
};

const render = (el, container) => {
  // if (typeof el === 'string') {
  //   container.append(el)
  //   return
  // }
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode(el.props.nodeValue)
      : document.createElement(el.type);

  Object.keys(el.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = el.props[key];
    }
  });

  const children = el.props.children;

  children.forEach((child) => {
    render(child, dom);
  });

  container.append(dom);
};

export { createElement, render };
