import { createTransport, type Transporter } from "nodemailer";

import { type MailService, type SendMailOptions } from "./libs/types/types.js";

const IMPLICIT_TLS_PORT = 465;

type Constructor = {
	from: string;
	host: string;
	password: string;
	port: number;
	user: string;
};

class NodemailerMailService implements MailService {
	private from: string;

	private transporter: Transporter;

	public constructor({ from, host, password, port, user }: Constructor) {
		this.from = from;
		this.transporter = createTransport({
			auth: { pass: password, user },
			host,
			port,
			secure: port === IMPLICIT_TLS_PORT,
		});
	}

	public async send({ subject, text, to }: SendMailOptions): Promise<void> {
		await this.transporter.sendMail({
			from: this.from,
			subject,
			text,
			to,
		});
	}
}

export { NodemailerMailService };
