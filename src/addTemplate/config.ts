import { writeFileSync } from "fs";
import kleur from "kleur";
import path from "path";
import { getDependencyVersion } from "../checkDep";
import { Logger } from "../types";
import { getPackageManager } from "../utils";
import { getPackageJson, getScriptFilePath } from "./utils";

export default async function configAddTemplate(
  args: string[],
  { log }: Logger
) {
  const { pkg, pkgConfig } = getPackageJson();
  const { version: yamlVersion } = await getDependencyVersion("yaml");

  if (pkgConfig.dependencies.yaml) {
    log(
      `skipping yaml dependency because there was already on found. (v${kleur.cyan(
        pkgConfig.dependencies.yaml
      )}, newest: ${kleur.cyan("" + yamlVersion)})`
    );
  } else {
    pkgConfig.dependencies.yaml = "^" + yamlVersion;
    writeFileSync(pkg, JSON.stringify(pkgConfig, undefined, 2));
  }

  const scriptFilePath = getScriptFilePath("config", args, log);

  const source = {
    head: "",
    function: "",
    body: "",
  };

  const all = () => `/*
 * this file was auto-generated by astato.
 * the file contains the logic to load a configuration object from a yaml-file
 */

${source.head}

${source.function} {
  ${source.body}
}`;

  if (pkgConfig.type === "module" || scriptFilePath.endsWith(".ts")) {
    source.head = `import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "yaml";

export const file = path.resolve(fileURLToPath(import.meta.url), "..", "..", "config.yaml");`;
  } else {
    source.head = `const fs = require("fs);
const path = require("path");
const { fileURLToPath } = require("url");
const yaml = require("yaml");

const file = path.resolve(__dirname, "..", "config.yaml");
module.exports.file = file`;
  }

  if (pkgConfig.type === "module") {
    source.function = 'export const file = path.resolve("");';
  } else if (scriptFilePath.endsWith(".ts")) {
    source.function = "export function loadConfig<T = {}>(): T ";
  } else {
    source.function = "module.exports.loadConfig = () => ";
  }

  if (pkgConfig.type === "module") {
    source.function = "export function loadConfig() ";
  } else if (scriptFilePath.endsWith(".ts")) {
    source.function = "export function loadConfig<T = {}>(): T ";
  } else {
    source.function = "module.exports.loadConfig = () => ";
  }

  source.body = `const content = fs.readFileSync(file, { encoding: "utf8" });
  const parsed = yaml.parse(content);
  return parsed${scriptFilePath.endsWith(".ts") ? " as T" : ""};`;

  writeFileSync(scriptFilePath, all());

  const configFilePath = path.resolve(process.cwd(), "config.yaml");
  writeFileSync(configFilePath, "");

  log(`Added YAML-Config to your project`);
  log(``);
  log(
    `Source file: ${kleur.cyan(path.relative(process.cwd(), scriptFilePath))}`
  );
  log(
    `Config file: ${kleur.cyan(path.relative(process.cwd(), configFilePath))}`
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
