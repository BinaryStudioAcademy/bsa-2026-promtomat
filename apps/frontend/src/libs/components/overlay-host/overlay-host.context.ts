import { createContext } from "react";

import { type OverlayHostContext } from "./libs/types/types.js";

const overlayHostContext = createContext<null | OverlayHostContext>(null);

export { overlayHostContext };
