import { walk } from "jsr:@std/fs";
import { toKebabCase, toPascalCase } from "jsr:@std/text";
import { extractSVGMetaData } from "./utils.ts";
import { Icon, IconMeta } from "./types.ts";
import * as YAML from "jsr:@std/yaml";
import * as Path from "jsr:@std/path";

export async function loadIcons(iconsPath: string) {
    const groupDirs = await Array.fromAsync(walk(iconsPath));
    const groups = groupDirs.filter(dir => dir.isDirectory && dir.path != iconsPath)
        .map(({ name, path }) => ({ name: toPascalCase(name), path }));

    const icons: Icon[] = [];

    for (const group of groups) {
        const iconFiles = await Array.fromAsync(walk(group.path));

        for (const file of iconFiles) {
            if (file.isDirectory && file.path == group.path) continue;


            const text = await Deno.readTextFile(file.path);

            const { meta, svg } = extractSVGMetaData<IconMeta>(text);

            const name = Path.basename(file.path, ".svg");

            icons.push({
                name: toPascalCase(name),
                pathname: toKebabCase(name),
                group: group.name,
                groupPathName: toKebabCase(group.name),
                meta: meta,
                svg: svg,
            });
        }
    }

    return icons;
}

const fnTemplate = (icon: Icon) => `
/*\n${YAML.stringify(icon.meta)}*/
const ${icon.name} = () => (
    ${icon.svg}
);

export default ${icon.name};`

export function iconToFn(icon: Icon) {
    return fnTemplate(icon);
}