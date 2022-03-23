const rwClient = require("./twitterClient.js");
const CronJob = require("cron").CronJob;
const puppeteer = require ("puppeteer");

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

            let match = {
                time: matchTime,
                meta: matchMeta,
                teamOne: teamOneName,
                teamTwo: teamTwoName,
                rating: matchRating.length,
                event: matchEvent
            }

            list.push(match)
        }
        return list;
    });
    await browser.close();
    return list;
}
var tweets = [];

function populateListOfMatches(){
    todayMatches().then(list => {
        var tweetBody = '';
        for (let i = 0; i < list.length; i++){
            let tweetHeader = 'Today matches: \n';
            let tweetFooter = '(+)';
            matchInfo = list[i];
            let string = matchInfo.teamOne + ' VS ' + matchInfo.teamTwo + ' at ' + matchInfo.time + ' in ' + matchInfo.meta + ' playing for ' + matchInfo.event + ' Game Rating ' + (5 - matchInfo.rating) + '/5;\n';
            
            if(i == 0){
                tweetBody = tweetBody + tweetHeader;
            }
            if (tweetBody.length + string.length + tweetFooter.length< 280){
                tweetBody = tweetBody + string;
            } else {
                if(i !== list.length -1){
                    tweetBody = tweetBody + tweetFooter;
                }
                tweets.push(tweetBody);
                tweetBody = string;
            }
            if(i == list.length - 1){
                tweets.push(tweetBody);
            }           
        }

        for (let i = 0; i < tweets.length; i ++){
            tweet(tweets[i]);
        }        
    });
}


const tweet = async (finalTweet) => {
    try{
        await rwClient.v1.tweet(finalTweet);
        console.log('Posted!')
    } catch(e){
        console.error(e);
    }
}

const job = new CronJob("0 5 * * *", () => {
    populateListOfMatches();
});

// Teste post JOB
// const job = new CronJob("* * * * *", () => {
//     console.log('Starting job...')
//     tweet();
// });

job.start();