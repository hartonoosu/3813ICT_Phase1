import { browser, element, by } from 'protractor';

describe('Chat Application', () => {
  it('should navigate to chat page', async () => {
    await browser.get('/chat');
    expect(await element(by.css('app-chat')).isPresent()).toBe(true);
  });

  it('should send a message', async () => {
    await element(by.css('input[type="text"]')).sendKeys('Hello');
    await element(by.buttonText('Send')).click();
    const message = await element(by.css('.message:last-child')).getText();
    expect(message).toContain('Hello');
  });
});
