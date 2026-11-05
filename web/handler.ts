import { e2c } from '../llm/e2c.ts'
import { http_password } from '../env.ts'
import { validate_word } from '../util.ts'

export
async function http_handler(req: Request): Promise<Response> {
	const url = new URL(req.url)
	const req_str = req.method + ' ' + url.pathname + url.search
	const now = Date.now()
	try {
		if (req.method === 'OPTIONS')
			return Respond(204, null)

		// 检查密码
		if (req.headers.get('password') !== http_password)
			return Respond(401, 'password incorrect')
		// 处理请求
		switch(url.pathname) {
			case '/e2c':
				if (req.method === 'GET')
					return await handle_e2c(url)
				else
					return not_found()
			// 404
			default:
				return not_found()
		}
	} catch(err) {
		// 未知错误
		console.error(`处理 ${req_str} 时发生未知错误:`)
		console.error(err)
		return unknown_error()
	} finally {
		console.log(`处理 ${req_str} 耗时: ${Date.now() - now}ms`)
	}
}

async function handle_e2c(url: URL) {
	const word = url.searchParams.get('word')
	if (word === null || !validate_word(word))
		return respond_400('无效的单词 ' + word)
	const [ok, result] = await e2c(word, {
		model: 'deepseek-flash',
		thinking: 'high',
	})
	if (ok)
		return respond_json(result)

	console.error(result)
	return unknown_error()
}

function Respond(status: number, body: string | null, opts?: {
	json: boolean
}) {
	const headers: Record<string, string> = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, OPTIONS, POST, DELETE, PUT',
		'Access-Control-Allow-Headers': 'password, Content-Type',
	}
	if (opts?.json === true)
		headers['Content-Type'] = 'application/json'
	return new Response(body, { status, headers })
}

function respond_json(data: unknown) {
	return Respond(200, JSON.stringify(data), {
		json: true,
	})
}

function respond_400(msg: string) {
	return Respond(400, '请求异常: ' + msg)
}

function not_found() {
	return Respond(404, 'noT founD')
}
function unknown_error() {
	return Respond(500, 'unknowN erroR')
}
