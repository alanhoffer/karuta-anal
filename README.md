## karutabot

Now working for buttons and reactions



# Config

```
  {
    "channel": "", // Channel, where will bots sends commands
    "collector": 500000, // time for which the collector will record the drop
    "reactions": 2, // How many reactions must there be on the drop for the bot to snipe
    "tokens": [""], // User tokens
    "webhook": {
      "enabled": false,
      "id": "",
      "token": ""
    },
    "proxies": [ // Proxies to evade karuta bans
      {
        "host": "",
        "port": 3128,
        "auth": {
          "username": "user1",
          "password": "pass1"
        }
      }
    ],
      "time": {
      "drop": {
        "delay": 1800000, // How often should the bot drop cards (30min default)
        "random": 130000 // Adds random amount of time
      },
      "wait": { // Bot will stop dropping cards for amount of time (0-23)
        "enabled": true,
        "starttime": 19, // When is the bot supposed to stop doping cards
        "endtime": 0 // When is the bot supposed to start dropping cards again
      }
    }
  }
```
