import { config } from "~/libs/modules/config/config.js";

import { NodemailerMailService } from "./nodemailer-mail.service.js";

const mail = new NodemailerMailService({
	from: config.ENV.MAIL.FROM,
	host: config.ENV.MAIL.HOST,
	password: config.ENV.MAIL.PASSWORD,
	port: config.ENV.MAIL.PORT,
	user: config.ENV.MAIL.USER,
});

export { mail };
export { FakeMailService } from "./fake-mail.service.js";
export { type MailService } from "./libs/types/types.js";
