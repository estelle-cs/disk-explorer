const fs = require('fs').promises;
const path = require('path');

export async function getFolderTree(dir: string): Promise<any> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const children = await Promise.all(
    entries.map(async (entry: any) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const child = await getFolderTree(fullPath);
        return {
          name: entry.name,
          path: fullPath,
          size: child.size,
          children: child.children,
        };
      } else if (entry.isFile()) {
        const { size } = await fs.stat(fullPath);
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
