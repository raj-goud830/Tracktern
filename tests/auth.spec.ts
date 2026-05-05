import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display the login page correctly', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Next.js will redirect to /sign-in because of Clerk middleware
    // We expect the URL to contain sign-in
    await expect(page).toHaveURL(/.*sign-in.*/);

    // Check if the Clerk Sign In box is visible
    // Clerk usually renders a card with the text "Sign in"
    const signInHeading = page.getByRole('heading', { name: /Sign in/i });
    await expect(signInHeading).toBeVisible({ timeout: 10000 });
  });

  test('should display the sign up page correctly', async ({ page }) => {
    await page.goto('/sign-up');
    await expect(page).toHaveURL(/.*sign-up.*/);
    
    const signUpHeading = page.getByRole('heading', { name: /Create your account/i });
    await expect(signUpHeading).toBeVisible({ timeout: 10000 });
  });
});
