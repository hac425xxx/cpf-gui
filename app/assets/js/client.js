let request = require('request');
const url = require("url");
const fs = require("fs");
const os = require('os');


function upload(u, src) {

    target = url.resolve(u, "upload");

    const formData = {
        file: fs.createReadStream(src)
    };
    request.post({
        url: target,
        // proxy: "http://127.0.0.1:8080",
        formData: formData
    }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', body);
    });
}

function zip_dir(src, dst) {
    const compressing = require('compressing');
    compressing.zip.compressDir(src, dst)
        .then(() => {
            console.log('success');
        })
        .catch(err => {
            console.error(err);
        });
}


function unzip(src, dst) {
    const compressing = require('compressing');
    compressing.zip.uncompress(src, dst)
        .then(() => {
            console.log('success');
        })
        .catch(err => {
            console.error(err);
        });
}


function downloadFile(uri, filename, callback) {
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback);
}

//检测文件或者文件夹存在 nodeJS
function fsExistsSync(path) {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}


if(fsExistsSync("tttttt") == false){
    fs.mkdirSync("tttttt");
}


// var fileUrl = 'http://192.168.245.158:5000/download/22c4db5c-1577-11e9-b4ab-000c29e4cea3/';
// test = "C:\\Users\\hac425\\AppData\\Local\\Temp\\test"
// var filename = 'C:\\Users\\hac425\\AppData\\Local\\Temp\\cpf.zip';

// downloadFile(fileUrl, filename, function () {
//     unzip(filename, test);
// });





// create_task("http://192.168.245.158:5000/", "tcpfuzzer", "test", " tcpfuzzer --host 192.168.245.131 --port 21 --conf /fuzzer/test/conf/floatftp --interval 0")
// get_status("http://192.168.245.158:5000", "a39f7eea-11b6-11e9-b4ab-000c29e4cea3")
// stop_task("http://192.168.245.158:5000", "a39f7eea-11b6-11e9-b4ab-000c29e4cea3")

// console.log(get_status("http://192.168.245.158:5000", "a39f7eea-11b6-11e9-b4ab-000c29e4cea3"));

// tgz("F:\\code\\Detamper", "F:\\out.zip")

// upload("http://192.168.245.158:5000", "F:\\code\\electron-serialport-master\\app\\public\\css\\index.css")


// console.log(os.tmpdir());
// var path = require("path")
//
// console.log(path.basename("F:\\ss\\sxxx\\"))
//
// console.log(Date.now());

// var data = fs.statSync('C:\\Users\\hac425\\AppData\\Local\\Temp\\project_test_1546790226923.zip');
// console.log(data.size);