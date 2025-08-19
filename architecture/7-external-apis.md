# 7. External APIs

## OpenAI API

- **Purpose:** 提供GPT模型进行工作记录的智能总结和内容分析
- **Documentation:** https://platform.openai.com/docs/api-reference
- **Base URL(s):** https://api.openai.com/v1
- **Authentication:** Bearer Token (API Key)
- **Rate Limits:**
  - Free tier: 20 requests per minute, 200,000 tokens per minute
  - Paid tier: 3,500 requests per minute, 350,000 tokens per minute

**Key Endpoints Used:**

- `POST /chat/completions` - 生成对话完成（用于工作总结）
- `POST /embeddings` - 生成文本嵌入（用于语义搜索）
- `GET /models` - 获取可用模型列表

**Integration Notes:** 使用Vercel AI SDK进行集成，支持流式响应和错误重试。需要处理API密钥的安全存储和轮换。

## Gemini API

- **Purpose:** 提供Google的Gemini模型进行多模态内容理解和总结
- **Documentation:** https://ai.google.dev/docs
- **Base URL(s):** https://generativelanguage.googleapis.com/v1
- **Authentication:** API Key
- **Rate Limits:** 60 requests per minute

**Key Endpoints Used:**

- `POST /models/{model}:generateContent` - 生成内容（用于工作总结）
- `POST /models/{model}:countTokens` - 计算token数量
- `POST /models/{model}:embedContent` - 生成内容嵌入

**Integration Notes:** 需要处理多模态输入（文本、图片），支持流式响应。注意不同模型的特性和限制。

## DeepSeek API

- **Purpose:** 提供DeepSeek模型进行中文内容优化和专业领域总结
- **Documentation:** https://platform.deepseek.com/api-docs
- **Base URL(s):** https://api.deepseek.com
- **Authentication:** Bearer Token (API Key)
- **Rate Limits:** 100 requests per minute

**Key Endpoints Used:**

- `POST /chat/completions` - 生成对话完成
- `POST /embeddings` - 生成文本嵌入
- `GET /models` - 获取模型列表

**Integration Notes:** 专门优化中文内容处理，支持长文本处理。需要注意API兼容性和错误处理。

## Supabase Auth API

- **Purpose:** 提供用户认证、会话管理和权限控制
- **Documentation:** https://supabase.com/docs/reference/auth
- **Base URL(s):** https://{project_ref}.supabase.co/auth/v1
- **Authentication:** API Key (anon key for public, service role key for admin)
- **Rate Limits:** 30 requests per second per IP

**Key Endpoints Used:**

- `POST /signup` - 用户注册
- `POST /token?grant_type=password` - 用户登录
- `POST /token?grant_type=refresh_token` - 刷新令牌
- `POST /logout` - 用户登出
- `GET /user` - 获取当前用户信息

**Integration Notes:** 使用Supabase JS客户端进行集成，支持JWT令牌管理和会话持久化。

## Supabase Storage API

- **Purpose:** 提供文件存储、上传和CDN加速服务
- **Documentation:** https://supabase.com/docs/reference/storage
- **Base URL(s):** https://{project_ref}.supabase.co/storage/v1
- **Authentication:** API Key + JWT Token
- **Rate Limits:** 100 requests per second per IP

**Key Endpoints Used:**

- `POST /object/{bucket_name}` - 上传文件
- `GET /object/{bucket_name}/{file_path}` - 下载文件
- `DELETE /object/{bucket_name}/{file_path}` - 删除文件
- `POST /object/{bucket_name}/move` - 移动文件
- `POST /object/{bucket_name}/copy` - 复制文件

**Integration Notes:** 支持大文件分片上传，自动生成CDN URL，支持文件权限管理。

## Supabase Realtime API

- **Purpose:** 提供实时数据同步和WebSocket连接
- **Documentation:** https://supabase.com/docs/reference/realtime
- **Base URL(s):** wss://{project_ref}.supabase.co/realtime/v1
- **Authentication:** JWT Token
- **Rate Limits:** 100 connections per client

**Key Endpoints Used:**

- `WebSocket /realtime/v1` - 建立实时连接
- `POST /realtime/v1/subscribe` - 订阅数据变更
- `POST /realtime/v1/unsubscribe` - 取消订阅

**Integration Notes:** 支持数据库变更监听、广播消息和状态同步。需要处理连接重连和错误恢复。
