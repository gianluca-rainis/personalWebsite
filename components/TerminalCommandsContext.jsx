import React, { createContext, useContext, useMemo } from 'react';

const THEME_ACCENT_BRIGHT = {
    green: '#00ff00',
    red: '#ff0000',
    yellow: '#ffff00',
    blue: '#0000ff',
};

const TERMINAL_COMMANDS = [
    { command: 'help', description: 'List the available commands.' },
    { command: 'clear', description: 'Clear the terminal output.' },
    { command: 'info', description: 'Show the main profile overview.' },
    { command: 'info --personal', description: 'Show personal details.' },
    { command: 'info --contact', description: 'Show contact links.' },
    { command: 'keyboard --language', description: 'Show language skills.' },
    { command: 'image --ascii', description: 'Show a decorative ASCII panel.' },
    { command: 'image --profile --ascii', description: 'Show the profile ASCII panel.' },
    { command: 'presentation --about', description: 'Show the about me summary.' },
    { command: 'skills --table', description: 'Show technical skills.' },
    { command: 'info --education', description: 'Show education history.' },
    { command: 'info --work', description: 'Show work experience.' },
    { command: 'info --certifications', description: 'Show certifications.' },
    { command: 'ls projects/', description: 'List selected projects.' },
    { command: 'project [name]', description: 'Show a project.' },
    { command: 'info --hobbies', description: 'Show hobbies and interests.' },
    { command: 'cat hackclub.txt', description: 'Show the Hack Club note.' },
];

const PROJECTS_INFO = [
    { name: '<a href="https://projects.gianlucarainis.com/projects/Z80DevBoard">Z80DevBoard</a>', description: 'Advanced development board for the Z80 CPU powered by an RP2040. PCB designed in KiCad, firmware written from scratch.<br /><span style="opacity:.7">KiCad · C · RP2040 · Z80 ASM</span><br /><a href="https://github.com/gianluca-rainis/Z80DevBoard" target="_blank" rel="noopener noreferrer">GitHub</a>'},
    { name: '<a href="https://projects.gianlucarainis.com/projects/FreeIdeas">FreeIdeas</a>', description: 'Community platform for sharing project ideas.<br /><span style="opacity:.7">Next.js · React · JavaScript</span><br /><a href="https://github.com/gianluca-rainis/FreeIdeas" target="_blank" rel="noopener noreferrer">GitHub</a> | <a href="https://www.freeideas.pro" target="_blank" rel="noopener noreferrer">Live Demo</a>'},
    { name: '<a href="https://projects.gianlucarainis.com/projects/MagicExplorer">MagicExplorer</a>', description: '2D action game about a wizard exploring a dungeon.<br /><span style="opacity:.7">Unity · C#</span><br /><a href="https://github.com/gianluca-rainis/magicExplorer" target="_blank" rel="noopener noreferrer">GitHub</a> | <a href="https://var-grdev.itch.io/magicexplorer" target="_blank" rel="noopener noreferrer">Live Demo</a>'},
    { name: '<a href="https://projects.gianlucarainis.com/projects/BeyondTheQuarks">Beyond the Quarks</a>', description: 'A multiverse survival adventure: fix your wormhole device piece by piece and jump your way back home.<br /><span style="opacity:.7">Unity · C#</span><br /><a href="https://github.com/gianluca-rainis/BeyondTheQuarks" target="_blank" rel="noopener noreferrer">GitHub</a> | <a href="https://var-grdev.itch.io/beyond-the-quarks" target="_blank" rel="noopener noreferrer">Live Demo</a>'},
    { name: '<a href="https://projects.gianlucarainis.com/projects/UHBadge">UHBadge</a>', description: 'Universal Hacker Badge - The conference badge for hackers.<br /><span style="opacity:.7">KiCad · C · RP2350</span><br /><a href="https://github.com/gianluca-rainis/UHBadge" target="_blank" rel="noopener noreferrer">GitHub</a>'},
];

const TerminalCommandsContext = createContext(null);

