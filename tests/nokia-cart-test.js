const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

(async function nokiaCartTest() {
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options())
        .build();
    
    const wait = driver.wait.bind(driver);
    const timeout = 5000;

    try {
        // Step 1: Navigate to website
        console.log('Navigating to website...');
        await driver.get('https://www.demoblaze.com/');
        
        await wait(until.titleContains('STORE'), timeout, 'Main page did not load correctly');
        console.log('Main page loaded successfully');
        
        // Step 2: Navigate to phones category
        console.log('Navigating to phones category...');
        const phoneCategory = await wait(until.elementLocated(By.linkText('Phones')), timeout, 
            'Phones category link not found');
        await wait(until.elementIsVisible(phoneCategory), timeout, 'Phones category link not visible');
        await phoneCategory.click();
        
        await wait(until.elementLocated(By.xpath("//h4[@class='card-title']/a")), timeout,
            'No products found in Phones category');
        console.log('Phones category loaded successfully');
        
        // Step 3: Find and click on Nokia lumia 1520
        console.log('Looking for Nokia Lumia 1520...');
        const nokiaLink = await wait(
            until.elementLocated(By.xpath("//a[contains(text(), 'Nokia lumia 1520')]")), 
            timeout, 'Nokia Lumia 1520 not found in the list'
        );
        await wait(until.elementIsVisible(nokiaLink), timeout, 'Nokia Lumia 1520 link not visible');
        await nokiaLink.click();
        
        const productTitle = await wait(
            until.elementLocated(By.xpath("//h2[contains(text(), 'Nokia lumia 1520')]")),
            timeout, 'Nokia Lumia 1520 product page did not load'
        );
        const productTitleText = await productTitle.getText();
        assert.strictEqual(productTitleText, 'Nokia lumia 1520', 'Product title does not match Nokia lumia 1520');
        console.log('Nokia Lumia 1520 product page loaded successfully');
        
        // Step 4: Add to cart
        console.log('Adding to cart...');
        const addToCartButton = await wait(
            until.elementLocated(By.xpath("//a[contains(text(), 'Add to cart')]")), 
            timeout, 'Add to cart button not found'
        );
        await wait(until.elementIsVisible(addToCartButton), timeout, 'Add to cart button not visible');
        await addToCartButton.click();
        
        // Step 5: Verify confirmation message
        console.log('Verifying confirmation message...');
        await wait(until.alertIsPresent(), timeout, 'Confirmation alert did not appear');
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        
        assert.strictEqual(alertText, 'Product added', 'Confirmation message is not "Product added"');
        console.log('Test successful! "Product added" message was displayed');
        
        await alert.accept();
        
    } catch (error) {
        console.error('Test error:', error);
        throw error;
    } finally {
        await driver.quit();
        console.log('Test completed');
    }
})();
