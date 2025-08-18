# 5. API Specification

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: 智能工作记录与总结小工具 API
  version: 1.0.0
  description: 智能工作记录与总结小工具的RESTful API，支持工作记录管理、AI总结生成、数据分析等功能
servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://dev-api.example.com/v1
    description: Development server

paths:
  # Authentication endpoints
  /auth/register:
    post:
      summary: 用户注册
      tags: [Authentication]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password, name]
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 8
                name:
                  type: string
                  minLength: 2
      responses:
        '201':
          description: 注册成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  user:
                    $ref: '#/components/schemas/User'
                  session:
                    type: object
                    properties:
                      access_token:
                        type: string
                      refresh_token:
                        type: string
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          description: 邮箱已存在

  /auth/login:
    post:
      summary: 用户登录
      tags: [Authentication]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
      responses:
        '200':
          description: 登录成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  user:
                    $ref: '#/components/schemas/User'
                  session:
                    type: object
                    properties:
                      access_token:
                        type: string
                      refresh_token:
                        type: string
        '401':
          $ref: '#/components/responses/Unauthorized'

  # WorkRecord endpoints
  /work-records:
    get:
      summary: 获取工作记录列表
      tags: [Work Records]
      security:
        - bearerAuth: []
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
        - name: tags
          in: query
          schema:
            type: string
            description: 标签过滤，多个标签用逗号分隔
        - name: date_from
          in: query
          schema:
            type: string
            format: date
        - name: date_to
          in: query
          schema:
            type: string
            format: date
        - name: search
          in: query
          schema:
            type: string
            description: 搜索关键词
      responses:
        '200':
          description: 成功获取工作记录列表
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/WorkRecord'
                  pagination:
                    type: object
                    properties:
                      page:
                        type: integer
                      limit:
                        type: integer
                      total:
                        type: integer
                      pages:
                        type: integer

    post:
      summary: 创建工作记录
      tags: [Work Records]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateWorkRecord'
      responses:
        '201':
          description: 创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WorkRecord'

  /work-records/{id}:
    get:
      summary: 获取工作记录详情
      tags: [Work Records]
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: 成功获取工作记录
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WorkRecord'
        '404':
          $ref: '#/components/responses/NotFound'

    put:
      summary: 更新工作记录
      tags: [Work Records]
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateWorkRecord'
      responses:
        '200':
          description: 更新成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WorkRecord'

    delete:
      summary: 删除工作记录
      tags: [Work Records]
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: 删除成功

  # Summary endpoints
  /summaries:
    get:
      summary: 获取总结列表
      tags: [Summaries]
      security:
        - bearerAuth: []
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
        - name: work_record_ids
          in: query
          schema:
            type: string
            description: 工作记录ID过滤，多个ID用逗号分隔
      responses:
        '200':
          description: 成功获取总结列表
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Summary'
                  pagination:
                    type: object
                    properties:
                      page:
                        type: integer
                      limit:
                        type: integer
                      total:
                        type: integer
                      pages:
                        type: integer

    post:
      summary: 生成AI总结
      tags: [Summaries]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateSummary'
      responses:
        '201':
          description: 总结生成成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Summary'
        '400':
          $ref: '#/components/responses/BadRequest'
        '503':
          description: AI服务暂时不可用

  /summaries/{id}:
    get:
      summary: 获取总结详情
      tags: [Summaries]
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: 成功获取总结
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Summary'
        '404':
          $ref: '#/components/responses/NotFound'

  # Tag endpoints
  /tags:
    get:
      summary: 获取标签列表
      tags: [Tags]
      security:
        - bearerAuth: []
      parameters:
        - name: search
          in: query
          schema:
            type: string
        - name: sort
          in: query
          schema:
            type: string
            enum: [name, usage_count, created_at]
            default: usage_count
        - name: order
          in: query
          schema:
            type: string
            enum: [asc, desc]
            default: desc
      responses:
        '200':
          description: 成功获取标签列表
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Tag'

    post:
      summary: 创建标签
      tags: [Tags]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, color]
              properties:
                name:
                  type: string
                  minLength: 1
                color:
                  type: string
                  pattern: ^#[0-9A-Fa-f]{6}$
      responses:
        '201':
          description: 创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Tag'

  # AI Service endpoints
  /ai-services:
    get:
      summary: 获取AI服务配置列表
      tags: [AI Services]
      security:
        - bearerAuth: []
      responses:
        '200':
          description: 成功获取AI服务列表
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/AIService'

    post:
      summary: 添加AI服务配置
      tags: [AI Services]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateAIService'
      responses:
        '201':
          description: 添加成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIService'

  /ai-services/{id}:
    put:
      summary: 更新AI服务配置
      tags: [AI Services]
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateAIService'
      responses:
        '200':
          description: 更新成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIService'

  # Analytics endpoints
  /analytics/trends:
    get:
      summary: 获取工作趋势分析
      tags: [Analytics]
      security:
        - bearerAuth: []
      parameters:
        - name: period
          in: query
          schema:
            type: string
            enum: [day, week, month, year]
            default: week
        - name: date_from
          in: query
          schema:
            type: string
            format: date
        - name: date_to
          in: query
          schema:
            type: string
            format: date
      responses:
        '200':
          description: 成功获取趋势数据
          content:
            application/json:
              schema:
                type: object
                properties:
                  labels:
                    type: array
                    items:
                      type: string
                  datasets:
                    type: array
                    items:
                      type: object
                      properties:
                        label:
                          type: string
                        data:
                          type: array
                          items:
                            type: number
                        borderColor:
                          type: string
                        backgroundColor:
                          type: string

  /analytics/time-distribution:
    get:
      summary: 获取时间分布分析
      tags: [Analytics]
      security:
        - bearerAuth: []
      parameters:
        - name: period
          in: query
          schema:
            type: string
            enum: [day, week, month]
            default: week
      responses:
        '200':
          description: 成功获取时间分布数据
          content:
            application/json:
              schema:
                type: object
                properties:
                  heatmap:
                    type: array
                    items:
                      type: object
                      properties:
                        hour:
                          type: integer
                        day:
                          type: integer
                        value:
                          type: number

  # Export endpoints
  /exports:
    post:
      summary: 创建导出任务
      tags: [Exports]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateExport'
      responses:
        '201':
          description: 导出任务创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Export'

  /exports/{id}:
    get:
      summary: 获取导出任务状态
      tags: [Exports]
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: 成功获取导出任务
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Export'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
        avatar_url:
          type: string
          nullable: true
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
        preferences:
          type: object
          properties:
            theme:
              type: string
              enum: [light, dark, system]
            language:
              type: string
            notifications:
              type: object
              properties:
                email:
                  type: boolean
                push:
                  type: boolean
            ai_settings:
              type: object
              properties:
                default_provider:
                  type: string
                summary_length:
                  type: string
                  enum: [short, medium, long]

    WorkRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
        user_id:
          type: string
          format: uuid
        title:
          type: string
        content:
          type: string
        tags:
          type: array
          items:
            type: string
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
        is_pinned:
          type: boolean
        metadata:
          type: object
          properties:
            word_count:
              type: integer
            reading_time:
              type: integer
            source:
              type: string
              enum: [manual, import, quick]

    CreateWorkRecord:
      type: object
      required: [title, content]
      properties:
        title:
          type: string
        content:
          type: string
        tags:
          type: array
          items:
            type: string
        is_pinned:
          type: boolean
          default: false

    UpdateWorkRecord:
      type: object
      properties:
        title:
          type: string
        content:
          type: string
        tags:
          type: array
          items:
            type: string
        is_pinned:
          type: boolean

    Summary:
      type: object
      properties:
        id:
          type: string
          format: uuid
        user_id:
          type: string
          format: uuid
        work_record_ids:
          type: array
          items:
            type: string
            format: uuid
        content:
          type: string
        ai_provider:
          type: string
          enum: [openai, gemini, deepseek, custom]
        model:
          type: string
        prompt_template_id:
          type: string
          format: uuid
          nullable: true
        quality_score:
          type: number
          minimum: 0
          maximum: 100
        created_at:
          type: string
          format: date-time
        metadata:
          type: object
          properties:
            tokens_used:
              type: integer
            generation_time:
              type: integer
            cost:
              type: number

    CreateSummary:
      type: object
      required: [work_record_ids, ai_provider, model]
      properties:
        work_record_ids:
          type: array
          items:
            type: string
            format: uuid
        ai_provider:
          type: string
          enum: [openai, gemini, deepseek, custom]
        model:
          type: string
        prompt_template_id:
          type: string
          format: uuid
        summary_length:
          type: string
          enum: [short, medium, long]
          default: medium

    Tag:
      type: object
      properties:
        id:
          type: string
          format: uuid
        user_id:
          type: string
          format: uuid
        name:
          type: string
        color:
          type: string
          pattern: ^#[0-9A-Fa-f]{6}$
        created_at:
          type: string
          format: date-time
        usage_count:
          type: integer
          minimum: 0

    AIService:
      type: object
      properties:
        id:
          type: string
          format: uuid
        user_id:
          type: string
          format: uuid
        provider:
          type: string
          enum: [openai, gemini, deepseek, custom]
        base_url:
          type: string
          nullable: true
        model:
          type: string
        is_active:
          type: boolean
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    CreateAIService:
      type: object
      required: [provider, api_key, model]
      properties:
        provider:
          type: string
          enum: [openai, gemini, deepseek, custom]
        api_key:
          type: string
        base_url:
          type: string
        model:
          type: string
        is_active:
          type: boolean
          default: true

    UpdateAIService:
      type: object
      properties:
        api_key:
          type: string
        base_url:
          type: string
        model:
          type: string
        is_active:
          type: boolean

    Export:
      type: object
      properties:
        id:
          type: string
          format: uuid
        user_id:
          type: string
          format: uuid
        type:
          type: string
          enum: [pdf, csv, json, markdown]
        filter:
          type: object
          properties:
            date_range:
              type: object
              properties:
                start:
                  type: string
                  format: date
                end:
                  type: string
                  format: date
            tags:
              type: array
              items:
                type: string
            include_summaries:
              type: boolean
        file_url:
          type: string
          nullable: true
        file_size:
          type: integer
          nullable: true
        status:
          type: string
          enum: [pending, processing, completed, failed]
        created_at:
          type: string
          format: date-time
        completed_at:
          type: string
          format: date-time
          nullable: true

    CreateExport:
      type: object
      required: [type, filter]
      properties:
        type:
          type: string
          enum: [pdf, csv, json, markdown]
        filter:
          type: object
          properties:
            date_range:
              type: object
              properties:
                start:
                  type: string
                  format: date
                end:
                  type: string
                  format: date
            tags:
              type: array
              items:
                type: string
            include_summaries:
              type: boolean

  responses:
    BadRequest:
      description: 请求参数错误
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: object
                properties:
                  code:
                    type: string
                  message:
                    type: string
                  details:
                    type: object

    Unauthorized:
      description: 未授权访问
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: object
                properties:
                  code:
                    type: string
                  message:
                    type: string

    NotFound:
      description: 资源未找到
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: object
                properties:
                  code:
                    type: string
                  message:
                    type: string
```
