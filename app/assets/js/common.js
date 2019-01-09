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


function background_check_task_status(task_id) {

    if (task_id == "aaaa-bbbb-cccc-dddd") {
        return
    }

    if (!task_id.length) {
        return
    }

    t = url.resolve(get_target(), "status");
    target = `${t}/${task_id}/`;
    request({
        url: target,
        proxy: "http://127.0.0.1:8080"
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            // console.log(info);
            if (!info.runtime.is_run) {
                var project_name = info.project_info.project_name;


                if (localStorage.getItem(`overhanged-${task_id}`) == null) {
                    $('body').overhang({
                        type: 'success',
                        message: `任务: ${project_name} 结束`,
                        duration: 1
                    });
                    localStorage.setItem(`overhanged-${task_id}`, "yes");
                }


                var int = parseInt(localStorage.getItem(`bg-check-${task_id}`));
                // alert(int);
                localStorage.setItem("current-status-taskid", task_id);
                clearInterval(int);
            }
        }
        return;
    }
    );
}


function save_selected_info() {
    var type = $("#selectd").val()
    var fuzz_type_info = {
        type: type,
        project_name: $("#project-name").val(),
        t1: $("#t1").val(),
        t2: $("#t2").val(),
        speed: $("#speed").val()
    }
    localStorage.setItem(`${type}-fuzz-info`, JSON.stringify(fuzz_type_info));
}

function select_type() {
    var selectd = $("#selectd").val()
    var fuzz_type_info = {
        type: selectd,
        project_name: $("#project-name").val(),
        t1: $("#t1").val(),
        t2: $("#t2").val(),
        speed: $("#speed").val()
    }

    if (selectd.indexOf("tcp") > -1 || selectd.indexOf("udp") > -1) {
        //tcp或者 udp
        $("#t1-name").text("目标地址");
        $("#t2-name").text("目标端口");
        if (selectd.indexOf("tcp") > -1) {

            if (localStorage.getItem("tcp-fuzz-info") == null) {
                $("#project-name").val("TCP模糊测试");
                $("#t1").val("192.168.245.131");
                $("#t2").val("21");
            } else {
                var fuzz_info = JSON.parse(localStorage.getItem("tcp-fuzz-info"));
                $("#project-name").val(fuzz_info.project_name);
                $("#t1").val(fuzz_info.t1);
                $("#t2").val(fuzz_info.t2);
                $("#speed").val(fuzz_info.speed);
            }

        } else {

            if (localStorage.getItem("udp-fuzz-info") == null) {
                $("#project-name").val("UDP模糊测试");
                $("#t1").val("192.168.245.158");
                $("#t2").val("1111");
            } else {
                var fuzz_info = JSON.parse(localStorage.getItem("udp-fuzz-info"));
                $("#project-name").val(fuzz_info.project_name);
                $("#t1").val(fuzz_info.t1);
                $("#t2").val(fuzz_info.t2);
                $("#speed").val(fuzz_info.speed);
            }

        }

    }

    if (selectd.indexOf("serial") > -1) {
        //串口
        $("#t1-name").text("设备地址");
        $("#t2-name").text("波特率");

        if (localStorage.getItem("serial-fuzz-info") == null) {
            $("#project-name").val("串口模糊测试");
            $("#t1").val("/dev/ttyS0");
            $("#t2").val("115200");
        } else {
            var fuzz_info = JSON.parse(localStorage.getItem("serial-fuzz-info"));
            $("#project-name").val(fuzz_info.project_name);
            $("#t1").val(fuzz_info.t1);
            $("#t2").val(fuzz_info.t2);
            $("#speed").val(fuzz_info.speed);
        }
    }
    if (selectd.indexOf("usb") > -1) {
        //usb
        $("#t1-name").text("设备vid");
        $("#t2-name").text("设备pid");

        if (localStorage.getItem("usb-fuzz-info") == null) {
            $("#project-name").val("USB模糊测试");
            $("#t1").val("0xaabb");
            $("#t2").val("0xccdd");
        } else {
            var fuzz_info = JSON.parse(localStorage.getItem("usb-fuzz-info"));
            $("#project-name").val(fuzz_info.project_name);
            $("#t1").val(fuzz_info.t1);
            $("#t2").val(fuzz_info.t2);
            $("#speed").val(fuzz_info.speed);
        }
    }

    localStorage.setItem("current-fuzz-type", selectd);
}


function get_target() {
    ret = localStorage.getItem("target");
    return ret;
}

localStorage.removeItem("status-init");
localStorage.removeItem("index-init");
localStorage.removeItem("replay-init");

