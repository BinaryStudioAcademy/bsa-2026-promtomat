import {
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
	S3ServiceException,
} from "@aws-sdk/client-s3";
import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { type Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { PROVISION_MARKER_FILE_NAME } from "./libs/constants/constants.js";
import { type ModelManifest } from "./libs/types/types.js";

type Constructor = {
	bucket: string;
	logger: Logger;
	prefix: string;
};

class S3ModelStore {
	private bucket: string;

	private client: S3Client;

	private logger: Logger;

	private prefix: string;

	public constructor({ bucket, logger, prefix }: Constructor) {
		this.bucket = bucket;
		this.logger = logger;
		this.prefix = prefix.endsWith("/") ? prefix : `${prefix}/`;
		this.client = new S3Client({});
	}

	private buildKey(file: string): string {
		return `${this.prefix}${file}`;
	}

	private async downloadFile(file: string, localPath: string): Promise<void> {
		const destination = path.join(localPath, file);
		await mkdir(path.dirname(destination), { recursive: true });

		const object = await this.client.send(
			new GetObjectCommand({ Bucket: this.bucket, Key: this.buildKey(file) }),
		);

		if (!object.Body) {
			throw new Error(
				`Model store object "${this.buildKey(file)}" has no body.`,
			);
		}

		await pipeline(object.Body as Readable, createWriteStream(destination));
		this.logger.info(`Embedding model store: downloaded "${file}".`);
	}

	public async downloadModel(localPath: string): Promise<ModelManifest> {
		const marker = await this.client.send(
			new GetObjectCommand({
				Bucket: this.bucket,
				Key: this.buildKey(PROVISION_MARKER_FILE_NAME),
			}),
		);

		if (!marker.Body) {
			throw new Error("Model store marker object has no body.");
		}

		const manifest = JSON.parse(
			await marker.Body.transformToString(),
		) as ModelManifest;

		if (!Array.isArray(manifest.files)) {
			throw new TypeError(
				"Model store marker content is not a valid manifest.",
			);
		}

		for (const file of manifest.files) {
			await this.downloadFile(file, localPath);
		}

		return manifest;
	}

	public async hasMarker(): Promise<boolean> {
		try {
			await this.client.send(
				new HeadObjectCommand({
					Bucket: this.bucket,
					Key: this.buildKey(PROVISION_MARKER_FILE_NAME),
				}),
			);

			return true;
		} catch (error) {
			const isMarkerAbsent =
				error instanceof S3ServiceException &&
				error.$metadata.httpStatusCode === HTTPCode.NOT_FOUND;

			if (isMarkerAbsent) {
				return false;
			}

			throw error;
		}
	}

	public async uploadModel(
		localPath: string,
		manifest: ModelManifest,
	): Promise<void> {
		for (const file of manifest.files) {
			const source = path.join(localPath, file);
			const { size } = await stat(source);

			await this.client.send(
				new PutObjectCommand({
					Body: createReadStream(source),
					Bucket: this.bucket,
					ContentLength: size,
					Key: this.buildKey(file),
				}),
			);

			this.logger.info(
				`Embedding model store: uploaded "${file}" (${size.toString()} bytes).`,
			);
		}

		await this.client.send(
			new PutObjectCommand({
				Body: JSON.stringify(manifest),
				Bucket: this.bucket,
				Key: this.buildKey(PROVISION_MARKER_FILE_NAME),
			}),
		);

		this.logger.info(
			`Embedding model store: marker uploaded last — s3://${this.bucket}/${this.prefix} is complete.`,
		);
	}
}

export { S3ModelStore };
