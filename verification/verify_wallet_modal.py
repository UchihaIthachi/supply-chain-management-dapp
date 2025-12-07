from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Assuming the server is running on localhost:3000
        page.goto("http://localhost:3000")
        
        # Wait for hydration
        time.sleep(2)

        print("Clicking 'Connect Wallet'...")
        # Click the connect wallet button
        # There might be two (desktop and mobile), target the visible one or desktop one
        page.click("button:has-text('Connect Wallet')")
        
        time.sleep(1)
        
        # Check for Modal
        # We look for text "Install MetaMask" or similar which indicates the modal is present
        modal_visible = page.is_visible("text=Install MetaMask")
        
        if modal_visible:
            print("SUCCESS: 'Install MetaMask' modal appeared.")
        else:
            print("FAILURE: 'Install MetaMask' modal did NOT appear.")

        page.screenshot(path="verification/wallet_modal_check.png")
        browser.close()

if __name__ == "__main__":
    run()
