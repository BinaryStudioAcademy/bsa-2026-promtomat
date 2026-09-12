import { ComposedPromptError } from "~/libs/exceptions/exceptions.js";
import {
	checkIsNonEmptyString,
	getErrorDetails,
} from "~/libs/helpers/helpers.js";
import { TextGenerationError } from "~/libs/modules/bedrock/bedrock.js";
import {
	type GeneratorInterface,
	SchemaKey,
} from "~/libs/modules/generator/generator.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import { ComposedPromptEntity } from "./composed-prompt.entity.js";
import { type ComposedPromptRepository } from "./composed-prompt.repository.js";
import {
	GENERATION_TEMPERATURE,
	GENERATION_TOP_P,
	SYSTEM_PROMPT,
} from "./libs/constants/constants.js";
import {
	ComposeResultKind,
	FallbackReason,
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
	type ComposedPromptDto,
	type ComposePayload,
	type ComposeResult,
	type GenerationOutcome,
	type ModelCallLog,
	type PromptCandidateDto,
	type PromptSearchService,
	type StoreResult,
} from "./libs/types/types.js";

type Constructor = {
	candidateLimit: number;
	composedPromptRepository: ComposedPromptRepository;
	generator: GeneratorInterface;
	logger: Logger;
	maxTokens: number;
	modelId: string;
	promptSearchService: PromptSearchService;
	workspaceService: WorkspaceService;
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

	private generator: GeneratorInterface;

	private logger: Logger;

	private maxTokens: number;

	private modelId: string;

	private promptSearchService: PromptSearchService;

	private workspaceService: WorkspaceService;

	public constructor({
		candidateLimit,
		composedPromptRepository,
		generator,
		logger,
		maxTokens,
		modelId,
		promptSearchService,
		workspaceService,
	}: Constructor) {
		this.candidateLimit = candidateLimit;
		this.composedPromptRepository = composedPromptRepository;
		this.generator = generator;
		this.logger = logger;
		this.maxTokens = maxTokens;
		this.modelId = modelId;
		this.promptSearchService = promptSearchService;
		this.workspaceService = workspaceService;
	}

	private async composeFromMaterial({
		candidates,
		descriptionHash,
		payload,
		topCandidate,
	}: Material): Promise<ComposeResult> {
		const { description, userId, workspaceId } = payload;
		const startedAt = Date.now();
		const { output, reason } = await this.generate(
			renderMaterial(candidates, description),
		);
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
				body: output.prompt,
				description,
				descriptionHash,
				explanation: output.explanation,
				modelId: this.modelId,
				requesterId: userId,
				sources: selectUsedSources(candidates, output.usedSources),
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

	private async generate(material: string): Promise<GenerationOutcome> {
		try {
			const output = await this.generator.generate({
				config: {
					maxTokens: this.maxTokens,
					temperature: GENERATION_TEMPERATURE,
					topP: GENERATION_TOP_P,
				},
				message: material,
				schemaKey: SchemaKey.COMPOSED_PROMPT,
				systemPrompt: SYSTEM_PROMPT,
			});

			if (
				!checkIsNonEmptyString(output.prompt) ||
				!checkIsNonEmptyString(output.explanation)
			) {
				return { output: null, reason: FallbackReason.UNUSABLE };
			}

			return { output, reason: null };
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

		const retrieved = await this.promptSearchService.findCandidates({
			description,
			limit: this.candidateLimit,
			userId,
			workspaceId,
		});
		const candidates = retrieved
			.filter((_, index) => index < this.candidateLimit)
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

	public async findById(
		id: number,
		userId: number,
	): Promise<ComposedPromptDto> {
		const composedPrompt = await this.composedPromptRepository.findById(id);

		if (!composedPrompt) {
			throw ComposedPromptError.notFound();
		}

		const workspace = await this.workspaceService.findByIdAndOwner(
			composedPrompt.toObject().workspaceId,
			userId,
		);

		if (!workspace) {
			throw ComposedPromptError.notFound();
		}

		return this.toDto(composedPrompt);
	}
}

export { ComposedPromptService };
