import { execa } from "execa";
import fs from "fs";
import got from "got";
import kleur from "kleur";
import Listr from "listr";
import path from "path";
import nproc from "process";
import { fileURLToPath } from "url";
import { getDependencyVersions } from "./checkDep.js";
import {
  DependencyVersionResult,
  ProjectType,
  PromptResponse,
} from "./types.js";
import * as util from "./utils.js";

export default function process(
  projectTypes: ProjectType[],
  response: PromptResponse,
  log: (...args: any[]) => void
): void {
  const projectType = projectTypes.find(
    (projectType) => projectType.name === response.type
  )!;
  const projectPath = path.resolve(
    response.directory,
    response.options.values.name
  );

  new Listr([
    {
      title: "Creating the directory",
      task() {
        fs.mkdirSync(projectPath);
      },
    },
    {
      title: "Applying template",
      task() {
        const templateDirectory = path.join(
          fileURLToPath(import.meta.url),
          "..",
          "..",
          "templates",
          projectType.templateName
        );

        if (!fs.existsSync(templateDirectory)) {
          throw new Error(
            `could not find the template for the selected project type: ${projectType.name}. Please reinstall the tool and try again.`
          );
        }

        fs.cpSync(templateDirectory, projectPath, {
          recursive: true,
        });

        const packageJsonPath = path.join(projectPath, "package.json");
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf8")
        );

        fs.writeFileSync(
          packageJsonPath,
          JSON.stringify(
            {
              ...{
                name: response.options.values.name,
                description: response.options.values.description,
                author: response.options.values.author,
                version: "0.0.1",
                license: "MIT",
              },
              ...packageJson,
            },
            null,
            2
          )
        );
      },
    },
    {
      title: "Installing TypeScript",
      async task(_, task) {
        if (
          !response.typescript &&
          projectType.isTypescriptInstallable !== "preinstalled"
        ) {
          task.skip("user has not selected TypeScript as a dependency");
          return;
        }

        if (fs.existsSync(path.join(projectPath, "tsconfig.json"))) {
          task.skip("there is already a typescript setup done");
          return;
        }

        const pkgConfig = path.join(projectPath, "package.json");
        const pkgConfigContent = JSON.parse(fs.readFileSync(pkgConfig, "utf8"));

        const registry = await got(
          "https://registry.npmjs.org/typescript"
        ).json();

        pkgConfigContent.dependencies = {
          ...pkgConfigContent.dependencies,
          //@ts-ignore
          typescript: "^" + registry["dist-tags"].latest,
        };

        pkgConfigContent.scripts = {
          ...pkgConfigContent.scripts,
          ...{
            compile: "tsc",
            dev: "tsc && node.",
          },
        };

        fs.writeFileSync(pkgConfig, JSON.stringify(pkgConfigContent, null, 2));

        let originalTsConfig = JSON.parse(
          fs.readFileSync(
            path.join(
              fileURLToPath(import.meta.url),
              "..",
              "..",
              "tsconfig.json"
            ),
            "utf8"
          )
        );

        // this is done, because in the original tsconfig, we exclude the
        // templates directory which is not needed in the created project
        originalTsConfig.exclude = undefined;

        fs.writeFileSync(
          path.join(projectPath, "tsconfig.json"),
          JSON.stringify(originalTsConfig, undefined, 2)
        );
      },
    },
    {
      title: "Initializing git",
      async task(_, task) {
        if (!response.git) {
          task.skip("user has not selected git to be initialized");
          return;
        }

        if (nproc.platform === "win32") {
          await execa("powershell", ["-c", '"cd ${projectPath}; git init"']);
        } else {
          await execa("sh", ["-c", '"cd ${projectPath} && git init"']);
        }
      },
    },
    {
      title: "Installing dependencies",
      task(_, task) {
        if (response.dependencies.length === 0) {
          task.skip("user has not selected any dependencies");
          return;
        }

        let dependencyVersions: DependencyVersionResult[];

        return new Listr([
          {
            title: "Retrieving dependency versions",
            task: async () => {
              dependencyVersions = await getDependencyVersions(
                response.dependencies
              );
            },
          },
          {
            title: "Adding dependencies",
            task: () => {
              const pkgConfig = path.join(projectPath, "package.json");
              const pkgConfigContent = JSON.parse(
                fs.readFileSync(pkgConfig, "utf8")
              );

              pkgConfigContent.dependencies = {
                ...pkgConfigContent.dependencies,
                ...dependencyVersions.reduce(
                  (acc, { name, version }) => ({
                    ...acc,
                    [name]: version,
                  }),
                  {}
                ),
              };

              fs.writeFileSync(
                pkgConfig,
                JSON.stringify(pkgConfigContent, null, 2)
              );
            },
          },
        ]);
      },
    },
  ])
    .run()
    .then(() => {
      log(`Project created at ${kleur.cyan(projectPath)}`);
      log(``);
      log(`To start the project, run:`);
      log(`  $ ${kleur.cyan(`cd ${projectPath}`)}`);
      const packageManager = util.getPackageManager();
      const pm = packageManager ? packageManager.name : "npm";
      switch (pm) {
        case "yarn":
          log(`  $ ${kleur.cyan("yarn")}`);
          log(`  $ ${kleur.cyan("yarn start")}`);
          break;
        default:
          log(`  $ ${kleur.cyan(`${pm} install`)}`);
          log(`  $ ${kleur.cyan(`${pm} start`)}`);
      }
    })
    .catch(() => {});
}
