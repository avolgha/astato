import got from "got";
import { DependencyVersionResult } from "./types";

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
