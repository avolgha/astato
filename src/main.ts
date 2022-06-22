import kleur from "kleur";
import process from "./processor.js";
import { executePrompt } from "./prompt.js";
import { ProjectType } from "./types.js";
import * as util from "./utils.js";

/*

TODO: Intialize a README?

*/

const { log, error } = {
  log: (...args: any[]) => console.log(kleur.green("info"), "  ", ...args),
  error: (...args: any[]) => console.log(kleur.red("error"), " ", ...args),
};

(async () => {
  log(`Running Astato ${kleur.cyan(`v${await util.version()}`)}`);

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
