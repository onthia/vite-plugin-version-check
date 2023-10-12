import { PluginDeployCheckOption } from "./typing";

export const sleep = (interval: number) =>
  new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, interval)
  );

export async function getVersion(fileName: string) {
  const response = await fetch(fileName);
  const result: { version: string } = await response.json();
  return result ?? {};
}

export async function checkVersion({
  storeKey,
  fileName,
}: PluginDeployCheckOption) {
  const localVersion = localStorage.getItem(storeKey);
  const { version: remoteVersion } = await getVersion(fileName);
  if (remoteVersion !== localVersion) {
    localStorage.setItem(storeKey, remoteVersion);
    if (!localVersion) location.reload();
  }
}
