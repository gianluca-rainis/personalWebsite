import React, { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import Head from '@/components/Head';
import { usePathname } from 'next/navigation';
import Terminal from '@/components/Terminal';
import { useTheme } from '@/components/ThemeContext';

const THEME_ACCENT_BRIGHT = {
    green: '#00ff00',
    red: '#ff0000',
    yellow: '#ffff00',
};

export async function getStaticProps() {
    return {
        props: {
            pageTitle: ""
        }
    }
}

export default function HomePage({ pageTitle = "" }) {
    const path = usePathname();
    const { theme } = useTheme();
    const [accentBrightHex, setAccentBrightHex] = useState(THEME_ACCENT_BRIGHT.green);

    useEffect(() => {
        setAccentBrightHex(normalizeHexColor(THEME_ACCENT_BRIGHT[theme] || THEME_ACCENT_BRIGHT.green));
    }, [theme]);

    return (
        <>
            <Head pageTitle={pageTitle} pageUrl={path} />

            <Nav />

            <main>
                <div className="term-layout">
                    <aside className="term-sidebar">
                        <Terminal
                            width={'auto'}
                            height={'fit-content'}
                            user={'gianluca@gianlucarainis:~$ image --ascii'}
                            terminalContent={`<p style="font-size:6px; line-height:6px; margin:0; text-align:center;">#*-+#%%#%@@****%@%%##*#*##*#**##%%%%%%@@@@@@@@@@@@@@%%%%%%%%%*++++::-****%%+*++*+%#*@@@%@%###%%%%%%%
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
*+====+==-----========+++=#+#+*@@@@@@@@@%#%#%%%%%%%#**#*@@@@@@@@@@@@@@@@@@@@@@++%**+#*++#%#%@@@@@@@@</p>`} />

                        <Terminal
                            width={'auto'}
                            height={'fit-content'}
                            user={'gianluca@gianlucarainis:~$ info --personal'}
                            terminalContent={`<table style="width: 100%; border-collapse: collapse;">
<thead><tr><th colspan="2" style="text-align: center; color: var(--theme-accent)">Personal Informations</th></tr></thead>
<tr><td>Name</td><td>Gianluca Rainis</td></tr>
<tr><td>Birth</td><td>${new Date("2007-11-23").toLocaleDateString()} (${getDateDiff("2007-11-23")} ago)</td></tr>
<tr><td>Nationality</td><td>Italian</td></tr>
<tr><td>Residence</td><td>Friuli-Venezia Giulia, Italy</td></tr>
<tr><td>Languages</td><td>Italian (Native), English (Certified B1)</td></tr>
<tr><td>Occupation</td><td>Student & Developer</td></tr>
</table>`} />
                        <Terminal
                            width={'auto'}
                            height={'fit-content'}
                            user={'gianluca@gianlucarainis:~$ info --contact'}
                            terminalContent={`<table style="width: 100%; border-collapse: collapse;">
<thead><tr><th colspan="2" style="text-align: center; color: var(--theme-accent)">Contact Informations</th></tr></thead>
<tr><td>Website</td><td><a href="https://www.gianlucarainis.com" target="_blank" rel="noopener noreferrer">gianlucarainis.com</a></td></tr>
<tr><td>Email</td><td><a href="mailto:gianlucarainis@gianlucarainis.com">gianlucarainis@gianlucarainis.com</a></td></tr>
<tr><td>GitHub</td><td><a href="https://github.com/gianluca-rainis" target="_blank" rel="noopener noreferrer">github.com/gianluca-rainis</a></td></tr>
<tr><td>LinkedIn</td><td><a href="https://linkedin.com/in/gianluca-rainis" target="_blank" rel="noopener noreferrer">linkedin.com/in/gianluca-rainis</a></td></tr>
</table>`} />
                        <Terminal
                            width={'auto'}
                            height={'fit-content'}
                            user={'gianluca@gianlucarainis:~$ image --profile --ascii'}
                            terminalContent={`<p style="font-size:6px; line-height:6px; margin:0; text-align:center;">****************************************************************************%%%%%%%%%%%%%%%%%%%%%***
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
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%</p>`} />
                        <Terminal
                            width={'100%'}
                            height={'fit-content'}
                            user={'gianluca@gianlucarainis:~$ cat hackclub.txt'}
                            terminalContent={`<p>Member of <a href="https://hackclub.com" target="_blank" rel="noopener noreferrer">Hack Club</a> — a global nonprofit network of student hackers and makers.<br></p>`} />
                    </aside>
                    <div className="term-right">
                        <Terminal
                            width={'100%'}
                            height={'fit-content'}
                            user={'gianluca@gianlucarainis:~$ info'}
                            terminalContent={`<h1 style="text-align: center;">Gianluca Rainis</h1>
<img src="https://readme-typing-svg.demolab.com?font=ui-monospace%2C+SFMono-Regular%2C+Menlo%2C+Monaco%2C+Consolas%2C+Liberation+Mono%2C+Courier+New%2C+monospace&size=10&duration=3000&pause=1000&color=${encodeURIComponent(accentBrightHex)}&center=true&vCenter=true&random=true&width=200&lines=Student;Developer;Open+Source+Lover;Hack+Clubber!;Hardware+Hacker;PCB+Designer;Low-Level+Enthusiast;IT+and+Networking+Student;Computer+Science+Student;Judo+Kata+Athlete" alt="Typing SVG" style="margin: 0; border: 0; border-radius: 0; width: 100%; background: transparent; box-shadow: none;" />`}
                        />
                        <Terminal
                            width={'100%'}
                            height={'fit-content'}
                            user={'gianluca@gianlucarainis:~$ presentation --about'}
                            terminalContent={`<p>My name is Gianluca Rainis and I'm a computer science student in my final year of high school.

I'm passionate about everything related to computers, but what drives me most is working at the boundaries between hardware and software, where a line of code directly controls physical reality.

I love tackling ambitious projects, especially those that require knowledge I don't already possess, because they force me to learn through a practical approach rather than a theoretical one. This led me to build a Z80 development board paired with an RP2040 microcontroller, designing both the PCB in KiCad and writing the firmware from scratch. On the software side, I developed FreeIdeas, a community platform for sharing project ideas, which pushed me to learn Next.js and React by actually shipping something real.

Outside of computers, I've been practicing judo competitively for several years, specializing in kata. My dedication led my partner and I to compete at the European and World Championships, joining the Italian national team.</p>`}
                        />
                        <Terminal
                            width={'100%'}
                            height={'fit-content'}
                            user={'gianluca@gianlucarainis:~$ skills --table'}
                            terminalContent={`<table style="width: 100%; border-collapse: collapse;">
<thead><tr><th colspan="2" style="text-align: center; color: var(--theme-accent)">Skills</th></tr></thead>
<tr><td>Languages</td><td>Python, JavaScript, C, C++, C#, Java, PHP, HTML/CSS, Assembly</td></tr>
<tr><td>Frameworks</td><td>Next.js, React</td></tr>
<tr><td>Tools</td><td>Git, GitHub, Linux, Bash, Arduino, Raspberry Pi, Godot, Unity, KiCad, VSCode</td></tr>
<tr><td>Database</td><td>MySQL, SQLite</td></tr>
</table>`} />

                        <Terminal
                            width={'100%'}
                            height={'fit-content'}
                            user={'gianluca@gianlucarainis:~$ info --education'}
                            terminalContent={`<table style="width: 100%; border-collapse: collapse;">
<thead><tr><th colspan="2" style="text-align: center; color: var(--theme-accent)">Education</th></tr></thead>
<tr><td style="white-space:nowrap; padding-right:12px;">2021 -> 2026 (Current)</td><td><strong>High School Diploma</strong> - EQF 4<br>I.S.I.S. "Brignoli-Einaudi-Marconi"<br><em style="opacity:.7">Computer Science</em></td></tr>
</table>`} />
                        <Terminal
                            width={'100%'}
                            height={'fit-content'}
                            user={'gianluca@gianlucarainis:~$ info --work'}
                            terminalContent={`<table style="width: 100%; border-collapse: collapse;">
<thead><tr><th colspan="2" style="text-align: center; color: var(--theme-accent)">Work Experience</th></tr></thead>
<tr><td style="white-space:nowrap; padding-right:12px;">27/01/2025 - 07/02/2025</td><td><strong>ICT Assistant</strong> - <a href="https://triesteairport.it" target="_blank" rel="noopener noreferrer">Trieste Airport</a>, Ronchi dei Legionari<br>
I completed a two-week internship as an ICT Assistant. I helped create a PHP calendar to manage meeting room reservations, assisted in the installation of two servers, and contributed to data organization and analysis in Excel.<br><br>
<span style="opacity:.7">‣ Corporate network architecture &amp; server management<br>
‣ Workplace communication and problem-solving<br>
‣ PHP · MySQL · JavaScript · HTML · CSS · Microsoft Excel</span></td></tr>
</table>`} />
                        <Terminal
                            width={'100%'}
                            height={'fit-content'}
                            user={'gianluca@gianlucarainis:~$ info --certifications'}
                            terminalContent={`<table style="width: 100%; border-collapse: collapse;">
<thead><tr><th colspan="2" style="text-align: center; color: var(--theme-accent)">Certifications</th></tr></thead>
<tr><td style="white-space:nowrap; padding-right:12px; opacity:.7">Cisco · 06/2025</td><td><a href="https://www.credly.com/badges/983fc03e-5490-441b-9f9b-108bdb7d3ca4" target="_blank" rel="noopener noreferrer">CCNA: Introduction to Networks</a></td></tr>
<tr><td style="white-space:nowrap; padding-right:12px; opacity:.7">Cisco · 06/2024</td><td><a href="https://www.credly.com/badges/ecf72a74-c84d-4880-8a7a-4a61c5ee6ac0" target="_blank" rel="noopener noreferrer">Cisco IT Essentials</a></td></tr>
<tr><td style="white-space:nowrap; padding-right:12px; opacity:.7">AICA · 03/2025</td><td>ICDL Full Standard</td></tr>
<tr><td style="white-space:nowrap; padding-right:12px; opacity:.7">IBM SkillsBuild · 03/2024</td><td><a href="https://www.credly.com/badges/51500970-9e4e-411b-ae39-ac40444177f5" target="_blank" rel="noopener noreferrer">Cybersecurity Fundamentals</a></td></tr>
<tr><td style="white-space:nowrap; padding-right:12px; opacity:.7">IBM SkillsBuild · 08/2024</td><td><a href="https://www.credly.com/badges/ea07be22-a6f0-444d-abe7-ad8163379ff4" target="_blank" rel="noopener noreferrer">Information Technology Fundamentals</a></td></tr>
<tr><td style="white-space:nowrap; padding-right:12px; opacity:.7">IBM SkillsBuild · 04/2024</td><td><a href="https://www.credly.com/badges/11a3e380-f241-464d-82c5-c30a82049c23" target="_blank" rel="noopener noreferrer">Web Development Fundamentals</a></td></tr>
<tr><td style="white-space:nowrap; padding-right:12px; opacity:.7">IBM SkillsBuild · 08/2024</td><td><a href="https://www.credly.com/badges/c72d0d42-6a02-4bd8-8b7c-f007434b9448" target="_blank" rel="noopener noreferrer">Project Management Fundamentals</a></td></tr>
<tr><td style="white-space:nowrap; padding-right:12px; opacity:.7">IBM SkillsBuild · 08/2024</td><td><a href="https://www.credly.com/badges/17bb586e-79de-4939-80e7-12d787cbf8b0" target="_blank" rel="noopener noreferrer">Basic Principles of Design</a></td></tr>
<tr><td style="white-space:nowrap; padding-right:12px; opacity:.7">Band of Rescue · 02/2026</td><td>BLSD & PBLSD</td></tr>
</table>`} />
                        <Terminal
                            width={'100%'}
                            height={'fit-content'}
                            user={'gianluca@gianlucarainis:~$ ls projects/'}
                            terminalContent={`<table style="width: 100%; border-collapse: collapse;">
<thead><tr><th colspan="2" style="text-align: center; color: var(--theme-accent)">Projects</th></tr></thead>
<tr><td style="white-space:nowrap; padding-right:12px;"><a href="https://github.com/gianluca-rainis/Z80DevBoard" target="_blank" rel="noopener noreferrer">Z80DevBoard</a></td><td>Advanced development board for the Z80 CPU powered by an RP2040. PCB designed in KiCad, firmware written from scratch.<br><span style="opacity:.7">KiCad · C · RP2040 · Z80 ASM</span></td></tr>
<tr><td style="white-space:nowrap; padding-right:12px;"><a href="https://www.freeideas.pro" target="_blank" rel="noopener noreferrer">FreeIdeas</a></td><td>Community platform for sharing project ideas. — <a href="https://github.com/gianluca-rainis/FreeIdeas" target="_blank" rel="noopener noreferrer">GitHub</a><br><span style="opacity:.7">Next.js · React · JavaScript</span></td></tr>
<tr><td style="white-space:nowrap; padding-right:12px;"><a href="https://var-grdev.itch.io/magicexplorer" target="_blank" rel="noopener noreferrer">MagicExplorer</a></td><td>2D action game — wizard exploring a dungeon. — <a href="https://github.com/gianluca-rainis/magicExplorer" target="_blank" rel="noopener noreferrer">GitHub</a><br><span style="opacity:.7">Unity · C#</span></td></tr>
</table>`} />
                        <Terminal
                            width={'100%'}
                            height={'fit-content'}
                            user={'gianluca@gianlucarainis:~$ info --hobbies'}
                            terminalContent={`<table style="width: 100%; border-collapse: collapse;">
<thead><tr><th colspan="2" style="text-align: center; color: var(--theme-accent)">Hobbies &amp; Interests</th></tr></thead>
<tr><td style="white-space:nowrap; padding-right:12px;">Judo Kata</td><td>Competing at international level as part of the Italian National Team.<br>
<span style="opacity:.7">European Championships Riga 2025 · World Championships Paris 2025</span><br>
<a href="https://www.ijf.org/judoka/91045" target="_blank" rel="noopener noreferrer">IJF profile</a></td></tr>
<tr><td style="white-space:nowrap; padding-right:12px;">Open Source</td><td>Developing personal projects and contributing to open source.<br>
<span style="opacity:.7">Low-level dev · PCB design · Hardware/software boundary</span></td></tr>
</table>`} />
                    </div>
                </div>
            </main>
        </>
    );
}

function normalizeHexColor(value) {
    const hex = value.trim();

    if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
        return `#${hex.slice(1).split('').map(char => char + char).join('')}`;
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