function replay() {
    // 首先把之前的计时器去掉
    var int = parseInt(localStorage.getItem("replay-int"));
    clearInterval(int);

    crash_path = $("#crash-path").val();
    fs.readFile(crash_path, function (err, data) {
        if (err) {
            return console.error(err);
        }

        var crash_log = JSON.parse(data.toString());
        var u = get_target();
        var replay_type = $("#selectd").val();
        var t1 = $("#t1").val();
        var t2 = $("#t2").val();
        var speed = $("#speed").val();

        target = url.resolve(u, "replay");
        var requestData = {
            type: replay_type,
            speed: speed,
            crash_log: crash_log,
            t1: t1,
            t2: t2
        };

        // console.log(requestData);
        // alert("requests");

        request({
            url: target,
            method: "POST",
            proxy: "http://127.0.0.1:8080",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: requestData
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (body.result == "successful") {
                    task_id = body.task_id;
                    localStorage.setItem("replay-task-id", task_id);
                    var int = setInterval(() => {
                        check_replay_result();
                    }, 1000);

                    localStorage.setItem("replay-int", int);

                    $('body').overhang({
                        type: 'success',
                        message: '开始重放，请耐心等待结果',
                        duration: 3
                    });

                    show_task_info();
                    // alert(task_id)
                    localStorage.setItem("replay-time", (new Date()).getTime().toString());
                    $("#info-crash-path").text(crash_path);
                    localStorage.setItem("crash-path", crash_path);
                    $("#info-task-id").text(task_id);
                    $("#result").text("正在重放.....");
                    $("#crash-info").hide();
                    console.log(task_id);
                    return true;
                }

            }
            console.log(requestData);
            $('body').overhang({
                type: 'warn',
                duration: 3,
                message: '任务创建失败...'
            });
        });
    });
}


function show_form() {
    $("#replay-task-info").hide()
    $("#page-content").show()
}

function show_task_info() {
    $("#page-content").hide()
    $("#replay-task-info").show()
}

function back_form() {
    show_form();
    localStorage.setItem("crash-path","f:/iiiii/xxxxx");
    localStorage.removeItem("replay-task-id");
    localStorage.removeItem("replay-finish");
}

function check_replay_result() {
    task_id = localStorage.getItem("replay-task-id");

    if (task_id == null) {
        return;
    }

    old = localStorage.getItem('replay-time');
    now = (new Date()).getTime().toString();

    // alert(getdelta(old, now));
    if(localStorage.getItem("replay-finish") == null){
        $("#time").text(getdelta(old, now));
    }
    

    t = url.resolve(get_target(), "replay-status");
    target = `${t}/${task_id}/`;
    request({
        url: target,
        proxy: "http://127.0.0.1:8080"
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            if (info.result == "successful") {
                var int = parseInt(localStorage.getItem("replay-int"));
                clearInterval(int);
                if (info.data.crash) {
                    $('body').overhang({
                        type: 'success',
                        message: '重放成功',
                        duration: 3
                    });
                    $("#info-crash-seq").val(JSON.stringify(info.data.seq));
                    $("#crash-info").show();
                    $("#result").text("重放成功");

                    localStorage.setItem("replay-finish", "yes");

                } else {
                    $('body').overhang({
                        type: 'warn',
                        duration: 3,
                        message: '目标依然存活， 确认提供的是正确的 crash log'
                    });
                    $("#result").text("重放失败，crash文件错误或者误报");
                }
            }
            return info;
        }
    });
}

function getdelta(old, now) {

    beginTime = parseInt(old)
    // alert(1);
    endTime = parseInt(now)
    var secondNum = parseInt((endTime - beginTime) / 1000);

    if (secondNum >= 0 && secondNum < 60) {
        return secondNum + ' 秒 ';
    }
    else if (secondNum >= 60 && secondNum < 3600) {
        var nTime = parseInt(secondNum / 60);
        return nTime + ' 分钟 ';
    }
    else if (secondNum >= 3600 && secondNum < 3600 * 24) {
        var nTime = parseInt(secondNum / 3600);
        return nTime + '小时 ';
    }
    else {
        var nTime = parseInt(secondNum / 86400);
        return nTime + ' 天 ';
    }
    return secondNum
}


if (localStorage.getItem("replay-init") == null) {

    ipcRenderer.on('selected-file', (event, path) => {

        // alert(path[0]);
        console.log(path[0]);
        $("#crash-path").val(path[0])
    });
    // alert("初始化 replay")
    localStorage.removeItem("replay-task-id");
    localStorage.setItem("replay-init", "yes");
}