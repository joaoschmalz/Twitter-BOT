const rwClient = require("./twitterClient.js");
const CronJob = require("cron").CronJob;
const puppeteer = require("puppeteer");

async function todayMatches() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://www.hltv.org/matches");

    const list = await page.evaluate(() => {
        let list = [];
        const upcomingMatches = document.querySelector(
            ".upcomingMatchesSection"
        );
        const matches = upcomingMatches.querySelectorAll(".upcomingMatch");

        for (let match of matches) {

            const matchTime = match.querySelector(".matchTime").innerHTML;
            const matchMeta = match.querySelector(".matchMeta").innerHTML;

            const matchRating = match.querySelectorAll(".faded");

            const teamOne = match.querySelector(".team1");
            const teamOneName = teamOne.querySelector(".matchTeamName").innerHTML;

            const teamTwo = match.querySelector(".team2");
            const teamTwoName = teamTwo.querySelector(".matchTeamName").innerHTML;

            const matchEvent = match.querySelector(".matchEventName").innerHTML;

            let matchInfo = {
                time: matchTime,
                meta: matchMeta,
                teamOne: teamOneName,
                teamTwo: teamTwoName,
                rating: matchRating.length,
                event: matchEvent,
            };

            list.push(matchInfo);
        }
        return list;
    });
    await browser.close();
    return list;
}
let tweets = [];

function populateListOfMatches() {
    todayMatches().then((list) => {
        let tweetBody = "";
        for (let i = 0; i < list.length; i++) {
            let tweetHeader = "Today matches: \n";
            let tweetFooter = "(+)";
            let matchInfo = list[i];
            let rating = 5 - matchInfo.rating;
            let string = `${matchInfo.teamOne} VS ${matchInfo.teamTwo} at ${matchInfo.time} in ${matchInfo.meta} playing for ${matchInfo.event} Game Rating ${rating}/5\n`;

            if (i == 0) {
                tweetBody = tweetBody + tweetHeader;
            }
            if (tweetBody.length + string.length + tweetFooter.length < 280) {
                tweetBody = tweetBody + string;
            } else {
                if (i !== list.length - 1) {
                    tweetBody = tweetBody + tweetFooter;
                }
                tweets.push(tweetBody);
                tweetBody = string;
            }
            if (i == list.length - 1) {
                tweets.push(tweetBody);
            }
        }

        for (let t of tweets) {
            tweet(t);
        }
    });
}

async function tweet (finalTweet) {
    try {
        await rwClient.v1.tweet(finalTweet);
        console.log("Posted!");
    } catch (e) {
        console.error(e);
    }
};

const job = new CronJob("0 5 * * *", () => {
    populateListOfMatches();
});

job.start();