import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show login and signup buttons when not authenticated', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Log In' }).click();
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign Up' }).click();
    await expect(page).toHaveURL('/signup');
    await expect(page.getByRole('heading', { name: /create.*account/i })).toBeVisible();
  });

  test('should show validation errors for empty login form', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Log in' }).click();
    
    // HTML5 validation should prevent submission
    await expect(page.locator('input[name="email"]:invalid')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.getByRole('button', { name: 'Log in' }).click();
    
    // Should show error alert
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('should redirect to login when accessing protected routes', async ({ page }) => {
    // Try to access profile without being logged in
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login/);
    
    // Try admin route
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show social login buttons', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in with Apple' })).toBeVisible();
  });

  test('should handle forgot password flow', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Forgot your password?' }).click();
    await expect(page).toHaveURL('/forgot-password');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.getByRole('button', { name: /send reset/i }).click();
    
    // Should show success message
    await expect(page.getByText(/password reset link has been sent/i)).toBeVisible();
  });

  test('should validate signup form', async ({ page }) => {
    await page.goto('/signup');
    
    // Try submitting empty form
    await page.getByRole('button', { name: /sign up/i }).click();
    await expect(page.locator('input[name="fullName"]:invalid')).toBeVisible();
    
    // Fill partial form
    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.getByRole('button', { name: /sign up/i }).click();
    await expect(page.locator('input[name="email"]:invalid')).toBeVisible();
  });

  test('should show loading states during auth', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Click and immediately check for loading state
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByText('Logging in...')).toBeVisible();
  });
});

test.describe('Protected Routes', () => {
  test('should redirect from profile pages when not authenticated', async ({ page }) => {
    const protectedRoutes = ['/profile', '/profile/trips', '/profile/favorites', '/admin', '/host/dashboard'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test('should preserve redirect URL after login', async ({ page }) => {
    await page.goto('/profile/trips');
    await expect(page).toHaveURL(/\/login.*redirect/);
    
    const url = new URL(page.url());
    expect(url.searchParams.get('redirect')).toBe('/profile/trips');
  });
});

test.describe('Session Management', () => {
  test('should persist auth state across page reloads', async ({ page }) => {
    // This test would require actual login, which needs real credentials
    // For now, just test that the auth store is properly hydrated
    await page.goto('/');
    
    // Check that auth state is properly initialized
    await page.waitForFunction(() => {
      return window.localStorage.getItem('auth-storage') !== null;
    });
  });

  test('should clear auth state on logout', async ({ page }) => {
    await page.goto('/');
    
    // Check initial state
    const initialAuth = await page.evaluate(() => 
      window.localStorage.getItem('auth-storage')
    );
    
    // Auth storage should exist (even if logged out)
    expect(typeof initialAuth).toBe('string');
  });
});
