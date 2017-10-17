import * as d3Selection from 'd3-selection';
import * as d3Timer from 'd3-timer';

export default class Canvas {
  public width: number;
  public height: number;
  public cellWidth: number;
  public cellHeight: number;
  public tickSpeed: number;
  private canvas: d3.Selection<HTMLCanvasElement, any, HTMLElement, any>;
  private dataContainer;
  private timer;
  private environment;

  constructor(environment, rootNode: HTMLElement, width: number, height: number, tickSpeed: number) {
    this.environment = environment;
    this.width = width;
    this.cellWidth = this.width/this.environment.width;
    this.height = height;
    this.cellHeight = this.width/this.environment.height;
    this.tickSpeed = tickSpeed;
    d3Selection.select(rootNode).append('canvas')
        .attr('width', this.width)
        .attr('height', this.height);
    this.canvas = d3Selection.select('canvas');

    this.dataContainer = d3Selection.select(document.createElement('custom'));
    this.bindHandlers();
  }

  public update(): void {
    this.timer = d3Timer.interval(() => {
      this.dataBind();
      this.draw();
    }, this.tickSpeed);
  }

  private dataBind(): void {
    let cells = this.dataContainer.selectAll('.cell').data(this.environment.tick());
    cells.exit().remove();
    cells.enter().append('custom')
      .classed('cell', true)
      .attr('width', this.cellWidth)
      .attr('height', this.cellHeight)
      .attr('x', (d, i) => this.environment.getX(i)*this.cellWidth)
      .attr('y', (d, i) => this.environment.getY(i)*this.cellHeight)
      .attr('fillStyle', this.environment.setColor)
    .merge(cells)
      .attr('fillStyle', this.environment.setColor);
  }

  public draw(): void {
    let context = this.canvas.node().getContext("2d");
    context.fillStyle = '#fff';
    context.rect(0, 0, this.width, this.height);
    context.fill();

    let elements = this.dataContainer.selectAll('custom.cell');
    elements.each(function(d) {
      let node = d3Selection.select(this);
      context.beginPath();
      context.fillStyle = node.attr('fillStyle');
      context.rect(+node.attr('x'), +node.attr('y'), +node.attr('width'), +node.attr('height'));
      context.fill();
      context.closePath();
    });
  }

  private bindHandlers() {
    this.canvas.on('click', () => {
      let mouseX = Math.floor(d3Selection.event.clientX/(this.width/this.environment.width));
      let mouseY = Math.floor(d3Selection.event.clientY/(this.width/this.environment.height));
      this.environment.makeToggle(this.environment.getIndex(mouseX-1, mouseY-1));
      console.log(`${d3Selection.event.clientX}, ${d3Selection.event.clientY}`);
      console.log(`${mouseX}, ${mouseY}`);
      // this.dataBind();
      // this.draw();
    });
  }
}