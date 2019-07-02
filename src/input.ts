function input(label: string, mask = "") {
  return new Promise<string>((resolve) => {
    process.stdout.write(label);
    const rawMode = !!(mask && process.stdin.setRawMode);
    if (rawMode) {
      process.stdin.setRawMode!(rawMode);
    }
    let result = "";
    const listenInput = (chunk: Buffer) => {
      if (rawMode) {
        const char = chunk.toString("utf8");
        switch (char) {
          case "\n":
          case "\r":
          case "\u0004": {
            process.stdin.setRawMode!(false);
            process.stdin.pause();
            process.stdin.off("data", listenInput);
            process.stdout.write("\n");
            resolve(result);
            break;
          }
          case "\u0003": {
            process.stdin.setRawMode!(false);
            process.stdin.pause();
            process.stdin.off("data", listenInput);
            process.stdout.write("\n^C");
            process.exit();
          }
          default: {
            process.stdout.write(mask);
            result += chunk;
          }
        }
      } else {
        process.stdin.pause();
        process.stdin.off("data", listenInput);
        resolve(chunk.toString().replace(/\n$/, ""));
      }
    };
    process.stdin.resume().on("data", listenInput);
  });
}

async function main() {
  const account = await input("Input Account: ");
  const password = await input("Password: ", "*");
  console.log({ account, password });
}

main();
