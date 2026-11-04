# HTTP API

所有接口均需在请求头携带密码：

| Header     | 说明                         |
| ---------- | ---------------------------- |
| `password` | 须与环境变量 `http_password` 一致 |

认证失败时返回：

- **状态码** `401`
- **正文** `password incorrect`（纯文本）

未知路径返回 `404`，正文 `noT founD`。未捕获异常返回 `500`，正文 `unknowN erroR`。

---

## `GET /e2c`

根据英文单词生成 3 道「英译中」题目（含英文原句与中文参考翻译）。

### Query

| 参数   | 类型   | 必填 | 说明                                      |
| ------ | ------ | ---- | ----------------------------------------- |
| `word` | string | 是   | 目标英文单词，须匹配 `/^[A-Za-z]+$/`（仅字母） |

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
