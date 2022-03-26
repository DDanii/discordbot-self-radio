"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var voice_1 = require("@discordjs/voice");
var adapter_1 = require("./adapter");
var WebRequest = __importStar(require("web-request"));
var player = (0, voice_1.createAudioPlayer)();
var connection;
function playSong() {
    return __awaiter(this, void 0, void 0, function () {
        var resource;
        return __generator(this, function (_a) {
            try {
                (0, voice_1.entersState)(connection, voice_1.VoiceConnectionStatus.Ready, 30e3);
            }
            catch (error) {
                connection.destroy();
            }
            resource = (0, voice_1.createAudioResource)(process.env['DISCORDBOT_STREAM_LINK'], {
                inputType: voice_1.StreamType.Raw
            });
            player.play(resource);
            return [2 /*return*/, (0, voice_1.entersState)(player, voice_1.AudioPlayerStatus.Playing, 15e3)];
        });
    });
}
function connectToChannel(channel) {
    return __awaiter(this, void 0, void 0, function () {
        var connection;
        return __generator(this, function (_a) {
            connection = (0, voice_1.joinVoiceChannel)({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: (0, adapter_1.createDiscordJSAdapter)(channel)
            });
            return [2 /*return*/, connection];
        });
    });
}
var client = new discord_js_1.Client({
    ws: { intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES] }
});
client.login(process.env['DISCORDBOT_TOKEN']);
client.on('voiceStateUpdate', function (oldState, newState) { return __awaiter(void 0, void 0, void 0, function () {
    var login, logout;
    return __generator(this, function (_a) {
        if (newState.member.user.id == 'todo self id')
            return [2 /*return*/]; //TODO
        if (oldState.channel != null) {
            if (oldState.channel.members.size == 1) {
                if (isBotIn(oldState)) {
                    onLogout(false);
                }
            }
        }
        if (newState.channel != null) {
            if (newState.channel.members.size == 1) {
                if (amIIN(newState)) {
                    play(newState.channel);
                }
                else {
                    if (isBotIn(newState)) {
                        onLogout(false);
                    }
                }
            }
            if (newState.channel.members.size >= 2) {
                login = !isBotIn(newState) && amIIN(newState);
                logout = false;
                newState.channel.members.forEach(function (x) {
                    if (x.user.id == process.env['DISCORDBOT_OWNER_ID'])
                        return;
                    if (!x.voice.deaf) {
                        login = false;
                        if (isBotIn(newState))
                            logout = true;
                    }
                });
                if (login) {
                    play(newState.channel);
                }
                if (logout) {
                    onLogout();
                }
            }
        }
        return [2 /*return*/];
    });
}); });
function isBotIn(state) {
    return state.channel.members.get('') != null; //TODO self id
}
function amIIN(state) {
    return state.channel.members.get(process.env['DISCORDBOT_OWNER_ID']) != null;
}
function play(channel) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, connectToChannel(channel)];
                case 1:
                    connection = _a.sent();
                    return [4 /*yield*/, playSong()];
                case 2:
                    _a.sent();
                    connection.subscribe(player);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function onLogout(notify) {
    if (notify === void 0) { notify = true; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            connection.destroy();
            if (notify)
                WebRequest.post(process.env['DISCORDBOT_JOIN_WEBHOOK']);
            return [2 /*return*/];
        });
    });
}
