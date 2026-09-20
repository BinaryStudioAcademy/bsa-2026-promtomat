const buildPasswordResetText = (link: string, ttlMinutes: number): string => {
	return `Open this link to choose a new password. It expires in ${ttlMinutes.toString()} minutes.\n\n${link}\n\nIf you did not ask for this, you can ignore this email.`;
};

export { buildPasswordResetText };
