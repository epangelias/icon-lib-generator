// User a hono server to serve index.html, and data.json

import { Hono } from "jsr:@hono/hono";
import * as Path from "jsr:@std/path";

const app = new Hono();

app.get("/", async (c) => {
    const file = await Deno.readTextFile(Path.resolve(import.meta.dirname!, "./index.html"));
    return c.body(file, {
        headers: {
            "content-type": "text/html; charset=utf-8",
        },
    });
});

app.get("/data.json", async (c) => {
    const filePath = Path.resolve(import.meta.dirname!, "../result/data.json");
    const file = await Deno.readTextFile(filePath);
    return c.json(JSON.parse(file));
});


const port = 8000;

console.log(`Starting server on port ${port}`);

if (import.meta.main) Deno.serve(app.fetch);
