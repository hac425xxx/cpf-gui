function upload(u, src) {
    target = url.resolve(u, "upload");
    const formData = {
        file: fs.createReadStream(src)
    };



    request.post({
        url: target,
        proxy: PROXY_SERVER,
        formData: formData
    }, function (err, response, body) {
        if (err) {
            // $('body').overhang({
            //     type: 'warn',
            //     duration: 1,
            //     message: '配置文件目录上传失败，请重试!!!'
            // });

            $.sweetModal({
                content: '配置文件目录上传失败，请重试!!!',
                title: '提示',
                icon: $.sweetModal.ICON_ERROR,
                theme: $.sweetModal.THEME_LIGHT,
                buttons: {
                    '好的': {
                        classes: 'redB'
                    }
                }
            });
            return console.error('upload failed:', err);
        }
        try {
            // alert(err);
            $("#workspace").text(JSON.parse(body).output_dir);
            $("#workspace").trigger("click");
        } catch (e) {
            // $('body').overhang({
            //     type: 'warn',
            //     duration: 1,
            //     message: '配置文件目录上传失败，请重试!!!'
            // });

            $.sweetModal({
                content: '配置文件目录上传失败，请重试!!!',
                title: '提示',
                icon: $.sweetModal.ICON_ERROR,
                theme: $.sweetModal.THEME_LIGHT,
                buttons: {
                    '好的': {
                        classes: 'redB'
                    }
                }
            });
        }
    });


}






function create_task_sub() {
    var u = get_target();
    var project_name = $("#project-name").val();
    var fuzz_type = $("#selectd").val();
    var t1 = $("#t1").val();
    var t2 = $("#t2").val();
    var speed = $("#speed").val();
    var workspace = $("#workspace").text();

    target = url.resolve(u, "create");
    var requestData = {
        type: fuzz_type,
        project_name: project_name,
        speed: speed,
        t1: t1,
        t2: t2,
        workspace: workspace
    };

    if (fuzz_type.indexOf("usb") > -1) {
        var usb_fuzz_type = $("input[name='usb-fuzz-type']:checked").val();
        requestData.usb_fuzz_type = usb_fuzz_type;
    }

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
            console.log(body);
            add_taskid(body.task_id);

            task_info = {
                task_id: body.task_id,
                configure_path: $("#fuzzer-configure").val(),
                workspace: $("#workspace").text(),
                is_dead: false,
                is_init: false
            }

            add_local_task_info(task_info);

            localStorage.setItem("current-status-taskid", body.task_id);

            var int = setInterval(() => {
                background_check_task_status(body.task_id)
            }, 2000);

            localStorage.setItem(`bg-check-${body.task_id}`, int.toString());

            $('body').overhang({
                type: 'success',
                message: '任务创建成功....',
                duration: 1.5
            });
            setTimeout(function () {
                load_status();
            }, 1000);
            return body;
        } else {
            // $('body').overhang({
            //     type: 'warn',
            //     duration: 1,
            //     message: '任务创建失败,请重试!!!'
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
        }
    });
}


function create_task() {
    save_selected_info();
    upload(get_target(), $("#zip-path").text());
}


function add_taskid(task_id) {
    task_ids = remote.getGlobal('sharedObject').task_ids;
    task_ids.push(task_id);
    remote.getGlobal('sharedObject').task_ids = task_ids;
}


function add_local_task_info(info) {
    localStorage.setItem(info.task_id, JSON.stringify(info));
}

if (localStorage.getItem("index-init") != "yes") {
    ipcRenderer.on('selected', (event, src_paths) => {
        src_path = src_paths[0];
        const os = require('os');
        var path = require("path");
        var tmp_dir = os.tmpdir();
        var project_name = $("#project-name").val();
        var fuzz_type = $("#selectd").val();
        var ts = Date.now();
        var file_name = `${fuzz_type}_${ts}.zip`
        dst = path.resolve(tmp_dir, file_name);
        zip_dir(src_path, dst);
        // upload(get_target(), dst);
        $("#fuzzer-configure").val(src_path);
        $("#zip-path").text(dst);
    });

    ipcRenderer.on('set-proxy', (event, src_paths) => {

        $.sweetModal.prompt('代理地址', PROXY_SERVER, PROXY_SERVER, function (val) {
            // $.sweetModal('You typed: ' + val);
            PROXY_SERVER = val;
        });
    });

    localStorage.setItem("index-init", "yes")
}

