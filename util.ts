export
function real_str(target: string | null | undefined): boolean {
	return target !== null && target !== undefined && target !== ''
}

export
function validate_word(word: string): boolean {
	return /^[A-Za-z]+$/.test(word)
}
