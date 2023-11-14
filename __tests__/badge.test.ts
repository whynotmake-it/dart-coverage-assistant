import { buildBadgeUrl, buildSvg } from '../src/badge'

describe('buildSvg', () => {
  it('should return a valid svg', async () => {
    const name = 'coverage'
    const upper = 90
    const lower = 70
    const percentage = 80.5

    const result = await buildSvg(name, upper, lower, percentage)
    const expected =
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="114" height="20" role="img" aria-label="coverage: 80.50%"><title>coverage: 80.50%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="114" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="61" height="20" fill="#555"/><rect x="61" width="53" height="20" fill="#fe7d37"/><rect width="114" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="315" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="510">coverage</text><text x="315" y="140" transform="scale(.1)" fill="#fff" textLength="510">coverage</text><text aria-hidden="true" x="865" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="430">80.50%</text><text x="865" y="140" transform="scale(.1)" fill="#fff" textLength="430">80.50%</text></g></svg>'
    expect(result).toEqual(expected)
  })
})

describe('buildBadgeUrl', () => {
  it('should return a success badge URL when percentage is greater than or equal to upper', () => {
    const name = 'coverage'
    const upper = 90
    const lower = 70
    const percentage = 95.5

    const expectedUrl = `http://img.shields.io/badge/coverage-95.50%25-success`
    const actualUrl = buildBadgeUrl(name, upper, lower, percentage)

    expect(actualUrl).toEqual(expectedUrl)
  })

  it('should return an important badge URL when percentage is greater than or equal to lower but less than upper', () => {
    const name = 'coverage'
    const upper = 90
    const lower = 70
    const percentage = 75.5

    const expectedUrl = `http://img.shields.io/badge/coverage-75.50%25-important`
    const actualUrl = buildBadgeUrl(name, upper, lower, percentage)

    expect(actualUrl).toEqual(expectedUrl)
  })

  it('should return a critical badge URL when percentage is less than lower', () => {
    const name = 'coverage'
    const upper = 90
    const lower = 70
    const percentage = 50.5

    const expectedUrl = `http://img.shields.io/badge/coverage-50.50%25-critical`
    const actualUrl = buildBadgeUrl(name, upper, lower, percentage)

    expect(actualUrl).toEqual(expectedUrl)
  })

  it('should return a badge URL without name when name is undefined', () => {
    const name = undefined
    const upper = 90
    const lower = 70
    const percentage = 80.5

    const expectedUrl = `http://img.shields.io/badge/80.50%25-important`
    const actualUrl = buildBadgeUrl(name, upper, lower, percentage)

    expect(actualUrl).toEqual(expectedUrl)
  })
})
