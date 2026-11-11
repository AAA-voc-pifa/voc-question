// deno run -A --env-file=.env ./test/llm/e2c_multi.ts

import { e2c_multi } from '../../llm/e2c/multi.ts'

console.log(
	await e2c_multi(['lash', 'proficient', 'self-aware'], {
		model: 'deepseek-flash',
	})
)
