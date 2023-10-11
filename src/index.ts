import fs from "fs";
import type { Plugin, ResolvedConfig } from "vite";
import { checkVersion, sleep } from "./util";

let configFileName: string;
export default (fileName = "version.json"): Plugin => {
  let config: ResolvedConfig;
  configFileName = fileName;
  return {
    name: "vite-plugin-deploy-check",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transformIndexHtml(html: string) {
      const reg = new RegExp(`crossorigin src="[^"]+\.(\w+)\.[^"]+"`);
      const version = html.match(reg)?.[1] || `${+new Date()}`;

      fs.writeFileSync(
        `./${config.build.outDir}/${fileName}`,
        JSON.stringify({ version })
      );
      return html;
    },
  };
};

const INTERVAL = 5 * 60 * 1000;
export const loopCheckHandler = async (interval = INTERVAL) => {
  try {
    await checkVersion(configFileName);
  } catch (e) {
    console.error(e);
  }
  await sleep(interval);
  loopCheckHandler();
};
