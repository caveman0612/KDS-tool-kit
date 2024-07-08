var myUrl2 = new URL(window.location.toLocaleString());
console.log('kst URL ' + myUrl2);
var PARAM = myUrl2.searchParams.get('PARAM');
console.log('kst PARAM ' + PARAM);

(new URL(tab.url)).host.replace(".service-now.com", "")

function extractSubstring(fullString, startString, stopString) {
    const startIndex = fullString.indexOf(startString);
    const stopIndex = fullString.indexOf(stopString);

    if (startIndex === -1 || stopIndex === -1) {
        // Handle case where start or stop string is not found
        return "Start or stop string not found in the full string.";
    }

    // Extract the substring between start and stop (excluding start and stop strings)
    const extractedSubstring = fullString.substring(startIndex + startString.length, stopIndex);

    return extractedSubstring;
}