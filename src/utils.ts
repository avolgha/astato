import { findUp } from "find-up";
import fs from "fs";

/**
 * @returns Check for the nearest `package.json` file located relative to the current working dir. If there is no file found, returns `0.0.0`
 */
export async function version() {
  const path = await findUp("package.json", { type: "file" });
  if (!path) {
    return "0.0.0";
  }
  return JSON.parse(fs.readFileSync(path, "utf8")).version as string;
}

/**
 * @param packageName The given package name
 * @returns Checks if the package name is a valid npm package name
 */
export function validatePackageName(packageName: string) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    packageName
  );
}

// NOTE: this is stolen from "vitejs" --> https://github.com/vitejs/vite/blob/26ee6bfe3991b67f3452d85278a0874a782848d1/packages/create-vite/index.js#L366
/**
 * @returns Checks for the current used package manager through the npm agent and returns it's name as well as it's version. If none is found, returns `undefined`.
 */
export function getPackageManager() {
  const userAgent = process.env.npm_config_user_agent;
  if (!userAgent) return undefined;

  const pkgSpec = userAgent.split(" ")[0];
  const pkgSpecArr = pkgSpec.split("/");

  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}
