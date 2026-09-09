import { generator } from "~/libs/modules/generator/generator.js";

import { LabelModel } from "./label.model.js";
import { LabelRepository } from "./label.repository.js";
import { LabelService } from "./label.service.js";

const labelRepository = new LabelRepository(LabelModel);
const labelService = new LabelService(labelRepository, generator);

export { labelService };

export { type LabelService } from "./label.service.js";
