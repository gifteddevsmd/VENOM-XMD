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
║◦${xprefix}autoread
║◦${xprefix}autobio 
║◦${xprefix}autotype 
║◦${xprefix}unavailable 
║◦autorecord 
║◦${xprefix}autorecordtype 
║◦${xprefix}autoswview 
║◦${xprefix}setautoblock 
║◦${xprefix}setantiforeign 
║◦${xprefix}autoblock 
║◦${xprefix}onlygc 
║◦${xprefix}onlypc 
║◦${xprefix}anticall 
║◦${xprefix}self 
║◦${xprefix}public 
║◦${xprefix}join 
║◦${xprefix}poll 
║◦${xprefix}bc 
║◦${xprefix}bcgroup 
║◦${xprefix}setmenu 
║◦${xprefix}setimgmenu 
║◦${xprefix}setvidmenu 
║◦${xprefix}setgifmenu 
║◦${xprefix}setreply 
║◦${xprefix}setprefix 
║◦${xprefix}addlimit 
║◦${xprefix}dellimit 
║◦${xprefix}resethit 
║◦${xprefix}resetuser 
║◦${xprefix}creategc 
║◦${xprefix}setexif 
║◦${xprefix}userjid 
║◦${xprefix}setbotbio 
║◦${xprefix}delppbot 
║◦${xprefix}trackip 
║◦${xprefix}setppbot 
║◦${xprefix}addprem 
║◦${xprefix}delprem 
║◦${xprefix}addowner 
║◦${xprefix}delowner 
║◦${xprefix}block 
║◦${xprefix}unblock 
║◦${xprefix}leavegc 
╰⟢
╭──• ❰ *Group Menu* ❱
║◦${xprefix}antibot 
║◦${xprefix}antiviewonce 
║◦${xprefix}welcome 
║◦${xprefix}adminevent 
║◦${xprefix}groupevent 
║◦${xprefix}antiforeign 
║◦${xprefix}antimedia 
║◦${xprefix}antiaudio 
║◦${xprefix}antivideo 
║◦${xprefix}antiimage 
║◦${xprefix}antidocument 
║◦${xprefix}antilocation 
║◦${xprefix}anticontact 
║◦${xprefix}antisticker 
║◦${xprefix}antipoll 
║◦${xprefix}antilink 
║◦${xprefix}antilinkgc 
║◦${xprefix}antivirtex 
║◦${xprefix}grouplink 
║◦${xprefix}listadmin 
║◦${xprefix}invite 
║◦${xprefix}delete 
║◦${xprefix}setppgroup 
║◦${xprefix}delppgroup 
║◦${xprefix}setnamegc 
║◦${xprefix}setdesc 
║◦${xprefix}add 
║◦${xprefix}kick 
║◦${xprefix}promote 
║◦${xprefix}demote 
║◦${xprefix}getcontact 
║◦${xprefix}savecontact 
║◦${xprefix}sendcontact 
║◦${xprefix}contactag 
║◦${xprefix}hidetag 
║◦${xprefix}totag 
║◦${xprefix}tagall 
║◦${xprefix}editinfo 
║◦${xprefix}opentime 
║◦${xprefix}closetime 
║◦${xprefix}resetlink 
║◦${xprefix}getbio 
║◦${xprefix}vote 
║◦${xprefix}upvote 
║◦${xprefix}downvote 
║◦${xprefix}checkvote 
║◦${xprefix}delvote 
║◦${xprefix}autostickergc 
║◦${xprefix}react 
║◦${xprefix}kickall
║◦${xprefix}open
║◦${xprefix}close
╰⟢
╭──• ❰ *Download Menu* ❱
║◦${xprefix}ytsearch 
║◦${xprefix}play 
║◦${xprefix}ytmp3 
║◦${xprefix}ytmp4 
║◦${xprefix}tiktokaudio 
║◦${xprefix}tiktok 
║◦${xprefix}igvideo 
║◦${xprefix}igimage 
║◦${xprefix}facebook 
║◦${xprefix}mediafire 
║◦${xprefix}google 
║◦${xprefix}imdb 
║◦${xprefix}weather 
║◦${xprefix}wanumber 
║◦${xprefix}spotify 
║◦${xprefix}gitclone 
║◦${xprefix}happymod 
║◦${xprefix}gdrive 
║◦${xprefix}pinterest 
║◦${xprefix}ringtone 
╰⟢
╭──• ❰ *Random Video* ❱
║◦${xprefix}tiktokgirl 
║◦${xprefix}tiktoknukthy 
║◦${xprefix}tiktokkayes 
║◦${xprefix}tiktokpanrika 
║◦${xprefix}tiktoknotnot 
║◦${xprefix}tiktokghea 
║◦${xprefix}tiktoksantuy 
║◦${xprefix}tiktokbocil 
╰⟢
╭──• ❰ *Stalker* ❱
║◦${xprefix}igstalk 
║◦${xprefix}tiktokstalk 
║◦${xprefix}mlstalk 
║◦${xprefix}npmstalk 
║◦${xprefix}ghstalk 
╰⟢

