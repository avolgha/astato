import { existsSync, readFileSync } from "fs";
import kleur from "kleur";
import path from "path";
import { LogFunction } from "../types";

export function getPackageJson() {
  const pkg = path.resolve(process.cwd(), "package.json");

  if (!existsSync(pkg)) {
    throw new Error(`in the current working dir is no package.json file.`);
  }

  const pkgConfig = JSON.parse(readFileSync(pkg, { encoding: "utf8" }));

  return { pkg, pkgConfig };
}

export function getScriptFilePath(
  scriptName: string,
  args: string[],
  log: LogFunction
) {
  let scriptFilePath: string;
  if (args.length > 3) {
    log(
      `there was a file path for the config script provided: ${kleur.cyan(
        args[3]
      )}.`
    );
    scriptFilePath = path.resolve(process.cwd(), args[3]);
  } else {
    const tsOrJs = existsSync(path.resolve(process.cwd(), "tsconfig.json"));
    scriptFilePath = path.resolve(
      process.cwd(),
      "src",
      scriptName + "." + (tsOrJs ? "ts" : "js")
    );
  }
  return scriptFilePath;
}
