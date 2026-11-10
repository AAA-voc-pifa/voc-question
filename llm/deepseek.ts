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

export
interface DeepSeekResponseData {
	id: string
	choices: {
		index: number
		message: DeepSeekResponseMessage
	}[]
}

type DeepSeekModel = 'deepseek-flash' | 'deepseek-v4-pro'
type DeepSeekReasoningEffort = 'low' | 'high' | 'max'
	
type DeepSeekResult = [false, string] | [true, DeepSeekResponseData]

export
interface DeepSeekOpts {
	model?: DeepSeekModel
	thinking?: DeepSeekReasoningEffort
}

export
async function deepseek(msg_list: DeepSeekMessage[], opts: DeepSeekOpts = {}): Promise<DeepSeekResult> {
	// https://api-docs.deepseek.com/zh-cn/api/create-chat-completion
	const response = await fetch('https://api.deepseek.com/chat/completions', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${deepseek_apikey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			messages: msg_list,

			model: opts.model ?? 'deepseek-v4-pro',
			thinking: {
				type: opts.thinking === undefined ? 'disabled' : 'enabled',
			},
			reasoning_effort: opts.thinking,
			response_format: {
				type: 'json_object', // 'json_object', 'text'
			},
		}),
	})
	
	const err = await check_response(response)
	if (err !== null)
		return [false, err]

	const data = await response.json() as DeepSeekResponseData
	return [true, data]
}

async function check_response(response: Response): Promise<string | null> {
	if (response.ok)
		return null

	const err_msg = `请求 deepseek 失败 ${response.status}. `
	try {
		const err = await response.text()
		return err_msg + '\n' + err
	} catch(err) {
		const e = err_msg + '接收 body 也失败. '
		console.error(e)
		console.error(err)
		return e
	}
}
