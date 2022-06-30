import kleur from "kleur";
import configAddTemplate from "./addTemplate/config";
import { Logger } from "./types";

export default async function add(args: string[], { log, error }: Logger) {
  if (args.length < 1) {
    error(`you need to provide a semi-template to add.`);
    return;
  }

  const template = args[0];

  log(`adding ${kleur.cyan(template)}...`);

  switch (template) {
    case "config":
      configAddTemplate(args, { log, error });
      break;
    default:
      error(`unknown template ${kleur.cyan(template)}.`);
      break;
  }
}
