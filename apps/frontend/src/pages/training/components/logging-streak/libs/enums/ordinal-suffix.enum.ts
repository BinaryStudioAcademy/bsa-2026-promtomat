const OrdinalSuffix = {
	few: "rd",
	many: "th",
	one: "st",
	other: "th",
	two: "nd",
	zero: "th",
} as const satisfies Record<Intl.LDMLPluralRule, string>;

export { OrdinalSuffix };
