import { test, expect } from '@playwright/test';

test.describe('Tech Villain E2E Tests', () => {
  test.describe('Step 1: Nickname Input', () => {
    test('should display nickname input page on load', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByRole('heading', { name: 'Tech Villain' })).toBeVisible();
      await expect(page.getByText('기술 면접, AI한테 먼저 털리고 가라')).toBeVisible();
      await expect(page.getByRole('textbox', { name: '닉네임 (2자 이상)' })).toBeVisible();
      await expect(page.getByRole('button', { name: '다음' })).toBeDisabled();
    });

    test('should keep next button disabled when nickname is less than 2 characters', async ({
      page,
    }) => {
      await page.goto('/');

      await page.getByRole('textbox', { name: '닉네임 (2자 이상)' }).fill('김');
      await expect(page.getByRole('button', { name: '다음' })).toBeDisabled();
    });

    test('should enable next button when nickname is 2 or more characters', async ({ page }) => {
      await page.goto('/');

      await page.getByRole('textbox', { name: '닉네임 (2자 이상)' }).fill('테스터');
      await expect(page.getByRole('button', { name: '다음' })).toBeEnabled();
    });

    test('should proceed to tech stack selection after entering nickname', async ({ page }) => {
      await page.goto('/');

      await page.getByRole('textbox', { name: '닉네임 (2자 이상)' }).fill('테스터');
      await page.getByRole('button', { name: '다음' }).click();

      await expect(page.getByText('방어할 기술 스택', { exact: true })).toBeVisible();
    });
  });

  test.describe('Step 2: Tech Stack Selection', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByRole('textbox', { name: '닉네임 (2자 이상)' }).fill('테스터');
      await page.getByRole('button', { name: '다음' }).click();
    });

    test('should display tech stack selection page', async ({ page }) => {
      await expect(page.getByText('방어할 기술 스택', { exact: true })).toBeVisible();
      await expect(page.getByText('기술 스택 선택 (최대 3개)')).toBeVisible();
      await expect(page.getByRole('button', { name: '다음' })).toBeDisabled();
    });

    test('should allow selecting a tech stack', async ({ page }) => {
      await page.getByText('기술 스택 선택 (최대 3개)').click();
      await page.getByRole('option', { name: 'React frontend' }).click();

      await expect(page.getByText('1개 선택됨')).toBeVisible();
      await expect(page.getByRole('button', { name: '다음' })).toBeEnabled();
    });

    test('should allow going back to nickname input', async ({ page }) => {
      await page.getByRole('button', { name: '이전' }).click();
      await expect(page.getByText('닉네임 입력')).toBeVisible();
    });

    test('should proceed to additional info after selecting tech stack', async ({ page }) => {
      await page.getByText('기술 스택 선택 (최대 3개)').click();
      await page.getByRole('option', { name: 'React frontend' }).click();
      await page.getByRole('button', { name: '다음' }).click();

      await expect(page.getByText('추가 정보 (선택)')).toBeVisible();
    });
  });

  test.describe('Step 3: Additional Info', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByRole('textbox', { name: '닉네임 (2자 이상)' }).fill('테스터');
      await page.getByRole('button', { name: '다음' }).click();
      await page.getByText('기술 스택 선택 (최대 3개)').click();
      await page.getByRole('option', { name: 'React frontend' }).click();
      await page.getByRole('button', { name: '다음' }).click();
    });

    test('should display additional info page', async ({ page }) => {
      await expect(page.getByText('추가 정보 (선택)')).toBeVisible();
      await expect(page.getByRole('button', { name: '건너뛰기' })).toBeVisible();
    });

    test('should allow skipping additional info', async ({ page }) => {
      await page.getByRole('button', { name: '건너뛰기' }).click();
      await expect(page.getByText('상대 선택')).toBeVisible();
    });
  });

  test.describe('Step 4: Opponent Selection', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByRole('textbox', { name: '닉네임 (2자 이상)' }).fill('테스터');
      await page.getByRole('button', { name: '다음' }).click();
      await page.getByText('기술 스택 선택 (최대 3개)').click();
      await page.getByRole('option', { name: 'React frontend' }).click();
      await page.getByRole('button', { name: '다음' }).click();
      await page.getByRole('button', { name: '건너뛰기' }).click();
    });

    test('should display opponent selection page with 3 options', async ({ page }) => {
      await expect(page.getByText('상대 선택')).toBeVisible();
      await expect(page.getByText('저승사자 CTO').first()).toBeVisible();
      await expect(page.getByText('창업병 대표').first()).toBeVisible();
      await expect(page.getByText('힙스터 주니어').first()).toBeVisible();
    });

    test('should have difficulty indicators', async ({ page }) => {
      await expect(page.getByText('HARD')).toBeVisible();
      await expect(page.getByText('MEDIUM')).toBeVisible();
      await expect(page.getByText('EASY')).toBeVisible();
    });

    test('should start debate when clicking "토론 시작" button', async ({ page }) => {
      await page.getByRole('button', { name: '토론 시작' }).click();

      await expect(page).toHaveURL('/debate');
      await expect(page.getByText('0/10 턴')).toBeVisible();
    });
  });

  test.describe('Debate Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByRole('textbox', { name: '닉네임 (2자 이상)' }).fill('테스터');
      await page.getByRole('button', { name: '다음' }).click();
      await page.getByText('기술 스택 선택 (최대 3개)').click();
      await page.getByRole('option', { name: 'React frontend' }).click();
      await page.getByRole('button', { name: '다음' }).click();
      await page.getByRole('button', { name: '건너뛰기' }).click();
      await page.getByRole('button', { name: '토론 시작' }).click();
    });

    test('should display debate page with CTO initial message', async ({ page }) => {
      await expect(page).toHaveURL('/debate');
      await expect(page.getByText('저승사자 CTO').first()).toBeVisible();
      await expect(page.getByPlaceholder('답변을 입력하세요...')).toBeVisible();
      await expect(page.getByRole('button', { name: 'GG (항복)' })).toBeVisible();
    });

    test('should allow submitting a response', async ({ page }) => {
      const responseInput = page.getByPlaceholder('답변을 입력하세요...');
      await responseInput.fill('React를 선택한 이유는 생태계가 크고 팀원들이 익숙하기 때문입니다.');

      // Find and click the submit button (the button next to the textbox)
      await page.locator('main').getByRole('button').filter({ hasNotText: 'GG' }).click();

      // Wait for turn counter to update
      await expect(page.getByText('1/10 턴')).toBeVisible({ timeout: 30000 });
    });

    test('should navigate to result page when clicking GG button', async ({ page }) => {
      await page.getByRole('button', { name: 'GG (항복)' }).click();

      await expect(page).toHaveURL(/\/result/);
      await expect(page.getByText('토론 결과')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Result Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByRole('textbox', { name: '닉네임 (2자 이상)' }).fill('테스터');
      await page.getByRole('button', { name: '다음' }).click();
      await page.getByText('기술 스택 선택 (최대 3개)').click();
      await page.getByRole('option', { name: 'React frontend' }).click();
      await page.getByRole('button', { name: '다음' }).click();
      await page.getByRole('button', { name: '건너뛰기' }).click();
      await page.getByRole('button', { name: '토론 시작' }).click();
      await page.getByRole('button', { name: 'GG (항복)' }).click();
      // Wait for result page to fully load with scores
      await expect(page.getByText('토론 결과')).toBeVisible({ timeout: 15000 });
      await expect(page.getByRole('button', { name: '다시 도전하기' })).toBeVisible({ timeout: 15000 });
    });

    test('should display result page with scores', async ({ page }) => {
      await expect(page.getByText('토론 결과')).toBeVisible();
      await expect(page.getByText('논리력').first()).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('깊이').first()).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('태도').first()).toBeVisible({ timeout: 10000 });
    });

    test('should have share buttons', async ({ page }) => {
      await expect(page.getByRole('button', { name: '링크 복사' })).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('button', { name: '트위터' })).toBeVisible({ timeout: 10000 });
    });

    test('should have retry button', async ({ page }) => {
      await expect(page.getByRole('button', { name: '다시 도전하기' })).toBeVisible({ timeout: 10000 });
    });

    test('should navigate back to home when clicking retry button', async ({ page }) => {
      await page.getByRole('button', { name: '다시 도전하기' }).click();
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Full User Flow', () => {
    test('should complete full flow from nickname to result', async ({ page }) => {
      // Step 1: Enter nickname
      await page.goto('/');
      await page.getByRole('textbox', { name: '닉네임 (2자 이상)' }).fill('E2E테스터');
      await page.getByRole('button', { name: '다음' }).click();

      // Step 2: Select tech stack
      await page.getByText('기술 스택 선택 (최대 3개)').click();
      await page.getByRole('option', { name: 'TypeScript language' }).click();
      await page.getByRole('button', { name: '다음' }).click();

      // Step 3: Skip additional info
      await page.getByRole('button', { name: '건너뛰기' }).click();

      // Step 4: Select opponent and start debate
      await expect(page.getByText('상대 선택')).toBeVisible();
      await page.getByRole('button', { name: '토론 시작' }).click();

      // Debate page
      await expect(page).toHaveURL('/debate');
      await expect(page.getByText('0/10 턴')).toBeVisible();

      // Submit a response
      await page
        .getByRole('textbox', { name: '답변을 입력하세요' })
        .fill('TypeScript는 정적 타입 검사를 통해 런타임 에러를 줄여줍니다.');
      await page.locator('main').getByRole('button').filter({ hasNotText: 'GG' }).click();

      // Wait for AI response
      await expect(page.getByText('1/10 턴')).toBeVisible({ timeout: 30000 });

      // Surrender
      await page.getByRole('button', { name: 'GG (항복)' }).click();

      // Verify result page
      await expect(page).toHaveURL(/\/result/);
      await expect(page.getByText('토론 결과')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('E2E테스터')).toBeVisible();
    });
  });
});
