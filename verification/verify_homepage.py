from playwright.sync_api import Page, expect, sync_playwright

def test_homepage_loads(page: Page):
    # 1. Arrange: Go to the local app.
    page.goto("http://localhost:3000")

    # 2. Act: Wait for some content to load.
    # We expect the NavBar to be present and "Pull Stackers Logo" alt text or "Connect Wallet" button.
    # Also "Create Tracking" heading.
    
    expect(page.get_by_text("Create Tracking")).to_be_visible()
    expect(page.get_by_text("Connect Wallet")).to_be_visible()

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="verification/homepage.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_homepage_loads(page)
            print("Screenshot taken successfully.")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
