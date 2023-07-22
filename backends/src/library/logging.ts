import chalk from "chalk";
export class Logging {
  static log(args: any) {
    Logging.info(args);
  }

  static info(args: any) {
    console.log(
      chalk.blue(`[${new Date().toLocaleString()}],[INFO]`),
      typeof args === "string" ? chalk.blueBright(args) : args
    );
  }

  static warining(args: any) {
    console.log(
      chalk.yellow(`[${new Date().toLocaleString()}],[WARNING]`),
      typeof args === "string" ? chalk.yellowBright(args) : args
    );
  }

  static error(args: any) {
    console.log(
      chalk.red(`[${new Date().toLocaleString()}],[ERROR]`),
      typeof args === "string" ? chalk.redBright(args) : args
    );
  }
}

// module.exports = Logging;
