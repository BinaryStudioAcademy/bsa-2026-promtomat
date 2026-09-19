import { EnvironmentConfig } from "./environment-config.module.js";

const config = new EnvironmentConfig(process.env);

export { config };
