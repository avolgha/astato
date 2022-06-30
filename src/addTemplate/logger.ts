import { writeFileSync } from "fs";
import kleur from "kleur";
import path from "path";
import { getDependencyVersion } from "../checkDep";
import { Logger } from "../types";
import { getPackageManager } from "../utils";
import { getPackageJson, getScriptFilePath } from "./utils";

export default async function loggerAddTemplate(
  args: string[],
  { log }: Logger
) {
  const { pkg, pkgConfig } = getPackageJson();
  const { version: kleurVersion } = await getDependencyVersion("kleur");

  if (pkgConfig.dependencies.kleur) {
    log(
      `skipping kleur dependency because there was already on found. (v${kleur.cyan(
        pkgConfig.dependencies.kleur
      )}, newest: ${kleur.cyan("" + kleurVersion)})`
    );
  } else {
    pkgConfig.dependencies.kleur = "^" + kleurVersion;
    writeFileSync(pkg, JSON.stringify(pkgConfig, undefined, 2));
  }

  const scriptFilePath = getScriptFilePath("logger", args, log);

  const source = {
    head: "",
    body: "",
  };

  const all = () => `/*
 * this file was auto-generated by astato.
 * the file contains the logic to load a configuration object from a yaml-file
 */

${source.head}

${source.body}
`;

  if (pkgConfig.type === "module" || scriptFilePath.endsWith(".ts")) {
    source.head = 'import kleur from "kleur";';
  } else {
    source.head = 'const kleur = require("kleur");';
  }

  if (scriptFilePath.endsWith(".ts")) {
    source.body = `export class Logger {

  info(...args: any[]): void {
    console.log(kleur.bgGreen().white(" info "), args);
  }

  debug(...args: any[]): void {
    console.log(kleur.bgCyan().white(" debug "), args);
  }

  warn(...args: any[]): void {
    console.log(kleur.bgYellow().white(" warn "), args);
  }

  error(...args: any[]): void {
    console.log(kleur.bgRed().white(" error "), args);
  }

}`;
  } else {
    let content: string;

    if (pkgConfig.type === "module") {
      content = "export class Logger {";
    } else {
      content = "module.exports.Logger = class Logger {";
    }

    content += `  info(...args) {
  console.log(kleur.bgGreen().white(" info "), args);
}

  debug(...args) {
  console.log(kleur.bgCyan().white(" debug "), args);
}

  warn(...args) {
  console.log(kleur.bgYellow().white(" warn "), args);
}

  error(...args) {
  console.log(kleur.bgRed().white(" error "), args);
}

}`;

    source.body = content;
  }

  writeFileSync(scriptFilePath, all());

  log(`Added colored logger to your project`);
  log(``);
  log(
    `Source file: ${kleur.cyan(path.relative(process.cwd(), scriptFilePath))}`
  );
  log(``);
  log(`To install the added dependencies, run this:`);
  const packageManager = getPackageManager();
  const pm = packageManager ? packageManager.name : "npm";
  switch (pm) {
    case "yarn":
      log(`  $ ${kleur.cyan("yarn")}`);
      break;
    default:
      log(`  $ ${kleur.cyan(`${pm} install`)}`);
  }
}