import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { cosmiconfig, cosmiconfigSync, defaultLoaders } from 'cosmiconfig';
import { env } from 'string-env-interpolation';
const legacySearchPlaces = [
    '.graphqlconfig',
    '.graphqlconfig.json',
    '.graphqlconfig.yaml',
    '.graphqlconfig.yml',
];
export function isLegacyConfig(filePath) {
    filePath = filePath.toLowerCase();
    return legacySearchPlaces.some((name) => filePath.endsWith(name));
}
function transformContent(content) {
    return env(content);
}
function createCustomLoader(loader) {
    return (filePath, content) => loader(filePath, transformContent(content));
}
export function createCosmiConfig(moduleName, legacy) {
    const options = prepareCosmiconfig(moduleName, legacy);
    return cosmiconfig(moduleName, options);
}
export function createCosmiConfigSync(moduleName, legacy) {
    const options = prepareCosmiconfig(moduleName, legacy);
    return cosmiconfigSync(moduleName, options);
}
const loadTypeScript = (...args) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { TypeScriptLoader } = require('cosmiconfig-typescript-loader');
    return TypeScriptLoader({ transpileOnly: true })(...args);
};
const loadToml = (...args) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { loadToml } = require('cosmiconfig-toml-loader');
    return createCustomLoader(loadToml)(...args);
};
function prepareCosmiconfig(moduleName, legacy) {
    const loadYaml = createCustomLoader(defaultLoaders['.yaml']);
    const searchPlaces = [
        '#.config.ts',
        '#.config.js',
        '#.config.cjs',
        '#.config.json',
        '#.config.yaml',
        '#.config.yml',
        '#.config.toml',
        '.#rc',
        '.#rc.ts',
        '.#rc.js',
        '.#rc.cjs',
        '.#rc.json',
        '.#rc.yml',
        '.#rc.yaml',
        '.#rc.toml',
        'package.json',
    ];
    if (legacy) {
        searchPlaces.push(...legacySearchPlaces);
    }
    // We need to wrap loaders in order to access and transform file content (as string)
    // Cosmiconfig has transform option but at this point config is not a string but an object
    return {
        searchPlaces: searchPlaces.map((place) => place.replace('#', moduleName)),
        loaders: {
            '.ts': loadTypeScript,
            '.js': defaultLoaders['.js'],
            '.json': createCustomLoader(defaultLoaders['.json']),
            '.yaml': loadYaml,
            '.yml': loadYaml,
            '.toml': loadToml,
            noExt: loadYaml,
        },
    };
}
