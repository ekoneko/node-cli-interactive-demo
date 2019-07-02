import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { spawn } from "child_process";

function getOneTmpFilePath(suffix: string = "") {
  const tmpDir = os.tmpdir();
  const fileName = Math.random()
    .toString(32)
    .slice(2);
  const baseFile = path.join(tmpDir, fileName);
  return suffix ? `${baseFile}.${suffix}` : baseFile;
}

async function editFile(filePath: string) {
  return new Promise<void>((resolve) => {
    const editor = process.env.EDITOR || "vi";
    const child = spawn(editor, [filePath], {
      stdio: "inherit",
    });
    child.on("exit", () => {
      resolve();
    });
  });
}

async function getContentFromEditor(initContent: string = "", suffix: string = "js") {
  const editTempFile = getOneTmpFilePath(suffix);
  fs.writeFileSync(editTempFile, initContent);
  await editFile(editTempFile);
  const content = fs.readFileSync(editTempFile).toString();
  fs.unlinkSync(editTempFile);
  return content;
}

async function main() {
  const content = await getContentFromEditor("// write something");
  console.log(content);
}
main();
