export interface ProjectType {
  name: string;
  description: string;
  isTypescriptInstallable: "preinstalled" | "installable" | "uninstallable";
  templateName: string;
}

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

export interface DependencyVersionResult {
  name: string;
  version: string;
}

export type LogFunction = (...args: any[]) => void;

export type Logger = {
  log: LogFunction;
  error: LogFunction;
};
