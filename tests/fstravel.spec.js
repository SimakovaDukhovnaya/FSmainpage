const { test, expect } = require('@playwright/test');
const { sendBandAlert } = require('../utils/band-notify');
const { validateMainPage } = require('../utils/validate-main-page');

const ALERT_MESSAGE = 'Главная fstravel.com недоступна';
const SUCCESS_MESSAGE = 'Главная страница доступна. Можно начинать проверки';

test('главная страница выглядит корректно', async ({ page }) => {
  const isValid = await validateMainPage(page);

  if (!isValid) {
    const sent = await sendBandAlert(ALERT_MESSAGE);
    expect(sent, 'Не удалось отправить алерт в WB Band').toBe(true);
    return;
  }

  const sent = await sendBandAlert(SUCCESS_MESSAGE);
  expect(sent, 'Не удалось отправить сообщение в WB Band').toBe(true);
});
