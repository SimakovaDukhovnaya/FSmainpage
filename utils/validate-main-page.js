async function isVisible(locator) {
  try {
    return await locator.isVisible();
  } catch {
    return false;
  }
}

async function validateMainPage(page) {
  const response = await page
    .goto('https://fstravel.com', { waitUntil: 'domcontentloaded', timeout: 60000 })
    .catch(() => null);

  if (!response || response.status() !== 200) {
    return false;
  }

  const header = page.locator('header');
  const searchWidget = page.locator('form').first();

  const checks = [
    isVisible(header),
    isVisible(header.getByText('Горящие туры')),
    isVisible(header.getByText('Акции').first()),
    isVisible(header.getByText('О компании')),
    isVisible(header.getByText('Офисы продаж')),
    isVisible(header.getByText('8 800 775 775 8')),
    isVisible(header.getByRole('button', { name: 'Подобрать тур' })),
    isVisible(
      page.getByRole('heading', { name: 'Умный выбор для яркого отдыха' }),
    ),
    isVisible(searchWidget),
    isVisible(page.getByText('Откуда', { exact: true }).first()),
    isVisible(page.getByText('Куда', { exact: true }).first()),
    isVisible(page.getByText('Дата вылета')),
    isVisible(page.getByText('Длительность')),
    isVisible(page.getByText('Кто едет')),
    isVisible(
      page
        .getByRole('button', { name: /Найти/i })
        .or(page.getByText('Найти', { exact: true })),
    ),
    isVisible(page.getByRole('heading', { name: 'Акции' })),
    ...['Туры', 'Отели', 'Авиа', 'Круизы', 'Экскурсионные туры'].map((tab) =>
      isVisible(searchWidget.getByText(tab, { exact: true })),
    ),
  ];

  const results = await Promise.all(checks);
  return results.every(Boolean);
}

module.exports = { validateMainPage };
