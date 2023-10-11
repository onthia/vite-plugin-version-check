export const sleep = (interval: number) =>
  new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, interval)
  );

export async function getVersion() {
  const response = await fetch("/version.json");
  const result: { version: string } = await response.json();
  return result ?? {};
}

export async function checkVersion(key: string) {
  const localVersion = localStorage.getItem(key);
  const { version: remoteVersion } = await getVersion();
  if (remoteVersion !== localVersion) {
    localStorage.setItem(key, remoteVersion);
    location.reload();
  }
}
