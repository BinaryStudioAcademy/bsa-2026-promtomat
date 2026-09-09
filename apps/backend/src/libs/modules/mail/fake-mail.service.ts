import { type MailService, type SendMailOptions } from "./libs/types/types.js";

class FakeMailService implements MailService {
	private messages: SendMailOptions[] = [];

	public get sentMessages(): SendMailOptions[] {
		return [...this.messages];
	}

	public clear(): void {
		this.messages = [];
	}

	public send(options: SendMailOptions): Promise<void> {
		this.messages.push(options);

		return Promise.resolve();
	}
}

export { FakeMailService };
