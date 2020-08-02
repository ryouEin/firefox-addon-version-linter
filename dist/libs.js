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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs_extra_1 = require("fs-extra");
const semver_1 = __importDefault(require("semver"));
const checkUrlFormatValidity = (url, format, version) => {
    const correctUrl = format.replace('[version]', version);
    return url === correctUrl;
};
const checkUrlValidity = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = yield axios_1.default.get(url);
    return status === 200;
});
const getAddonInfoFromUpdatesJson = (updatesJson, addonUUID) => {
    const addonInfo = updatesJson.addons[addonUUID];
    if (addonInfo === undefined) {
        throw new Error('addonUUID is invalid.');
    }
    return addonInfo;
};
const getNewestUpdateFromAddonInfo = (addonInfo) => {
    if (addonInfo.updates.length <= 0) {
        throw new Error('No update info found.');
    }
    const sortedUpdates = [...addonInfo.updates].sort((a, b) => {
        return semver_1.default.gt(a.version, b.version) ? -1 : 1;
    });
    return sortedUpdates[0];
};
exports.readJsonFile = (path) => {
    return fs_extra_1.readJSON(path);
};
exports.checkVersion = (manifestJson, updatesJson, addonUUID) => {
    const addonInfo = getAddonInfoFromUpdatesJson(updatesJson, addonUUID);
    const newestUpdate = getNewestUpdateFromAddonInfo(addonInfo);
    if (manifestJson.version !== newestUpdate.version) {
        throw new Error('version is not match.');
    }
};
exports.checkUpdateLinkFormat = (updatesJson, addonUUID, format) => {
    const { updates } = getAddonInfoFromUpdatesJson(updatesJson, addonUUID);
    for (const update of updates) {
        const isValid = checkUrlFormatValidity(update.update_link, format, update.version);
        if (!isValid) {
            throw new Error(`url format is invalid in version ${update.version}.`);
        }
    }
};
exports.checkUpdateLinkValidity = (updatesJson, addonUUID) => __awaiter(void 0, void 0, void 0, function* () {
    const addonInfo = getAddonInfoFromUpdatesJson(updatesJson, addonUUID);
    const newestUpdate = getNewestUpdateFromAddonInfo(addonInfo);
    const isValid = yield checkUrlValidity(newestUpdate.update_link);
    if (!isValid) {
        throw new Error('update_link is invalid.');
    }
});
