// deno run -A --env-file ./test/llm/deepseek.ts

import { deepseek } from '../../llm/deepseek.ts'

const [ok, result] = await deepseek([
	{
		role: 'system',
		content: '你会返回 json 格式的数据',
	},
	{
		role: 'user',
		content: 'Hello, world!',
	}
])

if (!ok)
	console.error(result)
else {
	console.log(JSON.parse(result.choices[0].message.content))
}
