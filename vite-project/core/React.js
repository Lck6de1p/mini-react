function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "string" ? createTextNode(child) : child;
      }),
    },
  };
}

function render(el, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el],
    },
  };

  root = nextUnitOfWork;
}

let root = null;
let nextUnitOfWork = null;
function workLoop(deadline) {
  let isYield = false;
  while (!isYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    isYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && root) {
    commitRoot(root.child);
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function commitRoot(fiber) {
  commitWork(fiber);
  root = null;
}

function commitWork(fiber) {
  if (fiber) {
    fiber.parent.dom.append(fiber.dom);
    commitWork(fiber.child);
    commitWork(fiber.sibling);
  }
}

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));

    updateProps(dom, fiber.props);
  }

  initChildren(fiber);

  // 返回下一个任务

  if (fiber.child) return fiber.child;
  if (fiber.sibling) return fiber.sibling;

  return fiber.parent?.sibling;
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function initChildren(fiber) {
  const children = fiber.props.children;
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      child: null,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

const React = {
  render,
  createElement,
};

export default React;
