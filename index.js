const {Telegraf} = require('telegraf');
const bot = new Telegraf('6890819714:AAG_0zFaUTA9ulO2RByCYFTIyBEuLmP7yig');
const axios = require('axios');

const youtubeApiKey = 'AIzaSyBWsykHM21DZXMa3ZS0pH9rCVa1ds3Ut4c';
//crowbcat, JCS, destiny channel Ids
const channelIds = ['UCYZtp0YIxYOipX15v_h_jnA', 'UCYwVxWpjeKFWwu8TML-Te9A','UC554eY5jNUfDq3yDOJYirOQ'];

const lastVideoIds = {};


function getLatestVideo(channelId) {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=1&order=date&type=video&key=${youtubeApiKey}`;
    return axios.get(apiUrl)
      .then(response => {
        const videoId = response.data.items[0].id.videoId;
        return videoId;
      })
      .catch(error => {
        console.error('Error fetching latest video:', error);
        return null;
      });
}

  
function sendLatestVideo(ctx, channelId) {
    getLatestVideo(channelId)
      .then(videoId => {
        if (videoId && videoId !== lastVideoIds[channelId]) {
          const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          ctx.reply(`Latest video from the channel: ${videoUrl}`);
          lastVideoIds[channelId] = videoId;
        } else {
          ctx.reply("No new videos since the last check.");
        }
      });
}
  

function checkForNewVideos() {
    channelIds.forEach(channelId => {
      sendLatestVideo(bot.telegram, channelId);
    });
}


bot.start((ctx) => {
    ctx.reply("the bot has started")
})

bot.help((ctx) => {
    ctx.reply("This bot can perform the following commands \n - /start\n - /help\n /say_crowbcat will post the latest video of Crowbcat's youtube channel\n  /say_jcs will post the latest video of JCS Psychology's youtube channel.\n /say_destiny will post the latest video of Destiny's youtube channel")
})


// Set up a timer to check for new videos every 5 minutes
setInterval(checkForNewVideos, 300000);


// Command to get the latest video for Crowbcat
bot.command('say_crowbcat', (ctx) => {
    sendLatestVideo(ctx, channelIds[0]);
});

// Command to get the latest video for JCS Psychology
bot.command('say_jcs', (ctx) => {
    sendLatestVideo(ctx, channelIds[1]);
});

//Command to get latest vid for destiny
bot.command('say_destiny', (ctx) => {
  sendLatestVideo(ctx, channelIds[2]);
});

bot.launch()

