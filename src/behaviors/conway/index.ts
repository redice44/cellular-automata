enum STATE {
  DEAD = 0,
  ALIVE = 1
}

export default class Conway {
  public environment: STATE[];
  public width: number;
  public height: number;

  constructor(width: number, height: number, rate?: number) {
    this.environment = this.initEnvironment(width*height, rate);
    this.width = width;
    this.height = height;
  }

  public tick(): STATE[] {
    this.environment = this.environment.map(this.cellUpdate.bind(this));
    return this.environment;
  }

  public setColor(state: STATE): string {
    switch(state) {
      case STATE.ALIVE:
        return `rgb(0, 0, 0)`;
      case STATE.DEAD:
        return `rgb(255, 255, 255)`;
    }
  }

  private cellUpdate(state: STATE, index: number): STATE {
    let aliveNeighbors:number = this.sumOfNeighbors(index);

    switch(state) {
      case STATE.ALIVE:
        return aliveNeighbors === 2 || aliveNeighbors === 3 ? STATE.ALIVE : STATE.DEAD;
      case STATE.DEAD:
        return aliveNeighbors === 3 ? STATE.ALIVE : STATE.DEAD;
    }
  }

  private sumOfNeighbors(index: number): number {
    return this.isAlive(this.environment[this.getUpLeftNeighbor(index)]) +
      this.isAlive(this.environment[this.getUpNeighbor(index)]) +
      this.isAlive(this.environment[this.getUpRightNeighbor(index)]) +
      this.isAlive(this.environment[this.getLeftNeighbor(index)]) +
      this.isAlive(this.environment[this.getRightNeightbor(index)]) +
      this.isAlive(this.environment[this.getBottomLeftNeighbor(index)]) +
      this.isAlive(this.environment[this.getBottomNeighbor(index)]) +
      this.isAlive(this.environment[this.getBottomRightNeighbor(index)]);
  }

  public makeAlive(index: number) {
    this.environment[index] = STATE.ALIVE;
  }

  public getX(index: number): number {
    return index - Math.floor(index/this.width) * this.width;
  }

  public getY(index: number): number {
    return Math.floor(index/this.width);
  }

  public getIndex(x: number, y: number): number {
    return y * this.width + x;
  }

  private isAlive(state: STATE): number {
    return state === STATE.ALIVE ? 1 : 0;
  }

  private getTop(i: number): number {
    let y = this.getY(i);
    return y === 0 ? this.height-1 : y-1;
  }

  private getBottom(i: number): number {
    let y = this.getY(i);
    return y === this.height-1 ? 0 : y+1;
  }

  private getLeft(i: number): number {
    let x = this.getX(i);
    return i === 0 ? this.width-1 : x-1;
  }

  private getRight(i: number): number {
    let x = this.getX(i);
    return i === this.width-1 ? 0 : x+1;
  }

  private getUpLeftNeighbor(i: number): number {
    return this.getIndex(this.getLeft(i), this.getTop(i));
  }

  private getUpNeighbor(i: number): number {
    return this.getIndex(this.getX(i), this.getTop(i));
  }

  private getUpRightNeighbor(i: number): number {
    return this.getIndex(this.getRight(i), this.getTop(i));
  }

  private getLeftNeighbor(i: number): number {
    return this.getIndex(this.getLeft(i), this.getY(i));
  }

  private getRightNeightbor(i: number): number {
    return this.getIndex(this.getRight(i), this.getY(i));
  }

  private getBottomLeftNeighbor(i: number): number {
    return this.getIndex(this.getLeft(i), this.getBottom(i));
  }

  private getBottomNeighbor(i: number): number {
    return this.getIndex(this.getX(i), this.getBottom(i));
  }

  private getBottomRightNeighbor(i: number): number {
    return this.getIndex(this.getRight(i), this.getBottom(i));
  }

  private initEnvironment(size: number, rate: number = 0.5): STATE[] {
    let env = [];
    for (let i = 0; i < size; i++) {
      env.push(Math.random() < rate ? STATE.ALIVE : STATE.DEAD);
    }
    return env;
  }
}