import { startRESTServer } from "./deps.ts";
import { configs } from "./configs.ts";

console.log("Starting custom REST Proxy Server");
startRESTServer(configs);
