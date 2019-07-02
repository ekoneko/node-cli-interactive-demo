import * as readline from "readline";

function clearLine() {
  readline.moveCursor(process.stdout, 0, -1);
  readline.clearLine(process.stdout, 0);
}

async function more() {
  process.stdout.write("-- Press Enter --\n");
  return new Promise<boolean>((resolve) => {
    process.stdin.setRawMode!(true);
    process.stdin.resume().on("data", (result: Buffer) => {
      const char = result.toString("utf8");
      switch (char) {
        case "\n":
        case "\r":
        case "\u0004": {
          process.stdin.setRawMode!(false);
          process.stdin.pause();
          clearLine();
          resolve(true);
          break;
        }
        case "\u0003": {
          process.stdin.setRawMode!(false);
          process.stdin.pause();
          process.stdout.write("\n^C");
          process.exit();
        }
      }
    });
  });
}

async function main() {
  process.stdout.write("a\n");
  process.stdout.write("b\n");
  await more();
  process.stdout.write("c\n");
  process.stdout.write("d\n");
}
main();
