import Canvas from './output/canvas';
import Conway from './behaviors/conway';

function init() {
  const canvasWidth = 600;
  const canvasHeight = 600;
  const tickSpeed = Math.floor(1000/60);
  const envWidth = 100;
  const envHeight = 100;
  const spawnRate = 0.3;

  let env = new Conway(envWidth, envHeight, spawnRate);
  let output = new Canvas(env, document.getElementById('simulation'), canvasWidth, canvasHeight, tickSpeed);
  output.update();
}

init();
