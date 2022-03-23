const rwClient = require("./twitterClient.js");
const CronJob = require("cron").CronJob;
const puppeteer = require ("puppeteer");
const Match = require("./match.class")
var listMatches = [];

async function todayMatches(){
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.hltv.org/matches');

    const list = await page.evaluate(() => {
        list = [];
        upcomingMatches = document.querySelector('.upcomingMatchesSection');
        matches = upcomingMatches.querySelectorAll('.upcomingMatch');

        for(let i = 0; i < matches.length; i++){
            a = matches[i];

            matchTime = a.querySelector('.matchTime').innerHTML;
            matchMeta = a.querySelector('.matchMeta').innerHTML;

            matchRating = a.querySelectorAll('.faded');

            teamOne = a.querySelector('.team1');
            teamOneName = teamOne.querySelector('.matchTeamName').innerHTML;

            teamTwo = a.querySelector('.team2');
            teamTwoName = teamTwo.querySelector('.matchTeamName').innerHTML;

            matchEvent = a.querySelector('.matchEventName').innerHTML;


            let match = new Match(matchTime, matchMeta, teamOneName, teamTwoName, matchRating.length, matchEvent);

            list.push(match)
        }
        return list;
    });
    await browser.close();
    return list;
}

const tweetHeader = 'Today matches:';
var tweetBody = '';

function populateListOfMatches(){
    todayMatches().then(list => {
        for (let i = 0; i < list.length; i++){
            for (let j = 0; j < i + 6; j++){
                if (j == 0){
                    tweetBody = tweetBody + list[j + i] + ' VS ';
                } else if (j == 4){
                    let rating = 5 - list[j + i];
                    tweetBody = tweetBody + rating + '/5 - playing for: ';
                } else if (j == 5){
                    tweetBody = tweetBody + list[j + i] + ';\n';
                } else {
                    tweetBody = tweetBody + list[j + i] + ' -> ';
                }
            }
            j = 0;
            i = i + 5;
        }
        console.log(tweetBody);
    });
}


const tweet = async () => {
    try{
        await rwClient.v1.tweet("New test CronJob");
        console.log('Posted!')
    } catch(e){
        console.error(e);
    }
}

// const job = new CronJob("0 5 * * *", () => {
//     tweet()
// });

// Teste post JOB
// const job = new CronJob("* * * * *", () => {
//     console.log('Starting job...')
//     tweet();
// });

// job.start();

populateListOfMatches();

