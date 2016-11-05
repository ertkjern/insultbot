/***
 * 
 *  SUPER CRAPPY BOT THAT INSULT PEOPLE WITH CLASSICAL YO MAMA JOKES:
 * 
 * To get it working run the following NPM-command: npm install --save @slack.
 * 
 * Run with node index.js
 * 
 *  The jokes are retrived from http://api.yomomma.info/.
 * 
 *  Made just for fun..... very fast..... 
 * 
 *  @author Ørjan Ertkjern 
 */


var Slack = require('@slack/client');
var RtmClient = Slack.RtmClient;
var RTM_EVENTS = Slack.RTM_EVENTS;

var token = ''; //token to add

var rtm = new RtmClient(token, {logLevel: 'info' }); 

rtm.start();
startMessage(); 

rtm.on(RTM_EVENTS.MESSAGE, function(message){
    var channel = message.channel;
    var text = message.text;
    
    console.log("Incoming Message: " + text)

    if(text == "!insultbot help"){    
        rtm.sendMessage(getHelpCommands(), channel); 
    }
    if(text.indexOf("!insultbot") !== -1){
        if(text.indexOf("@") !== 1){
            var username = getUsernameFromText(text);
            if(username){
                getRandomYoMamaJoke(function(joke){
                    var jokeString = username + ', ' + joke;
                    console.log("Insulttime: " + jokeString)
                    rtm.sendMessage(jokeString, channel);
                });  
            }else{
                rtm.sendMessage("Give me someone to insult, I need an @ in front of the name as well", channel);
            }
        }
    }
});

function startMessage(){
    console.log("Starting up insult bot!")
    console.log("Ready to insult!")
}


function getHelpCommands(){
    return `
           This is the commands that I do understand: 

           !insultbot help (HELP)
           !insultbot @username (Someone to insult)

           Have fun!
           `
}

function getUsernameFromText(text){
    var splittedText = text.split(" "); 
    var username = "";
    splittedText.forEach(function(item, index){
        if(item.indexOf("@") !== -1){
            username = item; 
        }
    });
    return username; 
    
}

function getRandomYoMamaJoke(callback){
    var request = require('request');
    request('http://api.yomomma.info/', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var returnString = JSON.parse(body);
        return callback(returnString.joke);   
     }
    }); 
}

