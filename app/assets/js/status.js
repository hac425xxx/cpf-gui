


function get_taskids() {
    task_ids = remote.getGlobal('sharedObject').task_ids;
    for (let index = 0; index < task_ids.length; index++) {
        const element = task_ids[index];
        // console.log(element);
    }
    remote.getGlobal('sharedObject').task_ids = [];
}


function get_status(u, task_id) {
    t = url.resolve(u, "status");
    target = `${t}/${task_id}/`;
    request({
        url: target,
        proxy: PROXY_SERVER
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            info = JSON.parse(body);
            var status = "runing"

            //info.status 表示异常情况， info.project_info.status表示任务的真实状况
            if (info.status == "dead" || info.project_info.status == "dead") {
                status = "dead"
            }
            // :todo 
            // console.log(info);
            add_task_info(info.project_info.task_id, info.project_info.start_time, status, info.project_info.project_name)
            return info;
        }
    });
}

function add_task_info(task_id, start_time, status, project_name) {
    tr = `<tr id="${task_id}" onclick="get_task_info('${task_id}', 'click')"><td>${project_name}</td><td>${task_id}</td><td>${start_time}</td><td id="status-${task_id}">${status}</td><td><div class="hidden-sm hidden-xs btn-group"><button class="btn btn-xs btn-success" onclick="get_task_info('${task_id}', 'click')" type="margin-right: 8px;"><i class="ace-icon glyphicon glyphicon-eye-open"></i></button><button class="btn btn-xs btn-danger stop-btn" onclick="stop_task('${task_id}')"><i class="ace-icon glyphicon glyphicon-stop"></i></button></div></td></tr>`;
    var $table = $('#task-table');
    $table.append(tr);
}


function is_alive(task_id) {
    var local_info = localStorage.getItem(task_id);
    if (local_info) {
        local_info = JSON.parse(local_info);
        if (local_info.is_dead) {
            return false
        }
    }
    return true;
}

function get_task_info(task_id, type = "") {

    if (task_id == "aaaa-bbbb-cccc-dddd") {
        return
    }

    if (!task_id.length) {
        return
    }
    // alert(type);
    if (type != "click" && is_alive(task_id) == false) {
        return;
    }

    localStorage.setItem("current-status-taskid", task_id);

    // console.log(`进入 get taskinfo ${task_id}`);
    t = url.resolve(get_target(), "status");
    target = `${t}/${task_id}/`;
    request({
        url: target,
        proxy: PROXY_SERVER
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            // console.log(info);

            $("#workspace").text(info.project_info.workspace);
            $("#project-name").text(info.project_info.project_name);
            $("#task-id").text(task_id);
            $("#info-path").text("工作目录");


            if (info.result == "successful") {

                if (info.runtime.is_run) {
                    $("#status").text("运行中......");
                    $("#crash-info").hide();
                } else {
                    $("#status").text("已结束");
                    $(`#status-${task_id}`).text("dead")
                    var project_name = info.project_info.project_name;



                    if (info.project_info.crash_sequence.length) {
                        var save_data = {
                            crash_seq: info.project_info.crash_sequence,
                            normal_configure: info.runtime.normal_configure,
                            type: info.runtime.type
                        }

                        // 对于 usb 类型的保存类型， 后面重放是可以使用
                        if (info.runtime.usb_fuzz_type != null) {
                            save_data.usb_fuzz_type = info.runtime.usb_fuzz_type;
                        }

                        save_data = JSON.stringify(save_data);
                        save_crash(task_id, save_data);
                        $("#crash-info").show();

                        if (localStorage.getItem(`overhanged-${task_id}`) == null) {
                            // $('body').overhang({
                            //     type: 'success',
                            //     message: `任务: ${project_name} 结束`,
                            //     duration: 1
                            // });
                            $.toast({
                                heading: '提示',
                                text: `任务: ${project_name} 结束`,
                                position: 'bottom-right',
                                icon: 'success',
                                hideAfter: false,
                                stack: 5
                            })
                            localStorage.setItem(`overhanged-${task_id}`, "yes");
                        }
                        // 设置任务状态为 dead, 避免为已经 dead 的任务发额外的请求
                        set_task_dead(task_id);
                    }

                }

                sec = parseInt(info.runtime.fuzz_time);
                min = parseInt(sec / 60);
                hour = parseInt(min / 60);
                sec = sec - 60 * min;
                min = min - 60 * hour
                st = `${hour} 时 ${min} 分 ${sec} 秒`;
                $("#run-time").text(st);
                fuzz_count = info.runtime.fuzz_count;
                $("#fuzz-count").text(fuzz_count);
            } else {

                $("#status").text("任务启动失败，请确认配置是否正确");
                $(`#status-${task_id}`).text("dead")
                $("#run-time").text("0");

                $("#crash-info").hide();
                var local_task = JSON.parse(localStorage.getItem(task_id));

                $("#info-path").text("配置文件路径");

                if (info.status == "dead") {
                    // alert(info.status);
                    if (localStorage.getItem(`overhanged-${task_id}`) == null) {
                        $.toast({
                            heading: '警告',
                            text: `任务 ${info.project_info.project_name} 运行失败，请确认配置信息是否正确`,
                            position: 'bottom-right',
                            icon: 'warning',
                            hideAfter: false,
                            stack: 5
                        });
                        localStorage.setItem(`overhanged-${task_id}`, "yes");
                    }
                    set_task_dead(task_id);
                }
                $("#workspace").text(local_task.configure_path);
            }
            return info;
        }
    });
}


