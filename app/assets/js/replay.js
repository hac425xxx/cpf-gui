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

        if(replay_type.indexOf("usb") > -1) {
            var usb_fuzz_type = $("input[name='usb-fuzz-type']:checked").val();
            requestData.usb_fuzz_type = usb_fuzz_type;
        }

        // console.log(requestData);
        // alert("requests");

        request({
            url: target,
            method: "POST",
            proxy: PROXY_SERVER,
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
                    // console.log(task_id);
                    return true;
                }

            }
            // $('body').overhang({
            //     type: 'warn',
            //     duration: 3,
            //     message: '任务创建失败...'
            // });
            $.sweetModal({
                content: '任务创建失败，请重试!!!',
                title: '提示',
                icon: $.sweetModal.ICON_ERROR,
                theme: $.sweetModal.THEME_LIGHT,
                buttons: {
                    '好的': {
                        classes: 'redB'
                    }
                }
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


function stop_replay_task(task_id) {
    t = url.resolve(get_target(), "replay-stop");
    target = `${t}/${task_id}/`;
    request({
        url: target,
        proxy: PROXY_SERVER
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("停止 replay 任务成功");
        }
    });
}

function back_form() {
    show_form();
    replay_taskid = localStorage.getItem("replay-task-id");
    stop_replay_task(replay_taskid);
    localStorage.setItem("crash-path", "f:/iiiii/xxxxx");
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
    if (localStorage.getItem("replay-finish") == null) {
        $("#time").text(getdelta(old, now));
    }


    t = url.resolve(get_target(), "replay-status");
    target = `${t}/${task_id}/`;
    request({
        url: target,
        proxy: PROXY_SERVER
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            if (info.result == "successful") {

                if (info.data.crash) {
                    // $('body').overhang({
                    //     type: 'success',
                    //     message: '重放成功',
                    //     duration: 3
                    // });
                    $.toast({
                        heading: '提示',
                        text: '重放成功',
                        position: 'bottom-right',
                        icon: 'success',
                        hideAfter: false,
                        stack: 1
                    });
                    $("#info-crash-seq").val(JSON.stringify(info.data.seq));
                    $("#crash-info").show();
                    $("#result").text("重放成功");



                } else {
                    // $('body').overhang({
                    //     type: 'warn',
                    //     duration: 3,
                    //     message: '目标依然存活， 确认提供的是正确的 crash log'
                    // });

                    $.toast({
                        heading: '警告',
                        text: '重放失败，crash文件错误或者误报',
                        position: 'bottom-right',
                        icon: 'warning',
                        hideAfter: false,
                        stack: 1
                    });

                    $("#result").text("重放失败，crash文件错误或者误报");
                }

                var int = parseInt(localStorage.getItem("replay-int"));
                clearInterval(int);
                localStorage.setItem("replay-finish", "yes");
            }

            if (info.result == "dead") {
                // $('body').overhang({
                //     type: 'warn',
                //     duration: 3,
                //     message: '重放失败，请确认参数信息是否正确....'
                // });

                $.toast({
                    heading: '提示',
                    text: '重放失败，请确认参数信息是否正确....',
                    position: 'bottom-right',
                    icon: 'warning',
                    hideAfter: false,
                    stack: 5
                });

                $("#result").text("重放失败，请确认参数信息是否正确");
                var int = parseInt(localStorage.getItem("replay-int"));
                clearInterval(int);
                localStorage.setItem("replay-finish", "yes");
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


if (localStorage.getItem("replay-init") != "yes") {

    ipcRenderer.on('selected-file', (event, path) => {
        // alert(path[0]);
        fpath = path[0];
        console.log(`选择的文件: ${fpath}`);
        $("#crash-path").val(fpath)
    });
    // alert("初始化 replay")
    localStorage.removeItem("replay-task-id");
    localStorage.setItem("replay-init", "yes");
}