import {
	GetObjectCommand,
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

import { S3Error } from "./libs/exceptions/exceptions.js";
import {
	type DownloadObjectOptions,
	type ReadObjectTextOptions,
	type UploadFileOptions,
	type UploadTextOptions,
} from "./libs/types/types.js";

class S3 {
	private client: S3Client;

	public constructor() {
		this.client = new S3Client({});
	}

	public async downloadObject({
		bucket,
		destinationPath,
		key,
	}: DownloadObjectOptions): Promise<void> {
		await mkdir(path.dirname(destinationPath), { recursive: true });

		const object = await this.client.send(
			new GetObjectCommand({ Bucket: bucket, Key: key }),
		);

		if (!object.Body) {
			throw new S3Error(`S3 object "${key}" has no body.`);
		}

		await pipeline(object.Body as Readable, createWriteStream(destinationPath));
	}

	public async readObjectText({
		bucket,
		key,
	}: ReadObjectTextOptions): Promise<null | string> {
		let object;

		try {
			object = await this.client.send(
				new GetObjectCommand({ Bucket: bucket, Key: key }),
			);
		} catch (error) {
			const isObjectAbsent =
				error instanceof S3ServiceException &&
				error.$metadata.httpStatusCode === HTTPCode.NOT_FOUND;

			if (isObjectAbsent) {
				return null;
			}

			throw error;
		}

		if (!object.Body) {
			throw new S3Error(`S3 object "${key}" has no body.`);
		}

		return await object.Body.transformToString();
	}

	public async uploadFile({
		bucket,
		key,
		sourcePath,
	}: UploadFileOptions): Promise<number> {
		const { size } = await stat(sourcePath);

		await this.client.send(
			new PutObjectCommand({
				Body: createReadStream(sourcePath),
				Bucket: bucket,
				ContentLength: size,
				Key: key,
			}),
		);

		return size;
	}

	public async uploadText({
		bucket,
		content,
		key,
	}: UploadTextOptions): Promise<void> {
		await this.client.send(
			new PutObjectCommand({ Body: content, Bucket: bucket, Key: key }),
		);
	}
}

export { S3 };
