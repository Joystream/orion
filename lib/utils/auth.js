"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorsOrigin = exports.setSessionCookie = exports.getOrCreateSession = exports.authenticate = exports.getSessionIdFromCookie = exports.getSessionIdFromHeader = exports.findActiveSession = exports.SESSION_COOKIE_NAME = void 0;
const typeorm_1 = require("typeorm");
const model_1 = require("../model");
const cache_1 = require("./cache");
const config_1 = require("./config");
const http_1 = require("./http");
const logger_1 = require("@subsquid/logger");
const globalEm_1 = require("./globalEm");
const crypto_1 = require("./crypto");
const authLogger = (0, logger_1.createLogger)('authentication');
exports.SESSION_COOKIE_NAME = 'session_id';
async function findActiveSession(req, em, where) {
    const { ip } = req;
    const { browser, device, os } = (0, http_1.getUserAgentData)(req);
    const activeSession = await em.getRepository(model_1.Session).findOne({
        where: {
            ...where,
            ip,
            os,
            device,
            browser,
            expiry: (0, typeorm_1.MoreThan)(new Date()),
        },
        relations: { user: true, account: true },
    });
    if (activeSession) {
        const userAcc = await em.getRepository(model_1.Account).findOneBy({ userId: activeSession.user.id });
        if (userAcc?.id !== activeSession.account?.id) {
            authLogger.warn(`Session ${activeSession.id} cannot be accessed with account ${activeSession.account?.id}, ` +
                `as user is now associated with account ${userAcc?.id}`);
            cache_1.sessionCache.del(activeSession.id);
            return undefined;
        }
        return activeSession;
    }
}
exports.findActiveSession = findActiveSession;
async function tryToProlongSession(id, lastActivity) {
    authLogger.debug(`Trying to prolong session ${id}. Last activity: ${lastActivity.toISOString()}...`);
    const em = await globalEm_1.globalEm;
    await em.transaction(async (em) => {
        const session = await em
            .getRepository(model_1.Session)
            .findOne({ where: { id }, lock: { mode: 'pessimistic_write' } });
        if (!session) {
            authLogger.error(`Session by id ${id} not found!`);
            return;
        }
        if (session.expiry.getTime() <= Date.now()) {
            authLogger.warn(`Cannot prolong session ${id}. Session expired.`);
            return;
        }
        const { startedAt, expiry } = session;
        const maxSessionDurationHours = await config_1.config.get(config_1.ConfigVariable.SessionMaxDurationHours, em);
        const prolongPeriodMinutes = await config_1.config.get(config_1.ConfigVariable.SessionExpiryAfterInactivityMinutes, em);
        const maxSessionDurationMs = maxSessionDurationHours * 3600000;
        const prolongPeriodMs = prolongPeriodMinutes * 60000;
        const newExpiryMs = Math.min(startedAt.getTime() + maxSessionDurationMs, lastActivity.getTime() + prolongPeriodMs);
        if (newExpiryMs <= expiry.getTime()) {
            authLogger.debug(`Session ${id}: prolonging not needed or impossible, skipping...`);
        }
        else {
            session.expiry = new Date(newExpiryMs);
            await em.save(session);
            authLogger.debug(`Session ${id} prolonged to ${session.expiry.toISOString()}...`);
        }
        tryToCacheSession(session, lastActivity);
    });
}
function tryToCacheSession({ id, expiry }, lastActivity) {
    const remainingLifetimeInSeconds = Math.floor((expiry.getTime() - Date.now()) / 1000);
    const ttl = remainingLifetimeInSeconds - cache_1.SESSION_CACHE_EXPIRY_TTL_MARGIN;
    if (ttl > cache_1.SESSION_CACHE_MINIMUM_TTL) {
        authLogger.debug(`Caching session ${id} with ttl=${ttl}...`);
        cache_1.sessionCache.set(id, { lastActivity }, ttl);
    }
}
cache_1.sessionCache.on('expired', (sessionId, cachedData) => {
    tryToProlongSession(sessionId, cachedData.lastActivity).catch((e) => {
        authLogger.error(String(e));
        process.exit(-1);
    });
});
async function getSessionIdFromHeader(req) {
    authLogger.trace(`Authorization header: ${JSON.stringify(req.headers.authorization, null, 2)}`);
    const [, sessionId] = req.headers.authorization?.match(/^Bearer ([A-Za-z0-9+/=]+)$/) || [];
    return sessionId;
}
exports.getSessionIdFromHeader = getSessionIdFromHeader;
async function getSessionIdFromCookie(req) {
    authLogger.trace(`Cookies: ${JSON.stringify(req.cookies, null, 2)}`);
    return req.cookies ? req.cookies[exports.SESSION_COOKIE_NAME] : undefined;
}
exports.getSessionIdFromCookie = getSessionIdFromCookie;
async function authenticate(req, authType) {
    const em = await globalEm_1.globalEm;
    const sessionId = authType === 'cookie' ? await getSessionIdFromCookie(req) : await getSessionIdFromHeader(req);
    if (sessionId) {
        authLogger.trace(`Authenticating... SessionId: ${sessionId}`);
        const session = await findActiveSession(req, em, { id: sessionId });
        if (session) {
            const cachedSessionData = cache_1.sessionCache.get(sessionId);
            if (cachedSessionData) {
                cachedSessionData.lastActivity = new Date();
                authLogger.trace(`Updated last activity of session ${sessionId} to ${cachedSessionData.lastActivity.toISOString()}`);
            }
            else {
                await tryToProlongSession(session.id, new Date());
            }
            return session;
        }
    }
    authLogger.debug(`Recieved a request w/ no sessionId provided. AuthType: ${authType}.`);
    return null;
}
exports.authenticate = authenticate;
async function getOrCreateSession(em, req, userId, accountId) {
    const now = new Date();
    const sessionExpiryAfterMinutes = await config_1.config.get(config_1.ConfigVariable.SessionExpiryAfterInactivityMinutes, em);
    const sessionExpiry = new Date(now.getTime() + sessionExpiryAfterMinutes * 60000);
    // Avoid duplicating sessions, just extend an existing one if found
    const existingSession = await findActiveSession(req, em, {
        userId,
        accountId: accountId || (0, typeorm_1.IsNull)(),
    });
    const sessionMaxDurationHours = await config_1.config.get(config_1.ConfigVariable.SessionMaxDurationHours, em);
    if (existingSession) {
        existingSession.expiry = new Date(Math.min(existingSession.startedAt.getTime() + sessionMaxDurationHours * 3600000, sessionExpiry.getTime()));
        return {
            session: await em.save(existingSession),
            sessionMaxDurationHours,
        };
    }
    const { ip } = req;
    const { browser, device, deviceType, os } = (0, http_1.getUserAgentData)(req);
    const session = new model_1.Session({
        id: (0, crypto_1.uniqueId)(),
        startedAt: now,
        expiry: sessionExpiry,
        browser,
        device,
        deviceType,
        os,
        ip,
        userId,
        accountId,
    });
    return {
        session: await em.save(session),
        sessionMaxDurationHours,
    };
}
exports.getOrCreateSession = getOrCreateSession;
function setSessionCookie(res, sessionId, maxDurationHours) {
    const sameSite = process.env.ORION_ENV === 'development' && process.env.DEV_DISABLE_SAME_SITE === 'true'
        ? 'none'
        : 'strict';
    res.cookie(exports.SESSION_COOKIE_NAME, sessionId, {
        maxAge: maxDurationHours * 3600000,
        httpOnly: true,
        secure: true,
        sameSite,
        domain: process.env.GATEWAY_ROOT_DOMAIN && `.${process.env.GATEWAY_ROOT_DOMAIN}`,
    });
}
exports.setSessionCookie = setSessionCookie;
function getCorsOrigin() {
    if (process.env.ORION_ENV === 'development' && process.env.DEV_DISABLE_SAME_SITE === 'true') {
        return true;
    }
    const rootDomain = process.env.GATEWAY_ROOT_DOMAIN;
    if (!rootDomain) {
        throw new Error('GATEWAY_ROOT_DOMAIN must be set unless in development mode with DEV_DISABLE_SAME_SITE set to true');
    }
    const corsOrigin = [
        `https://${rootDomain}`,
        new RegExp(`https://.+\\.${rootDomain.replace('.', '\\.')}$`),
    ];
    authLogger.info('Root domain: ' + rootDomain);
    authLogger.info('CORS origin: ' + corsOrigin.toString());
    return corsOrigin;
}
exports.getCorsOrigin = getCorsOrigin;
//# sourceMappingURL=auth.js.map