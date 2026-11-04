import { assert } from '@std/assert'
import { real_str } from './util.ts'

export
const deepseek_apikey: string = must_env('deepseek_apikey')

export
const http_password: string = must_env('http_password')

function must_env(key: string): string {
	const value = Deno.env.get(key)
	assert(real_str(value), err_msg(key))
	return value!
}

function err_msg(key: string) {
	return 'env ' + key + ' is required. 如果是本地测试，环境变量写入 .env 文件中时，命令行记得附带 --env-file 参数'
}
