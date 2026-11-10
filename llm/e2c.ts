// English to Chinese

import { z } from '@zod/zod'
import { deepseek, type DeepSeekOpts } from './deepseek.ts'

const question_e2c_schema = z.object({
	en: z.string().min(1),
	zh: z.string().min(1),
})
const example_e2c_schema = z.object({
	word: z.string().min(1),
	questions: z.array(question_e2c_schema),
})

type ExampleE2C = z.infer<typeof example_e2c_schema>

const example: ExampleE2C = {
	word: 'lash',
	questions: [
		{
			en: 'Poverty lashes at the body, but ignorance lashes at the soul.',
			zh: '贫穷鞭打身体，但无知鞭打灵魂。',
		},
		{
			en: 'During the Age of Sail, sailors would lash themselves to the rigging during storms to avoid being washed overboard.',
			zh: '在大航海时代，水手们在暴风雨中会把自己绑在索具上，以免被冲下船。',
		},
		{
			en: 'Many hands make light work, but many tongues lash with heavy words.',
			zh: '人多好干活，但众口以沉重的言语鞭挞。（多人合力轻而易举，多人舌语重若千钧。)',
		}
	]
}

const prompt = {
	sys: '你是一个资深的英语老师，擅长帮中国学生记忆英语单词。'
		+ '你的用户是一位年轻的英语老师，你的任务是**帮他出题，以让他的学生更好地记住单词**。'
		+ '你的用户（年轻英语老师）会给你一个单词，你要据此生成 3 个有意义的句子，并给出中文翻译。'
		+ '英文原句要有意义，如富含哲理、成语俗语、时事评论、中国历史和传统文化等。'
		+ '以上元素，包含之一即可，不必全有。'
		+ '翻译应该是直译，如果有必要，可以在直译之后给出更通顺的意译。'
		+ '年轻老师会把你生成的英文句子给他的学生，让学生翻译成中文；'
		+ '之后再根据你给出的翻译，对照学生的翻译，给出评分。'
		+ '当然，评分就不是你的工作了，你只要保证题目的质量。'
		+ '注意，你给出的英文句子，必须出现该词或其常见屈折/派生。'
		+ '你给出的响应应是 JSON 格式，如:\n'
		+ `\`\`\` json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n\n`
		+ '你给出的响应应符合以上 JSON 格式，但不必模仿例句的句式。',

	user: (word: string) =>
		`英文单词: "${word}"。请按系统要求输出 JSON。`,
}

type E2CResult = [false, string] | [true, ExampleE2C]

export
async function e2c(word: string, ds_opts?: DeepSeekOpts): Promise<E2CResult> {
	console.log('生成 e2c...', word)
	const [ok, result] = await deepseek([
		{ role: 'system', content: prompt.sys },
		{ role: 'user', content: prompt.user(word) },
	], ds_opts)
	if (!ok)
		return [false, '生成 e2c - 调用失败: ' + result]

	const data = example_e2c_schema.safeParse(
		JSON.parse(result.choices[0].message.content)
	)
	if (!data.success) {
		console.error('生成 e2c - 解析失败:')
		console.error(data.error)
		return [false, '生成 e2c - 解析失败: \n' + result.choices[0].message.content]
	}
	return [true, data.data]
}
