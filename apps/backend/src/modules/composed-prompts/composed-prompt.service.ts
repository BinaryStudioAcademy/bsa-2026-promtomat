import { FIRST_ELEMENT_INDEX } from "~/libs/constants/constants.js";
import { ComposedPromptError } from "~/libs/exceptions/exceptions.js";
import {
	checkIsNonEmptyString,
	getErrorDetails,
} from "~/libs/helpers/helpers.js";
import { TextGenerationError } from "~/libs/modules/bedrock/bedrock.js";
import {
	type Generator,
	SchemaKey,
} from "~/libs/modules/generator/generator.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type PromptService } from "~/modules/prompts/prompt.service.js";

import { ComposedPromptEntity } from "./composed-prompt.entity.js";
import { type ComposedPromptRepository } from "./composed-prompt.repository.js";
import { SYSTEM_PROMPT } from "./libs/constants/constants.js";
import {
	ComposeResultKind,
	FallbackReason,
	GenerationParameter,
	ModelCallOutcome,
} from "./libs/enums/enums.js";
import { ComposedPromptDuplicateError } from "./libs/exceptions/exceptions.js";
import {
	computeDescriptionHash,
	mapFallbackReasonToOutcome,
	mapTextGenerationErrorToFallback,
	mapToPromptCandidateDto,
	renderMaterial,
	selectUsedSources,
} from "./libs/helpers/helpers.js";
import {
	type ComposedPromptAdoptPayload,
	type ComposedPromptDto,
	type ComposePayload,
	type ComposeResult,
	type GenerationOutcome,
	type ModelCallLog,
	type PromptCandidateDto,
	type PromptDto,
	type StoreResult,
} from "./libs/types/types.js";

type Constructor = {
	candidateLimit: number;
	composedPromptRepository: ComposedPromptRepository;
	generator: Generator;
	logger: Logger;
	maxTokens: number;
	modelId: string;
	promptService: PromptService;
	sourceBodyMaxLength: number;
};

type Material = {
	candidates: PromptCandidateDto[];
	descriptionHash: string;
	payload: ComposePayload;
	topCandidate: PromptCandidateDto;
};

class ComposedPromptService {
	private candidateLimit: number;

	private composedPromptRepository: ComposedPromptRepository;

	private generator: Generator;

	private logger: Logger;

	private maxTokens: number;

	private modelId: string;

	private promptService: PromptService;

	private sourceBodyMaxLength: number;

	public constructor({
		candidateLimit,
		composedPromptRepository,
		generator,
		logger,
		maxTokens,
		modelId,
		promptService,
		sourceBodyMaxLength,
	}: Constructor) {
		this.candidateLimit = candidateLimit;
		this.composedPromptRepository = composedPromptRepository;
		this.generator = generator;
		this.logger = logger;
		this.maxTokens = maxTokens;
		this.modelId = modelId;
		this.promptService = promptService;
		this.sourceBodyMaxLength = sourceBodyMaxLength;
	}

	private async composeFromMaterial({
		candidates,
		descriptionHash,
		payload,
		topCandidate,
	}: Material): Promise<ComposeResult> {
		const { description, userId, workspaceId } = payload;
		const startedAt = Date.now();
		const { output, reason } = await this.generate(candidates, description);
		const log: ModelCallLog = {
			durationMs: Date.now() - startedAt,
			outcome: ModelCallOutcome.COMPOSED,
			sourceCount: candidates.length,
			workspaceId,
		};

		if (reason) {
			this.logModelCall({
				...log,
				outcome: mapFallbackReasonToOutcome(reason),
			});

			return {
				isCreated: false,
				response: {
					kind: ComposeResultKind.FALLBACK,
					prompt: topCandidate,
					reason,
				},
			};
		}

		const { entity, isCreated } = await this.store(
			ComposedPromptEntity.initializeNew({
				body: output.body,
				description,
				descriptionHash,
				explanation: output.explanation,
				modelId: this.modelId,
				requesterId: userId,
				sources: output.sources,
				workspaceId,
			}),
			workspaceId,
			descriptionHash,
		);

		this.logModelCall({
			...log,
			outcome: isCreated
				? ModelCallOutcome.COMPOSED
				: ModelCallOutcome.DEDUPLICATED,
		});

		return this.toComposedResult(entity, isCreated);
	}

