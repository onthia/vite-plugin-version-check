import fs from "fs";
import type { Plugin, ResolvedConfig } from "vite";
import { checkVersion, sleep } from "./util";
import { PluginDeployCheckOption } from "./typing";

const _option = {
  fileName: "__version__.json",
  storeKey: "__version__",
};

export default (option?: PluginDeployCheckOption): Plugin => {
  let config: ResolvedConfig;
  const { fileName } = _option;
  return {
    name: "vite-plugin-deploy-check",
    apply: "build",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transformIndexHtml(html: string) {
      const reg = new RegExp(`crossorigin src\="[^"]+\-|\.([a-z0-9]+)\.js"`);
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
    await checkVersion(_option);
  } catch (e) {
    console.error(e);
  }
  await sleep(interval);
  loopCheckHandler();
};
