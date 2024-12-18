import * as YAML from "jsr:@std/yaml";

const commentRegex = /<!--([\s\S]*?)-->/;

export function extractCommentContent(input: string) {
    const match = input.match(commentRegex);
    return match ? match[1].trim() : null;
}

export function extractSVGMetaData<T>(input: string) {
    const text = extractCommentContent(input);

    if (text !== null) {
        return {
            meta: YAML.parse(text) as T,
            svg: input.replace(commentRegex, '').trim()
        }
    } else {
        return {
            meta: {} as T,
            svg: input.trim()
        }
    }
}