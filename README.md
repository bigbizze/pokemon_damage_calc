# Pokemon Damage Calculator API

Quickly thrown together nodejs / typescript / express api for pokemon showdown damage calculator with the intention of using it with Google Sheets.

### POST request body example (http://host:port/calc):
The only fields that are required are "move_name" and "name" in "attacker". If no defender is given, it defaults to Chansey.
```json
{
    "attacker": {
        "name": "Machamp",
        "ability": "Sheer Force",
        "item": "Choice Band",
        "nature": "Jolly",
        "moves": [
            "Fire Punch",
            "Mach Punch",
            "Ice Punch",
            "Thunder Punch"
        ],
        "curHp": 100,
        "ivs": {
            "spc": 15
        },
        "evs": {
            "spc": 200
        }
    },
    "defender": {
        "name": "Machamp",
        "ability": "Sheer Force",
        "item": "Choice Band",
        "nature": "Jolly",
        "moves": [
            "Fire Punch",
            "Mach Punch",
            "Ice Punch",
            "Thunder Punch"
        ],
        "curHp": 100,
        "ivs": {
            "spc": 15
        },
        "evs": {
            "spc": 200
        }
    },
    "move_name": "Flamethrower"
}
```

![](https://i.imgur.com/JauhvwC.gif)



### Google Sheets script for above:

```js
function dmg_calc(moveName, atkMon, defMon = null, _) {
	var body = {
		"defender": {
			"name": defMon
		},
		"attacker": {
			"name": atkMon
		},
		"move_name": moveName
	};
	if (defMon == null || defMon == "") {
		delete body["defender"];
	}
	var options = {
		'method': 'post',
		'contentType': 'application/json',
		'payload': JSON.stringify(body)
	};
	var response = UrlFetchApp.fetch('http://<some-host>:3000/calc', options);
	var text_res = response.getContentText();
	return text_res;
}

function refreshLastUpdate() {
	var range_o = SpreadsheetApp.getActiveSpreadsheet().getRange('A1');
	range_o.setValue(new Date().toTimeString());
	range_o.setFontColor("#ffffff");
}
```

![image](https://user-images.githubusercontent.com/42508203/115085314-51f3f880-9ed8-11eb-9a40-c4b68c575f11.png)

A1 (or some other cell) needs to be a datetime to force the functions to update anytime a field feeding arguments to it changes value to get around how they cache stuff.

```
=dmg_calc(B2, C2, D2, $A$1) * 100
```
