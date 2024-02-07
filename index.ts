import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
  headless: false,
  args: ['--window-size=1920,1080'],
  defaultViewport: {
    width: 1920,
    height: 1080
  }
})
const page = await browser.newPage()

await page.goto('https://www.ikea.com/se/sv/cat/plantor-blommor-pp003/', {
  waitUntil: 'networkidle2'
})

const links = await page.evaluate(() =>
  Array.from(document.querySelectorAll('a.plp-product__image-link.link')).map((e) => (e as HTMLAnchorElement).href)
)

console.log(links)

const articleNumbers: Record<string, string> = {}

for (const link of links) {
  await page.goto(link, {
    waitUntil: 'networkidle2'
  })
  const articleNumber = await page.evaluate(
    () => document.querySelector('span[class="pip-product-identifier__value"]')?.textContent
  )

  if (articleNumber !== null && articleNumber !== undefined) {
    articleNumbers[link] = articleNumber
  }
}

console.log(articleNumbers)

await browser.close()
