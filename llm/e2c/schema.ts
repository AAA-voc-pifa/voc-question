import { z } from '@zod/zod'
import type { DeepSeekResponseData } from '../deepseek.ts'

export
const sentence_schema = z.object({
	en: z.string().min(1),
	zh: z.string().min(1),
})

export
type E2CSentence = z.infer<typeof sentence_schema>

export
type E2CResult<T> = [false, string] | [true, {
	data: T
	raw: DeepSeekResponseData
}]

export
function parse_e2c_json<T>(
	label: string,
	result: DeepSeekResponseData,
	schema: z.ZodType<T>,
): E2CResult<T> {
	const data = schema.safeParse(
		JSON.parse(result.choices[0].message.content)
	)
	if (!data.success) {
		console.error(`生成 ${label} - 解析失败:`)
		console.error(data.error)
		return [false, `生成 ${label} - 解析失败: \n` + result.choices[0].message.content]
	}
	result.choices[0].message.content = ''
	return [true, {
		data: data.data,
		raw: result,
	}]
}
