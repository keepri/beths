const fileText = await Bun.file("./package.json").text();
const packageJson = JSON.parse(fileText);
const dependencies = Object.keys(packageJson.dependencies);

await Bun.build({
    root: "./",
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    splitting: true,
    minify: true,
    plugins: [],
    external: dependencies,
});

// TODO
// copy package.json to dist
// copy node_modules to dist
// copy .env to dist
// copy static dir to dist

export {};
