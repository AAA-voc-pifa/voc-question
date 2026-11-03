// deno run -A --env-file ./test/deepseek/raw.ts

import { deepseek } from '../../deepseek/raw.ts'

const result = await deepseek([
	{
		role: 'system',
		content: '你会返回 json 格式的数据',
	},
	{
		role: 'user',
		content: 'Hello, world!',
	}
])

console.log(result)
