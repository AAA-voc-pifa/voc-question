# HTTP API

## 通用约定

### 认证

除 `OPTIONS` 预检外，所有接口均需在请求头携带密码：

| Header     | 说明                         |
| ---------- | ---------------------------- |
| `password` | 须与环境变量 `http_password` 一致 |

### 通用错误

| 状态码 | 正文（纯文本）       | 说明                 |
| ------ | -------------------- | -------------------- |
| `401`  | `password incorrect` | 密码错误             |
| `404`  | `noT founD`          | 未知路径或 Method 不支持 |
| `500`  | `unknowN erroR`      | 未捕获异常，或上游 LLM 失败 |

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
}
```
