#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const libs_1 = require("./libs");
process.on('unhandledRejection', (reason) => {
    let message = '';
    if (reason === null || reason === undefined) {
        message = 'unhandledRejection with null or undefined.';
    }
    else if (reason instanceof Error && reason.stack !== undefined) {
        message = reason.stack;
    }
    else {
        message = JSON.stringify(reason);
    }
    throw new Error(message);
});
const program = new commander_1.Command();
program
    .command('checkVersion')
    .description('Make sure the latest version of manifest.json and updates.json match.')
    .requiredOption('--manifestFilePath <manifestFilePath>', 'Path of manifest.json.')
    .requiredOption('--updatesFilePath <updatesFilePath>', 'Path of updates.json.')
    .requiredOption('--addonUUID <addonUUID>', 'UUID of addon.')
    .action(({ manifestFilePath, updatesFilePath, addonUUID }) => __awaiter(void 0, void 0, void 0, function* () {
    const manifestJson = yield libs_1.readJsonFile(manifestFilePath);
    const updatesJson = yield libs_1.readJsonFile(updatesFilePath);
    libs_1.checkVersion(manifestJson, updatesJson, addonUUID);
}));
program
    .command('checkUpdateLinkFormat')
    .description('Make sure that the update_link in updates.json is in the specified format.')
    .requiredOption('--updatesFilePath <updatesFilePath>', 'Path of updates.json.')
    .requiredOption('--addonUUID <addonUUID>', 'UUID of addon.')
    .requiredOption('--format <format>', 'Url format like http://example.com/file/download/[version]/sample.zip')
    .action(({ updatesFilePath, addonUUID, format }) => __awaiter(void 0, void 0, void 0, function* () {
    const updatesJson = yield libs_1.readJsonFile(updatesFilePath);
    libs_1.checkUpdateLinkFormat(updatesJson, addonUUID, format);
}));
program
    .command('checkUpdateLinkValidity')
    .description('Make sure the file exists in the update_link of newest version in updates.json.')
    .requiredOption('--updatesFilePath <updatesFilePath>', 'Path of updates.json.')
    .requiredOption('--addonUUID <addonUUID>', 'UUID of addon.')
    .action(({ updatesFilePath, addonUUID }) => __awaiter(void 0, void 0, void 0, function* () {
    const updatesJson = yield libs_1.readJsonFile(updatesFilePath);
    yield libs_1.checkUpdateLinkValidity(updatesJson, addonUUID);
}));
program.parse(process.argv);
