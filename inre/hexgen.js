function main(){
    // Disable error handler text
    var errorNotice = document.getElementById("error-message");
    errorNotice.style.display = "none";
    var errorDetails = document.getElementById("error-details");
    errorDetails.style.display = "none";
    // Actual code
    try {
        var textinput = document.getElementById("text-input").value;
        var bytes = [textinput.split("\n", 1)[0].length >> 2];  // Determine header value based on length of first line, and create array.
        var s = textinput.replace(/\n/g, ""); // remove newlines from string in setup for processing
        // Process hex string into numbers
        while (s.length > 0){
            bytes.push(Number("0x" + s.slice(0,2)));
            s = s.substring(2);
        }
        console.log(bytes);
        // Create file with byte array
        var blobUrl = URL.createObjectURL(new Blob([new Uint8Array(bytes).buffer], { type: "application/octet-stream" }));
        // Download file
        var link = document.createElement("a");
        link.href = blobUrl;
        link.download = "0.inre";
        link.click();
    } catch (error){
        // Error handler
        errorNotice.style.display = "block";
        errorDetails.textContent = error;
        errorDetails.style.display = "block";
    }
}