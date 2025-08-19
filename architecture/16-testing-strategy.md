# 16. Testing Strategy

## Testing Pyramid

```
    E2E Tests
   /        \
Integration Tests
  /            \
Frontend Unit  Backend Unit
```

## Test Organization

### Frontend Tests

```
tests/
├── unit/
│   ├── components/
│   │   ├── work-record-item.test.tsx
│   │   └── summary-generator.test.tsx
│   ├── hooks/
│   │   ├── use-work-records.test.ts
│   │   └── use-auth.test.ts
│   └── utils/
│       └── date-utils.test.ts
├── integration/
│   ├── auth-flow.test.ts
│   └── work-record-crud.test.ts
└── e2e/
    ├── auth.spec.ts
    ├── work-record.spec.ts
    └── summary.spec.ts
```

### Backend Tests

```
tests/
├── unit/
│   ├── repositories/
│   │   ├── work-record.repository.test.ts
│   │   └── user.repository.test.ts
│   ├── services/
│   │   ├── auth.service.test.ts
│   │   └── work-record.service.test.ts
│   └── utils/
│       └── validation.test.ts
└── integration/
    ├── api/
    │   ├── auth.test.ts
    │   └── work-records.test.ts
    └── database/
        └── migration.test.ts
```

### E2E Tests

```
tests/e2e/
├── fixtures/
│   └── test-data.json
├── support/
│   ├── commands.ts
│   └── e2e.ts
├── auth.spec.ts
├── work-record.spec.ts
├── summary.spec.ts
└── analytics.spec.ts
```

## Test Examples

### Frontend Component Test

```typescript
// tests/unit/components/work-record-item.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkRecordItem } from '@/components/features/work-record/work-record-item';
import { WorkRecord } from '@/types/api.types';

const mockWorkRecord: WorkRecord = {
  id: '1',
  user_id: 'user1',
  title: 'Test Work Record',
  content: 'This is a test work record content',
  tags: ['work', 'test'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  is_pinned: false,
  metadata: { word_count: 8, reading_time: 1, source: 'manual' },
};

describe('WorkRecordItem', () => {
  it('renders work record information correctly', () => {
    render(<WorkRecordItem workRecord={mockWorkRecord} />);

    expect(screen.getByText('Test Work Record')).toBeInTheDocument();
    expect(screen.getByText('This is a test work record content')).toBeInTheDocument();
    expect(screen.getByText('work')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = jest.fn();
    render(<WorkRecordItem workRecord={mockWorkRecord} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByLabelText('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
});
```

### Backend API Test

```typescript
// tests/integration/api/work-records.test.ts
import { createServer } from 'http'
import { api } from 'next/server'
import { db } from '@/lib/db'
import { workRecords } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

describe('Work Records API', () => {
  let server: any
  let baseUrl: string

  beforeAll(async () => {
    server = createServer(api)
    server.listen(0)
    baseUrl = `http://localhost:${server.address().port}`
  })

  afterAll(async () => {
    server.close()
  })

  beforeEach(async () => {
    // 清理测试数据
    await db.delete(workRecords)
  })

  describe('POST /api/work-records', () => {
    it('creates a new work record', async () => {
      const workRecordData = {
        title: 'Test Record',
        content: 'Test content',
        tags: ['test'],
      }

      const response = await fetch(`${baseUrl}/api/work-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: JSON.stringify(workRecordData),
      })

      expect(response.status).toBe(201)
      const data = await response.json()
      expect(data.title).toBe(workRecordData.title)
      expect(data.content).toBe(workRecordData.content)
      expect(data.tags).toEqual(workRecordData.tags)
    })
  })
})
```

### E2E Test

```typescript
// tests/e2e/work-record.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Work Record Management', () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto('/auth/login')
    await page.fill('[type="email"]', 'test@example.com')
    await page.fill('[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('should create a new work record', async ({ page }) => {
    await page.click('text=新建记录')

    await page.fill('[placeholder="标题"]', '测试工作记录')
    await page.fill('[placeholder="内容"]', '这是一个测试工作记录的内容')
    await page.fill('[placeholder="标签"]', '测试')
    await page.press('[placeholder="标签"]', 'Enter')

    await page.click('button:has-text("保存")')

    await expect(page.locator('text=测试工作记录')).toBeVisible()
    await expect(page.locator('text=测试工作记录的内容')).toBeVisible()
    await expect(page.locator('text=测试')).toBeVisible()
  })

  test('should generate AI summary', async ({ page }) => {
    // 创建测试记录
    await page.click('text=新建记录')
    await page.fill('[placeholder="标题"]', '需要总结的工作')
    await page.fill(
      '[placeholder="内容"]',
      '这是一个需要AI总结的详细工作内容，包含了很多重要的信息和要点。'
    )
    await page.click('button:has-text("保存")')

    // 生成总结
    await page.click('button:has-text("生成总结")')
    await page.selectOption('select', 'openai')
    await page.click('button:has-text("确认生成")')

    // 等待总结生成
    await expect(page.locator('text=总结生成成功')).toBeVisible()
    await expect(page.locator('.summary-content')).toBeVisible()
  })
})
```
