type UserSignInResponseDto = {
	token: string;
	user: {
		email: string;
		id: number;
	};
};

export { type UserSignInResponseDto };
