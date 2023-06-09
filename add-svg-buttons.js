console.log('Add svg button works');
let svgElements = document.getElementsByTagName('svg');

function getName(element) {
    return element.id || document.title || 'image';
}

function download(href, name) {
    let downloadLink = document.createElement("a");
    downloadLink.href = href;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function getSvgUrl(element) {
    //get svg source.
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(element);
    //add name spaces.
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;


    let svgBlob = new Blob([source], {type:"image/svg+xml;charset=utf-8"});
    return URL.createObjectURL(svgBlob);
}

function downloadSvg(element) {
    const svgUrl = getSvgUrl(element);
    download(svgUrl, getName(element) + ".svg");
}

function downloadPng(element) {
    let image = new Image();
    console.log(image);
    element.parentElement.appendChild(image);
    image.addEventListener('load', () => {
        let canvas = document.createElement('canvas');
        canvas.width  = 1024;
        canvas.height = canvas.width;
        let ctx = canvas.getContext('2d');
        element.parentElement.appendChild(canvas);
        ctx.drawImage(image, 0, 0);
        setTimeout(() => {
            let pngUrl = canvas.toDataURL();
            download(pngUrl, getName(element) + '.png');
            console.log(canvas);
            element.parentElement.removeChild(canvas);
            element.parentElement.removeChild(image);
        }, 10);
    });
    image.src = getSvgUrl(element);
}

function svgOnClick(element, event) {
    if (event.ctrlKey) {
        console.log('Ctrl+Clicked on', element, 'with event', event);
        downloadSvg(element);
        downloadPng(element);
    }
}

for (let svgElement of svgElements) {
    svgElement.addEventListener('click', (e) => svgOnClick(svgElement, e), true);
}
