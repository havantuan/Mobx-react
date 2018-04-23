const replaceHtmlTag = function (content) {
    let regex = /(&nbsp;|<([^>]+)>)/ig;
    return content.replace(regex, "");
};