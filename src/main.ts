import kleur from "kleur";
import { argv } from "node:process";
import add from "./add";
import process from "./processor";
import { executePrompt } from "./prompt";
import { Logger, ProjectType } from "./types";
import * as util from "./utils";

/*

TODO: Intialize a README?

*/

const logger: Logger = {
  log: (...args: any[]) =>
    console.log(kleur.bgGreen(kleur.white(" info ")), "  ", ...args),
  error: (...args: any[]) =>
    console.log(kleur.bgRed(kleur.white(" error ")), " ", ...args),
};

(async () => {
  const { log, error } = logger;

  log(`Running Astato ${kleur.cyan(`v${await util.version()}`)}`);

  if (argv.length > 2 && argv[2].toLowerCase() === "add") {
    await add(argv.slice(3), logger);
    return;
  }

  const projectTypes: ProjectType[] = [
    {
      name: "TypeScript",
      description: "A simple project using TypeScript",
      isTypescriptInstallable: "preinstalled",
      templateName: "template-typescript",
    },
    {
      name: "SolidJS + TS",
      description: "SolidJS template with preinstalled TypeScript",
      isTypescriptInstallable: "uninstallable", // this is because typescript is installed by solid rather than by astato
      templateName: "template-solid",
    },
  ];

  try {
    const response = await executePrompt(projectTypes);

    process(projectTypes, response, log);
  } catch (err) {
    error(
      "there were some errors with the prompt or the project creation:",
      err
    );
  }
})();
