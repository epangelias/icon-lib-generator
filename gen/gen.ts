
import * as Path from "jsr:@std/path";
import { iconToFn, loadIcons } from "../gen/icons.ts";
import { ensureDir } from "jsr:@std/fs/ensure-dir";
import { toKebabCase } from "jsr:@std/text/to-kebab-case";

if (import.meta.main) {
  const icons = await loadIcons(Path.resolve("./icon-data"));
  const iconsJSON = icons.map(({ name, group, meta }) => ({ name, group, meta }));

  await Deno.remove(Path.resolve("./result"), { recursive: true });
  await ensureDir(Path.resolve(`./result`));

  const data = icons.map(icon => ({
    ...icon,
    url: `https://raw.githubusercontent.com/epangelias/tabler-icons/refs/heads/main/${icon.groupPathName}/${icon.pathname}.tsx`
  }))

  await Deno.writeTextFile(Path.resolve("./result/icons.json"), JSON.stringify(iconsJSON, null, 2));
  await Deno.writeTextFile(Path.resolve("./result/data.json"), JSON.stringify(data, null, 2));

  for (const icon of icons) {
    const fn = iconToFn(icon);
    await ensureDir(Path.resolve(`./result/${icon.groupPathName}`));
    await Deno.writeTextFile(Path.resolve(`./result/${toKebabCase(icon.groupPathName)}/${toKebabCase(icon.pathname)}.tsx`), fn);
  }

  let exp = "";

  for (const icon of icons) {
    exp += `export { default as ${icon.name}${icon.group} } from "./${icon.groupPathName}/${icon.pathname}.tsx";\n`;
  }

  Deno.writeTextFile(Path.resolve("./result/exports.ts"), exp);

  // Format files
  new Deno.Command(Deno.execPath(), { args: ["fmt", "./result"] }).output();
}
