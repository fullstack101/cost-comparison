const httpJSONRequest = function(url){
    return new Promise(function(resolve, reject)
    {
        let xhr = new XMLHttpRequest();

        xhr.withCredentials = true;
        xhr.open('GET', url, true);
        xhr.send();
        xhr.addEventListener("readystatechange", processRequest, false);

        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let response = JSON.parse(xhr.responseText);
                resolve(response);
                //document.getElementById("col1").appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(response[0]);//JSON.stringify(response[0], null, 10);
                //console.log(response);
            }else if (xhr.readyState == 4) {
                console.log(xhr.readyState);
                console.log(xhr.status);
                reject(Error("Something went wrong with the request \n\t\t\t\t\t XHR Status: " + xhr.status));
            }
        }
    });
};

httpJSONRequest("http://nodeci.azurewebsites.net/testIP")
    .then((json) => document.getElementById("col1").appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(json));

httpJSONRequest("http://nodeci.azurewebsites.net/numbeo")
    .then((json) => document.getElementById("col2").appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(json[0]));

// Pretty JSON


function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}




