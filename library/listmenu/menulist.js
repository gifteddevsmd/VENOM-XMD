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
║◦${prefix}autoread
║◦${prefix}autobio 
║◦${prefix}autotype 
║◦${prefix}unavailable 
║◦${prefix}autorecord 
║◦${prefix}autorecordtype 
║◦${prefix}autoswview 
║◦${prefix}setautoblock 
║◦${prefix}setantiforeign 
║◦${prefix}autoblock 
║◦${prefix}onlygc 
║◦${prefix}onlypc 
║◦${prefix}anticall 
║◦${prefix}self 
║◦${prefix}public 
║◦${prefix}join 
║◦${prefix}poll 
║◦${prefix}bc 
║◦${prefix}bcgroup 
║◦${prefix}setmenu 
║◦${prefix}setimgmenu 
║◦${prefix}setvidmenu 
║◦${prefix}setgifmenu 
║◦${prefix}setreply 
║◦${prefix}setprefix 
║◦${prefix}addlimit 
║◦${prefix}dellimit 
║◦${prefix}resethit 
║◦${prefix}resetuser 
║◦${prefix}creategc 
║◦${prefix}setexif 
║◦${prefix}userjid 
║◦${prefix}setbotbio 
║◦${prefix}delppbot 
║◦${prefix}trackip 
║◦${prefix}setppbot 
║◦${prefix}addprem 
║◦${prefix}delprem 
║◦${prefix}addowner 
║◦${prefix}delowner 
║◦${prefix}block 
║◦${prefix}unblock 
║◦${prefix}leavegc 
╰⟢
╭──• ❰ *Group Menu* ❱
║◦${prefix}antibot 
║◦${prefix}antiviewonce 
║◦${prefix}welcome 
║◦${prefix}adminevent 
║◦${prefix}groupevent 
║◦${prefix}antiforeign 
║◦${prefix}antimedia 
║◦${prefix}antiaudio 
║◦${prefix}antivideo 
║◦${prefix}antiimage 
║◦${prefix}antidocument 
║◦${prefix}antilocation 
║◦${prefix}anticontact 
║◦${prefix}antisticker 
║◦${prefix}antipoll 
║◦${prefix}antilink 
║◦${prefix}antilinkgc 
║◦${prefix}antivirtex 
║◦${prefix}grouplink 
║◦${prefix}listadmin 
║◦${prefix}invite 
║◦${prefix}delete 
║◦${prefix}setppgroup 
║◦${prefix}delppgroup 
║◦${prefix}setnamegc 
║◦${prefix}setdesc 
║◦${prefix}add 
║◦${prefix}kick 
║◦${prefix}promote 
║◦${prefix}demote 
║◦${prefix}getcontact 
║◦${prefix}savecontact 
║◦${prefix}sendcontact 
║◦${prefix}contactag 
║◦${prefix}hidetag 
║◦${prefix}totag 
║◦${prefix}tagall 
║◦${prefix}editinfo 
║◦${prefix}opentime 
║◦${prefix}closetime 
║◦${prefix}resetlink 
║◦${prefix}getbio 
║◦${prefix}vote 
║◦${prefix}upvote 
║◦${prefix}downvote 
║◦${prefix}checkvote 
║◦${prefix}delvote 
║◦${prefix}autostickergc 
║◦${prefix}react 
║◦${prefix}kickall
║◦${prefix}open
║◦${prefix}close
╰⟢
╭──• ❰ *Download Menu* ❱
║◦${prefix}ytsearch 
║◦${prefix}play 
║◦${prefix}ytmp3 
║◦${prefix}ytmp4 
║◦${prefix}tiktokaudio 
║◦${prefix}tiktok 
║◦${prefix}igvideo 
║◦${prefix}igimage 
║◦${prefix}facebook 
║◦${prefix}mediafire 
║◦${prefix}google 
║◦${prefix}imdb 
║◦${prefix}weather 
║◦${prefix}wanumber 
║◦${prefix}spotify 
║◦${prefix}gitclone 
║◦${prefix}happymod 
║◦${prefix}gdrive 
║◦${prefix}pinterest 
║◦${prefix}ringtone 
╰⟢
╭──• ❰ *Random Video* ❱
║◦${prefix}tiktokgirl 
║◦${prefix}tiktoknukthy 
║◦${prefix}tiktokkayes 
║◦${prefix}tiktokpanrika 
║◦${prefix}tiktoknotnot 
║◦${prefix}tiktokghea 
║◦${prefix}tiktoksantuy 
║◦${prefix}tiktokbocil 
╰⟢
╭──• ❰ *Stalker* ❱
║◦${prefix}igstalk 
║◦${prefix}tiktokstalk 
║◦${prefix}mlstalk 
║◦${prefix}npmstalk 
║◦${prefix}ghstalk 
╰⟢
> RACHEL-XMD VERSION 1

> GIDDY TENNOR


