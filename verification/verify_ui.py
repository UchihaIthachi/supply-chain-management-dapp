from playwright.sync_api import sync_playwright

def verify_ui_improvements():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Navigate to home
        page.goto("http://localhost:3001")
        
        # Verify title or main element to ensure load
        page.wait_for_selector("text=SupplyChain")
        
        # Take a screenshot of the main page (Services, Table)
        page.screenshot(path="verification/main_page.png", full_page=True)
        
        # Click on "Start a Shipment" to see the modal
        # Using the text from the Service card title
        page.click("text=Start a Shipment")
        page.wait_for_timeout(1000) # wait for animation
        page.screenshot(path="verification/start_modal.png")
        
        # Close modal
        page.click("button:has-text('Cancel')")
        page.wait_for_timeout(500)

        # Click on "Get Shipment Details"
        page.click("text=Get Shipment Details")
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/get_modal.png")

        browser.close()

if __name__ == "__main__":
    try:
        verify_ui_improvements()
        print("Verification script ran successfully.")
    except Exception as e:
        print(f"Verification script failed: {e}")