	private async generate(
		candidates: PromptCandidateDto[],
		description: string,
	): Promise<GenerationOutcome> {
		try {
			const output = await this.generator.generate({
				config: {
					maxTokens: this.maxTokens,
					temperature: GenerationParameter.TEMPERATURE,
					topP: GenerationParameter.TOP_P,
				},
				message: renderMaterial({
					candidates,
					description,
					sourceBodyMaxLength: this.sourceBodyMaxLength,
				}),
				schemaKey: SchemaKey.COMPOSED_PROMPT,
				systemPrompt: SYSTEM_PROMPT,
			});
			const sources = selectUsedSources(candidates, output.usedSources);
			const [firstSource] = sources;

			if (
				!firstSource ||
				!checkIsNonEmptyString(output.prompt) ||
				!checkIsNonEmptyString(output.explanation)
			) {
				return { output: null, reason: FallbackReason.UNUSABLE };
			}

			return {
				output: {
					body: output.prompt,
					explanation: output.explanation,
					sources,
				},
				reason: null,
			};
		} catch (error) {
			if (!(error instanceof TextGenerationError)) {
				throw error;
			}

			const { isConfigurationFault, reason } =
				mapTextGenerationErrorToFallback(error);

			if (isConfigurationFault) {
				this.logger.error(
					"Composed prompt generation failed on our side.",
					getErrorDetails(error),
				);
			}

			return { output: null, reason };
		}
	}

	private logModelCall(parameters: ModelCallLog): void {
		this.logger.info("Composed prompt model call.", parameters);
	}

	private async store(
		entity: ComposedPromptEntity,
		workspaceId: number,
		descriptionHash: string,
	): Promise<StoreResult> {
		try {
			return {
				entity: await this.composedPromptRepository.create(entity),
				isCreated: true,
			};
		} catch (error) {
			if (!(error instanceof ComposedPromptDuplicateError)) {
				throw error;
			}

			const winner = await this.composedPromptRepository.findByWorkspaceAndHash(
				workspaceId,
				descriptionHash,
			);

			if (!winner) {
				throw error;
			}

			return { entity: winner, isCreated: false };
		}
	}

	private toComposedResult(
		entity: ComposedPromptEntity,
		isCreated: boolean,
	): ComposeResult {
		return {
			isCreated,
			response: {
				composedPrompt: this.toDto(entity),
				kind: ComposeResultKind.COMPOSED,
			},
		};
	}

	private toDto(entity: ComposedPromptEntity): ComposedPromptDto {
		const {
			body,
			createdAt,
			description,
			explanation,
			id,
			modelId,
			sources,
			workspaceId,
		} = entity.toObject();

		return {
			body,
			createdAt,
			description,
			explanation,
			id,
			modelId,
			sources,
			workspaceId,
		};
	}

	public async adopt(payload: ComposedPromptAdoptPayload): Promise<PromptDto> {
		const { id, promptBody, score, userId } = payload;
		const composedPrompt = await this.composedPromptRepository.findById(id);

		if (!composedPrompt) {
			throw ComposedPromptError.notFound();
		}

		const { body, description, workspaceId } = composedPrompt.toObject();

		return await this.promptService.create({
			efficiencyScore: score,
			promptBody: promptBody ?? body,
			taskIntent: description,
			userId,
			workspaceId,
		});
	}

	public async compose(payload: ComposePayload): Promise<ComposeResult> {
		const { description, userId, workspaceId } = payload;
		const descriptionHash = computeDescriptionHash(description);
		const existing = await this.composedPromptRepository.findByWorkspaceAndHash(
			workspaceId,
			descriptionHash,
		);

		if (existing) {
			this.logModelCall({
				durationMs: 0,
				outcome: ModelCallOutcome.DEDUPLICATED,
				sourceCount: 0,
				workspaceId,
			});

			return this.toComposedResult(existing, false);
		}

		const retrieved = await this.promptService.findCandidates({
			description,
			limit: this.candidateLimit,
			userId,
			workspaceId,
		});
		const candidates = retrieved
			.slice(FIRST_ELEMENT_INDEX, this.candidateLimit)
			.map((candidate) => mapToPromptCandidateDto(candidate));
		const [topCandidate] = candidates;

		if (!topCandidate) {
			return {
				isCreated: false,
				response: { kind: ComposeResultKind.NO_MATCHES },
			};
		}

		return await this.composeFromMaterial({
			candidates,
			descriptionHash,
			payload,
			topCandidate,
		});
	}

	public async findById(id: number): Promise<ComposedPromptDto> {
		const composedPrompt = await this.composedPromptRepository.findById(id);

		if (!composedPrompt) {
			throw ComposedPromptError.notFound();
		}

		return this.toDto(composedPrompt);
	}

	public async findWorkspaceId(id: number): Promise<null | number> {
		return await this.composedPromptRepository.findWorkspaceId(id);
	}
}

export { ComposedPromptService };
