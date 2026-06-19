const BAND_WEBHOOK_URL =
  process.env.BAND_WEBHOOK_URL ||
  'https://band.wb.ru/hooks/p8ujjo7kf3yf3dm715knnd751r';

const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 30000;

async function sendBandAlert(message) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(BAND_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (response.ok) {
        console.log(`Band alert sent: "${message}"`);
        return true;
      }

      console.error(
        `Band webhook attempt ${attempt}/${MAX_ATTEMPTS} failed: ${response.status} ${response.statusText}`,
      );
    } catch (error) {
      console.error(
        `Band webhook attempt ${attempt}/${MAX_ATTEMPTS} failed:`,
        error.message,
      );
    }

    if (attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    }
  }

  console.error(`Band alert was NOT delivered: "${message}"`);
  return false;
}

module.exports = { sendBandAlert };