export function normalizeTerminalCommand(command) {
    return String(command ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizeHexColor(value) {
    const hex = String(value ?? '').trim();

    if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
        return `#${hex.slice(1).split('').map((char) => char + char).join('')}`;
    }

    return hex;
}

function getDateDiff(startDate) {
    const now = new Date();
    const start = new Date(startDate);

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
        months--;

        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return `${years} years, ${months} months, ${days} days`;
}

function buildTable(title, rows) {
    const body = rows
        .map(([label, value]) => `
<tr>
${label?`<td style="white-space:nowrap; padding-right:12px;">${label}</td>`:''}
<td>${value}</td>
</tr>`)
        .join('');

    return `<table style="width: 100%; border-collapse: collapse;">
<thead><tr><th colspan="2" style="text-align: center; color: var(--theme-accent)">${title}</th></tr></thead>${body}
</table>`;
}

function buildHelpOutput() {
    const items = TERMINAL_COMMANDS
        .map(({ command, description }) => `<li><strong>${command}</strong> - ${description}</li>`)
        .join('');

    return `<div>
<p style="margin-top: 0;">Available commands:</p>
<ul style="margin: 0; padding-left: 18px;">
${items}
</ul>
</div>`;
}

function buildAsciiPanel(label) {
    switch (label) {
        case "picture":
            return `<p class="asciiPanel">############################################################################################################################################################oooo=o###################################################################################################@@#####################################
#############################################################################################################################################################ooo=o#############################################################################@@@############@@@@@#@@@#####################################
############################################################################################################################################################oooo=o##################################################@@@@@@@@@@@@@@@#####@@##@@@@@#@@@@@#########@@######@@@@@###############################
#############################################################################################################################################################ooo=oo####################################################@@@###################################@#@@@@@@@@@@##@@###############################
############################################################################################################################################################oooo=oo###################################################@@@@@########################@@@@@##@@@@@@@@@@########################################
############################################################################################################################################################oooo=oo#o.-##############################@@@@@@#@@##################################@##@@@@@@####@###@@@################################@@@@@@@@
############################################################################################################################################################oooo==oo...#########################@@@@@@@@@@@#############################@####@#@#####@@###@@@#####@@#@#######@###@@@@@@@@@@@@@@@@@@@@@@@@@@@
###########################################################################################################################################################ooooo==-==.-=#################@@@@@@#@@@@@@@@@@@@###@@@@@@@####oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
###########################################################################################################################################################ooo#o=ooo-===###############@@@@@@@@@@@######oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
###########################################################################################################################################################o#o#o=oooo...o###@@@@@#####oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo#ooooooooooooooooooooooooooooooooooooooo
###########################################################################################################################################################o#o##=ooo#o..-ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo=ooooooooooooooooooooooooooooooooooooooooo#ooooooooooooooo
###########################################################################################################################################################o#o#o=ooo#o#=-oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo=oooooooooooooooooo###ooooo#ooooo##oooo###oo#oooooooooooooo
##################################################################################################@@@###########################################ooooooooo##ooo#o=ooo#o###-ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo######oooo===========================================ooooooooo####oo#
######################################################################################################################################ooooooooooooooooooo##ooooo=#oo#o####ooooooooooooooooooooooooooooooooooo#o###oooooo===---...........=--===ooooo=-=====-==========---===-==-o-==o=====-=-===-------.---.
#########################################################################o=##########################-o######################oooooooooooooooooooooooooooo###oo##=#oo##o####oooooooooooooooooooooooooo==----.....--..---=-==-=---o=o======o=o=o=oooooo=o=o=o=o=oo=o=o=oo#ooo===o=o==oo=o=oo==oo=o======o===o=
#########################################################################o###########################=##############oooooooooooooooooooooooooooooooooooooo##oo##o#oo##oo###oooooooooo==--.....---=.======-=-===ooo=o-===ooo=oo-oo=o=oooooo=ooo=oooooo#oo=oo=oooo=o===o=#o=o=o===o=====o=o#oo===o=oooo=o==-oo
#########################################################################o###########################=######oooooooooooooooooooooooooooooooooooooooooooooo##o=##o#oo#######-. .-.--=====o====ooo=o===oo=o=oooo=o=o=oo===o-o=o===oooooooo==ooooooooooo#oo==oo#o=ooooooo=#oo==#oo=o=oo=oo==oo==oooo=oo==#ooooo
#########################################################################o###########################ooooooooooooooooooooooooooooooooooooooooooooooooooooo#===##o##o########o==o=ooo=o=ooo=oo=oooo=ooo=oo=o=ooo=oo=o=ooo==o=o==oo==ooo=o=oooooo#o#ooo#ooo=ooo#oooooo=oo#oo=oooooooo=#oooooo==o#=oooo=ooooooo
#############################################################################################oooooooooooooooooooooooooooooooooooooooooooooooooooo==---.--==.-=##=##oo#######o=oooo===o==o==oo=#ooo=ooo=oooo=oooooo=ooo=o=o==o===#=o=o#oo=#=o=oo###ooo#ooooo=#oooooooooo#ooooooooo=ooooooooooo#=ooo=oooo=oooo
##########################################################################o############ooooooooooooooooooooooooooooooooooooooooooooooooo=--...--====oo===o=--=##=o#oo########oooooooo#o=oo=o==#=o#oooooooooo=oo=ooo#o=ooooooo=o=o=ooo#oooo=o=oo#####=#ooo===o=o=oo=======-o=o=oooooooooooo===ooooooooo#ooooo
##################################################=o#####################oo#####ooooooooooooooooooooooooooooooooooooooooooooooo=--..---======o=oo==ooooooo=--o##=o#oo#######@ooooo=o#=o=o=oo#oooo#oo=o#oo=o==ooo=o=#ooooooooo===o=ooo#oo=oooooo#####=#o===ooooooooooooo#oo=o#ooo#=oo=oooooooooooooooo=oooooo
###############################################o##oo####################ooooooooooooooooooooooooooooooooooooooooooooooo=-. .------o==o=====o=ooooooo#ooo=o. -oo#=o#ooo#######ooooooo=ooooooo#=ooooooooooo=o=ooo==oo#oooo#oooooooooooo#oooo#oooo#####o#oooooo=oooo=o===o#ooooooooo=oooooooooo=oooooooooo=oooo
#################################################oo=o############ooooooooooooo===ooooooooooooooooooooooooooooo=--..-.-=--o==o=o===o==o=oo==oooo=o===o==#=oo-oooo=o##oo#o######oooooo=o==#ooooo#ooooooo=oo=o==oooooo#oooo=o=oo=oo#oooooooo#=oooo##o---------------------ooooooooo#ooo#==oo#ooooooooooooo=oooo
##################################################o########ooooooooooooooooooo=o=oooooooooooooooooooooo=-...-===o=====o==ooo==oo==o==o=ooo=ooo=oooooo=oo=ooooo#o=oo##ooo#####@o#ooooo#o=#oo===#oo#oooooo==oooo==o==o===o=ooo=oo=o=o==o=o=oooooo#oo=---------------------oo---=o=#o=oooooooooo#oooooooooooooo
################################################oo==#ooooooooooooooooooooooooo=o=oooooooooooooo==-...-=====o===oo=o=ooooo#oooooo=oooo=ooooo#oooooo=oo=#=#o=ooo##==##oo##########o==o###=#oooooooo#ooooooo=o=ooooooooooooooo=oooooooooooooo=oooo##oo=-.------.-======-=====------oo=ooooo=o=o=o=o=oooo=o===o=
##############################################@ooooooooooooooooooooooooooooooo==oooooooo=-- .=====o-oo===oo#==ooo=oooo==ooooooo===o=ooooooo#oo#oo=ooo=##oo=ooo##==oo#o=oo####@#ooooo#ooooooo#oooo#oooo#oo=ooooo#oooooooo#=ooooo=o#=ooooo==ooooo####o=------.-=oooo=ooo===-------ooooo#oo=ooo=ooo=o#oo=#ooooo
#########################################ooooooooooooooooooooooooooooooooooooooo=---.--=-=-=====o=#=oooooo===o==oooo=oo==oooooooooooooooooo#oo#=ooo=oo=#=ooooo#o==####o#o#####@ooooo=oooooooooooo#ooooooooo=ooooooooooo#=oo=o=oo#=ooooooooooooo#####=-------==oooo=o#oo#-----.==ooooooooooooooooo#oo=ooooooo
####################################ooooooooooooooooooooooooooooooooooooo==-.-==oooo=o===o==o=oo==o=ooooooo==#o=oooo==ooooo=oooo==o==o=o=ooooooooooooo=o=ooooo#o==####o#=o#####o=o===ooooooo=oo==o=ooo=oooooooooo=ooooooooooooooo=ooooooo#oo=oo####o-----.==o=oooooo=o=#==--==oooooo==ooooooo#oo=----=o=ooo=
###############################oooooooooooooooooooooooooooooooooooo=------===ooooooo=o===oo=oooo=o=o==ooo==o#=o=o=oooo=oo#oooo#o=oo===ooooo#oooo#oooo=#ooooooo#o==######=o######o=o=o#oo#oo=oooo=oooooooo=oooooooo=oo=oooooo#o==o=oooooo=o=oooo##oo-----------==oo=o=o=o==o-===---------=oo#oo=--------=====
##########################ooooooooooooooooooooooooooooooooooo=-----=====oooooooooooo=o=o====oo=oooo==ooo=ooo=oo=o=ooo===oooooo=o==o=oooo=oo#ooo=ooooo=oooooooo##o=##o###=-######oo=#oooo#oooo#=#=o=oooo=o=ooooo#oooo==oooooo#==oooooo#oo=oooo#oo-----------------==o=-----o=o=-----------oo=oo--------------
#####################oooooooooooooooooooooooooooooooooo=-----===ooooooooooooooooooooooo#oo=o=oo=oo#oo=oooooo=o==oo=oooooooooooooo=ooooooooo#ooooo=o=o=##ooooo###o=##o###o#####@#ooo#oooo#oooo=oo=oooo#==ooooooooooo#ooo#o=oo#ooo#oooooooooooo#oo-----------...---===-------o------.------oooo=-------.------
################ooooooooooooooooooooooooooooooooo==----===oooooooooooooooooooooooooooo=ooo=oooo=o=o=ooooo=o=o#==o=oo==o==#o=o=o==oo=oo=oo==oo=o=o=o=ooo#=ooooo##o=##o###o=-#####ooooo#oo#oo#o=o==#ooooooooooooooooo#ooo#oooo#ooo#ooo#oooo#ooo#ooo---------====o==o=-------=------===----==oooo----===---==--
@@@@#######ooooooooooooooooooooooooooooooooo=----====ooooooooooooooooo##oo#oooooooooooo==#ooo=oo==ooo=oooo=o##o=oooooooo=#ooo=#oo=o=oo=ooo=#oo=ooooooo#o=ooooo##o=##o####=######ooo==#oo#oooooooo#ooo==oooooooooo==#oo===o==ooooooo=ooo#o#oo=oo#------==o=o=#=oo=o------==------o==----==ooooo----ooo=o==---
@@@@@@#oooooooooooooooooooooooooooooooo-----====oooooooooooooooo##o#oo####oooooooooooooo==ooooo==oo=o=oooooo#oo=o=o=##ooo#ooooooooooo=ooooo#oooooo=oooo=oooooo##o=##o##o--#######oo#oooo#oooo#oo=oooooooooooooo#ooo#=ooooooo#==ooo#oo#o=oooooo#=----=oooooooooo#o=------=-----------.==o=ooo=o----o=ooo=----
@#ooooooooooooooooooooooooooooooo=--.--===oooooooooooooooooo#oooooo#o##o##oooooooooooo=ooo=ooo=oo=oooooooooo=oooo=ooooooo#oo#oo==oooooooooo#oo#oo=oo#=##ooooo###o=###ooo#####@###oo##ooo#oooooooo#ooooooooooooo#ooo#oo=ooooooooooooooooooooooo=-----oooooooooo##o-------=----------==oooooo=---------=#o----
oooooooooooooooooooooooooooo=-..--====oooooooooooooooooooooooo#######oo##ooooooooooo=--o=o=oooooo=o=====-====ooooooo=oo==ooooooooo=oooo#ooo##o#ooooooo=#ooooo###o=####=--=###@###ooooooo#ooooooo=oooooooooooo#ooooo#ooo#oooooooo#ooo#oooo#=ooo-----=oooooo#=oo#o=-----oo=------=ooooo=--=-----.---==o==o----
ooooooooooooooooooooooo=-..-====ooooooooooooooooooooooooooooo##o#o######o##ooooooooooooo=o=o=o#ooooooo=oo=o==#oo#ooo=oo==oo=o=oooo#ooooooooo=oo=oooo##oooo=ooo##o=##########@@@###===#=o#==============o===========oo===o==o========================-========-===========================================-==
oooooooooooooooooo=-..--====oooooooooooooooooooooooooooooo#oo#oooo##########ooooooooooo=oooo=o#oo==#=o=o=oooo=oo#oo=o#oooo=ooooooo##ooo#oooo=ooooooo##ooo#oo#o##o=###oo.=###@@@##@ooo#oo#======================o=o=o===oo=o======o======o=================================o==o=ooooo========================
ooooooooooooo=-..--===ooooooooooooooooooooooooooooo#oo#ooooo###########o######ooooooo=oooo=ooo#ooo#=ooooooo#=ooo#oooooo==oooo#o=oo#oooooo=oo=oooo=oo#ooooooo####o=###oooo=o#@@@@#####oooo==========================o=====o===o======================o===================o=====o=o==o========================
oooooooo=-..--===ooooooooooooooooooooooooooooooooooooooooooo##o##########o####oooooooo=o=#oooo#oooo=ooooo=o#o#=o#oooo====ooooooooo#oo#oooo=ooo#ooooo##ooooooo###o=###oo#-####@@@##@#ooooo======-========--===-o==oooo===========o===============================o=o===o#oo=========o=======o===============o
ooo=-..--====oooooooooooooooooooooooooooooooooooooooooo#oo###ooo##o####oo####ooooooooo=o===ooo#oooo=oooooo===o=o#==o=oooooooo=oooo#oooooooooooo=oooo#oo#oooooo##o=###ooo##o##@#@@#@#o#ooo================-===o##########oo======o=o====o====================o=o==o###########o==o==========o================
-..--===oooooooooooooooooooooooooooooooooooooooooooooooooo###################ooooooo#oooo#oooo#oooo#oo=oooooo#oo#oooo#oooooooo#ooo#oooooooooo#o=oooo##ooo#oo#o##o=###ooo#=###@#####@#oooo==================o##########o##ooo===========o====================o==oo#############oo==o=========================
====ooooooooooooooooooooooooooooooooooooooooooooooo#oo##oo##################ooooooooo=oooooooo#oooo#ooooooo#oooo#oooo#ooooooo##ooo#oo=#oooooo#=##ooo##oo=o#=#o##o=###ooo#=###@#@###@#oooo=================o#oo#o=====ooooooooo=======================o======o=oo#####o====o#oooooo==========================
oooooooooooooooooooooooooooooooooooo#ooooooooooooo###########################ooooooo#=oo=ooooo#ooo#=#oooooo#oooo#oo#ooooo#oo##oooo#ooo#oooooo##ooooo##o#oo=ooo##o=###ooo-####@##@####oooo-==============-ooooo==oooooo=oooooo======o=========================ooooooo=oooooo=ooooo====o=====o================
oooooooooooooooooooooooooooooooooooooooooooo##ooooooo###oo###################oo#oooo#ooo=o===oo=o=o=oooooo=o=o-=o==oooooo##o#ooo==ooo#o#oooo#o#o#o#o####o#o#oo##o=####oo######@#@@##ooooo===o==o=========ooooooooooooooooooo===-============o=====o===o=====-=ooooooooooooooooooo==-======================o=
oooooooooooooooooooooooooooooooooooooooooooooooooooooo##oo#o#################ooooo#o#=#ooooooo#oooooooo#ooooo#oo#oooo#ooo#oooooooo##ooo#ooooooo=oooo##o#o#ooo###o=###o#oo#####@##@@#ooooo==============-=======oooooooo========-===================o=o==============ooooooooo======-=========o==============
oooooooooooooooooooooo#ooooooo#ooooooooooooooooooooo###o#####################ooooo#o#=oo#ooooo#oo==#=oooooo#oooo#o==o#ooo#=oo##ooo##ooo#oo=oo#o#oooo##oo=#oo#o##o=###o#oo#####@####o#oooo==o============--=======o#oo========-=-===========o================-=========o##oo=======--========================
oooooooooooooooo####ooooooooooooo###oo####ooooo##o#oooooo#####################oooo#o#=o#ooooo##ooo#=ooooooo#=ooo#ooooooo=#ooo#oooo#oooooo=o#o#o#o=oo##oooo#ooo##o=###ooo######@@##oo#oooo===============-----==============-----=======o==o==========o=======-----==============--.=========================
ooooooo#oooo##oo####ooo##oooo#ooooo#####oo##oooo##ooooooo#######################o##o#o=#=#oo=##o#=#o#oooooo#o#oo#oo#o=ooo#o=oooooo##o#oooo=#oo#ooooo#oooo#oooo##o=#####=o######@#o#ooooo#-=============-=--------=--====--------=======o====================-=-------========----.-==========o==============
ooooooooooooooo##o##ooooo#oooooo#oo#o############ooo##o#########################oo#o##o#o#oo=oo=#o#=ooo#ooooo#o=#=oo=o#oo#oo#ooo==#ooo=oooo#oo#oooo=o==#=ooooo##o=###ooo#o#####@#=ooooooo=================--.---------------.-=-=====================o=====o==--.----------------===========================
ooooooooooooooooooooooooooo##################o##ooo#########o###################oo#o##ooo#oooooooooooo##oooo###=#ooooo#oo##ooo#ooo#oooo#ooo##ooo#ooooo##o#o#oo##o=###o#oo#=o####@ooo#ooo#===============--==--...-------...-=-====================o============----..-------..--============================
oooooooooooooooooooooooooooo#########oooo###############o######################oo##o#ooooo#ooooooooooo##ooo####o#ooo##ooo#ooooo#oo#ooo#oooo#ooooo#oooo#=##o#oo##o=###o#ooo########oo#ooo#==================-------......--=-=--=============================-==--=------..-------===========================
oooooooooooooooooooooooooooo#oooo###################oo########################ooo####ooooo=ooooooo#ooo##oo#oo#oo#oo##oooo#oo#ooo=o#ooo#oooo##o#o#ooo#o##oooooo##oo#####o###oo######ooooo#======================-=-----------=-=========o=====o====o=o================-=====--=--============================
oooooooooooooooooooooooooooo#####o########o##########oo#o######################oooo##=.                  .o#oo#oo##oooo==o==ooooooo##oo#oo=#oo#ooo#oo=o-=----..-=-==o##oo##########ooo##o==============o=-=====-==-==---===-=========o==o============o=======o=====-==-=--=======-====================o=====
ooooooooooooooooooooooo##ooooo######################ooo#ooooo#################=..                             ...=#o=o#oo#oo#ooooo#oooo#oo####oooo==-------.=---=-=.-==oo#o######-....   -======================================o====o=========o=oo====o====oo==-====-=-=-=======================o==========
oooooooooooooooooooooooooooooooooo##############oo########o##############o-        .o#o                --            -o#o#ooo##o#o#ooo#oooo###oo======-----.------.-----=oo-..o=  --...  .=====-===================-============================================o=====-========================o======o=====
oooooooooooooooooooooooooooooooooooooooo##o###oo#######o##############-                                                  =##o#ooo##ooo#ooo###o=-====-=----.-...-...----.---. ........    .===---=-====---==========-========================================================================o========o===o==
oooo-.ooooooooooooooooooooooooooooooooooo################o#########-    .                       -.                          =#@#oo#oo#o#oo###o-==---.--..----...-.-..-------......      ..===============o=========-====================================================================o===o===o===o=======
ooo-.. .---oooooooooooooooooooooooooooooooooooooo#ooo###oo######o    ..                             ..                        .##@@#ooo##oo#o----...............-----.-.--.-.           #o=====o=--==============o===========================================o=========o=====o=====o========o=o=============
........  .ooooooooooooooooooooooooooo#ooo#oooooooooooo#o#####=    ..        .-o                                                 =###@##ooo#=-.........---=========-----.....             ========-=o====o==oo=o=============================================o=o======o======o======oo=o=o====o=====o===o===
       .--.-ooooooooooooooooooooooo######ooooooooo##oo#o#o##=   ....                                           .                   =########o-......-=====oooooooo=====-.....             =========o=-==o========o==---==========================o===o=====o======o==o=====o======o==ooo=o===========o==o===
  .     -oooooooooooooooooooooooooooooo####oooooo#o###oo##o   ... .                                                                  o#####@##...--===ooooooooooooo====--....             =======o=oo=o=oo==o===o======--====o==------oo==================o====o==o==o=ooooo=oo==o=====oo=o=oo=o==oooo==o===
- .=o.  ..oo#oooo#..--. ..ooooooooooooooo#ooooooo#o######   ...  .                            -                     .               . .#######=.-==ooooo=======o====--=---..     .-     .................-----------..................-.....................................................................
-...  .  .=o=-..-oo-.-.-o=--=oooooooooooo#oooo#oo#####oo   ......                                                                       o######--=o=--.....-==--..------=-..-.            .--...........................................................................................               . ...
    .       .  ...=-=oooooooooooooooooooooo###########-  .......                                                                         -##o.----=--..  ...-=--....--=------..    ..  .  ..--..............................................................................................................
 .  .  .  .    .    .  -=oooooooooooooooooooooooo####.  ........                                  .                                       .##.--.=o====----.oo-.=======-=-----  ....-.-.....---.............................................................................................................
    .... ... .. . ....  .ooooooooooooooooooooooooooo-  .........                                                              .            .#o=--==o========oo==-==o=====--=-=.       ...==-------..........................................................................................................
          .  .  .    -..-...ooooooooooooooooooooooo-  ..........                                      .                       .             .##=o==========ooo==========--==-        .......=-==--------------------------------------------------------.---.-------..-..........................----....-.-
     .       ...      .. .-ooooooooooooooo= .o###oo   ...........                                                             .            . o##=-=========------=======-.    .-oo=-.=-..  -==---------------------------------------------------------------------------.-----.--....--...-----------------
          . .  .      . -  .=oooooooooooooo-..---..  -...........                                                             .               o###=-=======----------==--   --.....-.  .  ..=-=---------------------------------------------------------------------------------...-------..----------------
                 ..  .-.... -=ooooooooooooo#oo      .-...........                                                             .               ......======-----=---===---             .-    --=-=------------------------------------------------------------------------------------------.----------------
   . .         .      ...-=.--oooooooooooooo=oo..   ---...........                                                            .               .... .===-=====-----===----              -   .------------------------------------------------------------------------------------===oo==o====----------------
.      .-         ..   .      -=ooooooooooooo      .-.............                             .                              .               .... .===--===========-----              -    -====----------------------------------------------------------------------o===ooooo=ooooooooo===o=ooo===-------
 . .      .               ..  ..  .oooooooooo=..     ..............                            .                              .              ...-...-===----=-=--=----=--             .-    -=====-----==-------=------------------------=-----------------------====oo=========================o=o=======--
 . .... .     .   .-. .  .      . ..ooooooooooooooooo      ......... .                         .                             ..                     -======---.------==--         ...-.-    -======-=---==-=-----------------=---=--=------------------------==o=o============================o===o=oo=ooo==
      ..=--   ......=.... =o- -ooooooooooooooooooooo=      ..........                          .                              .                   . -======--------=====-.            .-  .--===--=======-==---=====-==-==-=---==-=---------------==------==oo================================o=========o=o=
       ===-            .  -=--oooooooooooooooooooooo=      ...........                         .                              .                 ..  .---=----------=====- -.      .    -    --============-=-=-========-=-=---=--=-====-====-==--=------=o=========o======o=========oo===o==========o-==o=oo
       ....               .-oooooooooooooooooooooooo=      ...........                         .                              .            .-----=. . ..-----------===-=      ...  .-  -    -==-====-==-==-==-===========-==-====-=-===-=----=-------==o======o====o=o===========o===================o======
         .                  .====ooooooooooooooooooo=      -..........                         .                             ..       .----------.-...          ..... =-.- .     ...   -    .-========-=====-==============-===-====-==-=-=-==-----===o======-==o==========o====------------==========o===o=
    ... .==-.-  ..--        =====ooooooooooooooooooo=      -..........                   .-====. ------------------------=-=-..  .-=-----------=-=-...          .  . .-.=.     ........-    .---=======-=-===============-=====-=-===-===--=-=--==o================oo====-.------------------------=========
     --=======.. . .      .========ooooooooooooooooo=      -..........               -----=====. ===========================o========----------=-..    ...           ..................---...---====-=-=-=================-=====-====-=-=-=-=--=ooo==========o==o==o=.---------------------------------=====
        -=======-.-=.==.  -==============oo=====o=oo=      -..........          ...------======. ===================#@@@@@#-----------------...=........            -.=-...................-...==-----=-=-=-===-==============-=-==-==-=-=----=oo=========o=oooo=------------------------------------------=
 ...-=================-    ===================o======      -..........          .-------=======. ==============@@#@@@@#@#=-----..---.-------...o-=..........  .....=...-.................------..-----=--===-=-=====-=================---=--======o===o===o==o=----------====================---------------
 .--==-========================================-=====      --.........          .-------=======. =================ooooo.-...--...-.......--....@-=..........  ....=o...............................---=--====================-=-==-===-=---=o=============o=--------================================--------
  .-============================-       --==-==-====-      --.........      ...................................----.-=...........-.......--...-#=--........   ...=#.-...............................----==-=-======-=-============-==-=-=-=============o===------=============oooooooo=================-----
================================          .-.--.....-      -..........               ...   .                    .=-=-..-. .......-......---....#-.-........  ....#-.=.................................--=-=-=-=-===-==-=-==-=======-=-=--==o==========o==------=========ooooooooooooooooooooo=============--
..      .-=====================  o...o.    ....  ....      -..........               ...                         .o-..... .......-.....---.....o==.........  ..-oo.....................................---=-==========o========--==-=-=-==o=============----========ooooooooooooooooooooooooooooo===========
        . .-==============                     .           --.........                                          .o=...... .......-......--.....####o.......  .=#o.. ............................. ......---=======--=====-=--==-===---============o==o----========ooooooooooooooooooooooooooooooooooo=======
        --  --=============.       .                       --.........                                          ====..... ......-.......--.....oo.o.......  .==o.-=.............................. .......-=--===--==-=======--==-==--================---=======oooooooooooooooooooooooooooooooooooooooo=====
       . .   .-======-.-====.  .--.-.---. .       .        --.........                                         ==--==....  .....-..............=#-==...... .=.=.  .............................. ........----==========-=-=====--==---=o=======oo===---======ooooooooooooooooo#ooo#o#ooooooooooooooooooooo==
       ..-=-------=-=-=  .-..   ..  ..--.                  --.........         .                             .==----== ..  .....-..............=o####o... --#o.  ............................... ........=---=--=-=--=======---====--=o==oo=oo==oo=--======ooooooooooooo######################oooooooooooooo
    .----..  . .  .  .     .     .---.  .            -.... --.........  .............                         ==----=--    ....-...............-oo#=#o...-=o-.....-=o####o=-................... .......==---=---=-==--==-==--===-==-==============-======ooooooooooooo###########################ooooooooooo
    ...---             .-...   .-      .-          ....    -...........               .                      ===--------.  ....-................o--##-..o==......o@@@@@##oooo=o................ .....===--=----====-=-=====-===-=---=o==================oooooooooooo################################oooooooo
  ....   .. .       -... .  .  .  .....     .. .      .    ...........                                      ====-------##. ....-................@#=.....-=.... .-@@@@@@@@@@@@##................  ..-====--=-----==-=-=========----===o===o=============oooooooooo#####################################o#oooo
            ..   -==-.  .   .                 . .-=====-=- -........                                       .====-----=@###.....-................#@#-...=--=..  .-##@@@@@@@@@@@=...............  ..======----------===-=-==-==--=---===================ooooooooo##########################################ooo
               .====--    .     -=..    ..    .. .-=------ .........                    ..                 o===------o####o.....................=@o=.=-..-... .........-o@@#-.................  ==---===--==--=-=-=--=========-=-=-=====oo==o==o=====ooooooooo############################################oo
             =.-===--..  . -  ===##...o#o#. .    --==-..--.-........                     --.              =====-----######o......................ooo..-.  .. .................................----===-==-====-----==-=-=-====-=-=--==o==============oooooooo################################################
o#o- .==-  ------====-.   .oo-o===---oo.   . .  ---===--.=---......-                   ..---             -======---#######o-====================-=o=.-..  .  ................................=#o--==-==--====------=--=--=-==-=---===o===o==========ooooooo#################################################
oo. .=o==  ---.   -== ---o=----=-=.=oo#.       .o-=====-= .=........             .    .=.---            .========-o#######o======================--.  .. --.-============--..................o##o----==--=====---=-=-====--=-=----====o======o=====ooooooo##################################################
=. .@o##=  -...  =o.     .........    ..-==- -=-o#=-===--  ---...o=.            ..  ....----.           =========o########o=======================--.- ---.---===================-..........=###@o--===--=====-----=-====-==-=--=-==o==o===========oooooo###################################################
  =o#o#oo        .      .           .   oo=.=--=o##o   ..  --.-.=--...         ..--......---.          -=======--#@@#######=======================--.-   .--==================--===-====-...o#####o====-======-----=-==-=----=--=--==o============ooooooo###################################################
 .-.--==              --.      .-     . -=#==#o==oooo- .   ---.-=-----.      -......  ..-..           ......-=--o##o#######o=o#@@@@@@#########oo===---  ..--=====================----=======o######===--=======-------==-=-==--=---o==o===========oooooo###############o-.       .-o########################
 .....=o            .-.      .oo#o=    .--=o==.o##@@-.  -  ---.=--=--..  .-=#=o...  ..         .=o#@@=.       .-@@#oo#######@@@@@@@@@@@@@@@@@@@@@@-#@o  .=#@@@@@@@@###oo===========--=======o#####o===-=========----==-=-=-==-=----o===o=========ooooooo############=                 =#####################
==---oo-          .=.        o###.      .===--=-=--..  ..  ---------=oo######o- .===oo=     =####@@##          .##o=-=######@@@@@@@@@@@@@@@@@@@@@#=@@.  o##@@@@@@@@@@@@@#@@@@@o======-=====oo####@==-==========-----=-==----=--=---==============ooooooo#########o.                     -###################
--==.-.           =-                ...-.......      ..    ---. .-@@####o#### .-===ooooo=  oo#######=             o@#=.o##o#@@@@@@@@@@@@@@@#==--=o=-o==-o##@@@@@@@@@@@@@@@@@@@@@@@##=======oooo#@@=-----=========-.--===---=---=---==============ooooooo######oo=                         o#################
-==--o-          -o        -#.               ..-=  --.=   ====o  .##o#ooo=-. --=======---==o########=             .o=-==##=o@@@@@@@@@@@@@@#------.-=.==-=##@@@@@@@@@@@@@@@@@@@@@@@@###@@@#o=o######----------.....------=--=-=------==============oooooo#####oo-                           =################
o##=o#o.      .--o       -. =#.      -o@@@##.-@ o#  -oo=   =o#o             ..--==oooo######oooooooo=.              -###ooo#@@@@@@@@@@@@@@#---..-..------.o@@@@@@@@@@@@@@@@@@@@@@@@@@###@@oo#######=           ....----------=------==============ooooooo###oo-                             o###############
==-=o##@=  ===  o        .o .@@@#.-@####o=-      -.    ########o------===ooo#######ooooooooooooooooo=..       ..-#@@@@@@####@@@@@@@@@@####-.-==oo=oo..=o--...=o@@@@@@@@@@@@@@@@@@@@@@###@@oo@@@@@@@@#=-           ..----=-=-=--=-----=======o===oo=oooooo#oooo                               ###############
-####@@##=   =#o   ..    #   ...                       o###################oooooooooooooooooooooooooo.......  ===o@@@@#=ooo#@@@@@@@@@@@@##-=--.-=-..=-.--#oo=--#@@@@@@@@@@@@@@@@@@@@@#####o=-=@@@@@####o-.    ..   ..----=----=-------ooo===========ooooooooo=                               o##############
=o=ooooo-        ...    .=..                         -o###########oooooooooooooooooooooooooooo=-----=====.   .o@@@@@@@@@@o-o@@@@@@@@@@@@@#---==o---...--o#####-o@@@@@@@@@@@@@@@@@@@@@###@#o.=#@###@@@@o...       .  .-----------------=ooo==========oooooooo=-                                -#############
oo=o===         .o=                                 -oooooooooooooooooooooooooooooooo==----==ooo#oooo===.--o@@@@@@@@@@@@@@@#@@@@@@@@@@@#@#=----..--.-.-..-=..-o==o@@@@@@@@@@@@@@@@@@@@@@@@@#@@@@@@@@@=.............  .-----------------=o=======o====ooooooo=-                               o##############
===--            --                                -====ooooooooooooooooooooo==---===oooooooooooooooo==-.#@@##@@@@@@@@@@o===@@@@@@@@@#####o-=--------=-=====-=-=--===#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#.. ............. ----------=-------o===o======o===ooooo==                               o##############
--.              o                  .             .======oooooooooooo==---==ooo#oooooooooooooooooooo===-...=#@@#@@@#==-o--===----=======--=---..==-=--=---=o=--=@o--==ooooooooo=-#@@@@@@@@@@@@@@@#=................. .------=------------=o=======o==o==oooo==.                             oooo#########ooo
                 =-.                ...           .=====ooooo=----===oo##oooooooooooooooooooooooooo==-... ....=@@@.ooooo---------=..........   .==---=---=------@@@@@o=ooo#ooooooo=@@#@@@@####@@@@-............-==== -------=--=--=-------=o=o==o=========o===-                            =ooooooo####ooooo
                  -.                ...           -==------==oo##ooooooooooooooooooooooooooooooo====o-......  ... =##oo-.-ooo###o=----------=-----===oooo=.---==@@@@@@@o###ooooooo=o#@@@@@#@@@@@@@@-.... ....======------------------------===o=o===o==========-.                         =====oooo###ooo#oo
                 --..               ...           --===oooo=oooooooooooooooooooooooooooooooooooo=o===-....... .. .###=-..=oo##ooo----------==============.----==@@####=.o##oo=o====-@####@#oo=-...........=======-----------=--=------------==oo=o=============---                      -=====oooo###ooooooo
                ---...                           .========ooooooooooooooooooooooooooooooooo=oooo=====-....       =##=-..-======o==.o---..-=-------------------=o#####o-=#oo========.-....         ...........-==-..----------=----=-----------=oo===============---.                  -=====oooooooooooooooo
                 ---...                          -==========o==oooooooooooooooooooooooooooo=o=============     .-o#oo=-.==o=====-=---=-..--.....-....---=---==-#@##ooo##o==--===-=- .       ......... ..  .... ..------------=-=---------.-----=o=o=o==o=o====o==o=--...          .---=====oooooooooooooo===
                 ----...                        .============oooooooooooooooooooooooooo==================-      .o##==o==--==--=.-...--..==o==#-- ...----------####-o#o=----===-=--         .-..  ...=====  ....-----------------------=----.-..-oo=oo=o====o==========--..---------======ooooooooooo=======
                 ----....                       -============oooooooooooooooooooooooooooo=o===============-      .o#o=--------.-.-==o=...===-=#--...-----...---#oo==-----....-==-=.         -------  -====--..-----------------==-=-=--=-----------=oo==========o====o=o=o===---=========oooo-ooo========ooo
                ------.-....                   --=============ooooooooooooooooooooooooooooo=================-.  . .=oo=-------=-=#=oo-...-=o----=-....--.----=o=--=o###o----.---=-=  -     .========-===--..--------------------===--=-=----------.--o=====o================oo==o==o===========o=====o=o====
              ------------...                 .--===============oooooooooooooooo==========-------------------===-. .==o=---------=======ooooo####=  #########o=o##ooo####oo========  =--  .-========-=--..-------------------=--=--=---=----------.----=ooo==o===o=====o========o===o======================o
               -------------..                ..-==========----------------=======oooooooooooooooooo================-=.=-ooo===oooooo#####ooo####. -@##############oo####ooooooo===. ==---. .---===. ....---------------=-==----=-==-=-=-=--------..--.---==oo=====o==============o====o=====o=o====o==o-===
               --------------...                .--=======ooooooooooooooo=====oooo====o====o=======================oo=-#ooooooooooooo##########oo  o######################ooooooo===  ===-----.---. .---------------=---=-=-===-=-==--==-==-------------.-----======o--==ooooo=====o==oo====o==o=o====o=o===
               ---------------...               -=======================oooooo=oooooooooo=========================oo=.#######oooooo#############o  #########################oooooo=o  .o====-=.......----------------=--=-=--=---==-=-=-=--------------.-.-.----===oo=ooo=========o==o=====o====oooo=oooooo-
               .--------------.                .-=================================================================##.###########################= .##############################oooo  =ooo===....-.----------------=------=-==---==---=-------------------.----...--oooo=ooooo=oooooo====oo=oooooo====-----
               ---------------.                --================================================================o##############################- .###############################ooo  =oooo==-.-.-------------------=------===--=====---=------------------..--.-.-......-====ooo=ooooo==o=oo===------.----
               .--------------..               --================================================================###@@#######################o##- .#o#############################oo#= -oo##oo------------------------=-==-=-=-===-=--=--=----------------------.-.-...--......................-------------
               .--------------...             ---=============================================---------------=--=###@###@#######################-  ###################################.=o####o---------------------==--=-==-=-=-==-===-=====---=---------------=------------....--.-.......-..--------------
               ---------------...           .-----===================-=-==---==================================o####@##@@#######################=  ###################################o######o--------------------------=-=-======-====-===--=-=------------------------------------------------------------
               ---------------...       ...---------------------====================oooooooooooooooooooooooooooo####@@@@@#######################=  ###########################################-----------------------========================-=-=-----------------------------------------------------------
    ..        ---------------....       ...-----=========--===ooo=ooooooooooooooooooooooooooooooooooooooooooo#ooo@##@#@@##########o#############= .###########################################----------------------====-====---=====-=====--==-=---=-----=------------------------------------------------=
     ..          -------------=====----===oo=oooooooooooooooooooooooooooooooooooooooooooooooooo##o########o####o#####@###########oo###@@@####o##- .###############@###########################.---------------------====-====-===-====-=============--------------------.--------------------.--------------
       ..          .-=================ooooooooooooooooooooooooooooo##oooooo#ooo#oooooooo#ooo#o####oo#####oo####o#@###############o##############. -############@@############################=.------------=--=--=-----============================--------------=------=------=----------------------------
.       ..==--==--===oooooooooooooooooooooooooooooooooooooooo#oooo################################oo#oooooooooo##################=@#############  o#########################################o..----------==--===--=-=======-==-=============-====-=====-===-=-----------------------------------------------
ooo=====oooo=ooooooooooooooooooooooooooooo##ooooooooooooooooooo#o##o###########################o##################@@#@@########################= .@@@@@#####################################o.--------------===-====--=========================-==-====-==--====--=-=--------------=---------------------=--
oooo##oooooooooooooooooooooo##oooooooooooooooooooooooo#######ooooooo##############ooooo####oo############oo#######@@@@@@@@@@@@#@@#@#@@#@##@@@@@. -@###@@@###################################o.-----------------=-=======================-==========-=-===--=--=--=----=-------==----=-=--------------=------
oooooooooooooo##o#ooooooooooooooooooooo####oo#########################oo####o#ooooo###ooo###########o#oo##########@@@@@@@@@@@@@@@#@@@##@@@@@@@o  o@@@@@@@@@@#########@#############oo###o###o..------------====-=--=============================-=-====-=============--==----=-------=-=--------------=-----
##oooooo#oooooooo####o##########################o#######oo########o###########oo###################o################@@@@@@@@@@@@#@@@@@@@@@@@@@. .@@@@@@@@@@@@@###@#@@@@#@@#@#@@@############o.----------=--=-===-======================-=-=====--====--=----==------=-==-===-=========-=---==-----==--------
oooooo#####################################ooooooooo######################oo###################oo####################-======ooooooo#o====o#@@o#oo@@@@@@@@@@@@@@#@@@@@@@@@@@@@@@@############o .--=-----============--===--=-====-----========---------=-----==--------===-----------------------------------
#####################oooooo##ooo#######oooooo#o##ooooo####o###########oo####################oo#######################---.................      .   -######@@@#@@@@@@@@@@@@@#@@@@@#@########## .-------=-==-===-==-=-=====================-========---=--==-=-==---===------------------------===============
###############ooo#################o####o##o####o####oo#########o#o#####o####################################o#######=-------................      o###................--===oo###############.----=-=----=====================-=============-==-==-=--=====--==------===========oo==o==ooooooooooooooooooooo
###o###o######################o##################o##################o#####################################o##########==---------.-............    -####=.........------====-==------##o######..---------===-==-====================================--==---=-----======o=o==oooo=o==ooo-=oooo=oooooo=oooooooo
##oo###################oo#oo#################oo################ooo#################oo#################################===--------.............    o#####.....--------======---------#o#######..---=-=-=--=====-==============================-=-====-===----======o=====o=o=ooo=oo=ooooooooo==============o=
#o####o##################################o######################################o##################################oo#====--------.-...........  .###o##....------===========-------#########.----=---=-=================================-========-------==oo======o==oooo==ooo=oo=oo====o==o=====o=o=o=oo==
#####################################o#o#####################################o##################################o=####===-----------...........  -#o####-..------============-------#########.------==-==================================--==-=-==----==========o=oooo======o=o=oo===o=o=o=o===o==o==oo==o=o
####oo###############################################o###################o####################ooo#o###oooo#oooo##oo###==---------------........  o######=..---==========-=--=------=######### .---=----==-=-================================-==------=o===o=ooooo====o=oooooooo=oooo==o===--o=======-==-==-=
#################o###############o###########o###o##############oooo#o#oo######ooo########o#########ooooooo###########o==---------------.........#######o.----=============-=------=########o.-------=========================================----=o=======oo===oooo=o=.        -------------.              
#############################################o#########################################oo#######o##########oo##########==---------------..... . .#######o.----===============------o########o.------=---=--===========================-=--==-----=oo=ooo=====oo=o-             .-------=-====.              
####################o######################################oo###ooo####oo#####oo#oooo#####oo#############oo############==----------------...... -########----===============-------=########o.-------=-===========-=====================-=-=---=========oo=o==.                .=============.              
################o############################################oo#########o###############o####ooo#o#####o########o######==---------------........=########----==============--=-----o########o.-------=-=-==-======================--=---=----==========ooo=.                   .===o=========.              
###########oo#############################ooo#############o###o######################=#############oo##################o-----------------.... ..=########---==================-----o########o.---------===--=-================--------=-----o====oo====o=                     ..=-===o==o=o==.              
####################ooo###########################o###oo##############o####o#####oo#####################################=----------------.......o########----================------o########o.-----------=--========-===========--=-=-----======o==oooo                       ..=ooo=o=====o=.              
################oo#######################oo#######oo####o#####################oo########################################=---------------........o########----==============--------##########.-----=---===-===================-=--===----=o=====o=ooo-                         .=ooo==ooo====.              
o##########oooo######################oo########oo########o##########ooo########o############o#######o#o########oo##o####=---------------........o########---===============--------#######@@#.-----=---==-==================-=-=---=-=--o======o=o==                          ..ooooo=oo=o=oo.              
########oo########################o#########o####################oo################oo####o#######ooo##o#################o=--------------........#########---===============--------#####@@@@#.-----=-=--=====-==-==---===--====--=--=--=======o=oo=                           .-oooooo=oo===o.              
#o###o##################################oo####################oo######oooo############oo###########o###########o#######oo=---=----------........#########---=================---.--###@@@@@@#.---==-=======-======-===-====-====-==---======o==oo=                            .-=oooooo=o==o=.              
ooo#######oo###########o###########ooo#o##o###############ooo###o#o#############o###o####################################=--------------.......-#########---=============----------##@@@@@@@# .---=---=====-==========-=====--==--=---==oo=o==oo=                             .-o=o==o=o=o===.              
######oo####################################oo#########oo########################o#####ooooooooo##ooo#######o############==-------------.......-#########---=============------.-.=@@@@@@@@@# .-=-==---==============-=--=====-------==o==oo==oo-                             .-o=o===o=o=o==.              
##oo###################o############################ooo#####o#########o###########################oo#####oo#o#ooo###o####o-===---------.....-..=#########----=============--------o@@@@@@@@@o.-------=-===-============-===-=---=----=o=o=oo=oo=.                             .-oo==oo====o==               
o#########oo###################o##oo####o########oo#################################o###oo##ooo########o##o#ooo#######o###--===---------....-..=ooooooo##=-==============---------@@@@@@@@@@#.------=--===-==============-=-===--=---o===ooo=oo-.                             .-=o=o===ooo==o               
#####o#################o#oo##oo###o#oo########oo#####o#######o##########ooooo#ooo#o####o##o###ooo#oooo#####o##o###########====-==--------......o#########o--============---------@@@@@@@@@@@#.---------=====-=================----=-=====oo===o..                             .-=o=oo====oo==               
#ooo#######oo##oo#o#ooooo####o####o###o####################oo#######oo####o#######################oo#ooooooooooo##oooooo##o=====-==------.-....o##########=--===========-------=@@@@@@@@@@@@#.---------===-========o=-======-==-----=o====o=o==..                             .-=====o==o=o=o               
#############oo##########ooooo##o#o#o########oooooooo##oo##ooo#################################oo############o############o=====-------.......=###########o--============------#@@@@@@@@@@@@#.--------==-=--================-=------oo==oo=oo==...                            .-==o==oo=oo=oo               
##########o##########################################o###oooo####oo#########o#########o###o##oo##############o###########o#o====-----.....-...o############-==-===========------@@@@@@@@@@@@#.-=-==---==-=-==-===o====-======-===---oo===oo=oo=-..                            .-===o=oo=====o               
######oo#################o#o#ooooooooo#oooo#o#####o###ooooooooo#######o######o#oo##########=#######oooooooooo##o###oo######o===-----......-...oo###########=-==============------@@@@@@@@@@@@..-=-==-==-===-==o====o-=--====--------====oo=o=o=-...                           .-=o==o==oo====               
##oo################o#########oo###############o##############################o###o#o###=o########o###o##########oo###oooo#o===------......-..o############=-=============-------o##@@@@@@@@@..-=--=-====-===========o=-=--=--==----=====oo==oo-....                          .-oo======o=o==               
o######oooo################o################o##############oo##################oo####oo########################=#####ooooo#o===----...........o#ooo########o-====----====--------=@@@@@@@@@@@ .-===-====-=-========---=======-=-----=====oo===o=-....                         .-oo=o=o=====o=               
########################o######o#########o######oooooo####o#####o#############oooo#oo#############oooooooooooo###oo########o=--------.-....-..#####o#oooo###---====----==--------#@@@@@@@@@@# -===-==--=-=-===============-====------===o=o==ooo--....                        .=oo===oo===ooo               
oooooooooooooooooo##oo################o#####o##ooooooooo################ooooo#################o#oo#####oo#o=#ooo#o####oo###=-==-----..........o##oooo#######o---====-----=----..-o@@@@@@@@@@# -----==-====-=-======-======-=----=----=====o====o=--.....                      .==ooo=========               
oooo#oooo####oo##ooo##########################o#####################################o###o###oooooo#oo####=##oo#####ooooo#o#=-.................o#############o-----===----------.-@@@@@@@@@@@# -===-======--=-=======o=====-=--=-=-----oo==ooo==oo=--......                    .======o=o=o===          .    
###ooooooooo#ooooooo##########ooooo#####o##oo######oo#########################oo#oo##############oo#ooo=oooooooooooooooooo....--..........-...=###########o#o--------==---.------o@@@@@@@@@@# ---=-====--=========--=--====-===--------=======oooo=---......                  .==============               
##########ooo##########################oooo###ooo######o################oooo##oooooo#oo#ooooooooooooo=ooooooooooooooooooo=..---...............-##########o##o----------==--..----=@@@@@@@@@@@ ---==-=============-=---====-===---------==o=====oooo=----......                .======o=======               
#######oo################o#oo####ooo##=o##########################ooo#oooo###o#ooo#oooooooooooooooo=ooooooooooooooooooo#oo------..........--...ooooooooooooo@--=-------.--=--..-.=@@@@@@@@@@@.-==-====-============---====--=--==-------=====oooo==o==----........            .====o==o==oo=o               
##o#o=############o#####o###o####o#=o##############o######ooooo############ooo#o#ooooooo###o##oooo###oooooooooooooo#######-----.--.......---..-##oooo###oo@@@#-----------...------@@@@@@@@@@@---======-==-====-====--====-==--=-=--------==o===o===o=o=------.........        .==o=o===o=oo=o    ........   
#=o#############################o#################oo##oo##o#####ooo########oo#####o#o###oo##o#oo##o########oooooooooooooo#=-----.--.......--...######o#o#@@@@#=-------------..----@@@@@@@@@@@---===-=======-========-===--=-=---=-=--=-----oo==o====o==o=-------...........   .==o=====oooo=o ..............
############o################oo###############ooooooooooooooooooooooooooooooooo#ooooo###oooooooooo#oooooo##ooooooooooo=o#o#-----.-.........-...oooooooo#@@@@@#--------------------#@@@@@@@@@@--=---======-==========-======--====-----------====o=oo===ooo=--------............======o===oo==...............
########oo#############o##oo################oo##oo########=oo#ooo##o########oo############ooooooooooooooooooooooooooo=oooooo------........-....ooooooo@@@@@@@o--------------------@@@@@@@@@@@.---=================-=-=-==========------------====-==ooo==ooo==----------.......==============..-------------
o##oooooooo#oooooo#####oo######oooo#oooooo########oo####=######oo####ooo#o#oooo###oooooooooooooooooooooooooooooo#oo=oooooooo=-..--..----..---..=oooo#@@@@@@@@#--------------------@@@@@@@@@@@..=--==-===--========-=--==========--==------=----==o==o=oo==o=oo===--=------------=======ooooo=.-=--=---------
#o#ooo##############oo##ooooo###o##oo#oooo####o##oooo=o#######ooooooooooo#oo#ooooooooooooooooooooooooooo#oooooooo=ooooo#oooo=------.-.....-.-..=ooo@@@@@@@@@@#=------------------=@@@@@@@@@@@.-=-=--===-==-===-====-==-========-=====------=---.-=o==oo===o=o==ooooo====-----=================-=====o=o=oo=o
o#####o######ooooo=oooooooo#############oo#oooo#o#o=#############oooooo#oooooo#ooooooooooooo#oooooooooooooooooo=o####oooooooo--..----.....-.-..-##@@@@@@@@@@@#-------------------=@@@@@@@@@@@---===-===============-======-=-====--==--==----------==o====o===o====oooooo===========o==========o======o=o===
###ooooooooo##o-o#oo#o#o##o###########oooooo####oo###oo######oooo#oooooooo#ooooooooooooo##oooooooooooo#oooooo==oooooooooooooo-------...........-@@@@@@@@@@@@@#=------------------o@@@@@@@@@@@=--===-=====================-==-=====-====-==------------==o=====o===============o============o=========o====o=
###########ooo##########o#o##########o###oo#oo=##o####oooooooooooooooooooooooooooooooooooo#ooooooooo###o#oo==ooooooooooooo##o=------.-..-.--....@@@@@@@@@@@@@#-------------------o@@@@@@@@@@@o--==--=====-=========--=======-==========--==-=-----=------=oo===o============o=o=======o=====o==o===o========
#########oo#######oo#o##################o##==#oooooooooooooooooooooooooooooooooooooooo##oo#ooo##ooo#o##ooo-oooooooo##ooooooooo--------.........-@@@@@@@@@@@@@#------.------------o@@@@@@@@@@@o-==-=--=-==-=========-============-=====--=--=-=----=----------==========o=o===oo=oo=======o=oo=====o========o
######oo#####o#####oo##ooooo####oooo#oooo=ooooo####oo###o#oooooooooooo#####oo###o#o##oooooo#o#oo#ooo##oo=o#ooooo#ooooooooooooo--------..-.. .-.=@@@@@@@@@@#@#o-------------------o@@@@@@@@@@@==-==--=-==--=-============-====---==========--=-=-------------------=oo====oo=o==o==o===o====ooo====o====oo==o
###=o########o##############o#######o#==o########o##############oo####ooooooo###ooo##o##oo###oo###ooooo=##oooooooooooooooooooo=------..---..-..=@@@@@@@@@@@#@#-------------------#@@@@@@@@@@@=--==--=================================-==-==-=---------=-----------------------------------------------------</p>`;
        case "profile":
            return `<p class="asciiPanel">............................................................................................................................................................................................................................................................................................................
...................................................................................................................................................................................................................................                                                                .........
.............................................................................................................................................................     ...............................................................                                                 .....----.     .   .......
.............................................................................................................................................................     ...............................................................                                                 .....----.    ..   .......
...........................................................................................................................................................  --...  .............................................................   ..         ..............   ..            ..  .......--.......   .......
.............................................................................................................................................................  .--..  ...........................................................            .......            ..              .....                .......
..............                                                               ................................................................................  .--..  ...........................................................   .        ....              ...              ..        .          .......
..............  .----------------------------------------------------------  ................................................................................  .--..  ...........................................................     ..       ..                               ..       ..          .......
..............  .----------------------------..................------------  ................................................................................  .--..  ...........................................................       ....                               .......                   .......
..............  .-------------------------........................---------  ................................................................................  .--..                                             ................          .                                                    ..   .......
..............  .-------------------------........................---------  ................................................................................  .-...                                             ................          .                                                    ...  .......
..............  .-----------------------.....---------............---------  ................................................................................   ....              ..                   ..          ..............                        ..                                 ..       .......
..............  .---------------------....-------...................-------  ................................................................................  .--..   ..  ..          ..     ..              ..   ..............   ....                                 ..          ..     ..       .......
..............  .------------------.......--------------............-------  ................................................................................  .....                   ..                          ..............   ...........            ..                        ..     ..       .......
..............  .------------------.....-------------------...........-----  ................................................................................   ..     ..     ....     ....          ..            ..............  .....                     ..            ..            .....  ..   .......
..............  .------------------.....---------------------.........-----  ................................................................................  ...     ....   ..         ..     ..        ..   .   ..............  .....       .....       .......       ....          ..            .......
..............  .------------------.....---------------------.........-----  ................................................................................  .-...              ...  .....  .......         ..   ..............  .....     .........                                 ..            .......
..............  .----------------.....-----------------------.........-----  ................................................................................  .--..              .......................   ....   ..............  .....     .........                                 ..            .......
..............  .-------------.....----------------------------..........--  .................................                   ............................  .--..     .........                        ..     ................  .......   .........                     .................  ..     .......
..............  .-------------.....-----..--------------.................--  ..........................                     .....     .........................   --  ...........................................................       ..     .....                                 ......          .......
..............  .-------------.....-----.......---------...--............--  ........................                          ......     ........................  .............................................................       ..            ..                   ..........              .........
..............  .-------------...----...--...---------..--...--..........--  .....................                                 .......     ..................................................................................              ..   ....   ..              ...................  ............
..............  .-------------...---------------------..-------..........--  ...................                                        .......  ................................................................................                                          .................................
..............  .-------------...---------------------..-------..........--  ...................                                        .......  ................................................................................                                          .................................
..............  .-------------...---------------------..----------....-----  ...................                                          .......   .............................................................................     ....                          ..     .................................
..............  .----------------..-------------------..-----.........-----  .................                                               ......   ...........................................................................     ..              .....  ..            .................................
..............  .----------------..-------------------..-----.........-----  .................                                               .........  .........................................................................     ..     .......                       .................................
..............  .------------------...------------------...--.........-----  .................                                                 .........                                                  .........................       ..............                 ...................................
..............  .------------------...---------.....................-------  ..............                                                      .......   .....................         ..   ..   ....   ..........................................................   .....................................
..............  .--------------------.....---.......................-------  ..............                                                      .......                                                  ..........................................................  ......................................
..............  .---------------------....--...---------............-------  ..............                                                      .......                                                  ..................................................................................................
..............  .---------------------..--...--..---.........--...---------  ..............                                                         ....     ==o######- .=======                          ..................................................................................................
..............  .-----------------------..--...--.....==...--.....---------  ..............                                                                      .====. .oooo-                            ..................................................................................................
..............  .-----------------------..  .----==----------..   ..-------  ..............                                                      ............  =o=  --===         =========-              ..................................................................................................
..............  .------------------.....         ===----            ..-----  ..............                                                             =####..     ##- .----. .=======                   ..................................................................................................
..............  .--------------....            ---------...           ...--  ..............                                                    =======  =####..     oo=--..==. .-------                   .......................                                             ..............................
..............  .-------------.....            ==-------...           ...--  ..............                                        ...       ..==ooooo  =##oo..   ..==---  --. .-------                   .......................                                             ..............................
..............  .-----------..                 ==-----.......            ..  .................                                   --=o-      .====ooooo  =#o==..   ==                                      .....................     .                 ..                        ............................
..............  .---------..                .==-------.......                .................                                   --=o-      .====ooooo  =====..     ####o  ooooo==                        .....................     ....   ....       .....                ..   ............................
..............  .------...                  .==-------.........              .................                                   --=o-      .====ooooo  ===..         -==                                 .....................                   ..                ..          ............................
..............  .----..                   ===-----------.......              ...................                                 --==-    =======ooooo       oo. .==--. .##-----====.    =======          .....................  ..                   ..            ..          ............................
..............  .--..                     =====------------.......           ...................                                 ================ooooo         ---    -==                                 .....................  .....  ..............   ....................   ............................
..............  .--..                     ..-==----------------...           .....................                               ================oo=..    .==  ...    .----    .---------                 .......................     ..              ..                      ..............................
..............  .--..                       .------------------...           .....................                               ==============oooo=      .oo           .==    .=========                 .......................     ..              ..                      ..............................
..............   ..                            ----------------.....         ........................                         .--==============oooo=    o#o  ==.      =####                               ..................................................................................................
..............   ..                              -----------------..         ........................  --=================  -----==============oooo=    =====  ---======-                                 ..................................................................................................
..............   ..                                   ------------....       .....................     --------------=======--===============oooo                                                         ..................................................................................................
..............                                                               ...................                     --=================ooooooo  =oooooo. .oo  =oo                                        ..................................................................................................
..............................................................................................                       -------==========oo       ==. .oo  ===oo==oo=                                        ..................................................................................................
..............................................................................................                       .......------------   .   ==...--..=====-----                                        ..................................................................................................
...........................................................................................                                               --.  -----  -------                                             ..................................................................................................
.........................................................................................                                   .........   oooo=  ooooooooooo=                                               ..................................................................................................
.......................................................................................                                        .........                                                                  ..................................................................................................
................................................................................                                                 .......     ................       ........................................................................................................................................
.............................................................................                                                       ........   ..............       ........................................................................................................................................
...........................................................................                                                           ......   ..............       ........................................................................................................................................
...........................................................................                                                             ....   ..............       ........................................................................................................................................
.........................................................................                                                               ....   ..............       ........................................................................................................................................
......................................................................                                                                     .      ........            ......................................................................................................................................
......................................................................                                                                       ....   ..                     .................................................................................................................................
.............................................................                                                                                  ..                            ..........     ................................................................................................................
...........................................................       ...................    .....    .....                                           ....                          ....   oooo-  ..............................................................................................................
.........................................................         ...................    .....    .....                                             ..                                 oo==-                                                                                             ...................
........................................................          ...................    .....    .....                                             ..                                 oo==-                                                                                             ...................
......................................................       ............................    ......    .....                                          ....                        ooooo=========                                                                                     ..     ................
......................................................       ............................    ......    .....                                             .                        oo========--                                                                                    ..        ................
......................................................       .................................    .....     ....            ..                             .........         -oooo=======--.                                                                                      ..        ................
......................................................       .................................    .....     ....            ..                                    ..         -oo=========                                                                                       ..   ..     ................
......................................................       ..........................................     ....            ..                                    ..         -=======--..                                                                                                   ................
......................................................       ......................................         ....            ..                                             ..-=======--                                                                                           ..        ................
......................................................       ......................................         ....            ..                                             ..-=======--                                                                                    ..   ..          ................
......................................................       ..........................................     ....            ..                                               -==--                                                                                         ..   ..          ................
......................................................       ..........................................     ....            ..                                               -==--                                                                                            ..            ................
......................................................       ..........................................     ....            ..                                                                                                                                                ..         ...................
......................................................       ..........................................     ....            ..                                                                                                                                                ..       .....................
......................................................       ..........................................     ....                                                                                                                                                                       .....................
......................................................       ..........................................     ....               ....                                                                                                                                                  .......................
......................................................       ..........................................     ....                 ..                                                                                                                                               ..........................
......................................................       ..........................................     ....                 ..                                                                                                                                             ............................
......................................................       ..........................................     ....                 ..   ............................................................   ..   ..  ..   ..   ..            ..   ..  ..   ..   ..                   ..............................
......................................................       ..........................................     ....                      ............................................................     ..   ..   ..  ..   ..        .   ..   ..   ..  ..   ..                 ..............................
......................................................       ..........................................     ....                      ............................................................          ..   ..  ..                 ..   ..   ..                          ..............................
......................................................       ..........................................     ....                      ............................................................                 ....                                                       ..............................
......................................................       ............................                   ....                      ............................................................                 .....                                                      ..............................
......................................................       ............................                   ....                        ..........................................................                   ...                                                      ..............................
......................................................                                                                                    ........................................................                                             ooooooo                        ..............................
......................................................                                                          ...                       ........................................................                                          .oo.......oo.                     ..............................
........................................................          ...................................................                     ........................................................          .......                       =o=...........=o=                   ..............................
.........................................................         ...................................................                                          ...................................          ............                -----.......    -o=                   ..............................
...........................................................       .....................................................                                        ...................................          ..---.........              oo-.........    -o=                   ..............................
...........................................................           .............................                  .....              .......................   ................................        ..--...----.......            --.......     oo.                     ..............................
...........................................................           .............................                  .......          ............................       .........................        .......--.....--..              ---oo     oo                        ..............................
...........................................................                                                                        ......................................  .......................            .....--.....                     oo.                            ..............................
...........................................................                                                                   ...  ........................................  .....................                 .......                                                    ..............................
...........................................................                ........................................................   ............................  .........   ..................                 ....                     .oo                               ..............................
...........................................................                ........................................................     ........................    .........   ..................                                          .##---..                          ..............................
...................              ..........................                ..........................................................   .......................   ...........   ..................                                          .####oo=                          ..............................
................                   ........................                ..........................................              .....  ...................   .............   ..................                                          .oo#####oo                        ..............................
..............                        .....................                ..........................................              .......                      .............   ..................                                        =o=--##=--####-                     ..............................
............                          .....................                                                                             .......................   ...........   ..................                                        =o=--##=--##oo-                     ..............................
............                            ...................                                                                             .......................   ...........   ..................              .==                       =o=.........oo-                     ..............................
.........                               ...................                                                          .................................            ...........   ..................          -----==--.                    .-.............                     ..............................
.........                               ...................                          ........................................................                     ...........   ..................        ..=========..                                                       ..............................
.........                               ...................                          ........................................................           ..........  .........   ..................       .==.....======-                                                      ..............................
.........                               ...................                                                                                           ............  .........   ..................     =====..---....==-                       ==.                            ..............................
.........                               ...................                       ..............................   ...........   .......  ........................  .........   ..................     ===--.......====-                  -=-  =====                          ..............................
.........                               ...................                       ..............................   ...........   .......  ........................  .........   ..................     ===----.....==.                  ==---==                               ..............................
.........                               ...................                       ..............................   ...........   .......  ........................              ..................       .=========                                                           ..............................
.........                               ...................                       ..............................   ...........   .......  ........................              ..................       .--==-----                                                           ..............................
.........                               ...................                       ..............................   ............  .......  ........................    .......   ..................          ==.                                                               ..............................
.........                               ...................                       ..............................   ............  .......  ........................    .......   ..................                                                                            ..............................
.........                               ...................                       ..............................   ............  .......  ........................    .......   ..................          =======                         .oooo-                            ..............................
.........                               ...................                       ..............................   ............           ........................    .......   ..................       .==oo.                           =o=  ..=o=                          ..............................
.........                               ...................                       ..............................   ............    .....  ..........................     .......  ................       .====. -oo                       =o=....=o=                          ..............................
.........                               ...................                       ..............................   ............    .....  ..........................     .......    ..............       -oooo==-..                       ..-====-..                          ..............................
.........                               ...................                       ..............................   ............    .....  ..........................     .......     .............       -oooooo=                           .====.                            ..............................
                                          .....                               .                                    ...........     .....                                 ...........                     -oooooo=                                                                                      .....
.....                                          .........                      .     ............................   ...........     .....     .......................            ....   .........                                                                                         ...................
                                                                           ..                                      ............    .........                                                           ..   ..   ..  ..   ..        .   ..   ..   ..  ..   ..                     .......   ................
..                                                           .......   ....                                        ............         .....                                                        ..   ..  ..   ..   ..            ..   ..  ..   ..   ..                          ....   ................
                                                                                                                   ...........


..                                    .......................                        .........  ..............   .........  ..............   .........                                                                                                                                   ...................
..   ..                          ................................                    .........  ..............   .........  ..............   .........                                                                                                                                      ................
..   ......               ............................................               .........                   .........                   .........                                                                                                                                      ................
                                                                                     .........                   .........                   .........


..........................  ..........................................                                                                                                                                                                                                                        ..............
..........................  ........................................                                                                                                                                                                                                                          ..............
..........................  ...................................                                                                                                                                                                                                                               ..............



.................................  ..........................                                                                                                                                                                                                                                    ...........
.................................  .......................                                                                                                                                                                                                                                       ...........
.................................  .....................                                                                                                                                                                                                                                           .........


.................................................                                                                                                                                                                                                                                                    .......
...............................................                                                                                                                                                                                                                                                      .......
...............................................                                                                                         .....................   .........                .........................................................................  ........................................
..........................................                                                                                         ..........................   .............        .............................................................................  ........................................


................   ............................                                                                         .................................................................................   ................................................................................................
................   ............................                                                                         .................................................................................   ................................................................................................
................   ...................................                                             ....   ...............................................................................................   ................................................................................................
................   ....................................................................................   ...............................................................................................   ................................................................................................</p>`;
    }
}

function buildTypingSvg(accentBrightHex) {
    const color = encodeURIComponent(normalizeHexColor(accentBrightHex) || THEME_ACCENT_BRIGHT.green);

    return `<h1 style="text-align: center; margin-bottom: 12px;">Gianluca Rainis</h1>
<img src="https://readme-typing-svg.demolab.com?font=ui-monospace%2C+SFMono-Regular%2C+Menlo%2C+Monaco%2C+Consolas%2C+Liberation+Mono%2C+Courier+New%2C+monospace&size=10&duration=3000&pause=1000&color=${color}&center=true&vCenter=true&random=true&width=200&lines=Student;Developer;Open+Source+Lover;Hack+Clubber!;Hardware+Hacker;PCB+Designer;Low-Level+Enthusiast;IT+and+Networking+Student;Computer+Science+Student;Judo+Kata+Athlete" alt="Typing SVG" style="margin: 0; border: 0; border-radius: 0; width: 100%; background: transparent; box-shadow: none;" />`;
}

function getCommandOutput(command, context = {}) {
    const normalizedCommand = normalizeTerminalCommand(command);
    const accentBrightHex = normalizeHexColor(context.accentBrightHex || THEME_ACCENT_BRIGHT.green);

    if (!normalizedCommand) {
        return {
            command: '',
            action: 'noop',
            recognized: true,
            outputHtml: null,
        };
    }

    const projectMatch = normalizedCommand.match(/^project\s+(.+)$/);
    const isExtended = /(?:^|\s)--extended$/.test(normalizedCommand);
    const projectCommand = isExtended ? normalizedCommand.replace(/\s+--extended$/, '') : normalizedCommand;

    if (projectMatch) {
        const project = PROJECTS_INFO_EXTENDED.find(({ command }) => command === projectCommand);

        if (isExtended) {
            return project
                ? {
                    command: normalizedCommand,
                    action: 'redirect',
                    recognized: true,
                    href: project.href,
                }
                : {
                    command: normalizedCommand,
                    action: 'output',
                    recognized: false,
                    outputHtml: `<p>Project not found: <strong>${escapeHtml(projectMatch[1])}</strong></p>`,
                };
        }

        return project
            ? {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: buildTable(project.name, [[null, project.description]]),
            }
            : {
                command: normalizedCommand,
                action: 'output',
                recognized: false,
                outputHtml: `<p>Project not found: <strong>${escapeHtml(projectMatch[1])}</strong></p>`,
            };
    }

    switch (normalizedCommand) {
        case 'clear':
            return {
                command: normalizedCommand,
                action: 'clear',
                recognized: true,
                outputHtml: null,
            };
        case 'help':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: buildHelpOutput(),
            };
        case 'info':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: buildTypingSvg(accentBrightHex),
            };
        case 'info --personal':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: buildTable('Personal Information', [
                    ['Name', 'Gianluca Rainis'],
                    ['Date of birth', `${new Date('2007-11-23').toLocaleDateString()} (${getDateDiff('2007-11-23')} ago)`],
                    ['Nationality', 'Italian'],
                    ['Residence', 'Friuli-Venezia Giulia, Italy'],
                    ['Occupation', 'Student & Developer'],
                ]),
            };
        case 'info --contact':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: buildTable('Contact Information', [
                    ['Website', '<a href="https://www.gianlucarainis.com" target="_blank" rel="noopener noreferrer">gianlucarainis.com</a>'],
                    ['Portfolio', '<a href="https://projects.gianlucarainis.com" target="_blank" rel="noopener noreferrer">projects.gianlucarainis.com</a>'],
                    ['Email', '<a href="mailto:gianlucarainis@gianlucarainis.com">gianlucarainis@gianlucarainis.com</a>'],
                    ['GitHub', '<a href="https://github.com/gianluca-rainis" target="_blank" rel="noopener noreferrer">github.com/gianluca-rainis</a>'],
                    ['LinkedIn', '<a href="https://linkedin.com/in/gianluca-rainis" target="_blank" rel="noopener noreferrer">linkedin.com/in/gianluca-rainis</a>'],
                ]),
            };
        case 'keyboard --language':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: buildTable('Languages', [
                    ['Italian', 'Native'],
                    ['English', 'B1 - Cambridge Certified'],
                ]),
            };
        case 'image --ascii':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: buildAsciiPanel("picture"),
            };
        case 'image --profile --ascii':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: buildAsciiPanel("profile"),
            };
        case 'presentation --about':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: `<p>My name is Gianluca Rainis and I am a Computer Science student at the University of Udine. I graduated high school in Computer Science and Telecommunications with a score of 100/100 cum laude.<br />
I am passionate about everything related to computers, but what I love the most is working at the boundary between hardware and software, where the code directly controls the computer.<br />
I like working on ambitious projects, especially the ones that allows me to learn by building instead of only studying theory. That mindset led me to create a Z80 development board paired with an RP2040 microcontroller, designing the PCB in KiCad and writing the firmware from scratch. On the software side, I built FreeIdeas, a community platform for sharing project ideas, which pushed me to learn Next.js and React by building something real.<br />
I have also been practicing judo at a competitive level for several years, specializing in kata. My partner and I competed at the European and World Championships as part of the Italian national team.</p>`,
            };
        case 'skills --table':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: buildTable('Skills', [
                    ['Languages', 'Python, JavaScript, C, C++, C#, Java, PHP, HTML/CSS, Assembly'],
                    ['Frameworks', 'Next.js, React'],
                    ['Tools', 'Git, GitHub, Linux, Bash, Arduino, Raspberry Pi, Godot, Unity, KiCad, VS Code'],
                    ['Database', 'MySQL, SQLite'],
                ]),
            };
        case 'info --education':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: buildTable('Education', [
                    ['2026 -> Present', '<strong>Bachelor\'s Degree</strong> - EQF 6<br />Università degli Studi di Udine<br /><em style="opacity:.7">Computer Science</em>'],
                    ['2021 -> 2026', '<strong>High School Diploma</strong> - EQF 4<br />I.S.I.S. &quot;Brignoli-Einaudi-Marconi&quot;<br /><em style="opacity:.7">Computer Science</em><br /><span style="opacity:.7">Grade: 100/100 cum Laude</span>']
                ]),
            };
        case 'info --work':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: buildTable('Work Experience', [
                    ['27/01/2025 - 07/02/2025', `<strong>ICT Assistant</strong> - <a href="https://triesteairport.it" target="_blank" rel="noopener noreferrer">Trieste Airport</a>, Ronchi dei Legionari<br>
I completed a two-week internship as an ICT Assistant. I helped create a PHP calendar to manage meeting room reservations, assisted in the installation of two servers, and contributed to data organization and analysis in Excel.<br><br>
<span style="opacity:.7">‣ Corporate network architecture &amp; server management<br>
‣ Workplace communication and problem-solving<br>
‣ PHP · MySQL · JavaScript · HTML · CSS · Microsoft Excel</span>`],
                ]),
            };
        case 'info --certifications':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: buildTable('Certifications', [
                    ['Cisco · 06/2025', '<a href="https://www.credly.com/badges/983fc03e-5490-441b-9f9b-108bdb7d3ca4" target="_blank" rel="noopener noreferrer">CCNA: Introduction to Networks</a>'],
                    ['Cisco · 06/2024', '<a href="https://www.credly.com/badges/ecf72a74-c84d-4880-8a7a-4a61c5ee6ac0" target="_blank" rel="noopener noreferrer">Cisco IT Essentials</a>'],
                    ['AICA · 03/2025', 'ICDL Full Standard'],
                    ['IBM SkillsBuild · 03/2024', '<a href="https://www.credly.com/badges/51500970-9e4e-411b-ae39-ac40444177f5" target="_blank" rel="noopener noreferrer">Cybersecurity Fundamentals</a>'],
                    ['IBM SkillsBuild · 08/2024', '<a href="https://www.credly.com/badges/ea07be22-a6f0-444d-abe7-ad8163379ff4" target="_blank" rel="noopener noreferrer">Information Technology Fundamentals</a>'],
                    ['IBM SkillsBuild · 04/2024', '<a href="https://www.credly.com/badges/11a3e380-f241-464d-82c5-c30a82049c23" target="_blank" rel="noopener noreferrer">Web Development Fundamentals</a>'],
                    ['IBM SkillsBuild · 08/2024', '<a href="https://www.credly.com/badges/c72d0d42-6a02-4bd8-8b7c-f007434b9448" target="_blank" rel="noopener noreferrer">Project Management Fundamentals</a>'],
                    ['IBM SkillsBuild · 08/2024', '<a href="https://www.credly.com/badges/17bb586e-79de-4939-80e7-12d787cbf8b0" target="_blank" rel="noopener noreferrer">Basic Principles of Design</a>'],
                    ['Band of Rescue · 02/2026', 'BLSD & PBLSD'],
                ]),
            };
        case 'ls projects/':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: buildTable('<a href="https://projects.gianlucarainis.com">Projects</a>', PROJECTS_INFO.map((project) => [
                    project.name,
                    project.description,
                ])),
            };
        case 'info --hobbies':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: buildTable('Hobbies &amp; Interests', [
                    ['Judo Kata', 'Competing at international level as part of the Italian National Team.<br /><br /><span style="opacity:.7">European Judo Championships Kata Riga 2025 · Paris World Championships Kata 2025 · European Judo Championships Kata Sarajevo 2026</span><br /><br /><a href="https://www.ijf.org/judoka/91045" target="_blank" rel="noopener noreferrer">IJF profile</a>'],
                    ['Open Source', 'Developing personal projects and contributing to open source.<br /><br /><span style="opacity:.7">Low-level development · PCB design · Hardware/software boundary · Videogames · Web Development</span>'],
                ]),
            };
        case 'cat hackclub.txt':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: `<p>Member of <a href="https://hackclub.com" target="_blank" rel="noopener noreferrer">Hack Club</a>, a global nonprofit network of student hackers and makers.<br />
I've taken part in Midnight, a hackathon in Vienna, and Outpost, a hardware hackathon in San Francisco, where I later exhibited my projects at Open Sauce 2026.</p>`,
            };
        default:
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: false,
                outputHtml: `<p>Command not found: <strong>${escapeHtml(normalizedCommand)}</strong></p><p>Type <strong>help</strong> to see the available commands.</p>`,
            };
    }
}

export function TerminalCommandsProvider({ children }) {
    const value = useMemo(() => ({
        recognizeCommand: (command) => {
            const result = getCommandOutput(command);

            return {
                command: result.command,
                recognized: result.recognized,
                action: result.action,
            };
        },
        executeCommand: (command, context = {}) => getCommandOutput(command, context),
        getSupportedCommands: () => TERMINAL_COMMANDS.slice(),
    }), []);

    return (
        <TerminalCommandsContext.Provider value={value}>
            {children}
        </TerminalCommandsContext.Provider>
    );
}

export function useTerminalCommands() {
    const context = useContext(TerminalCommandsContext);

    if (!context) {
        throw new Error('useTerminalCommands must be used within a TerminalCommandsProvider');
    }

    return context;
}
