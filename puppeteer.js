const puppeteer = require("puppeteer");

export async function todayMatches(){
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.hltv.org/matches');

    const list = await page.evaluate(() => {
        list = [];
        upcomingMatches = document.querySelector('.upcomingMatchesSection');
        matches = upcomingMatches.querySelectorAll('.upcomingMatch');

        for(let i = 0; i < matches.length; i++){
            match = matches[i];

            matchTime = match.querySelector('.matchTime').innerHTML;
            matchMeta = match.querySelector('.matchMeta').innerHTML;

            matchRating = match.querySelectorAll('.faded');

            teamOne = match.querySelector('.team1');
            teamOneName = teamOne.querySelector('.matchTeamName').innerHTML;

            teamTwo = match.querySelector('team2');
            teamTwoName = teamTwo.querySelector('.matchTeamName').innerHTML;

            matchEvent = match.querySelector('.matchEventName').innerHTML;

            list.push(teamOneName);
            list.push(teamTwoName);
            list.push(matchTime);
            list.push(matchMeta);
            list.push(matchRating);
            list.push(matchEvent);
        }
        return list;
    });
    await browser.close();
    return list;
}

// const getTodayMatches = todayMatches();

// module.exports = getTodayMatches;