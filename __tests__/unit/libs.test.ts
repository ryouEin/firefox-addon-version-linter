import { checkUpdateLinkFormat, checkVersion } from '../../src/libs'

describe('checkVersion', () => {
  test('updates.jsonの最新版のversionとmanifest.jsonのversionを比較して、一致しなかった場合例外を吐く', () => {
    const manifestJson = {
      version: '1.0.0',
    }
    const updatesJson = {
      addons: {
        '{1234-5678-9}': {
          updates: [
            {
              version: '0.1.0',
              update_link: 'https://example.com/hogehoge/0.1.0/application.zip',
            },
            {
              version: '1.0.1',
              update_link: 'https://example.com/hogehoge/1.0.1/application.zip',
            },
            {
              version: '1.0.0',
              update_link: 'https://example.com/hogehoge/1.0.0/application.zip',
            },
          ],
        },
      },
    }

    expect(() => {
      checkVersion(manifestJson, updatesJson, '{1234-5678-9}')
    }).toThrow()
  })

  test('updates.jsonの最新版のversionとmanifest.jsonのversionを比較して、一致する場合例外を吐かない', () => {
    const manifestJson = {
      version: '1.0.0',
    }
    const updatesJson = {
      addons: {
        '{1234-5678-9}': {
          updates: [
            {
              version: '0.1.0',
              update_link: 'https://example.com/hogehoge/0.1.0/application.zip',
            },
            {
              version: '1.0.0',
              update_link: 'https://example.com/hogehoge/1.0.0/application.zip',
            },
          ],
        },
      },
    }

    expect(() => {
      checkVersion(manifestJson, updatesJson, '{1234-5678-9}')
    }).not.toThrow()
  })
})

describe('checkUpdateLinkFormat', () => {
  test('updatesJsonのupdates内のupdate_linkが指定された形式通りでなければ例外を吐く', () => {
    const updatesJson = {
      addons: {
        '{1234-5678-9}': {
          updates: [
            {
              version: '0.1.0',
              update_link: 'https://example.com/hogehoge/0.1.0/application.zip',
            },
            {
              version: '1.0.1',
              update_link: 'https://example.com/hogehoge/1.1.1/application.zip',
            },
            {
              version: '1.0.0',
              update_link: 'https://example.com/hogehoge/1.0.0/application.zip',
            },
          ],
        },
      },
    }

    expect(() => {
      checkUpdateLinkFormat(
        updatesJson,
        '{1234-5678-9}',
        'https://example.com/hogehoge/[version]/application.zip'
      )
    }).toThrow()
  })

  test('updatesJsonのupdates内のupdate_linkが指定された形式通りなら例外を吐かない', () => {
    const updatesJson = {
      addons: {
        '{1234-5678-9}': {
          updates: [
            {
              version: '0.1.0',
              update_link: 'https://example.com/hogehoge/0.1.0/application.zip',
            },
            {
              version: '1.0.1',
              update_link: 'https://example.com/hogehoge/1.0.1/application.zip',
            },
            {
              version: '1.0.0',
              update_link: 'https://example.com/hogehoge/1.0.0/application.zip',
            },
          ],
        },
      },
    }

    expect(() => {
      checkUpdateLinkFormat(
        updatesJson,
        '{1234-5678-9}',
        'https://example.com/hogehoge/[version]/application.zip'
      )
    }).not.toThrow()
  })
})