> ENJOY
╭──• ❰ *OpenAI* ❱
║◦${prefix}openai 
║◦${prefix}dalle 
║◦${prefix}ai 
║◦${prefix}remini 
╰⟢
╭──• ❰ *Fun Menu* ❱
║◦${prefix}define 
║◦${prefix}lyrics 
║◦${prefix}suit 
║◦${prefix}math 
║◦${prefix}tictactoe 
║◦${prefix}fact 
║◦${prefix}truth 
║◦${prefix}dare 
║◦${prefix}couple 
║◦${prefix}soulmate 
║◦${prefix}stupidcheck 
║◦${prefix}handsomecheck 
║◦${prefix}uncleancheck 
║◦${prefix}hotcheck 
║◦${prefix}smartcheck 
║◦${prefix}greatcheck 
║◦${prefix}evilcheck 
║◦${prefix}dogcheck 
║◦${prefix}coolcheck 
║◦${prefix}waifucheck 
║◦${prefix}awesomecheck 
║◦${prefix}gaycheck 
║◦${prefix}cutecheck 
║◦${prefix}lesbiancheck 
║◦${prefix}hornycheck 
║◦${prefix}prettycheck 
║◦${prefix}lovelycheck 
║◦${prefix}uglycheck 
║◦${prefix}pick 
║◦${prefix}pickupline 
║◦${prefix}quotes 
║◦${prefix}can 
║◦${prefix}is 
║◦${prefix}gecg 
║◦${prefix}checkme 
║◦${prefix}tqto 
╰⟢
╭──• ❰ *PhotoOxy Maker* ❱
║◦${prefix}shadow   
║◦${prefix}write  
║◦${prefix}romantic  
║◦${prefix}burnpaper 
║◦${prefix}smoke 
║◦${prefix}narutobanner  
║◦${prefix}love  
║◦${prefix}undergrass 
║◦${prefix}doublelove  
║◦${prefix}coffecup 
║◦${prefix}underwaterocean 
║◦${prefix}smokyneon 
║◦${prefix}starstext 
║◦${prefix}rainboweffect 
║◦${prefix}balloontext 
║◦${prefix}metalliceffect 
║◦${prefix}embroiderytext 
║◦${prefix}flamingtext 
║◦${prefix}stonetext 
║◦${prefix}writeart 
║◦${prefix}summertext 
║◦${prefix}wolfmetaltext 
║◦${prefix}nature3dtext 
║◦${prefix}rosestext 
║◦${prefix}naturetypography 
║◦${prefix}quotesunder 
║◦${prefix}shinetext 
╰⟢
╭──• ❰ *Ephoto360 Maker* ❱
║◦${prefix}glitchtext 
║◦${prefix}writetext 
║◦${prefix}advancedglow 
║◦${prefix}typographytext 
║◦${prefix}pixelglitch 
║◦${prefix}neonglitch 
║◦${prefix}flagtext 
║◦${prefix}flag3dtext 
║◦${prefix}deletingtext 
║◦${prefix}blackpinkstyle 
║◦${prefix}glowingtext 
║◦${prefix}underwatertext 
║◦${prefix}logomaker 
║◦${prefix}cartoonstyle 
║◦${prefix}papercutstyle 
║◦${prefix}watercolortext 
║◦${prefix}effectclouds 
║◦${prefix}blackpinklogo 
║◦${prefix}gradienttext 
║◦${prefix}summerbeach 
║◦${prefix}luxurygold 
║◦${prefix}multicoloredneon 
║◦${prefix}sandsummer 
║◦${prefix}galaxywallpaper 
║◦${prefix}1917style 
║◦${prefix}makingneon 
║◦${prefix}freecreate 
║◦${prefix}galaxystyle 
║◦${prefix}lighteffects 
╰⟢
> BELLAH XMD VERSION 1 
╭──• ❰ *Other Menu* ❱
║◦${prefix}ping 
║◦${prefix}menu 
║◦${prefix}repo 
║◦${prefix}listpc 
║◦${prefix}listgc 
║◦${prefix}idgroup 
║◦${prefix}owner 
║◦${prefix}tts 
║◦${prefix}say 
║◦${prefix}checkaccount 
║◦${prefix}vv 
║◦${prefix}quran 
║◦${prefix}bible 
╰⟢
╭──• ❰ *Bug & War* ❱
║◦${prefix}amountbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}pmbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}delaybug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}docubug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}unlimitedbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}bombug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}lagbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}trollybug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}gcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}delaygcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}laggcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}bomgcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}unlimitedgcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}trollygcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}docugcbug 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}verif 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}banv1 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}banv2 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}banv3 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}banv4 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}banv5 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}banv6 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}unbanv1 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}unbanv2 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}unbanv3 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}unbanv4 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
║◦${prefix}unbanv5 𝙋𝙍𝙀𝙈𝙄𝙐𝙈
╰⟢
`}



module.exports = Menu

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})