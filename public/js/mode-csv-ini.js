// mode-csv-ini.js

// 1. Define the Highlight Rules
define("ace/mode/csv_ini_highlight_rules", function(require, exports, module) {
    var oop = require("ace/lib/oop");
    var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

    var CsvIniHighlightRules = function() {
        this.$rules = {
            "start": [
                { token: "keyword.header", regex: "^\\s*\\[.*\\]\\s*$" }, // [Sections]
                { token: "string", regex: '"(?:[^"\\\\]|\\\\.)*?"' },    // "Quoted"
                // { token: "constant.numeric", regex: "\\b\\d+\\b" },      // Numbers
                { token: "separator", regex: ";" },           // Commas
                { token: "comment", regex: "#.*$" }                      // Comments
            ]
        };

        let reText = "[^;]+"
        let reSeparator = ";"
        this.$rules = {
            "start": [
                { token: "keyword.header", regex: "^\\s*\\[.*\\]\\s*$" }, // [Sections]
                { token: "text.col1",      regex: "^"+reText }, 
                { token: "separator",      regex: reSeparator, next: "col2" } 
            ],
            "col2": [
                { token: "separator",      regex: reSeparator, next: "col3" }, 
                { token: "text.colFecha",  regex: reText },
            ],
            "col3": [
                { token: "separator",      regex: reSeparator, next: "col4" },
                { token: "text.colLugar",  regex: reText },
                { token: "empty",          regex: "$", next: "start" } 
            ],
            "col4": [
                { token: "separator",      regex: reSeparator, next: "col5" },
                { token: "text.colTeam1",      regex: reText }, 
                { token: "empty",          regex: "$", next: "start" } 
            ],
            "col5": [
                { token: "separator",      regex: reSeparator, next: "body" },
                { token: "text.colTeam2",      regex: reText },
                { token: "empty",          regex: "$", next: "start" } 
            ],
            "body": [
                { token: "separator",      regex: reSeparator },
                { token: "text",           regex: reText },
                { token: "empty",          regex: "$", next: "start" } 
            ]
        };        
    };


    
    oop.inherits(CsvIniHighlightRules, TextHighlightRules);
    exports.CsvIniHighlightRules = CsvIniHighlightRules;
});

// 2. Define the Mode itself
define("ace/mode/csv_ini", function(require, exports, module) {
    var oop = require("ace/lib/oop");
    var TextMode = require("ace/mode/text").Mode;
    var CsvIniHighlightRules = require("ace/mode/csv_ini_highlight_rules").CsvIniHighlightRules;

    var Mode = function() {
        this.HighlightRules = CsvIniHighlightRules;
    };
    oop.inherits(Mode, TextMode);

    (function() {
        this.$id = "ace/mode/csv_ini";
    }).call(Mode.prototype);

    exports.Mode = Mode;
});