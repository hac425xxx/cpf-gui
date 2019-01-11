<link href="assets/css/app.min.css" rel="stylesheet">

<style>
	.profile-info-name {
			font-size: 16px;
			text-align: right;
			padding: 6px 10px 6px 4px;
			font-weight: 400;
			color: #667E99;
			background-color: transparent;
			width: 110px;
			vertical-align: middle;
		}

	.profile-user-info-striped .profile-info-value {
		font-size: 16px;
		border-top: 1px dotted #DCEBF7;
		padding-left: 12px;
		margin-top: 20px;
	}
</style>

<header style="-webkit-app-region: drag">
	<section>
		<!-- 导航栏 -->
		<div id="navbar" class="navbar navbar-default  ace-save-state">
			<div class="navbar-container ace-save-state" id="navbar-container">
				<div class="navbar-header pull-left">
					<a href="#" class="navbar-brand">
						<small>
							<i class="glyphicon glyphicon-flag"></i>
							通用模糊测试框架
						</small>
					</a>
				</div>

				<div class="navbar-buttons navbar-header pull-right" style="-webkit-app-region: no-drag;" role="navigation">
					<ul class="nav ace-nav">
						<li class="grey" onclick="hide_window()">
							<span class="badge">-</span>
						</li>

						<li class="grey">
							<span class="badge" onclick="exit_app()">x</span>
						</li>

					</ul>
				</div>
			</div><!-- /.navbar-container -->
		</div>
	</section>
