# HTTP API

## 通用约定

### 认证

除 `OPTIONS` 预检外，所有接口均需在请求头携带密码：

| Header     | 说明                         |
| ---------- | ---------------------------- |
| `password` | 须与环境变量 `http_password` 一致 |

认证失败：

- **状态码** `401`
- **正文** `password incorrect`（纯文本）

### CORS

所有响应（含错误与预检）均带：

| Header                         | 值                                      |
| ------------------------------ | --------------------------------------- |
| `Access-Control-Allow-Origin`  | `*`                                     |
| `Access-Control-Allow-Methods` | `GET, OPTIONS, POST, DELETE, PUT`       |
| `Access-Control-Allow-Headers` | `password, Content-Type`                |

`OPTIONS` 任意路径返回 `204`（无正文）。

### 通用错误

| 状态码 | 正文（纯文本）       | 说明                         |
| ------ | -------------------- | ---------------------------- |
| `401`  | `password incorrect` | 密码错误                     |
| `404`  | `noT founD`          | 未知路径或 Method 不支持     |
| `500`  | `unknowN erroR`      | 未捕获异常，或上游 LLM 失败  |

---

## `GET /e2c`

根据英文单词生成 3 道「英译中」题目（含英文原句与中文参考翻译）。

### Query

| 参数   | 类型   | 必填 | 说明 |
| ------ | ------ | ---- | ---- |
| `word` | string | 是   | 目标英文单词，须匹配 `/^[A-Za-z]+(-[A-Za-z]+)*$/`（字母，可含连字符，如 `self-aware`） |

### 成功响应

- **状态码** `200`
- **Content-Type** `application/json`

```json
{
  "data": {
    "word": "lash",
    "questions": [
      {
        "en": "Poverty lashes at the body, but ignorance lashes at the soul.",
        "zh": "贫穷鞭打身体，但无知鞭打灵魂。"
      },
      {
        "en": "...",
        "zh": "..."
      },
      {
        "en": "...",
        "zh": "..."
      }
    ]
  },
  "raw": {
    "id": "...",
    "choices": [
      {
        "index": 0,
        "message": {
          "content": "",
          "reasoning_content": "..."
        }
      }
    ]
  }
}
```

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `data` | object | 解析后的题目 |
| `data.word` | string | 请求的单词 |
| `data.questions` | array | 题目列表（通常为 3 题） |
| `data.questions[].en` | string | 包含目标单词的英文句子 |
| `data.questions[].zh` | string | 对应中文翻译（可含意译） |
| `raw` | object | DeepSeek 原始响应（字段可能多于下方列出的） |
| `raw.id` | string | 请求 ID |
| `raw.choices[].message.content` | string | 已清空为 `""`（题目见 `data`） |
| `raw.choices[].message.reasoning_content` | string | 模型思考过程 |

### 错误响应

| 状态码 | 条件 | 正文 |
| ------ | ---- | ---- |
| `400` | 缺少 `word` 或格式无效 | `请求异常: 无效的单词 ...`（纯文本） |
| `401` | 密码错误 | `password incorrect` |
| `404` | 非 `GET`（如 `POST /e2c`） | `noT founD` |
| `500` | LLM 调用/解析失败，或未知异常 | `unknowN erroR` |

### 示例

```bash
curl -H "password: YOUR_PASSWORD" \
  "http://localhost:8000/e2c?word=self-aware"
```

---

## `GET /e2c-multi`

接收恰好 3 个英文单词，为每个单词各生成 1 道「英译中」题目（含英文原句与中文参考翻译）。

### Query

| 参数   | 类型   | 必填 | 说明 |
| ------ | ------ | ---- | ---- |
| `word` | string | 是   | 重复传 3 次；每个值须匹配 `/^[A-Za-z]+(-[A-Za-z]+)*$/` |

### 成功响应

- **状态码** `200`
- **Content-Type** `application/json`

```json
{
  "data": {
    "questions": [
      {
        "word": "lash",
        "en": "Poverty lashes at the body, but ignorance lashes at the soul.",
        "zh": "贫穷鞭打身体，但无知鞭打灵魂。"
      },
      {
        "word": "proficient",
        "en": "...",
        "zh": "..."
      },
      {
        "word": "self-aware",
        "en": "...",
        "zh": "..."
      }
    ]
  },
  "raw": {
    "id": "...",
    "choices": [
      {
        "index": 0,
        "message": {
          "content": "",
          "reasoning_content": "..."
        }
      }
    ]
  }
}
```

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `data` | object | 解析后的题目 |
| `data.questions` | array | 恰好 3 题，顺序与请求单词一致 |
| `data.questions[].word` | string | 该题对应的单词 |
| `data.questions[].en` | string | 包含目标单词的英文句子 |
| `data.questions[].zh` | string | 对应中文翻译（可含意译） |
| `raw` | object | DeepSeek 原始响应（字段可能多于下方列出的） |
| `raw.choices[].message.content` | string | 已清空为 `""`（题目见 `data`） |
| `raw.choices[].message.reasoning_content` | string | 模型思考过程 |

### 错误响应

| 状态码 | 条件 | 正文 |
| ------ | ---- | ---- |
| `400` | 不是恰好 3 个有效 `word` | `请求异常: 需要恰好 3 个有效单词，收到: ...`（纯文本） |
| `401` | 密码错误 | `password incorrect` |
| `404` | 非 `GET` | `noT founD` |
| `500` | LLM 调用/解析失败，或未知异常 | `unknowN erroR` |

### 示例

```bash
curl -H "password: YOUR_PASSWORD" \
  "http://localhost:8000/e2c-multi?word=lash&word=proficient&word=self-aware"
```
