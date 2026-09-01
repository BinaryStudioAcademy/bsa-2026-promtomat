import path from "node:path";

import { type Logger } from "~/libs/modules/logger/logger.js";
import { type S3 } from "~/libs/modules/s3/s3.js";

import { PROVISION_MARKER_FILE_NAME } from "./libs/constants/constants.js";
import { checkIsManifest } from "./libs/helpers/helpers.js";
import { type ModelManifest } from "./libs/types/types.js";

type Constructor = {
	bucket: string;
	logger: Logger;
	prefix: string;
	s3: S3;
};

class S3ModelStore {
	private bucket: string;

	private logger: Logger;

	private prefix: string;

	private s3: S3;

	public constructor({ bucket, logger, prefix, s3 }: Constructor) {
		this.bucket = bucket;
		this.logger = logger;
		this.prefix = prefix.endsWith("/") ? prefix : `${prefix}/`;
		this.s3 = s3;
	}

	private assertSafeManifestEntry(file: string, localPath: string): void {
		const destination = path.resolve(localPath, file);
		const isConfinedToRoot = destination.startsWith(
			path.resolve(localPath) + path.sep,
		);

		if (!isConfinedToRoot) {
			throw new TypeError(
				`Model store manifest entry "${file}" escapes the local path.`,
			);
		}
	}

	private buildKey(file: string): string {
		return `${this.prefix}${file}`;
	}

	public async downloadModel(
		localPath: string,
		manifest: ModelManifest,
	): Promise<void> {
		for (const file of manifest.files) {
			this.assertSafeManifestEntry(file, localPath);
		}

		for (const file of manifest.files) {
			await this.s3.downloadObject({
				bucket: this.bucket,
				destinationPath: path.join(localPath, file),
				key: this.buildKey(file),
			});

			this.logger.info(`Embedding model store: downloaded "${file}".`);
		}
	}

	public async fetchManifest(): Promise<ModelManifest | null> {
		const markerText = await this.s3.readObjectText({
			bucket: this.bucket,
			key: this.buildKey(PROVISION_MARKER_FILE_NAME),
		});

		if (markerText === null) {
			return null;
		}

		const parsed: unknown = JSON.parse(markerText);

		if (!checkIsManifest(parsed)) {
			this.logger.warn(
				"Embedding model store: marker content is not a valid manifest — treating the store as unprovisioned.",
			);

			return null;
		}

		return parsed;
	}

	public async uploadModel(
		localPath: string,
		manifest: ModelManifest,
	): Promise<void> {
		for (const file of manifest.files) {
			const size = await this.s3.uploadFile({
				bucket: this.bucket,
				key: this.buildKey(file),
				sourcePath: path.join(localPath, file),
			});

			this.logger.info(
				`Embedding model store: uploaded "${file}" (${size.toString()} bytes).`,
			);
		}

		await this.s3.uploadText({
			bucket: this.bucket,
			content: JSON.stringify(manifest),
			key: this.buildKey(PROVISION_MARKER_FILE_NAME),
		});

		this.logger.info(
			`Embedding model store: marker uploaded last — s3://${this.bucket}/${this.prefix} is complete.`,
		);
	}
}

export { S3ModelStore };
