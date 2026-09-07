import { embedding } from "~/libs/modules/embedding/embedding.js";
import { serverApplication } from "~/libs/modules/server-application/server-application.js";

embedding.init();

await serverApplication.init();
