let env = process.env.NODE_ENV;

let useConfig = require(`./env/${env}.ts`);
import { globalConfig } from "../typescript/interface/interface"
export const config:globalConfig = {
    apiUrl: "/api",
    staticUrl: "/static",
    userUrl: "/api/user",
    ...useConfig.config
}