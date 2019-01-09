const { remote, ipcRenderer } = require('electron');

const request = require('request');
const fs = require("fs");
const url = require("url");
// const path = require("path");

function select_file() {
    ipcRenderer.send('select-file-requests');
}

function select_directory() {
    ipcRenderer.send('select-directory-requests');
}

function load_status() {
    var fs = require("fs");
    // 异步读取
    fs.readFile(`${__dirname}/status.tpl`, function (err, data) {
        if (err) {
            return console.error(err);
        }
        $("body").html(data.toString());
    });

}

function load_index() {
    var fs = require("fs");
    // 异步读取
    fs.readFile(`${__dirname}/index.tpl`, function (err, data) {
        if (err) {
            return console.error(err);
        }
        $("body").html(data.toString());
    });
}

function load_replay() {
    var fs = require("fs");
    // 异步读取
    fs.readFile(`${__dirname}/replay.tpl`, function (err, data) {
        if (err) {
            return console.error(err);
        }
        $("body").html(data.toString());
    });
}


function select_type() {
    selectd = $("#selectd").val()


    if (selectd.indexOf("tcp") > -1 || selectd.indexOf("udp") > -1) {
        //tcp或者 udp
        $("#t1-name").text("目标地址");
        $("#t2-name").text("目标端口");
        if (selectd.indexOf("tcp") > -1) {
            $("#t1").val("192.168.245.131");
            $("#t2").val("21");
        } else {
            $("#t1").val("192.168.245.158");
            $("#t2").val("1111");
        }

    }
    if (selectd.indexOf("serial") > -1) {
        //串口
        $("#t1-name").text("设备地址");
        $("#t2-name").text("波特率");

        $("#t1").val("/dev/ttyS0");
        $("#t2").val("115200");
    }
    if (selectd.indexOf("usb") > -1) {
        //串口
        $("#t1-name").text("设备vid");
        $("#t2-name").text("设备pid");

        $("#t1").val("0xaabb");
        $("#t2").val("0xccdd");
    }
}


function get_target() {
    ret = localStorage.getItem("target");
    return ret;
}

localStorage.removeItem("status-init");
localStorage.removeItem("index-init");
localStorage.removeItem("replay-init");

