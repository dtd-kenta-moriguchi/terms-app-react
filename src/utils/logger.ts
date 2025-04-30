export class Logger {
    private static readonly PREFIX = "[Terms Extension]";
  
    static info(message: string, ...args: unknown[]): void {
      console.log(`${this.PREFIX} ${message}`, ...args);
    }
  
    static error(message: string, error?: Error): void {
      console.error(`${this.PREFIX} ${message}`, error);
    }
  
    static debug(message: string, ...args: unknown[]): void {
      if (process.env.NODE_ENV === "development") {
        console.debug(`${this.PREFIX} ${message}`, ...args);
      }
    }
  
    static startSection(label: string): void {
      console.log(`${this.PREFIX} ========== ${label} ==========`);
    }
  
    static endSection(label: string): void {
      console.log(`${this.PREFIX} ========== ${label} 終了 ==========`);
    }
  }
  