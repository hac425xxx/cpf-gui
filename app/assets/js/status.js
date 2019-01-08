const { remote } = require('electron');
let request = require('request');
const url = require("url");
const path = require("path");
const fs = require("fs");


const { ipcRenderer } = require('electron');

// 停止并删除所有任务
ipcRenderer.on('clear-local-storage', (event, src_paths) => {
    task_ids = remote.getGlobal('sharedObject').task_ids;
    for (let index = 0; index < task_ids.length; index++) {
        var taskid = task_ids[index];
        stop_task(taskid);
    }


    remote.getGlobal('sharedObject').task_ids = [];

    // 保存需要的变量
    int = localStorage.getItem("task-int")
    target = localStorage.getItem("target");

    localStorage.clear();


    localStorage.setItem("target", target);
    localStorage.setItem("task-int", int)
    load_status();
});

function get_taskids() {
    task_ids = remote.getGlobal('sharedObject').task_ids;
    for (let index = 0; index < task_ids.length; index++) {
        const element = task_ids[index];
        console.log(element);
    }
    remote.getGlobal('sharedObject').task_ids = [];
}

function get_target() {
    ret = localStorage.getItem("target");
    return ret;
}

function stop_task(task_id) {
    t = url.resolve(get_target(), "stop");
    target = `${t}/${task_id}/`;
    request({
        url: target,
        proxy: "http://127.0.0.1:8080"
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    });
}

function get_status(u, task_id) {
    t = url.resolve(u, "status");
    target = `${t}/${task_id}/`;
    request({
        url: target,
        proxy: "http://127.0.0.1:8080"
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            info = JSON.parse(body);
            console.log(info);
            add_task_info(info.project_info.task_id, info.project_info.start_time, info.project_info.status, info.project_info.project_name)
            return info;
        }
    });
}

function add_task_info(task_id, start_time, status, project_name) {
    tr = `<tr><td>${project_name}</td><td>${task_id}</td><td>${start_time}</td><td id="status-${task_id}">${status}</td><td><div class="hidden-sm hidden-xs btn-group"><button class="btn btn-xs btn-success" onclick="get_task_info('${task_id}')" type="margin-right: 8px;"><i class="ace-icon glyphicon glyphicon-eye-open"></i></button><button class="btn btn-xs btn-danger stop-btn" onclick="stop_task('${task_id}')"><i class="ace-icon glyphicon glyphicon-stop"></i></button></div></td></tr>`;
    var $table = $('#task-table');
    $table.append(tr);
}

function get_task_info(task_id) {

    if(task_id == "aaaa-bbbb-cccc-dddd"){
        return
    }

    if (!task_id.length) {
        return
    }

    // console.log(`进入 get taskinfo ${task_id}`);
    t = url.resolve(get_target(), "status");
    target = `${t}/${task_id}/`;
    request({
        url: target,
        proxy: "http://127.0.0.1:8080"
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            // console.log(info);

            if (info.runtime.is_run) {
                $("#status").text("运行中......");
                $("#crash-info").hide();
            } else {
                $("#status").text("已结束");
                $(`#status-${task_id}`).text("dead")
                if (info.project_info.crash_sequence.length) {
                    crash_seq = JSON.stringify(info.project_info.crash_sequence);
                    save_crash_seqs(task_id, crash_seq);
                    $("#crash-info").show();
                }
            }

            $("#workspace").text(info.project_info.workspace);
            $("#project-name").text(info.project_info.project_name);
            $("#task-id").text(task_id);
            try {
                sec = parseInt(info.runtime.fuzz_time);
                min = parseInt(sec / 60);
                sec = sec - 60 * min;
                st = `${min} 分 ${sec} 秒`;
                $("#run-time").text(st);
                fuzz_count = info.runtime.fuzz_count;
                $("#fuzz-count").text(fuzz_count);
            } catch (error) {

            }
            return info;
        }
    });
}


function save_crash_seqs(task_id, crash_seq) {
    var info = localStorage.getItem(task_id);
    if (info) {
        info = JSON.parse(info);
        dst = path.resolve(info.configure_path, `${task_id}_crash.json`);
        if (!info.is_crash) {
            fs.writeFile(dst, crash_seq, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    info.is_crash = true;
                    localStorage.setItem(info.task_id, JSON.stringify(info));
                }
            })
        }
        $("#crash-path").text(dst);
    }
}

function load_status() {
    console.log(path.resolve("app/status.tpl"))
    // 异步读取
    fs.readFile(`${__dirname}/status.tpl`, function (err, data) {
        if (err) {
            return console.error(err);
        }
        $("body").html(data.toString());
    });

}

function load_index() {
    console.log(path.resolve("app/index.tpl"))
    // 异步读取
    fs.readFile(`${__dirname}/index.tpl`, function (err, data) {
        if (err) {
            return console.error(err);
        }
        $("body").html(data.toString());
    });
}

// 初始化的js

let task_id = "";
task_ids = remote.getGlobal('sharedObject').task_ids;
for (let index = 0; index < task_ids.length; index++) {
    task_id = task_ids[index];
    console.log(task_id);
    get_status(get_target(), task_id);
}
get_task_info(task_id);


// 先清除之前的计时器
var int = parseInt(localStorage.getItem("task-int"));
clearInterval(int);

// 每秒获取一次
var int = setInterval(function () {
    get_task_info($("#task-id").text());
    // console.log($("#task-id").text())
}, 2000);

localStorage.setItem("task-int", int)



