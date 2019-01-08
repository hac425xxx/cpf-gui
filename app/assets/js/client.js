let request = require('request');
const url = require("url");
const fs = require("fs");
const os = require('os');

function create_task(u, type, project_name, arguments) {

    target = url.resolve(u, "create");
    var requestData = {
        type: type,
        project_name: project_name,
        arguments: arguments
    };
    request({
        url: target,
        method: "POST",
        // proxy: "http://127.0.0.1:8080",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: requestData
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            return body;
        }
    });
}

function get_status(u, task_id) {
    t = url.resolve(u, "status");
    target = `${t}/${task_id}/`;
    request({
        url: target,
        // proxy: "http://127.0.0.1:8080"
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            return body;
        }
    });
}

function stop_task(u, task_id) {
    t = url.resolve(u, "stop");
    target = `${t}/${task_id}/`;
    request({
        url: target,
        // proxy: "http://127.0.0.1:8080"
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    });
}


function zip_dir(src, dst) {
    var fs = require('fs');
    var archiver = require('archiver');

    const arch = archiver.create('zip', {});
    const out = fs.createWriteStream(dst);

    arch.on('end', function () {
        console.log(`create ${dst}`);
    });
    arch.on('error', function (err) {
        console.error(err);
    });
    arch.pipe(out);
    arch.directory(src, "");
    arch.finalize();
}


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


function zipDirectory(source, out) {
    var archiver = require('archiver');
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(out);

    return new Promise((resolve, reject) => {
        archive
            .directory(source, false)
            .on('error', err => reject(err))
            .pipe(stream)
            ;

        stream.on('close', () => resolve());
        archive.finalize();
    });
}

function gzip(src, dst) {
    var fstream = require('fstream'),
        tar = require('tar'),
        zlib = require('zlib');

    fstream.Reader({ 'path': src, 'type': 'Directory' }) /* Read the source directory */
        .pipe(new tar.Pack()) /* Convert the directory to a .tar file */
        .pipe(zlib.Gzip()) /* Compress the .tar file */
        .pipe(fstream.Writer({ 'path': dst })); /* Give the output file name */
}



function tgz(src,dst) {
    const compressing = require('compressing');
    compressing.tar.compressDir(src, dst)
        .then(() => {
            return compressing.gzip.compressFile(dst,
                `${dst}.gz`);
        });
}

// create_task("http://192.168.245.158:5000/", "tcpfuzzer", "test", " tcpfuzzer --host 192.168.245.131 --port 21 --conf /fuzzer/test/conf/floatftp --interval 0")
// get_status("http://192.168.245.158:5000", "a39f7eea-11b6-11e9-b4ab-000c29e4cea3")
// stop_task("http://192.168.245.158:5000", "a39f7eea-11b6-11e9-b4ab-000c29e4cea3")

// console.log(get_status("http://192.168.245.158:5000", "a39f7eea-11b6-11e9-b4ab-000c29e4cea3"));

tgz("F:\\code\\Detamper", "F:\\out.zip")

// upload("http://192.168.245.158:5000", "F:\\code\\electron-serialport-master\\app\\public\\css\\index.css")


// console.log(os.tmpdir());
// var path = require("path")
//
// console.log(path.basename("F:\\ss\\sxxx\\"))
//
// console.log(Date.now());

// var data = fs.statSync('C:\\Users\\hac425\\AppData\\Local\\Temp\\project_test_1546790226923.zip');
// console.log(data.size);