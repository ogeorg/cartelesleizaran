
function Persistor() {
    this.download = function (dataKey, filename) {
        // const json = { numberProp: 1, stringProp: "hello world" };
        // const data = JSON.stringify(json);
        const data = localStorage.getItem(dataKey);
        // Pass the string to a Blob and turn it
        // into an ObjectURL
        const blob = new Blob([data], { type: "application/json" });
        const jsonObjectUrl = URL.createObjectURL(blob);

        // Create an anchor element, set it's
        // href to be the Object URL we have created
        // and set the download property to be the file name
        // we want to set
        const anchorEl = document.createElement("a");
        anchorEl.href = jsonObjectUrl;
        anchorEl.download = filename;

        // There is no need to actually attach the DOM
        // element but we do need to click on it
        anchorEl.click();

        // We don't want to keep a reference to the file
        // any longer so we release it manually
        URL.revokeObjectURL(jsonObjectUrl);
    }
    function handleFileSelecting(evt) {
        var files = evt.target.files; // FileList object
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e) {
                    var content = e.target.result;
                    if (content) {
                        innerFileParsingCallback(content);
                        $dlg.dialog('close');
                        $dlg.empty();
                    }
                };
            })(f);
            reader.readAsText(f);
        }
    }
    this.getUploadDialog = function (fileParsingCallback) {
        $dlg = $(`<div id="uploadDialog" title="Cargar un fichero"></div>`);
        var $inputs = $("<div></div>").appendTo($dlg);
        $(`<input type="file" id="files" name="files[]" />`) //
            .appendTo($dlg);
        $('#right_panel').append($dlg);
        $dlg.dialog({ autoOpen: false });

        var filesElem = document.getElementById('files');
        filesElem.addEventListener('change', handleFileSelecting, false);

        innerFileParsingCallback = fileParsingCallback;
        return $dlg;
    }
    var innerFileParsingCallback = function (content) { };
    var $dlg;
}
