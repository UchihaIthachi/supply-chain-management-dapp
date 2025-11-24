from playwright.sync_api import Page, expect, sync_playwright

def verify_app_load(page: Page):
    # 1. Arrange: Go to the app homepage.
    page.goto("http://localhost:3000")

    # 2. Assert: Check if the title contains expected text.
    # Adjust this based on the actual title or content of the app.
    # For now, I'll check if the page loads and has some content.
    expect(page.locator("body")).to_be_visible()

    # 3. Screenshot: Capture the loaded page.
    page.screenshot(path="/home/jules/verification/app_load.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_app_load(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
