import got from "got";
import { DependencyVersionResult } from "./types";

/**
 * @param dependency The name of the dependency to check
 * @returns Check if the dependency is available in the NPM-Registry or not
 */
export function checkDependency(dependency: string) {
  return new Promise<{
    missing: boolean;
  }>((res) => {
    got
      .get(`https://registry.npmjs.org/${dependency}`)
      .then((res) => JSON.parse(res.body))
      .then((response) => {
        res({
          missing: response.error && response.error === "Not found",
        });
      })
      .catch(() => {
        res({
          missing: true,
        });
      });
  });
}

/**
 * @param dependency The name of the dependency to check
 * @returns The version in the NPM-Registry of the package
 */
export function getDependencyVersion(dependency: string) {
  return new Promise<{
    version: string;
  }>((res) => {
    got
      .get(`https://registry.npmjs.org/${dependency}`)
      .then((res) => JSON.parse(res.body))
      .then((response) => {
        res({
          version: response["dist-tags"].latest,
        });
      })
      .catch(() => {
        res({
          version: "0.0.0",
        });
      });
  });
}

/**
 * Perform the `checkDependency` method on multiple targets.
 *
 * @param dependencies The names of the dependencies to check
 * @returns Check if the dependencies are available in the NPM-Registry or not
 */
export default async function checkDependencies(dependencies: string[]) {
  const missing: string[] = [];

  for (const dependency of dependencies) {
    const result = await checkDependency(dependency);

    if (result.missing) {
      missing.push(dependency);
    }
  }

  return {
    missing,
    available: missing.length === 0,
  };
}

/**
 * Perform the `getDependencyVersion` method on multiple targets.
 *
 * @param dependencies The name of the dependency to check
 * @returns The versions in the NPM-Registry of the packages
 */
export function getDependencyVersions(
  dependencies: string[]
): Promise<DependencyVersionResult[]> {
  return new Promise((res) => {
    const result: DependencyVersionResult[] = [];

    for (const dependency of dependencies) {
      getDependencyVersion(dependency).then((response) => {
        result.push({
          name: dependency,
          version: response.version,
        });
      });
    }

    res(result);
  });
}
