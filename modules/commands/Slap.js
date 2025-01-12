/**
* @author ProCoderMew
* @warn Do not edit code or edit credits
*/

module.exports.config = {
    name: "slap",
    version: "2.2.6",
    hasPermssion: 0,
    credits: "ProCoderMew",
    description: "",
    commandCategory: "general",
    usages: "[@tag]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    },
    envConfig: {
        APIKEY: ""
    }
};

module.exports.onLoad = async() => {
    const { resolve } = global.nodemodule["path"];
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const path = resolve(__dirname, 'cache/canvas', 'slap.png');
    if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://dev.meewmeew.info/Module-Miraiv2/data/slap.png", path);
}
async function makeImage({ one, two }) {    
    const { APIKEY } = global.configModule.slap;
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"];
    const jimp = global.nodemodule["jimp"];
    const __root = path.resolve(__dirname, "cache", "canvas");

    let slap_image = await jimp.read(__root + "/slap.png");
    let pathImg = __root + `/slap_${one}_${two}.png`;
    try {
        var avatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).data;    
        var avatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).data;
        var circleOne = await jimp.read(await circle(Buffer.from(avatarOne, 'utf-8')));
        var circleTwo = await jimp.read(await circle(Buffer.from(avatarTwo, 'utf-8')));        
    } catch (e) {
        let raw = await slap_image.getBufferAsync("image/png");    
        fs.writeFileSync(pathImg, raw);
        return pathImg;
    } 
    slap_image.composite(circleOne.resize(150, 150), 745, 25).composite(circleTwo.resize(140, 140), 180, 40);
    
    let raw = await slap_image.getBufferAsync("image/png");    
    fs.writeFileSync(pathImg, raw);
    return pathImg;
}
async function circle(image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api, args }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);
    if (!mention[0]) return api.sendMessage("Vui lòng tag 1 người.", threadID, messageID);
    else {
        var one = senderID, two = mention[0];
        return makeImage({ one, two }).then(path => api.sendMessage({ body: "Toang ALO nè", attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID));
    }
}
