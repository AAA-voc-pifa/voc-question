import { e2c } from '../llm/e2c.ts'
import { http_password } from '../env.ts'
import { validate_word } from '../util.ts'

export
async function http_handler(req: Request): Promise<Response> {
	const url = new URL(req.url)
	const req_str = req.method + ' ' + req.url
	const now = Date.now()
	try {
		// 检查密码
		if (req.headers.get('password') !== http_password)
			return new Response('password incorrect', { status: 401 })
		// 处理请求
		switch(url.pathname) {
			case '/e2c':
				return await handle_e2c(url)
			// 404
			default:
				return new Response('noT founD', { status: 404 })
		}
	} catch(err) {
		// 未知错误
		console.error(`处理 ${req_str} 时发生未知错误:`)
		console.error(err)
		return new Response('unknowN erroR', { status: 500 })
	} finally {
		console.log(`处理 ${req_str} 耗时: ${Date.now() - now}ms`)
	}
}

async function handle_e2c(url: URL) {
	const word = url.searchParams.get('word')
	if (word === null || !validate_word(word))
		return respond_400('无效的单词 ' + word)
	return respond_json(
		await e2c(word, {
			model: 'deepseek-flash',
			thinking: 'high',
		})
	)
}

function respond_json(data: unknown) {
	return new Response(JSON.stringify(data), {
		headers: {
			'Content-Type': 'application/json',
		},
	})
}

function respond_400(msg: string) {
	return new Response('请求异常: ' + msg, {
		status: 400,
	})
}
