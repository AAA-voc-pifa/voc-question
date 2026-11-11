// deno run -A --env-file=.env ./test/llm/e2c.ts

import { e2c } from '../../llm/e2c/single.ts'

console.log(
	await e2c('proficient', {
		model: 'deepseek-flash',
	})
)
