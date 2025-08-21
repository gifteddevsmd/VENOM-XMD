const chalk = require('chalk')
const fs = require('fs')

const Menu = `
▣ ◈ *RACHEL-𝐗𝐌𝐃 MENU* ◈ ▣
┃ ✦ Owner   : ${global.ownername}
┃ ✦ Version : 1.0.0
┃ ✦ Mode    : ${global.typebot}
┃ ✦ Prefix  : ${global.xprefix || '.'}
┗━━━━━━━━━━━━━━━━━━━━━━
╭──• ❰ *Owner Menu* ❱
║◦autoread
║◦autobio 
║◦autotype 
║◦unavailable 
║◦autorecord 
║◦autorecordtype 
║◦autoswview 
║◦setautoblock 
║◦setantiforeign 
║◦autoblock 
║◦onlygc 
║◦onlypc 
║◦anticall 
║◦self 
║◦public 
║◦join 
║◦poll 
║◦bc 
║◦bcgroup 
║◦setmenu 
║◦setimgmenu 
║◦setvidmenu 
║◦setgifmenu 
║◦setreply 
║◦setprefix 
║◦addlimit 
║◦dellimit 
║◦resethit 
║◦resetuser 
║◦creategc 
║◦setexif 
║◦userjid 
║◦setbotbio 
║◦delppbot 
║◦trackip 
║◦setppbot 
║◦addprem 
║◦delprem 
║◦addowner 
║◦delowner 
║◦block 
║◦unblock 
║◦leavegc 
╰⟢
╭──• ❰ *Group Menu* ❱
║◦antibot 
║◦antiviewonce 
║◦welcome 
║◦adminevent 
║◦groupevent 
║◦antiforeign 
║◦antimedia 
║◦antiaudio 
║◦antivideo 
║◦antiimage 
║◦antidocument 
║◦antilocation 
║◦anticontact 
║◦antisticker 
║◦antipoll 
║◦antilink 
║◦antilinkgc 
║◦antivirtex 
║◦grouplink 
║◦listadmin 
║◦invite 
║◦delete 
║◦setppgroup 
║◦delppgroup 
║◦setnamegc 
║◦setdesc 
║◦add 
║◦kick 
║◦promote 
║◦demote 
║◦getcontact 
║◦savecontact 
║◦sendcontact 
║◦contactag 
║◦hidetag 
║◦totag 
║◦tagall 
║◦editinfo 
║◦opentime 
║◦closetime 
║◦resetlink 
║◦getbio 
║◦vote 
║◦upvote 
║◦downvote 
║◦checkvote 
║◦delvote 
║◦autostickergc 
║◦react 
║◦kickall
║◦open
║◦close
╰⟢
╭──• ❰ *Download Menu* ❱
║◦ytsearch 
║◦play 
║◦ytmp3 
║◦ytmp4 
║◦tiktokaudio 
║◦tiktok 
║◦igvideo 
║◦igimage 
║◦facebook 
║◦mediafire 
║◦google 
║◦imdb 
║◦weather 
║◦wanumber 
║◦spotify 
║◦gitclone 
║◦happymod 
║◦gdrive 
║◦pinterest 
║◦ringtone 
╰⟢
╭──• ❰ *Random Video* ❱
║◦tiktokgirl 
║◦tiktoknukthy 
║◦tiktokkayes 
║◦tiktokpanrika 
║◦tiktoknotnot 
║◦tiktokghea 
║◦tiktoksantuy 
║◦tiktokbocil 
╰⟢
╭──• ❰ *Stalker* ❱
║◦igstalk 
║◦tiktokstalk 
║◦mlstalk 
║◦npmstalk 
║◦ghstalk 
╰⟢

╭──• ❰ *OpenAI* ❱
║◦openai 
║◦dalle 
║◦ai 
║◦remini 
╰⟢
╭──• ❰ *Fun Menu* ❱
║◦define 
║◦lyrics 
║◦suit 
║◦math 
║◦tictactoe 
║◦fact 
║◦truth 
║◦dare 
║◦couple 
║◦soulmate 
║◦stupidcheck 
║◦handsomecheck 
║◦uncleancheck 
║◦hotcheck 
║◦smartcheck 
║◦greatcheck 
║◦evilcheck 
║◦dogcheck 
║◦coolcheck 
║◦waifucheck 
║◦awesomecheck 
║◦gaycheck 
║◦cutecheck 
║◦lesbiancheck 
║◦hornycheck 
║◦prettycheck 
║◦lovelycheck 
║◦uglycheck 
║◦pick 
║◦pickupline 
║◦quotes 
║◦can 
║◦is 
║◦gecg 
║◦checkme 
║◦tqto 
╰⟢
╭──• ❰ *PhotoOxy Maker* ❱
║◦shadow   
║◦write  
║◦romantic  
║◦burnpaper 
║◦smoke 
║◦narutobanner  
║◦love  
║◦undergrass 
║◦doublelove  
║◦coffecup 
║◦underwaterocean 
║◦smokyneon 
║◦starstext 
║◦rainboweffect 
║◦balloontext 
║◦metalliceffect 
║◦embroiderytext 
║◦flamingtext 
║◦stonetext 
║◦writeart 
║◦summertext 
║◦wolfmetaltext 
║◦nature3dtext 
║◦rosestext 
║◦naturetypography 
║◦quotesunder 
║◦shinetext 
╰⟢
╭──• ❰ *Ephoto360 Maker* ❱
║◦glitchtext 
║◦writetext 
║◦advancedglow 
║◦typographytext 
║◦pixelglitch 
║◦neonglitch 
║◦flagtext 
║◦flag3dtext 
║◦deletingtext 
║◦blackpinkstyle 
║◦glowingtext 
║◦underwatertext 
║◦logomaker 
║◦cartoonstyle 
║◦papercutstyle 
║◦watercolortext 
║◦effectclouds 
║◦blackpinklogo 
║◦gradienttext 
║◦summerbeach 
║◦luxurygold 
║◦multicoloredneon 
║◦sandsummer 
║◦galaxywallpaper 
║◦1917style 
║◦makingneon 
║◦freecreate 
║◦galaxystyle 
║◦lighteffects 
╰⟢
> BELLAH XMD VERSION 1 
╭──• ❰ *Other Menu* ❱
║◦ping 
║◦menu 
║◦repo 
║◦listpc 
║◦listgc 
║◦idgroup 
║◦owner 
║◦tts 
║◦say 
║◦checkaccount 
║◦vv 
║◦quran 
║◦bible 
╰⟢
╭──• ❰ *Bug & War* ❱
║◦amountbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦pmbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦delaybug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦docubug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦unlimitedbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦bombug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦lagbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦trollybug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦gcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦delaygcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦laggcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦bomgcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦unlimitedgcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦trollygcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦docugcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦verif 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦banv1 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦banv2 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦banv3 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦banv4 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦banv5 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦banv6 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦unbanv1 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦unbanv2 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦unbanv3 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦unbanv4 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦unbanv5 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
╰⟢
> RACHEL-XMD VERSION 1
> GIFTED DAVE
> ENJOY
`;


module.exports = Menu

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})