let taskId = 0
function loop(deadline) {
  let isYield = false;
  taskId++;
  while (!isYield) {
    isYield = deadline.timeRemaining() < 1;
    console.log(`taskId: ${taskId}`)
  }

  requestIdleCallback(loop);
}

requestIdleCallback(loop);