╭──• ❰ *OpenAI* ❱
║◦${xprefix}openai 
║◦${xprefix}dalle 
║◦${xprefix}ai 
║◦${xprefix}remini 
╰⟢
╭──• ❰ *Fun Menu* ❱
║◦${xprefix}define 
║◦${xprefix}lyrics 
║◦${xprefix}suit 
║◦${xprefix}math 
║◦${xprefix}tictactoe 
║◦${xprefix}fact 
║◦${xprefix}truth 
║◦${xprefix}dare 
║◦${xprefix}couple 
║◦${xprefix}soulmate 
║◦${xprefix}stupidcheck 
║◦${xprefix}handsomecheck 
║◦${xprefix}uncleancheck 
║◦${xprefix}hotcheck 
║◦${xprefix}smartcheck 
║◦${xprefix}greatcheck 
║◦${xprefix}evilcheck 
║◦${xprefix}dogcheck 
║◦${xprefix}coolcheck 
║◦${xprefix}waifucheck 
║◦${xprefix}awesomecheck 
║◦${xprefix}gaycheck 
║◦${xprefix}cutecheck 
║◦${xprefix}lesbiancheck 
║◦${xprefix}hornycheck 
║◦${xprefix}prettycheck 
║◦${xprefix}lovelycheck 
║◦${xprefix}uglycheck 
║◦${xprefix}pick 
║◦${xprefix}pickupline 
║◦${xprefix}quotes 
║◦${xprefix}can 
║◦${xprefix}is 
║◦${xprefix}gecg 
║◦${xprefix}checkme 
║◦${xprefix}tqto 
╰⟢
╭──• ❰ *PhotoOxy Maker* ❱
║◦${xprefix}shadow   
║◦${xprefix}write  
║◦${xprefix}romantic  
║◦${xprefix}burnpaper 
║◦${xprefix}smoke 
║◦${xprefix}narutobanner  
║◦${xprefix}love  
║◦${xprefix}undergrass 
║◦${xprefix}doublelove  
║◦${xprefix}coffecup 
║◦${xprefix}underwaterocean 
║◦${xprefix}smokyneon 
║◦${xprefix}starstext 
║◦${xprefix}rainboweffect 
║◦${xprefix}balloontext 
║◦${xprefix}metalliceffect 
║◦${xprefix}embroiderytext 
║◦${xprefix}flamingtext 
║◦${xprefix}stonetext 
║◦${xprefix}writeart 
║◦${xprefix}summertext 
║◦${xprefix}wolfmetaltext 
║◦${xprefix}nature3dtext 
║◦${xprefix}rosestext 
║◦${xprefix}naturetypography 
║◦${xprefix}quotesunder 
║◦${xprefix}shinetext 
╰⟢
╭──• ❰ *Ephoto360 Maker* ❱
║◦${xprefix}glitchtext 
║◦${xprefix}writetext 
║◦${xprefix}advancedglow 
║◦${xprefix}typographytext 
║◦${xprefix}pixelglitch 
║◦${xprefix}neonglitch 
║◦${xprefix}flagtext 
║◦${xprefix}flag3dtext 
║◦${xprefix}deletingtext 
║◦${xprefix}blackpinkstyle 
║◦${xprefix}glowingtext 
║◦${xprefix}underwatertext 
║◦${xprefix}logomaker 
║◦${xprefix}cartoonstyle 
║◦${xprefix}papercutstyle 
║◦${xprefix}watercolortext 
║◦${xprefix}effectclouds 
║◦${xprefix}blackpinklogo 
║◦${xprefix}gradienttext 
║◦${xprefix}summerbeach 
║◦${xprefix}luxurygold 
║◦${xprefix}multicoloredneon 
║◦${xprefix}sandsummer 
║◦${xprefix}galaxywallpaper 
║◦${xprefix}1917style 
║◦${xprefix}makingneon 
║◦${xprefix}freecreate 
║◦${xprefix}galaxystyle 
║◦${xprefix}lighteffects 
╰⟢
╭──• ❰ *Other Menu* ❱
║◦${xprefix}ping 
║◦${xprefix}menu 
║◦${xprefix}repo 
║◦${xprefix}listpc 
║◦${xprefix}listgc 
║◦${xprefix}idgroup 
║◦${xprefix}owner 
║◦${xprefix}tts 
║◦${xprefix}say 
║◦${xprefix}checkaccount 
║◦${xprefix}vv 
║◦${xprefix}quran 
║◦${xprefix}bible 
╰⟢
╭──• ❰ *Bug & War* ❱
║◦${xprefix}amountbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}pmbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}delaybug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}docubug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}unlimitedbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}bombug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}lagbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}trollybug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}gcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}delaygcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}laggcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}bomgcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}unlimitedgcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}trollygcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}docugcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}verif 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}banv1 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}banv2 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}banv3 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}banv4 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}banv5 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}banv6 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}unbanv1 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}unbanv2 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}unbanv3 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}unbanv4 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${xprefix}unbanv5 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
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