import enquirer from "enquirer";
const { prompt } = enquirer; // idk why but enquirer does not have named exports *shrug*
import fs from "fs";
import kleur from "kleur";
import checkDependencies from "./checkDep";
import { ProjectType, PromptResponse } from "./types";
import * as util from "./utils";

/**
 * Prompts the user questions about...
 * - the project type
 * - the project name, description, version
 * - the directory
 * - initialisation of git
 * - adding of TypeScript
 * - other dependencies
 *
 * @param projectTypes The project types that are available to use for the end-user
 * @returns Returns an object representing the result of the prompt
 */
export async function executePrompt(projectTypes: ProjectType[]) {
  return (await prompt([
    {
      type: "autocomplete",
      name: "type",
      message: "What type of project do you want to create?",
      choices: projectTypes.map(({ name }) => name),
      required: true,
    },
    {
      type: "snippet",
      name: "options",
      message: "Please enter the project options",
      //@ts-ignore
      fields: [
        {
          name: "name",
          message: "Project name",
          validate(value: string) {
            if (util.validatePackageName(value)) {
              return true;
            }

            return kleur.magenta(
              "package name should match the npm package name spec"
            );
          },
        },
        {
          name: "description",
          message: "Project description",
        },
        {
          name: "author",
          message: "Project author",
        },
      ],
      template: `{
  "name": "\${name}",
  "description": "\${description}",
  "author": "\${author}",
}`,
      required: true,
    },
    {
      //@ts-ignore
      type: "input",
      name: "directory",
      message: "Where do you want to create the project?",
      initial: process.cwd(),
      required: true,
      //@ts-ignore
      validate(
        currentValue: string,
        {
          answers,
        }: {
          answers: {
            options: {
              name: string;
            };
          };
        }
      ) {
        if (!fs.existsSync(currentValue)) {
          return kleur.magenta("Directory does not exist");
        }

        if (fs.existsSync(`${currentValue}/${answers.options.name}`)) {
          return kleur.magenta(
            "There is already a directory with the same name as the project"
          );
        }

        return true;
      },
    },
    {
      //@ts-ignore
      type: "toggle",
      name: "git",
      message: "Do you want to initialize git here as well?",
      enabled: "Yep",
      disabled: "Nope",
      required: true,
    },
    {
      //@ts-ignore
      type: "toggle",
      name: "typescript",
      message: "Should we add TypeScript to your project?",
      enabled: "Yep",
      disabled: "Nope",
      skip(state: any & { type: string }) {
        return !(
          projectTypes.find(({ name }) => {
            return name.toLowerCase() === state.toLowerCase();
          })!.isTypescriptInstallable === "installable"
        );
      },
      required: true,
    },
    {
      //@ts-ignore
      type: "list",
      name: "dependencies",
      message: "Please enter dependencies to install (separated by commas)",
      //@ts-ignore
      async validate(dependencies: string[]) {
        const result = await checkDependencies(dependencies);
        if (result.available) {
          return true;
        }
        return kleur.magenta(
          `The following dependencies are not available: ${result.missing.join(
            ", "
          )}`
        );
      },
    },
  ])) as PromptResponse;
}
