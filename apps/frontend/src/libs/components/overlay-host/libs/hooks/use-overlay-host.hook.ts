import { useContext } from "react";

import { overlayHostContext } from "../../overlay-host.context.js";
import { type OverlayHostContext } from "../types/types.js";

const useOverlayHost = (): OverlayHostContext => {
	const overlayHost = useContext(overlayHostContext);

	if (overlayHost === null) {
		throw new Error("useOverlayHost must be used within OverlayHost.");
	}

	return overlayHost;
};

export { useOverlayHost };
