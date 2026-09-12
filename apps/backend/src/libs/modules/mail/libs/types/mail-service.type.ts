import { type SendMailOptions } from "./send-mail-options.type.js";

type MailService = {
	send(options: SendMailOptions): Promise<void>;
};

export { type MailService };
