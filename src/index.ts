#!/usr/local/bin/node

import { Command } from 'commander'
import {
  checkUpdateLinkFormat,
  checkUpdateLinkValidity,
  checkVersion,
  readJsonFile,
} from './libs'

process.on('unhandledRejection', (reason) => {
  let message = ''
  if (reason === null || reason === undefined) {
    message = 'unhandledRejection with null or undefined.'
  } else if (reason instanceof Error && reason.stack !== undefined) {
    message = reason.stack
  } else {
    message = JSON.stringify(reason)
  }

  throw new Error(message)
})

const program = new Command()

program
  .command('checkVersion')
  .description(
    'Make sure the latest version of manifest.json and updates.json match.'
  )
  .requiredOption(
    '--manifestFilePath <manifestFilePath>',
    'Path of manifest.json.'
  )
  .requiredOption(
    '--updatesFilePath <updatesFilePath>',
    'Path of updates.json.'
  )
  .requiredOption('--addonUUID <addonUUID>', 'UUID of addon.')
  .action(async ({ manifestFilePath, updatesFilePath, addonUUID }) => {
    const manifestJson = await readJsonFile(manifestFilePath)
    const updatesJson = await readJsonFile(updatesFilePath)
    checkVersion(manifestJson, updatesJson, addonUUID)
  })

program
  .command('checkUpdateLinkFormat')
  .description(
    'Make sure that the update_link in updates.json is in the specified format.'
  )
  .requiredOption(
    '--updatesFilePath <updatesFilePath>',
    'Path of updates.json.'
  )
  .requiredOption('--addonUUID <addonUUID>', 'UUID of addon.')
  .requiredOption(
    '--format <format>',
    'Url format like http://example.com/file/download/[version]/sample.zip'
  )
  .action(async ({ updatesFilePath, addonUUID, format }) => {
    const updatesJson = await readJsonFile(updatesFilePath)
    checkUpdateLinkFormat(updatesJson, addonUUID, format)
  })

program
  .command('checkUpdateLinkValidity')
  .description(
    'Make sure the file exists in the update_link of newest version in updates.json.'
  )
  .requiredOption(
    '--updatesFilePath <updatesFilePath>',
    'Path of updates.json.'
  )
  .requiredOption('--addonUUID <addonUUID>', 'UUID of addon.')
  .action(async ({ updatesFilePath, addonUUID }) => {
    const updatesJson = await readJsonFile(updatesFilePath)
    await checkUpdateLinkValidity(updatesJson, addonUUID)
  })

program.parse(process.argv)
