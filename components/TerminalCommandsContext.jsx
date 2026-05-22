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
    { command: 'info --hobbies', description: 'Show hobbies and interests.' },
    { command: 'cat hackclub.txt', description: 'Show the Hack Club note.' },
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
<td style="white-space:nowrap; padding-right:12px;">${label}</td>
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
            return `<p style="font-size:6px; line-height:6px; margin:0; text-align:center;">#*-+#%%#%@@****%@%%##*#*##*#**##%%%%%%@@@@@@@@@@@@@@%%%%%%%%%*++++::-****%%+*++*+%#*@@@%@%###%%%%%%%
++-:-=#=%%%++++%%#@%#+#+#*#*####%%%%%%%%@@@%@@@@@@%@@@@%%##%%++++=::=****#%=====*%*-=#%@@%%####%%%%%
+-=++=#-#*====+##+%%*%%*#+#+#*%%##%#%%%%%%@%%%%@@@####%%%%%#**+++-::=+++*##=---=*%*-+%%##%%@%###%%%%
@#+*#%#=###=--=*+=##+#@@@#++%##%*#%%%%%%%%@%%%%@@@@%%%%%###%%%%%%%@%*++++#*-----#%+-####%%%@%@%###%%
%%%@@%#--=+=::=+::++=*%@%###%##+##%###%%%%%%%%%@@@@%##%%%@@@%%%%%@%%#=+%*#*-----#%==*=*%#%%@@@%@%#%%
#####%@@%#*+=-+*=-++-++#####%###*#%%#*#*#%%%%%%%%%%###%%%@@@@@@%%%%%*==+***-----%%--**####%%%%%%%%%%
*++==+*#*%@@%###=::**-.-+=-=%*%##%%%@%#*%%%%%%%%%%%##*#%%@@@@@@@@%%%+==+**+-----##::*#%###%%%%%+==%%
***%#*#++==++++*#%%#%+:=+-::*=#**%@@@%+*%%%%@@%%@%%%###%%%@@@@@@@%%%---*%#=::::-#+::*#####%%%%%+=+@%
*++=+++=--=+#%*###*+++===--::--==*%@@#*#%%%@@@%+*###%%%###%@@@@@#***+=-*%%%%%%#*#=:-######%#**+*==@@
@@@%%%%%##*+++=++*++**%*#**+++-=-==+%+=+%@%%%%#**#####%%%##*#%@@#*****%%%%*%%%%%:::=*#####@%**++=+%@
@@@@@@@@%==##%%%%%#*****+=+*=-===::=--==+*++***+#%+*+%%*###++%@@*###**%@@@#%%%%+:::+*#*##%%%%%#+=+#%
##*++=+##*+#%%%%%###%%%#=+#@%**====:.:::==++====-=-==%%++**++%@#+%@@@#%%%%*%%%%*=::+****#@%%#%#===@%
++*#**###*#+***++++*#%%#==+=+#%%***-::::=++=====+**++*+======#@#+%%@@#%@%%*@@@%%%@%**+**#@%%###--=@@
*######****+*++*####*###*=======*%#***+===+=#+=++**+======*#+++==+=+++*##%+%@@@%%%#*++*@@@#####--=%@
#*###***+**+++*####*++++=======+*##++=-======+++=*%%######%#*===--===+++*#++*=+**%++###@@%##*#*-:=*#
%##*+=+**##*+**#**#*****===++*##*+=-==+##++*+**=-*%%%@%%%@@@@%%+====+=-+++=+=**#%%#%##%@@@%%#*+::+*#
####**%***++*#+#********===+**++++#*++++++***+=*#%%%@@@@@@@@@@@@%#*##**%%%%#=%%%%########%%@@%@%@@@#
+*+++**+*+==*#*#****###*===+#*==+*+++=====+***##%%%@@@@@@@@@@@@@@@%+++==+++++==*@@@%@@@%##%@@%%@@%@@
=******+###***+***++++*+-==*+----=::=+**+=+++#%%%%@@@@@@@@@@@%@@%@@%---=++**==+===--+*%%#%%%%@@@@@@%
====*##**+==*####***+##*======+*##+***+*+**+#**%%@@@@@%%######%%@%%@*+##*+++++=++=-=-=*+*#*+*++++++%
*=+++*=++++=***#####***+=+****++=***-=-++++***#%%%%###******###%%@@@%**##***++++++=#*---*****++*++++
#**+-:-++-==+**####*+***+===++=+=+==--=-::-*###*+************###%@@@%%%%#%%######==##+++#####+###%%%
=+=:---==*++++*#######%#**=--:+-:-=*****++=+##+=++********###%##%%%%+%###%%##*%%%%#%%##*%@@%%@@##%%%
***#######+-********+=*++==-=======*#=*=---+*#=+#%%%%#*##%%%%%%##%%#+-+#**%@%#%%*-:*-:%%#*%@@%%##%%#
***##**###+-*++=**##*#%#*#++**++*======+===**#+=*#%%%#*#%%%@@%##%%%#*===+*%%@@%%###%%%@@@%%%@@@%%@@@
##*%%#*###%*#%%##****+*+########**+++##*+++***+++*####*#%###########+++++*****+*#%%%%@@@@@@@%#@%%%@@
@#%%%*===+*###+*%#****##***+=+++=++===**+*++##==+****++##%#########*#++***###*****#%@@%@@@#%#****++%
+#*#+#*====+##+++*%###*++=--=--=-=----=------*+=+*##*=**###########*##*+****#+**-**+#%%%@@#**=-+***%
%#*=+###%*-=**##*=+*+****#***+++++++==========+==******#%##**###*-=**++**#%%####%#%%%##%%%%%*+#%%##@
###+=+***=--*#*==-+#==-==++*#**++++++===========-=*++**#########++++**+#%#%##%%%##%#++*##%#%@@@@@@@@
#*++++=++***###+====****++**+==+#%%=-++==+==------+*+*#########*=+++==++*##*=**#+#=+*+=++**%@@@@@@@@
-=****+==*+:*###+++#==*###*=+==**#%#*+*##*=------=-=++*#######**====*-+*=*+++=+#*+==+***%%%%%%%%%%%@
==========*#=-+===-==-=-==-=++*+==+##*=++==--=====+===+*########*++==:=#+*++**#*===-==**%%%%%%%%%%%%
=+-:::::::-=-=+===-----=--:::-===+=+*=---------*%=++++**########@+++==---+#%+==-+==+*#*%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%@@@%%%%%%%%%%%%%%%%%%+%%%%%##%##@*+*+++*#######%@#--=----++----:-*#++++%%%%%%%%%%%%%
+%##%%%%%#########*#*######+***=*+*=+==*====*###@%#****########@@#@#--::::-:--=###***::==---=+*#%%%%
+**--**------=----=-=#*=*#+=+#-====-+==**##%%%+#%@%###########%@@#@@@@#**+-:-:=###*#*==---=-====----
=*+===*##+*#%%%+=#%#%#*#*%####+=####%%%@%%%%%%=%@@%%##########@@%#@@@@@@@*%%%%####*==----===-=-----=
++=+++**+*=-=#*==**+++********=+%%@@%@@@%%%%%#+%@@@%#########@@%#@@@@@@@@@@@@*+###*==**+=--:--::-=+=
+===++********##********+++++=*%@@@@@%@@@%%%%*+%@@@@@@@@@@@@@@@@%@@@@@@@@@@@@@@@%*+-------==+++==-::
++++++++++++=++++++=++++++===*@@@@@@@@@@@%%%%#*%@@@@@@@@@@@@@@@%@@@@@@@@@@@@@@@@@@+--------------=+*
-=:::-+--+==========+++++++==*@@@@@@@@@@@@@@@%%%@@@@@@@@@@@@@%%@@@@@@@@@@@@@@@@@@@@#+++*=---**-::-=+
:::::::::::::::::::::=++++===+*%@@@@@@@%@@@@@%+#@@@@@@@@@@@@%%%@@@@@@@@@@@@@@@@@@@@@%==*#%%%##-:--*@
::::::::::::::::::::::-++===+=+#@@@@%%%@@@@@@%+#@@@@@@@@@@@%%%@@@@@@%%@@@@@@@@@@@@@@%+****+++#%%%%%%
::::::::::::::::::::::::===++=+#@@@%+++#**#%@%+#@@@@@@@@@@%**%@@@@@@*==#@@@@@@@@@@@@+++*****##*++**#
:::::::::::::::::::::::::-=++=+#@@@#+**####%@%**%@@@@@@@@@#*#@@@@@@#=#@+*@@@@@@@@@@++++*************
::::::::::::::::::::::::::=+++=*@@@%%%%%@@@@@%++%@@@@@@@@#*#@@@@@@@+=%%=*@@@@@@@@@++++++=++=+*****##
:::::::::::::::::::::::::-=+++=+%@@@%%%%@@@@@%**%@@@@@@@%+*%@@@@@@@@#===%@@@@@@@@++++++**##*#***+==+
:::::::::::::::::::::::::-++++++@@@@%%%%%@@@@@#+%@@@@@@%*+%@@@@@@@%@@@@@@@@@@@@@++++=+++*#++********
:::::::::::::::::::::::::-++++++@@@@%@%%%@@@@@%%%@@@@@@#+%@@@@@@@@+*++*+%@@@@@%*++++=+++**+**####***
::::::::::::::::::-==+++=-++++++@%@@%@%@@@@@@@%%%@@@@@%+%@@%%@@@@@@@@@%%@@@@@@*++++=++++*%##***#****
:::::--===+++++++++++++=--++++++%@@@@@@%%@@@@@%##@@@@@%%@@@@@@@@@@@@@@@@@@@@@@*++++=++++#%*++**#++++
+++++++++++===:-=-::=-:---++*+++%@@@@@@%@@@@@@@##@@@@%%%@@@@@@@@@@@@@@@@@@@@@%+++++=++++**+===+*=+++
==+=.-=-:.:::=+++++==+=--==+*+++%@@@@@%%@@@@%@@##%@@%#%@@@@@@@@@@@@@@@@@@@@@@*++++=+*+++++++==++++++
---==++++==--==+==++*%#--=++*+++@@@@@@%@@@@%%@@%%@@%#%@@@@@@@@@@@@@@@@@@@@@@@+++++++++=+++*++=**++++
***+===+=**++*+**+++*##-#++++*+*@@@@@@%@@@@%@@@@%@@%%@@@@@@@@@@@@@@@@@@@@@@@%++++++*+==++**+++##++++
*#%*#*+*++*+*******+===**%++++**@@@@@%%@@@%%@@@@%@%@@@@@@@@@@@@@@@@@@@@@@@@@*+++++++===++**++*******
#*##******+=*+++**++++*#*%%+++*#@@@@@%@@@%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%*+++++*+====+*##*##****%
****++==+++++*###*+==-===++++++%@@@@@%@@@%%@@@@@@%@@@@@@@@@@@@@@@@@@@@@@@@@#*++++*+====++***+**###*%
+++**###**++*+=++====+*++==++++*@@@@@@@@@%%@@@@@@%@@@@@@@@@@@@@@@@@@@@@@@@@**+++++=====+++***######@
#*+=--==+==+*++++++++==+*#%%%%%@@@@@@@@@@%%@@@@@%@@@@@@@@@@@@@@@@@@@@@@@@@@#**+++==++++%#***#####+=+
===--=+++=+*=====++++======++++%*@@@@@@@@%%@@@@@%#@@@@@@@@@@@@@@@@@@@@@@@@%%#*+===+++#%#%*#####%#=-=
+====-+++++*++++*===++++++*%%@@@#@@@@@@@@##%##**+*#%@@@@@@@@@@@@@@@@@@@@@@%%*+=====*##@*%*######=-=+
====+++====+**+**+++++*=*+*@@@@@@@@@@@@@@*%%#%%%%%%%%#***@@@@@@@@@@@@@@@@@*+++====+*#+*++######=-=+*
=*+==*+===+*+=-==++++*+=#=#@@@@@@@@@@@@@@*%@%%%%%#%##*#%*@@@@@@@@@@@@@@@@%@@@@#*++++++++++*++++-=+**
=***+=++*+**++=+*==+=*=*+**@@@@@@@@@@@@@@+%%+#*++#+*#%%%+@@@@@@@@@@@@@@@@#+===+*%@@@@@@%#*#***-=++**
*=====+*++=+*++++==+*#=*=#=%@@@@@@@@@@@@%*%%%%%%%####*%%*@@@@@@@@@@@@@@@@@#+====++++++==#%%##+==+**%
*+++***===++**+==##**#+*+*+@@@@@@@@@@@@@%*%###%#%%%%%%%%*@@@@@@@@@@@@@@@@@@@@@@@@+#+*+**#@@%#==**%@@
+**++****+++++==+###**#+***#@@@@@@@@@@@@%*%%%%%%%%%%**%##@@@@@@@@@@@@@@@@@@@@@@@@*+**+#%#%#==#*%@@@@
*+===*++++*##******++++=#=#+#@@@@@@@@@@@%#@@#%#%%%%%%%%#%@@@@@@@@@@@@@@@@@@@@@@@@+##++##+#%%%*%%*%%%
#+=+*********+++++++===++=#=*@@@@@@@@@@@%#@@%%%@%@%%%%%*@@@@@@@@@@@@@@@@@@@@@@@@@+#+++#########%%#*%
#******+++++++===========*+*+%@@@@@@@@@@%#***%%%%%%%%%@*@@@@@@@@@@@@@@@@@@@@@@@@*+%+*%#**####%@@@@@@
*+====+==-----========+++=#+#+*@@@@@@@@@%#%#%%%%%%%#**#*@@@@@@@@@@@@@@@@@@@@@@++%**+#*++#%#%@@@@@@@@</p>`;
        case "profile":
            return `<p style="font-size:6px; line-height:6px; margin:0; text-align:center;">****************************************************************************%%%%%%%%%%%%%%%%%%%%%***
***************************************************#**@********************@%@%%####%%@@@%%#*+*%#@**
****#@%%%%%%%%%%%%%%%%%%%@**************************@+#%*******************@%%@%%@@%%#%%@@%%%%%%%@**
****%*--------*######*---@**************************@+#@%%%%%%%%%%%%%#*****@%%%%%@%%%%%%%%%@%%%%#@**
****%*------+#+=+***##*--@**************************@+#@%%%%%%@%@%%%%%#****@#%@@%%%%%%%%#%%@%@%%@@**
****%*-----=#+=====+*##+-@**************************@#%%%%%%@%%%%%%%@@#****@#%%%%%%%%%@%%#%%%%%%%@**
****%*----*#+=======+*#*=@**********#%%%%%%*********@+#@%##%%%%%%@@%%%#****@*#%***@%%@@%@%%%##%%@@**
****%*----##=*#*==+**#*#=@*******#@@@@@@@@##%@********@********************@@%@@%@%%@%%@@***@@@@@***
****%*----#=======#==***=@******@@@@@@@@@@@@@%#%%**************************@%%%@@%@@@%%%@***********
****%*-----#======#=***+-@*****@@@@@@@@@@@@@@@@##%%************************@%%@%%@@%%%@@@***********
****%*-----=*==+###****--@****%@@@@@@@@@@@@@@@@@%##@%%%%%%%@@@%%@%@#********##*****####%************
****%*------=+*++#**+#---@****%@@@@@@@@@@@@@@@@@@%%@=..-:.+%%%%%%%@#********************************
****%*-----=+#%#=-=##%#=-@****%@@@@@@@@@@@@@@@@%@%%.*+*:++#-:+*%%%@#********************************
****%*---+%%%%%*:-+*%%%%#@*****@@@@@@@@@@@@=+@@:..%.+@-#%####%%%%%@#******@@%@@%@@#%%@@%@@%*********
****%*-=%%%%%%#:--+**%%%%@*****%@@@@@@@@@@%-=@%...@=%%#=+###%#**%%@#******@%%%%@%%%@%%%%%@@*********
****%**%%%%%%%+-=====*%%%@******%@@@@@@@@@@......=%***%*+%*==+%%%%@#******#%%%%%%@%%%%%%%@#*********
****%%%%%%%%%%%%+----=*%%@*******#*:::::=#=......%#.+==-+%%%%%%%%%@#********************************
****#@@@@@@@@@@@@@@@@@@@@@*****#@@@@@@@=......:-=..=+.@@@@@@@@@@@@@#********************************
*****************************#%@@@%%%%@@@@@@@+:#:-:-%@@@@@@@@@@@@@@#********************************
**************************#@@@@@@%%%%%%%%%%%%@@%%%%%@@@############*********************************
************************#@@@@%%%%%%%%%%%%%%%%%%@%%%%@@@*********************************************
***********************%@@@%%%%%%%%%%%%%%%%%%%%@@%%@@@@@%*******************************************
*******************#%%%%%%%%%%%%%#@@@%%%%%%%%%%%%%@@@@@@@@%*@:+#************************************
******************@%%#########%##%##@@@%%%%@@@@%%%%%%%%@@%@=...:@@@@%%%%%%%%%%%%%%%%%%%%%%%%%@%*****
******************@%%##########%%##%#%@@%%@@@@@@@%%%%%%@@@...:%%@@@@%%%%%%%%%%%%%%%%%%%%%%%%%@%*****
******************@%%############%%%#%@@%%@%%%%%%@@@%%%%%#..=@@@@@@@%%%%%%%%%%%%%%%%%%%%%%@%%@%*****
******************@%%##############%#%@@%%@@@@@@@@@@@@@%%%-%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%@@%*****
******************@%%##############%#%@@%%@@@%%%%%%%%%@@@@@%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%@%@%*******
******************@%%##############%#%@@%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*********
******************@%%##############%#%@@%%%@%********************@%@%%%#@%@@%%@%%%%%@@@@@@**********
******************@%%#########%%%%%%#%@@%%%@@#*******************@@%%%##%@@@%%%%%%%@@@%%@@**********
******************@%%%%%%%%%%%%%%%%%%%@@@%%%%@*******************@@%%%%%%@@@%%%-++-@@@%%@@**********
*******************%@%%%################@@@%@@@@@@@@@#***********@@%#+##%@@@%-#**%#=@@%%@@**********
*******************%%@%%%#######%%%%%%%##%@@#*********%%%********@@%##*#*%@@%%*=#=%@@@%%@@**********
*******************%%%@%%%%%%%%%%##########%%********#%**#%******@@%%%%%%@@@%%%:%%%@@@%%@@**********
*****%%%%%%@*******%%%@@%##############%%%%%#@######@#****%******@@%%%%%@@@@@%#...%@@@%%@@**********
****@%%@@@@@%#*****%%%@@@%%%%%%%%%%%%%%%%%%%%########@#***%******@@%%##%@@@@@%.=-:.@@@%%@@**********
***@%%@@@@@%@#*****%%%@@%@@%%##################%%%@###%***%******@@-*=.-%@@@%%%%%%%@@@%@@@**********
***@@@@@@%%%@#*****%%%@@%%@#*********%%###@#*%********@#**%******@+-##=.%@@@%%:*:#%@@@%@@@**********
***@%%%%%%%%@#*****%%%@@%%@#*********%%###@#*%********@@@@%******@@=.=#%%@@@%%%%%%%@@@@@@@**********
***@%%%%%%%%@#*****%%%%@%%@#*********%%#**@#*%********@%##%******@@%::*%%@@@%%%:+%%@@@@@@@**********
***@%%%%%%%%@#*****%%%%@%%@#*********%%#**@%#@********#@##%%*****@@.-=+%%@@@%%.#=*%@@@@@@@**********
%%%@%%%%%%%%@%#%%%%@%%%@%%%%%%%%%%%%%%%###@%#@@%%%%%%%%@%###@%%%%@@::+%%%@@@%%%%%%%@@@@@@@%%%%%%%%##
%@@@%%%%%%%%@%%%%%%@%%%@%@@%%%%%%%%%%@%#**@%%#*@%%%%%@@@@@@@@%%%%@%%%%%%%@@@%%%%%%%%@@@@@@@%%%%#####
%%@@@@@@@@@%%%%%%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%%%
%%%%@@@@%%%###########%%@@@@###@%%##%@##%@%%##@###@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#####
%%%%%%%%%%%%%%%%%%%%%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%
########%%############%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%####
%%%%%%%%%%%%%%%%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%
###########%#######%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@####
@@@@@@@@@@@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###############%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%%%%%%%@@@@@@%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%##
%%%%%%%%%%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%%%%%%%%%%@@%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#####%%########%@@@@@@@@@@@@@@@@@@@@@@@@###########################%################################
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%</p>`;
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
                outputHtml: `<p>My name is Gianluca Rainis and I am a computer science student in my final year of high school.<br />
I am passionate about everything related to computers, but what drives me most is working at the boundary between hardware and software, where a line of code directly controls physical reality.<br />
I like ambitious projects, especially the ones that force me to learn by building instead of only studying theory. That mindset led me to create a Z80 development board paired with an RP2040 microcontroller, designing the PCB in KiCad and writing the firmware from scratch. On the software side, I built FreeIdeas, a community platform for sharing project ideas, which pushed me to learn Next.js and React by shipping something real.<br />
Outside of computers, I have practiced judo competitively for several years, specializing in kata. My partner and I competed at the European and World Championships as part of the Italian national team.</p>`,
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
                    ['2021 -> 2026 (Current)', '<strong>High School Diploma</strong> - EQF 4<br />I.S.I.S. &quot;Brignoli-Einaudi-Marconi&quot;<br /><em style="opacity:.7">Computer Science</em>'],
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
                outputHtml: buildTable('Projects', [
                    ['<a href="https://github.com/gianluca-rainis/Z80DevBoard" target="_blank" rel="noopener noreferrer">Z80DevBoard</a>', 'Advanced development board for the Z80 CPU powered by an RP2040. PCB designed in KiCad, firmware written from scratch.<br /><span style="opacity:.7">KiCad · C · RP2040 · Z80 ASM</span>'],
                    ['<a href="https://www.freeideas.pro" target="_blank" rel="noopener noreferrer">FreeIdeas</a>', 'Community platform for sharing project ideas. <a href="https://github.com/gianluca-rainis/FreeIdeas" target="_blank" rel="noopener noreferrer">GitHub</a><br /><span style="opacity:.7">Next.js · React · JavaScript</span>'],
                    ['<a href="https://var-grdev.itch.io/magicexplorer" target="_blank" rel="noopener noreferrer">MagicExplorer</a>', '2D action game about a wizard exploring a dungeon. <a href="https://github.com/gianluca-rainis/magicExplorer" target="_blank" rel="noopener noreferrer">GitHub</a><br /><span style="opacity:.7">Unity · C#</span>'],
                ]),
            };
        case 'info --hobbies':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: buildTable('Hobbies &amp; Interests', [
                    ['Judo Kata', 'Competing at international level as part of the Italian National Team.<br /><br /><span style="opacity:.7">European Championships Riga 2025 · World Championships Paris 2025</span><br /><br /><a href="https://www.ijf.org/judoka/91045" target="_blank" rel="noopener noreferrer">IJF profile</a>'],
                    ['Open Source', 'Developing personal projects and contributing to open source.<br /><br /><span style="opacity:.7">Low-level development · PCB design · Hardware/software boundary</span>'],
                ]),
            };
        case 'cat hackclub.txt':
            return {
                command: normalizedCommand,
                action: 'output',
                recognized: true,
                outputHtml: '<p>Member of <a href="https://hackclub.com" target="_blank" rel="noopener noreferrer">Hack Club</a>, a global nonprofit network of student hackers and makers.</p>',
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