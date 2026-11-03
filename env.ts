import { assert } from '@std/assert'
import { real_str } from './util.ts'

export
const deepseek_apikey = Deno.env.get('deepseek_apikey')
assert(real_str(deepseek_apikey), 'env deepseek_apikey is required')
