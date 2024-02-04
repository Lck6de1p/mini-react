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
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
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

  wipRoot = nextUnitOfWork;
}

let wipRoot = null;
let wipFiber = null;

let currentRoot = null;
let nextUnitOfWork = null;
let deletions = [];
function workLoop(deadline) {
  let isYield = false;
  while (!isYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    if (wipRoot?.sibling?.type === nextUnitOfWork?.type) {
      nextUnitOfWork = null;
    }
    isYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot(wipRoot.child);
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function commitRoot(fiber) {
  deletions.forEach(commitDeletion);
  commitWork(fiber);
  currentRoot = wipRoot;
  wipRoot = null;
  deletions = [];
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let parentFiber = fiber.parent;
    while (!parentFiber.dom) {
      parentFiber = parentFiber.parent;
    }
    parentFiber.dom.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child);
  }
}

function commitWork(fiber) {
  if (fiber) {
    let parentFiber = fiber.parent;
    while (!parentFiber.dom) {
      parentFiber = parentFiber.parent;
    }
    if (fiber.effectTag === "update") {
      updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
    } else if (fiber.effectTag === "placement") {
      if (fiber.dom) {
        parentFiber.dom.append(fiber.dom);
      }
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
  }
}

function updateFunctionComponent(fiber) {
  stateHooks = [];
  stateHookIndex = 0;
  wipFiber = fiber;
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));

    updateProps(dom, fiber.props, {});
  }
  const children = fiber.props.children;

  reconcileChildren(fiber, children);
}

function performUnitOfWork(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  // 返回下一个任务

  if (fiber.child) return fiber.child;
  if (fiber.sibling) return fiber.sibling;

  let parentFiber = fiber.parent;
  while (parentFiber) {
    if (parentFiber.sibling) {
      return parentFiber.sibling;
    }
    parentFiber = parentFiber.parent;
  }
  return fiber.parent?.sibling;
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, nextProps, oldProps) {
  Object.keys(oldProps).forEach((key) => {
    if (!(key in nextProps)) {
      dom.removeAttribute(key);
    }
  });

  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (nextProps[key] !== oldProps[key]) {
        if (key.startsWith("on")) {
          const event = key.slice(2).toLocaleLowerCase();
          dom.removeEventListener(event, oldProps[key]);
          dom.addEventListener(event, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });
}

function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child;
  let prevChild = null;
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type;
    let newFiber;
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        child: null,
        sibling: null,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: "update",
      };
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          parent: fiber,
          child: null,
          sibling: null,
          dom: null,
          effectTag: "placement",
        };
      }

      if (oldFiber) {
        deletions.push(oldFiber);
      }
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });

  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
}

function update() {
  let currentFiber = wipFiber;

  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    nextUnitOfWork = wipRoot;
  };
}

let stateHooks = [];
let stateHookIndex = 0;
function useState(initial) {
  let currentFiber = wipFiber;
  let oldStateHook = currentFiber.alternate?.stateHooks[stateHookIndex];
  const stateHook = {
    state: oldStateHook ? oldStateHook.state : initial,
  };
  stateHooks.push(stateHook);
  stateHookIndex++;

  currentFiber.stateHooks = stateHooks;

  function setState(action) {
    stateHook.state = action(stateHook.state);
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    nextUnitOfWork = wipRoot;
  }

  return [stateHook.state, setState];
}

const React = {
  update,
  render,
  createElement,
  useState,
};

export default React;
