// English to Chinese — 三词各一句

import { z } from '@zod/zod'
import { deepseek, type DeepSeekOpts } from '../deepseek.ts'
import { parse_e2c_json, sentence_schema, type E2CResult } from './schema.ts'

const multi_question_schema = sentence_schema.extend({
	word: z.string().min(1),
})
const multi_schema = z.object({
	questions: z.array(multi_question_schema).length(3),
})

type E2CMulti = z.infer<typeof multi_schema>

const example: E2CMulti = {
	questions: [
		{
			word: 'lash',
			en: 'Poverty lashes at the body, but ignorance lashes at the soul.',
			zh: '贫穷鞭打身体，但无知鞭打灵魂。',
		},
		{
			word: 'proficient',
			en: 'A proficient cook needs no recipe, just as a wise ruler needs no flattery.',
			zh: '熟练的厨师不需要菜谱，正如明智的统治者不需要奉承。',
		},
		{
			word: 'self-aware',
			en: 'To be self-aware is to hold a quiet mirror to one\'s own ambition.',
			zh: '自省，就是静静地对着自己的野心举起一面镜子。',
		},
	],
}

const prompt = {
	sys: '你是一个资深的英语老师，擅长帮中国学生记忆英语单词。'
		+ '你的用户是一位年轻的英语老师，你的任务是**帮他出题，以让他的学生更好地记住单词**。'
		+ '你的用户（年轻英语老师）会给你 3 个单词，你要为**每个单词各生成 1 个**有意义的句子，并给出中文翻译。'
		+ '英文原句要有意义，如富含哲理、成语俗语、时事评论、中国历史和传统文化等。'
		+ '以上元素，包含之一即可，不必全有。'
		+ '翻译应该是直译，如果有必要，可以在直译之后给出更通顺的意译。'
		+ '年轻老师会把你生成的英文句子给他的学生，让学生翻译成中文；'
		+ '之后再根据你给出的翻译，对照学生的翻译，给出评分。'
		+ '当然，评分就不是你的工作了，你只要保证题目的质量。'
		+ '注意，每句英文必须出现对应单词或其常见屈折/派生。'
		+ '三个句子应分别对应三个单词，顺序与用户给出的单词顺序一致。'
		+ '你给出的响应应是 JSON 格式，如:\n'
		+ `\`\`\` json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n\n`
		+ '你给出的响应应符合以上 JSON 格式，但不必模仿例句的句式。',

	user: (words: [string, string, string]) =>
		`英文单词: "${words[0]}", "${words[1]}", "${words[2]}"。请按系统要求输出 JSON。`,
}

export
async function e2c_multi(
	words: [string, string, string],
	ds_opts?: DeepSeekOpts,
): Promise<E2CResult<E2CMulti>> {
	console.log('生成 e2c_multi...', words.join(', '))
	const [ok, result] = await deepseek([
		{ role: 'system', content: prompt.sys },
		{ role: 'user', content: prompt.user(words) },
	], ds_opts)
	if (!ok)
		return [false, '生成 e2c_multi - 调用失败: ' + result]

	return parse_e2c_json('e2c_multi', result, multi_schema)
}
