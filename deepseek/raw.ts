import { deepseek_apikey } from '../env.ts'

interface DeepSeekMessage {
	content: string
	role: 'system' | 'user' | 'assistant'
	name?: string
}

interface DeepSeekResponseMessage {
	content: string
	reasoning_content: string
}
interface DeepSeekResponseData {
	id: string
	choices: {
		message: DeepSeekResponseMessage[]
	}
}

type DeepSeekResult = [false, null] | [true, DeepSeekResponseData]

export
async function deepseek(msg_list: DeepSeekMessage[]): Promise<DeepSeekResult> {
	// https://api-docs.deepseek.com/zh-cn/api/create-chat-completion
	const response = await fetch('https://api.deepseek.com/chat/completions', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${deepseek_apikey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			messages: msg_list,

			// model: 'deepseek-v4-pro', // 'deepseek-flash', 'deepseek-v4-pro'
			model: 'deepseek-flash',
			thinking: {
				type: 'enabled',
			},
			reasoning_effort: 'high', // low, high, max
			response_format: {
				type: 'json_object', // 'json_object', 'text'
			},
		}),
	})
	if (await check_response(response))
		return [false, null]

	const data = await response.json() as DeepSeekResponseData
	return [true, data]
}

async function check_response(response: Response) {
	if (response.ok)
		return false

	const err_msg = `请求 deepseek 失败 ${response.status}`
	try {
		const err = await response.text()
		console.error(err_msg)
		console.error(err)
	} catch(err) {
		console.error(err_msg, '接收 body 也失败')
		console.error(err)
	}
	return true
}