</header>
<div class="main-container ace-save-state" id="main-container">
	<script type="text/javascript">
		try { ace.settings.loadState('main-container') } catch (e) { }
	</script>

	<div id="sidebar" class="sidebar responsive ace-save-state">
		<script type="text/javascript">
			try { ace.settings.loadState('sidebar') } catch (e) { }
		</script>

		<ul class="nav nav-list">
			<li>
				<a href="#" onclick="load_index()">
					<i class="menu-icon glyphicon glyphicon-fire"></i>
					<span class="menu-text"> 创建任务 </span>
				</a>

				<b class="arrow"></b>
			</li>

			<li class="">
				<a href="#" onclick="load_status()">
					<i class="menu-icon glyphicon glyphicon-eye-open"></i>
					<span class="menu-text"> 查看任务 </span>
				</a>
				<b class="arrow"></b>
			</li>

			<li class="active">
				<a href="#" onclick="load_replay()">
					<i class="menu-icon glyphicon glyphicon-repeat"></i>
					<span class="menu-text"> 重放异常用例 </span>
				</a>
				<b class="arrow"></b>
			</li>
		</ul><!-- /.nav-list -->

	</div>
	<div class="main-content">
		<div class="main-content-inner">
			<div class="page-content">
				<div class="row" id="page-content" style="display: none;">
					<div class="col-xs-12">
						<h3 style="margin-top: 0px;">
							重放异常用例
						</h3>
						<div class="hr hr-dotted"></div>
						<form class="form-horizontal" role="form">
							<div class="form-group">
								<label class="col-sm-3 control-label no-padding-left" for="crash-path"> 异常用例路径 </label>
								<div class="col-sm-9">
									<input onclick="select_file()" type="text" id="crash-path" class="col-xs-10 col-sm-5">
								</div>
							</div>

							<div class="form-group">
								<label class="col-sm-3 control-label" for="selectd">重放类型</label>
								<div class="col-sm-4">
									<div style="width: 99%;">
										<select class="form-control" id="selectd" onchange="select_type()">
											<option value="tcp">TCP模式</option>
											<option value="udp">UDP模式</option>
											<option value="serial">串口模式</option>
											<option value="usb">USB模式</option>
										</select>
									</div>
								</div>
							</div>

							<div class="space-4"></div>

							<div class="form-group">
								<label id="t1-name" class="col-sm-3 control-label no-padding-left" for="t1"> 目标地址 </label>

								<div class="col-sm-9">
									<input type="text" id="t1" class="col-xs-10 col-sm-5">
								</div>
							</div>

							<div class="form-group">
								<label id="t2-name" class="col-sm-3 control-label no-padding-left" for="t2"> 目标端口 </label>

								<div class="col-sm-9">
									<input type="text" id="t2" class="col-xs-10 col-sm-5">
								</div>
							</div>

							<div class="form-group">
								<label class="col-sm-3 control-label no-padding-left" for="speed"> 发包速率 </label>

								<div class="col-sm-9">
									<input type="text" id="speed" class="col-xs-10 col-sm-5">
								</div>
							</div>

							<div class="space-4"></div>

							<div class="col-md-offset-3 col-md-9">
								<button class="btn btn-info" type="button" id="create-task" onclick="replay()">
									<i class="ace-icon glyphicon glyphicon-send"></i>
									重放
								</button>

								&nbsp; &nbsp; &nbsp;
								<button class="btn" type="reset">
									<i class="ace-icon glyphicon glyphicon-remove"></i>
									重置
								</button>
							</div>

						</form>
					</div>

				</div><!-- /.row -->

				<div id="replay-task-info" style=" margin-left: 10px; ">
					<div style=" margin-left: 10px; ">
						<h3 style="color: #596608;font-weight: bold;">重放任务信息</h3>
					</div>
					<div class="profile-user-info profile-user-info-striped" style="margin-top: 20px;">
						<div class="profile-info-row">
							<div class="profile-info-name"> crash路径 </div>

							<div class="profile-info-value">
								<span class="editable editable-click" id="info-crash-path">f:/sss/sss</span>
							</div>
						</div>

						<div class="profile-info-row">
							<div class="profile-info-name"> 任务ID </div>
							<div class="profile-info-value">
								<span class="editable editable-click" id="info-task-id">aaaa-bbbb-cccc-dddd</span>
							</div>
						</div>

						<div class="profile-info-row">
							<div class="profile-info-name"> 运行时间 </div>

							<div class="profile-info-value">
								<span class="editable editable-click" id="time">0 分 10 秒</span>
							</div>
						</div>

						<div class="profile-info-row">
							<div class="profile-info-name"> 重放结果 </div>

							<div class="profile-info-value">
								<span class="editable editable-click" id="result">成功</span>
							</div>
						</div>



					</div>

					<div class="row" style="display: none; margin-left: 12px; margin-top: 20px; " id="crash-info">
						<label for="info-crash-seq" style=" color: #e34109; font-size: 20px; ">Crash序列</label>
						<textarea id="info-crash-seq" style=" height: 200px;overflow:hidden; resize:none;" class="autosize-transition form-control"></textarea>
					</div>

					<div class="row">
						<input type="submit" onclick="back_form()" style="position:fixed; bottom:60px; right: 20px;" value="返回" class="btn btn-primary" />
						<!-- <button style="position:fixed; bottom:80px; right: 20px;" class="btn btn-info" type="button" id="create-task" onclick="replay()">
							<i class="ace-icon fa fa-check"></i>
							重放
						</button> -->
					</div>

				</div>
			</div>
		</div>
	</div><!-- /.main-content -->



	<div class="footer">
		<div class="footer-inner">
			<div class="footer-content" style="position: absolute;  left: 12px; right: 12px; bottom: 4px;  padding: 4px; border-top: 3px double #eee;">
				<span class="bigger-120">
					<span class="bolder" style="color: #16753c!important;">通用模糊测试框架</span>
				</span>
			</div>
		</div>
	</div>
</div><!-- /.main-container -->

<!-- basic scripts -->


<script src="assets/js/app.min.js"></script>
<script src="assets/js/replay.js"></script>

<script>


	$("#t1").val("192.168.245.131");
	$("#t2").val("21");
	$("#speed").val("0");

	//$(".main-content").busyLoad("show", { spinner: "cubes" })
	//$("#demo").busyLoad("show", { animation: false });

	task_id = localStorage.getItem("replay-task-id");
	if (task_id == null) {
		show_form();
	} else {
		show_task_info();
		crash_path = localStorage.getItem("crash-path");
		$("#info-crash-path").text(crash_path);
		$("#info-task-id").text(task_id);
		$("#result").text("正在重放.....");
		check_replay_result();
	}

	/*


	$("#demo").busyLoad("show", {
		maxSize: "150px",
		minSize: "150px"
	});

	*/

</script>