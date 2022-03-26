"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
exports.createDiscordJSAdapter = void 0;
var discord_js_1 = require("discord.js");
var adapters = new Map();
var trackedClients = new Set();
/**
 * Tracks a Discord.js client, listening to VOICE_SERVER_UPDATE and VOICE_STATE_UPDATE events
 *
 * @param client - The Discord.js Client to track
 */
function trackClient(client) {
    if (trackedClients.has(client))
        return;
    trackedClients.add(client);
    client.ws.on(discord_js_1.Constants.WSEvents.VOICE_SERVER_UPDATE, function (payload) {
        var _a;
        (_a = adapters.get(payload.guild_id)) === null || _a === void 0 ? void 0 : _a.onVoiceServerUpdate(payload);
    });
    client.ws.on(discord_js_1.Constants.WSEvents.VOICE_STATE_UPDATE, function (payload) {
        var _a, _b;
        if (payload.guild_id && payload.session_id && payload.user_id === ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id)) {
            (_b = adapters.get(payload.guild_id)) === null || _b === void 0 ? void 0 : _b.onVoiceStateUpdate(payload);
        }
    });
    client.on(discord_js_1.Constants.Events.SHARD_DISCONNECT, function (_, shardID) {
        var e_1, _a;
        var _b;
        var guilds = trackedShards.get(shardID);
        if (guilds) {
            try {
                for (var _c = __values(guilds.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var guildID = _d.value;
                    (_b = adapters.get(guildID)) === null || _b === void 0 ? void 0 : _b.destroy();
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        trackedShards["delete"](shardID);
    });
}
var trackedShards = new Map();
function trackGuild(guild) {
    var guilds = trackedShards.get(guild.shardID);
    if (!guilds) {
        guilds = new Set();
        trackedShards.set(guild.shardID, guilds);
    }
    guilds.add(guild.id);
}
/**
 * Creates an adapter for a Voice Channel.
 *
 * @param channel - The channel to create the adapter for
 */
function createDiscordJSAdapter(channel) {
    return function (methods) {
        adapters.set(channel.guild.id, methods);
        trackClient(channel.client);
        trackGuild(channel.guild);
        return {
            sendPayload: function (data) {
                if (channel.guild.shard.status === discord_js_1.Constants.Status.READY) {
                    channel.guild.shard.send(data);
                    return true;
                }
                return false;
            },
            destroy: function () {
                return adapters["delete"](channel.guild.id);
            }
        };
    };
}
exports.createDiscordJSAdapter = createDiscordJSAdapter;
