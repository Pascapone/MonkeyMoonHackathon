"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrangoutangStickers = exports.changeScene = void 0;
const changeScene = (ctx, gifId) => {
    if (ctx.chat) {
        if (ctx.session.privateContext.messageSceneId && ctx.session.privateContext.messageSceneFileId !== gifId) {
            ctx.api.editMessageMedia(ctx.chat.id, ctx.session.privateContext.messageSceneId, { type: 'animation', media: gifId });
            ctx.session.privateContext.messageSceneFileId = gifId;
        }
    }
};
exports.changeScene = changeScene;
exports.OrangoutangStickers = {
    laughing: 'CgACAgIAAxkBAAILeWHt6KG6Qgv5dho6dKP15963RdaPAALNFgACCk5wS-AXZQ_gn-sGIwQ',
    love: 'CgACAgIAAxkBAAILkWHt8cWNMKO3knO1orrE_PIb_fzjAALWFgACCk5wS2Ag5mOVnHuuIwQ',
    thumbs: 'CgACAgIAAxkBAAINlmHuq_00pgIIBN6G1JjYiXpf-TcKAAL7EwACCk54S3VqUrCc99lyIwQ',
    scared: 'CgACAgIAAxkBAAILfWHt638MKzLHn7KtmCUOF6WJ9bBvAALQFgACCk5wSxxxgWGAnsbDIwQ',
    waving: "CgACAgIAAxkBAAILc2Ht55cX6w95ORf10eRnh770BkuPAALMFgACCk5wS0xW7noW97K_IwQ",
    nono: 'CgACAgIAAxkBAAILgWHt7apvTSA7n7dgdTBeYQwhqO6ZAALSFgACCk5wS9INk8Eg8CcoIwQ',
    crying: 'CgACAgIAAxkBAAILf2Ht7NPbM1cfmcDTvOus8bTogHgUAALRFgACCk5wSx5ODQJHR1CtIwQ',
    ok: 'CgACAgIAAxkBAAILj2Ht8J8H2AJAblc8bQTfdf0F8pNMAALVFgACCk5wS45v8IiFweWSIwQ',
    fuckyou: 'CgACAgIAAxkBAAILhWHt79WadIU6_NJ8VsVcSau9pxd3AALUFgACCk5wS5mO-oVwJy_fIwQ',
    hugging: 'CgACAgIAAxkBAAILk2Ht8miNWhNyDYs05O3gf8NQ8FwSAALXFgACCk5wSyBQjmw3XZ-OIwQ',
    smoking: 'CgACAgIAAxkBAAILlWHt818VUdyNBtkFmRc_SwABlJLyYwAC2BYAAgpOcEsMc7O4lBb9aiME',
    facepalm: 'CgACAgIAAxkBAAILl2Ht892Z9WWo1Z2t2Bmx5gpjWk66AALZFgACCk5wS348enDVma2cIwQ',
    bored: 'CgACAgIAAxkBAAILmWHt9G_bRNhT3aVDfmpBvE7LPxUAA_MWAAIKTnBLp04UZC01pmQjBA',
    dancing: 'CgACAgIAAxkBAAILm2Ht9SQGDR3_2GBSec-qmuzsMV38AAL0FgACCk5wS9ll5sCMH9STIwQ',
    baddream: 'CgACAgIAAxkBAAILnWHt9cfyntyL8wAB5mgIC-nphd2WhQAC9RYAAgpOcEtkNPEH1CfW7SME',
    calping: 'CgACAgIAAxkBAAILn2Ht9lPTj-ov2qGwUVeeObVulpfRAAL2FgACCk5wS46H_dypqyIUIwQ',
    lookout: 'CgACAgIAAxkBAAILoWHt9t0HURyiG74fg5PeyAGc_qkBAAL3FgACCk5wSw9ofb5LBr8VIwQ',
    selfhug: 'CgACAgIAAxkBAAILo2Ht96YHZj-q2TXAn_bWtaVs2lw5AAL4FgACCk5wSwZNmEatbyiIIwQ',
    bubblenose: 'CgACAgIAAxkBAAILpWHt-F6tnDmaKrk3CLGPq43W-a9vAAL5FgACCk5wS-T5EN29DNXcIwQ',
    sleeping: 'CgACAgIAAxkBAAILqWHt-ODp13shoG1y7U8u-Ws1D-y8AAL7FgACCk5wS0FhCWCpIankIwQ',
    angry: 'CgACAgIAAxkBAAILq2Ht-WCaFlf0dIepFUYv72W3O_WoAAL8FgACCk5wS5kpG92Zqz--IwQ',
    mad: 'CgACAgIAAxkBAAILrWHt-cmYaERbCjWiPwKZv7dbiVW6AAL9FgACCk5wS4OmYlK_sadyIwQ',
    wine: 'CgACAgIAAxkBAAILr2Ht-kFBWxMAAUpjUb5D95opiCFbBwAC_hYAAgpOcEvJ80y_HGXVlCME',
    sweating: 'CgACAgIAAxkBAAILsWHt-sxg60_bxAhHufLc7nYb4EMYAAL_FgACCk5wS8ErxQfTP2D1IwQ',
    shocked: 'CgACAgIAAxkBAAILs2Ht-yCe1tRawep7bQ515cUS0xxnAAMXAAIKTnBLoul690k2XFcjBA',
};
