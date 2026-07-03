export type QueueTask = () => Promise<void>;

export class TaskQueue {
  private readonly tasks: QueueTask[] = [];
  private running = false;

  enqueue(task: QueueTask): void {
    this.tasks.push(task);
    void this.drain();
  }

  get size(): number {
    return this.tasks.length + (this.running ? 1 : 0);
  }

  private async drain(): Promise<void> {
    if (this.running) {
      return;
    }

    this.running = true;
    try {
      while (this.tasks.length > 0) {
        const task = this.tasks.shift();
        if (!task) {
          continue;
        }

        try {
          await task();
        } catch (error) {
          console.error("[queue] task failed:", error);
        }
      }
    } finally {
      this.running = false;
    }
  }
}
