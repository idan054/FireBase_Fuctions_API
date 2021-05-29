function httpGet(theUrl)
{
    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

httpGet("https://random-data-api.com/api/users/random_user")