// deno run -A --env-file ./test/llm/e2c.ts

import { e2c } from '../../llm/e2c.ts'

console.log(
	await e2c('proficient', {
		model: 'deepseek-flash',
	})
)
