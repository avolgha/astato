/**
 * The interface that describes what the type of a project look like.
 *
 * ```
 * name: string
 * description: string
 * isTypescriptInstallable: "preinstalled" | "installable" | "uninstallable"
 * templateName: string
 * ```
 */
export interface ProjectType {
  name: string;
  description: string;
  isTypescriptInstallable: "preinstalled" | "installable" | "uninstallable";
  templateName: string;
}

/**
 * The interface that describes what the `enquirer`-prompt result looks like.
 *
 * ```
 * type: string
 * options: {
 *   values: {
 *     name: string
 *     description: string
 *     author: string
 *   }
 * }
 * directory: string
 * git: boolean
 * typescript: boolean
 * dependencies: string[]
 * ```
 */
export interface PromptResponse {
  type: string;
  options: {
    values: {
      name: string;
      description: string;
      author: string;
    };
  };
  directory: string;
  git: boolean;
  typescript: boolean;
  dependencies: string[];
}

/**
 * The interface that descibes what the result of a dependency version check looks like.
 *
 * ```
 * name: string
 * version: string
 * ```
 */
export interface DependencyVersionResult {
  name: string;
  version: string;
}

/**
 * The type of a logger function used in the `Logger` type.
 */
export type LogFunction = (...args: any[]) => void;

/**
 * The type that descibes a Logger.
 */
export type Logger = {
  log: LogFunction;
  error: LogFunction;
};
