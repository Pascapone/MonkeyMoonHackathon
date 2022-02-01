"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.giveRewardToRecruiter = exports.getWalletLinkConfirmationStatus = exports.deleteWalletLink = exports.linkWalletAddress = exports.createTelegramUser = exports.getTelegramUserById = exports.getUserByAddress = exports.connectMoralis = void 0;
const node_1 = __importDefault(require("moralis/node"));
const crypto_1 = __importDefault(require("crypto"));
const connectMoralis = async () => {
    await node_1.default.start({ serverUrl: process.env.MORALIS_SERVER_URL, appId: process.env.MORALIS_APPLICATION_ID, masterKey: process.env.MORALIS_MASTER_KEY });
};
exports.connectMoralis = connectMoralis;
const getUserByAddress = async (address) => {
    const User = node_1.default.Object.extend("User");
    const query = new node_1.default.Query(User);
    query.equalTo("ethAddress", address.toLowerCase());
    const result = await query.first({ useMasterKey: true });
    return result;
};
exports.getUserByAddress = getUserByAddress;
const getTelegramUserById = async (telegramId) => {
    const User = node_1.default.Object.extend("telegramUser");
    const query = new node_1.default.Query(User);
    query.include("signMessage");
    query.equalTo("telegramId", telegramId);
    const result = await query.first({ useMasterKey: true });
    return result;
};
exports.getTelegramUserById = getTelegramUserById;
const createTelegramUser = async (telegramId, username, first_name, recruiter) => {
    const User = node_1.default.Object.extend("telegramUser");
    const telegramUser = new User();
    telegramUser.set('telegramId', telegramId);
    telegramUser.set('username', username);
    telegramUser.set('firstName', first_name);
    if (recruiter) {
        telegramUser.set('invitedBy', recruiter);
    }
    telegramUser.save(null, { useMasterKey: true });
};
exports.createTelegramUser = createTelegramUser;
const linkWalletAddress = async (telegramId, walletAddress, telegramUsername, telegramFirstName) => {
    const telegramUser = await (0, exports.getTelegramUserById)(telegramId);
    if (telegramUser) {
        const TelegramUser = node_1.default.Object.extend("telegramUser");
        const query = new node_1.default.Query(TelegramUser);
        query.equalTo("ethAddress", walletAddress.toLowerCase());
        const result = await query.find();
        console.log(result);
        for (let i = 0; i < result.length; i++) {
            if (result[i].get("user")) {
                return "already-linked";
            }
        }
        const SignMessage = node_1.default.Object.extend('signMessage');
        const signMessage = new SignMessage();
        signMessage.set('subject', 'Telegram Link');
        signMessage.set('message', `I want to link my wallet to my telegram account.\nNonce:\n${crypto_1.default.randomBytes(16).toString('base64')}`);
        signMessage.set('telegramUser', telegramUser);
        signMessage.set('signed', false);
        await signMessage.save();
        telegramUser.set('ethAddress', walletAddress.toLowerCase());
        telegramUser.set('signMessage', signMessage);
        await telegramUser.save();
        const Notification = node_1.default.Object.extend('notification');
        const notification = new Notification();
        notification.set('subject', 'Telegram Link');
        notification.set('text', `You need to confirm your telegram link to your wallet. 
#### The telegram username is: **${telegramUsername}**  
#### The first name is: **${telegramFirstName}**`);
        notification.set('warning', 'Important: You can not revert this action! Once you linked your wallet address to your telegram account, you can not link a new telegram account to your wallet! You will still be able to remove the link, but you will not be able to establish a new one!');
        notification.set('image', 'https://pascapone.github.io/kette.png');
        notification.set('type', 'sign');
        notification.set('telegramUser', telegramUser);
        notification.set('opened', false);
        notification.set('signMessage', signMessage);
        await notification.save();
        return "success";
    }
    else {
        return "no-telegram-account";
    }
};
exports.linkWalletAddress = linkWalletAddress;
const deleteWalletLink = async (telegramId) => {
    const telegramUser = await (0, exports.getTelegramUserById)(telegramId);
    if (telegramUser) {
        telegramUser.unset('ethAddress');
        telegramUser.unset('signMessage');
        telegramUser.save();
        console.log("Removed");
        return true;
    }
    else {
        return false;
    }
};
exports.deleteWalletLink = deleteWalletLink;
const getWalletLinkConfirmationStatus = async (telegramId) => {
    const telegramUser = await (0, exports.getTelegramUserById)(telegramId);
    if (telegramUser) {
        const signMessage = telegramUser.get('signMessage');
        if (!signMessage) {
            return "not-linked";
        }
        else if (signMessage && signMessage.get('signed')) {
            return "confirmed";
        }
        return "not-confirmed";
    }
    else {
        return "user-unknown";
    }
};
exports.getWalletLinkConfirmationStatus = getWalletLinkConfirmationStatus;
const giveRewardToRecruiter = async (telegramId, personalInvite) => {
    const telegramUser = await (0, exports.getTelegramUserById)(telegramId);
    console.log(process.env.TELEGRAM_MORALIS_API_KEY);
    if (!telegramUser)
        return;
    const response = await node_1.default.Cloud.run("rewardTelegramRecruiter", {
        telegramApiKey: process.env.TELEGRAM_MORALIS_API_KEY,
        ethAddress: telegramUser.get("ethAddress"),
        personalInvite: personalInvite
    });
    console.log(response);
};
exports.giveRewardToRecruiter = giveRewardToRecruiter;
// export const whitelistTelegramUser = async (telegramId : number) : Promise<boolean> => {
//   const telegramUser = await getTelegramUserById(telegramId)
//   if(telegramUser){
//     telegramUser.set('whitelisted', true)
//     telegramUser.save()
//     return true
//   }
//   else{
//     return false
//   }  
// }
