async function read() {
  return new Promise((resolve, reject) => {
    const clear = setTimeout(() => {
      process.stdin.pause();
      reject("timeout");
    }, 500);
    process.stdin.resume();
    let data = "";
    process.stdin.on("data", (chunk) => {
      clearTimeout(clear);
      data += chunk;
    });
    process.stdin.on("end", () => {
      process.stdin.pause();
      resolve(data.trim());
    });
    process.stdin.on("error", (err) => {
      reject(err);
    });
  });
}

async function main() {
  const result = await read();
  console.log(result);
}
main();
