const { remote, ipcRenderer } = require('electron');

const request = require('request');
const fs = require("fs");
const url = require("url");

let PROXY_SERVER = ""
// PROXY_SERVER = "http://127.0.0.1:8080"
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


function stop_task(task_id) {
    t = url.resolve(get_target(), "stop");
    target = `${t}/${task_id}/`;
    request({
        url: target,
        proxy: PROXY_SERVER
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body);
            var int = parseInt(localStorage.getItem(`bg-check-${task_id}`));
            clearInterval(int);
        }
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
        proxy: PROXY_SERVER
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            if (info.result == "successful") {
                // console.log(info);
                if (!info.runtime.is_run) {
                    var project_name = info.project_info.project_name;


                    if (localStorage.getItem(`overhanged-${task_id}`) == null) {

                        $.toast({
                            heading: '提示',
                            text: `任务: ${project_name} 结束`,
                            position: 'bottom-right',
                            icon: 'success',
                            hideAfter: false,
                            stack: 5
                        });

                        // 表示已经提示过，无需再次提示
                        localStorage.setItem(`overhanged-${task_id}`, "yes");
                    }

                    var int = parseInt(localStorage.getItem(`bg-check-${task_id}`));
                    // alert(int);
                    localStorage.setItem("current-status-taskid", task_id);
                    clearInterval(int);
                }
            } else {
                if(info.status == "dead") {
                    if (localStorage.getItem(`overhanged-${task_id}`) == null) {
                        $.toast({
                            heading: '警告',
                            text: `任务: ${info.project_info.project_name} 运行失败，请确认配置信息是否正确`,
                            position: 'bottom-right',
                            icon: 'warning',
                            hideAfter: false,
                            stack: 5
                        });
                        localStorage.setItem(`overhanged-${task_id}`, "yes");
                    }
                    var int = parseInt(localStorage.getItem(`bg-check-${task_id}`));
                    // alert(int);
                    localStorage.setItem("current-status-taskid", task_id);
                    clearInterval(int);
                }
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
        $("#usb-fuzz-type-form").hide();
        if (selectd.indexOf("tcp") > -1) {

            if (localStorage.getItem("tcp-fuzz-info") == null) {
                $("#project-name").val("TCP模糊测试");
                $("#t1").val("192.168.245.131");
                $("#t2").val("21");
                $("#speed").val("0.01");
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
                $("#speed").val("0.01");
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
        $("#usb-fuzz-type-form").hide();

        if (localStorage.getItem("serial-fuzz-info") == null) {
            $("#project-name").val("串口模糊测试");
            $("#t1").val("/dev/ttyS0");
            $("#t2").val("115200");
            $("#speed").val("0.01");
        } else {
            var fuzz_info = JSON.parse(localStorage.getItem("serial-fuzz-info"));
            $("#project-name").val(fuzz_info.project_name);
            $("#t1").val(fuzz_info.t1);
            $("#t2").val(fuzz_info.t2);
            $("#speed").val(fuzz_info.speed);
        }
    }
    if (selectd.indexOf("usb") > -1) {

        $("#usb-fuzz-type-form").show();

        //usb
        $("#t1-name").text("设备vid");
        $("#t2-name").text("设备pid");

        if (localStorage.getItem("usb-fuzz-info") == null) {
            $("#project-name").val("USB模糊测试");
            $("#t1").val("0x0781");
            $("#t2").val("0x5591");
            $("#speed").val("0.001");
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


function get_local_task_obj(task_id) {
    var info = localStorage.getItem(task_id);
    if (info) {
        return JSON.parse(info);
    }
    return null;
}

function set_task_dead(task_id){
    // 设置任务的本地状态为 dead
    var localTask = get_local_task_obj(task_id);
    if(localTask){
        localTask.is_dead = true;
        localStorage.setItem(task_id, JSON.stringify(localTask));
    }
}

function get_target() {
    ret = localStorage.getItem("target");
    return ret;
}


function exit_app() {

    $.sweetModal.confirm('退出会停止所有任务，确认退出吗?', function () {
        // 首先停止所有运行的任务
        var task_ids = remote.getGlobal('sharedObject').task_ids;
        for (let index = 0; index < task_ids.length; index++) {
            var taskid = task_ids[index];
            stop_task(taskid);

        }
        // 清除 localStorage
        remote.getGlobal('sharedObject').task_ids = [];
        localStorage.clear();

        ipcRenderer.send('exit-app');
    });
}


function hide_window() {
    ipcRenderer.send('hide-window');
}


function zip_dir(src, dst) {
    const compressing = require('compressing');
    compressing.zip.compressDir(src, dst)
        .then(() => {
            console.log(`${src} 压缩完成, 压缩文件存储于： ${dst}`);
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


//检测文件或者文件夹存在 nodeJS
function fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}

function test_sync(){
    $.sweetModal.prompt('输入', PROXY_SERVER, PROXY_SERVER, function (val) {
        $.sweetModal('You typed: ' + val);
    });

    // 会先弹下面的，然后才会出来输入框，所以是 异步的 prompt
    alert(1);
    console.log("进入。。。。。")
}


localStorage.removeItem("status-init");
localStorage.removeItem("index-init");
localStorage.removeItem("replay-init");
