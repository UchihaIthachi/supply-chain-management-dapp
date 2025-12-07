from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        # Launch browser in headless mode
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # Navigate to the app (assuming localhost:3000)
            print("Navigating to http://localhost:3000...")
            page.goto("http://localhost:3000")
            
            # Wait for hydration
            page.wait_for_timeout(2000)

            print("Clicking 'Connect Wallet'...")
            # Click the connect wallet button
            # Use a robust selector - matching the button text and class if needed to distinguish desktop/mobile
            # But "Connect Wallet" text should be unique enough or we can use get_by_role
            connect_btn = page.get_by_role("button", name="Connect Wallet").first
            if connect_btn.is_visible():
                connect_btn.click()
            else:
                print("Connect Wallet button not found or not visible.")
                # fallback to text selector
                page.click("text=Connect Wallet")
            
            # Wait for modal to appear
            page.wait_for_timeout(1000)
            
            # Check for Modal content
            # The modal has title "Wallet Connection" and text "MetaMask Not Found"
            
            print("Checking for modal...")
            modal_visible = page.get_by_text("MetaMask Not Found").is_visible()
            
            if modal_visible:
                print("SUCCESS: 'MetaMask Not Found' modal appeared.")
            else:
                print("FAILURE: Modal did NOT appear.")
                # print page content for debug
                # print(page.content())

            # Take screenshot
            screenshot_path = "verification/wallet_modal_check_final.png"
            page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")
            
        except Exception as e:
            print(f"Error occurred: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
