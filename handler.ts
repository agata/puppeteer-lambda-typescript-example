import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import * as chromium from 'chrome-aws-lambda';

import { Browser } from 'puppeteer';

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const { url } = event.queryStringParameters;
  let browser: Browser = null;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.goto(url);
    const title = await page.title();
    return {
      statusCode: 200,
      body: JSON.stringify({
        title,
        url,
      }, null, 2),
    };
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
