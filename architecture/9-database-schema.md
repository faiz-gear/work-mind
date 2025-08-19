# 9. Database Schema

```sql
-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{}'::jsonb
);

-- 工作记录表
CREATE TABLE work_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_pinned BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 标签表
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    usage_count INTEGER DEFAULT 0
);

-- 工作记录-标签关联表（多对多关系）
CREATE TABLE work_record_tags (
    work_record_id UUID NOT NULL REFERENCES work_records(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (work_record_id, tag_id)
);

-- 总结表
CREATE TABLE summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    work_record_ids UUID[] NOT NULL,
    content TEXT NOT NULL,
    ai_provider VARCHAR(50) NOT NULL CHECK (ai_provider IN ('openai', 'gemini', 'deepseek', 'custom')),
    model VARCHAR(100) NOT NULL,
    prompt_template_id UUID REFERENCES prompt_templates(id) ON DELETE SET NULL,
    quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 总结-工作记录关联表（多对多关系）
CREATE TABLE summary_work_records (
    summary_id UUID NOT NULL REFERENCES summaries(id) ON DELETE CASCADE,
    work_record_id UUID NOT NULL REFERENCES work_records(id) ON DELETE CASCADE,
    PRIMARY KEY (summary_id, work_record_id)
);

-- AI服务配置表
CREATE TABLE ai_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('openai', 'gemini', 'deepseek', 'custom')),
    api_key TEXT NOT NULL, -- 加密存储
    base_url TEXT,
    model VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 提示模板表
CREATE TABLE prompt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    template TEXT NOT NULL,
    variables JSONB DEFAULT '[]'::jsonb,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 导出记录表
CREATE TABLE exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('pdf', 'csv', 'json', 'markdown')),
    filter JSONB NOT NULL,
    file_url TEXT,
    file_size BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 用户会话表（用于JWT令牌管理）
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    device_info JSONB
);

-- 创建索引以优化查询性能
CREATE INDEX idx_work_records_user_id ON work_records(user_id);
CREATE INDEX idx_work_records_created_at ON work_records(created_at DESC);
CREATE INDEX idx_work_records_tags ON work_records USING GIN(tags);
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_summaries_user_id ON summaries(user_id);
CREATE INDEX idx_summaries_created_at ON summaries(created_at DESC);
CREATE INDEX idx_ai_services_user_id ON ai_services(user_id);
CREATE INDEX idx_ai_services_provider ON ai_services(provider);
CREATE INDEX idx_prompt_templates_user_id ON prompt_templates(user_id);
CREATE INDEX idx_exports_user_id ON exports(user_id);
CREATE INDEX idx_exports_status ON exports(status);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_refresh_token ON user_sessions(refresh_token);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要更新时间的表添加触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_records_updated_at BEFORE UPDATE ON work_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_services_updated_at BEFORE UPDATE ON ai_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prompt_templates_updated_at BEFORE UPDATE ON prompt_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建标签使用计数更新触发器
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_tag_usage_count
    AFTER INSERT OR DELETE ON work_record_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- 创建RLS (Row Level Security) 策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的数据
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own work records" ON work_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own work records" ON work_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own work records" ON work_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own work records" ON work_records FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tags" ON tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tags" ON tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tags" ON tags FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tags" ON tags FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own summaries" ON summaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own summaries" ON summaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own summaries" ON summaries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own summaries" ON summaries FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own AI services" ON ai_services FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own AI services" ON ai_services FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own AI services" ON ai_services FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own AI services" ON ai_services FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own prompt templates" ON prompt_templates FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can insert own prompt templates" ON prompt_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own prompt templates" ON prompt_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own prompt templates" ON prompt_templates FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own exports" ON exports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own exports" ON exports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exports" ON exports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exports" ON exports FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON user_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON user_sessions FOR DELETE USING (auth.uid() = user_id);

-- 创建视图以简化查询
CREATE VIEW work_record_details AS
SELECT
    wr.id,
    wr.user_id,
    wr.title,
    wr.content,
    wr.tags,
    wr.created_at,
    wr.updated_at,
    wr.is_pinned,
    wr.metadata,
    u.name as user_name,
    u.email as user_email
FROM work_records wr
JOIN users u ON wr.user_id = u.id;

CREATE VIEW summary_details AS
SELECT
    s.id,
    s.user_id,
    s.work_record_ids,
    s.content,
    s.ai_provider,
    s.model,
    s.prompt_template_id,
    s.quality_score,
    s.created_at,
    s.metadata,
    u.name as user_name,
    u.email as user_email,
    pt.name as template_name
FROM summaries s
JOIN users u ON s.user_id = u.id
LEFT JOIN prompt_templates pt ON s.prompt_template_id = pt.id;

-- 创建函数用于数据分析和统计
CREATE OR REPLACE FUNCTION get_work_record_stats(p_user_id UUID, p_period INTERVAL DEFAULT '30 days')
RETURNS TABLE(
    total_records BIGINT,
    total_words BIGINT,
    avg_words_per_record DECIMAL,
    most_used_tags TEXT[],
    records_per_day DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT,
        SUM(LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1)::BIGINT,
        AVG(LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1)::DECIMAL,
        ARRAY(
            SELECT tag
            FROM (
                SELECT UNNEST(tags) as tag, COUNT(*)
                FROM work_records
                WHERE user_id = p_user_id
                AND created_at >= NOW() - p_period
                GROUP BY tag
                ORDER BY COUNT(*) DESC
                LIMIT 5
            ) t
        ),
        COUNT(*)::DECIMAL / EXTRACT(DAY FROM p_period)
    FROM work_records
    WHERE user_id = p_user_id
    AND created_at >= NOW() - p_period;
END;
$$ LANGUAGE plpgsql;

-- 创建函数用于更新标签使用计数
CREATE OR REPLACE FUNCTION refresh_tag_usage_counts()
RETURNS VOID AS $$
BEGIN
    -- 重置所有标签的计数
    UPDATE tags SET usage_count = 0;

    -- 重新计算每个标签的使用次数
    UPDATE tags t
    SET usage_count = COALESCE(tag_counts.count, 0)
    FROM (
        SELECT tag_id, COUNT(*) as count
        FROM work_record_tags
        GROUP BY tag_id
    ) tag_counts
    WHERE t.id = tag_counts.tag_id;
END;
$$ LANGUAGE plpgsql;
```
