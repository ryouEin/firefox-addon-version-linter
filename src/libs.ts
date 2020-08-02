import axios from 'axios'
import { readJSON } from 'fs-extra'
import semver from 'semver'

type AddonUUID = string

interface Update {
  version: string
  // eslint-disable-next-line camelcase
  update_link: string
}

interface AddonInfo {
  updates: Update[]
}

interface UpdatesJson {
  addons: { [key: string]: AddonInfo }
}

interface ManifestJson {
  version: string
}

const checkUrlFormatValidity: (
  url: string,
  format: string,
  version: string
) => boolean = (url, format, version) => {
  const correctUrl = format.replace('[version]', version)
  return url === correctUrl
}

const checkUrlValidity: (url: string) => Promise<boolean> = async (url) => {
  const { status } = await axios.get(url)
  return status === 200
}

const getAddonInfoFromUpdatesJson: (
  updatesJson: UpdatesJson,
  addonUUID: AddonUUID
) => AddonInfo = (updatesJson, addonUUID) => {
  const addonInfo = updatesJson.addons[addonUUID]
  if (addonInfo === undefined) {
    throw new Error('addonUUID is invalid.')
  }

  return addonInfo
}

const getNewestUpdateFromAddonInfo: (addonInfo: AddonInfo) => Update = (
  addonInfo
) => {
  if (addonInfo.updates.length <= 0) {
    throw new Error('No update info found.')
  }

  const sortedUpdates = [...addonInfo.updates].sort((a, b) => {
    return semver.gt(a.version, b.version) ? -1 : 1
  })

  return sortedUpdates[0]
}

export const readJsonFile: (path: string) => Promise<any> = (path) => {
  return readJSON(path)
}

export const checkVersion: (
  manifestJson: ManifestJson,
  updatesJson: UpdatesJson,
  addonUUID: AddonUUID
) => void = (manifestJson, updatesJson, addonUUID) => {
  const addonInfo = getAddonInfoFromUpdatesJson(updatesJson, addonUUID)
  const newestUpdate = getNewestUpdateFromAddonInfo(addonInfo)
  if (manifestJson.version !== newestUpdate.version) {
    throw new Error('version is not match.')
  }
}

export const checkUpdateLinkFormat: (
  updatesJson: UpdatesJson,
  addonUUID: AddonUUID,
  format: string
) => void = (updatesJson, addonUUID, format) => {
  const { updates } = getAddonInfoFromUpdatesJson(updatesJson, addonUUID)
  for (const update of updates) {
    const isValid = checkUrlFormatValidity(
      update.update_link,
      format,
      update.version
    )
    if (!isValid) {
      throw new Error(`url format is invalid in version ${update.version}.`)
    }
  }
}

export const checkUpdateLinkValidity: (
  updatesJson: UpdatesJson,
  addonUUID: AddonUUID
) => Promise<void> = async (updatesJson, addonUUID) => {
  const addonInfo = getAddonInfoFromUpdatesJson(updatesJson, addonUUID)
  const newestUpdate = getNewestUpdateFromAddonInfo(addonInfo)
  const isValid = await checkUrlValidity(newestUpdate.update_link)
  if (!isValid) {
    throw new Error('update_link is invalid.')
  }
}
