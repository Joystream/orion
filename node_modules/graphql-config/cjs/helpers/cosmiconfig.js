"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCosmiConfigSync = exports.createCosmiConfig = exports.isLegacyConfig = void 0;
const cosmiconfig_1 = require("cosmiconfig");
const string_env_interpolation_1 = require("string-env-interpolation");
const legacySearchPlaces = [
    '.graphqlconfig',
    '.graphqlconfig.json',
    '.graphqlconfig.yaml',
    '.graphqlconfig.yml',
];
function isLegacyConfig(filePath) {
    filePath = filePath.toLowerCase();
    return legacySearchPlaces.some((name) => filePath.endsWith(name));
}
exports.isLegacyConfig = isLegacyConfig;
function transformContent(content) {
    return (0, string_env_interpolation_1.env)(content);
}
function createCustomLoader(loader) {
    return (filePath, content) => loader(filePath, transformContent(content));
}
function createCosmiConfig(moduleName, legacy) {
    const options = prepareCosmiconfig(moduleName, legacy);
    return (0, cosmiconfig_1.cosmiconfig)(moduleName, options);
}
exports.createCosmiConfig = createCosmiConfig;
function createCosmiConfigSync(moduleName, legacy) {
    const options = prepareCosmiconfig(moduleName, legacy);
    return (0, cosmiconfig_1.cosmiconfigSync)(moduleName, options);
}
exports.createCosmiConfigSync = createCosmiConfigSync;
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
    const loadYaml = createCustomLoader(cosmiconfig_1.defaultLoaders['.yaml']);
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
            '.js': cosmiconfig_1.defaultLoaders['.js'],
            '.json': createCustomLoader(cosmiconfig_1.defaultLoaders['.json']),
            '.yaml': loadYaml,
            '.yml': loadYaml,
            '.toml': loadToml,
            noExt: loadYaml,
        },
    };
}
