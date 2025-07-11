const fs = require("fs").promises;
const path = require("path");

export async function getFolderTree(
  dir: string,
  onProgress?: (count: number) => void,
  state?: { current: number },
  onError?: (error: { path: string; message: string }) => void
): Promise<any> {
  let entries: any[] = [];

  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err: any) {
    onError?.({
      path: dir,
      message:
        err.code === "EACCES" || err.code === "EPERM"
          ? "Accès refusé (permissions)"
          : err.message ?? "Erreur inconnue",
    });
    return {
      name: path.basename(dir),
      path: dir,
      size: 0,
      children: [],
    };
  }

  let children: any[] = [];

  try {
    children = await Promise.all(
      entries.map(async (entry: any) => {
        const fullPath = path.join(dir, entry.name);

        try {
          if (entry.isDirectory()) {
            const child = await getFolderTree(
              fullPath,
              onProgress,
              state,
              onError
            );
            return {
              name: entry.name,
              path: fullPath,
              size: child.size,
              children: child.children,
            };
          }

          if (entry.isFile()) {
            const stat = await fs.stat(fullPath);
            state && state.current++;
            onProgress?.(state?.current ?? 0);
            return {
              name: entry.name,
              path: fullPath,
              size: stat.size,
            };
          }

          return null;
        } catch (err: any) {
          onError?.({
            path: fullPath,
            message: err.message ?? "Erreur inconnue",
          });
          return null;
        }
      })
    );
  } catch (err: any) {
    onError?.({
      path: dir,
      message:
        err.code === "EACCES" || err.code === "EPERM"
          ? "Accès refusé (permissions)"
          : err.message ?? "Erreur inconnue",
    });

    return {
      name: path.basename(dir),
      path: dir,
      size: 0,
      children: [], 
      isDirectory: true, 
    };
  }

  const filtered = children.filter(Boolean);
  const totalSize = filtered.reduce(
    (sum: number, item: any) => sum + (item.size ?? 0),
    0
  );

  return {
    name: path.basename(dir),
    path: dir,
    size: totalSize,
    children: filtered,
  };
}

export async function countFiles(dir: string): Promise<number> {
  let entries = await fs.readdir(dir, { withFileTypes: true });
  entries = entries.filter(
    (entry: any) => !entry.name.startsWith(".") || entry.name === ".config"
  );

  let count = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += await countFiles(fullPath);
    } else if (entry.isFile()) {
      count++;
    }
  }

  return count;
}
