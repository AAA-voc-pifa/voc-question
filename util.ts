export
function real_str(target: string | null | undefined): target is string {
	return target !== null && target !== undefined && target !== ''
}

export
function validate_word(word: string): boolean {
	return /^[A-Za-z]+(-[A-Za-z]+)*$/.test(word)
}
