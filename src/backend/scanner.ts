const fs = require('fs').promises;
const path = require('path');

export async function getFolderTree(
  dir: string,
  onProgress?: (count: number) => void,
  state?: { current: number } // état partagé
): Promise<any> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const children = await Promise.all(
    entries.map(async (entry: any) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const child = await getFolderTree(fullPath, onProgress, state);
        return {
          name: entry.name,
          path: fullPath,
          size: child.size,
          children: child.children,
        };
      } else if (entry.isFile()) {
        const { size } = await fs.stat(fullPath);
        if (state) {
          state.current++;
          onProgress?.(state.current);
        }
        return {
          name: entry.name,
          path: fullPath,
          size,
        };
      }
    })
  );

  const filtered = children.filter(Boolean);
  const totalSize = filtered.reduce(
    (sum: number, item: any) => sum + (item.size || 0),
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
  const entries = await fs.readdir(dir, { withFileTypes: true })

  let count = 0

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      count += await countFiles(fullPath)
    } else if (entry.isFile()) {
      count++
    }
  }

  return count
}