function save_crash(task_id, save_data) {
    console.log(`需要保存的crash日志为：${save_data}`);
    var info = localStorage.getItem(task_id);
    if (info) {
        info = JSON.parse(info);
        dst = path.resolve(info.configure_path, `${task_id}_crash.json`);
        if (!info.is_dead) {
            fs.writeFile(dst, save_data, function (err) {
                if (err) {
                    console.log(`保存crash日志异常：${err}`);
                    $.toast({
                        heading: '警告',
                        text: `任务: ${task_id} 的 crash 用例保存失败`,
                        position: 'bottom-right',
                        icon: 'warning',
                        hideAfter: false,
                        stack: 5
                    });
                } else {
                    console.log(`crash保存成功，保存路径为 ${dst}`);
                    info.is_dead = true;
                    localStorage.setItem(info.task_id, JSON.stringify(info));
                }
            })
        }
        $("#crash-path").text(dst);
    }
}

if (localStorage.getItem("status-init") != "yes") {
    // 停止并删除所有任务
    ipcRenderer.on('clear-local-storage', (event, src_paths) => {
        var task_ids = remote.getGlobal('sharedObject').task_ids;
        for (let index = 0; index < task_ids.length; index++) {
            var taskid = task_ids[index];
            stop_task(taskid);
            var int = parseInt(localStorage.getItem(`bg-check-${taskid}`));
            clearInterval(int);
        }

        remote.getGlobal('sharedObject').task_ids = [];

        // 保存需要的变量
        var int = localStorage.getItem("task-int")
        var target = localStorage.getItem("target");
        var status_init = localStorage.getItem("status-init");
        var index_init = localStorage.getItem("index-init");
        var replay_init = localStorage.getItem("replay-init");

        localStorage.clear();

        localStorage.setItem("replay-init", replay_init);
        localStorage.setItem("index-init", index_init);
        localStorage.setItem("status-init", status_init);
        localStorage.setItem("target", target);
        localStorage.setItem("task-int", int)
        load_status();
    });
    localStorage.setItem("status-init", "yes");
}





// 初始化的js

let task_id = "";
task_ids = remote.getGlobal('sharedObject').task_ids;
for (let index = 0; index < task_ids.length; index++) {
    task_id = task_ids[index];
    // console.log(task_id);
    get_status(get_target(), task_id);
}

// console.log(`第1次获取: ${task_id}`);

if (localStorage.getItem('current-status-taskid') != null) {
    task_id = localStorage.getItem('current-status-taskid');
} else {
    localStorage.setItem("current-status-taskid", task_id);
}

// console.log(`第2次获取: ${task_id}`);
// $(`#${task_id}`).click();

get_task_info(task_id, "click");

// 先清除之前的计时器
var int = parseInt(localStorage.getItem("task-int"));
clearInterval(int);

// 每秒获取一次
var int = setInterval(function () {
    get_task_info($("#task-id").text());
    // console.log($("#task-id").text())
}, 2000);

localStorage.setItem("task-int", int);