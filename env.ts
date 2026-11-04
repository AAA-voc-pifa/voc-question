import { assert } from '@std/assert'
import { real_str } from './util.ts'

export
const deepseek_apikey = Deno.env.get('deepseek_apikey')
assert(real_str(deepseek_apikey), err_msg('deepseek_apikey'))

export
const http_password = Deno.env.get('http_password')
assert(real_str(http_password), err_msg('http_password'))

function err_msg(key: string) {
	return 'env ' + key + ' is required. 如果是本地测试，环境变量写入 .env 文件中时，命令行记得附带 --env-file 参数'
}
