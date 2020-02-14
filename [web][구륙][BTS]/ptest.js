function getIdfromUrl(urlstr, cb) {
  urlstr = urlstr + "";
  var usp = new URLSearchParams(urlstr.substring(urlstr.indexOf("?")));
  var id = usp.get("v");
  console.log("YouTube id : "  + id);
  
  cb(id);
}


getIdfromUrl('https://www.youtube.com/watch?v=PySo_6S4ZAg&list=PLoROMvodv4rOABXSygHTsbvUz4G_YQhOb', function(id) {
  console.log(id);
})