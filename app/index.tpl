<header style="-webkit-app-region: drag">
	<section>
		<!-- 导航栏 -->
		<div id="navbar" class="navbar navbar-default          ace-save-state">
			<div class="navbar-container ace-save-state" id="navbar-container">
				<div class="navbar-header pull-left">
					<a href="#" class="navbar-brand">
						<small>
							<i class="glyphicon glyphicon-flag"></i>
							通用模糊测试框架
						</small>
					</a>
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
			<li class="active">
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

			<li class="">
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
				<div class="row">
					<div class="col-xs-12">
						<h3 style="margin-top: 0px;">
							模糊测试任务配置
						</h3>
						<div class="hr hr-dotted"></div>
						<form class="form-horizontal" role="form">

							<div class="form-group">
								<label class="col-sm-3 control-label" for="selectd">模糊测试类型</label>
								<div class="col-sm-3">
									<div>
										<select class="form-control" id="selectd" onchange="select_type()">
											<option value="tcp">TCP模糊测试</option>
											<option value="udp">UDP模糊测试</option>
											<option value="serial">串口模糊测试</option>
											<option value="usb">USB模糊测试</option>
										</select>
									</div>
								</div>
							</div>

							<div id="configure_form">
								<div class="form-group">
									<label class="col-sm-3 control-label no-padding-left" for="project-name"> 项目名称 </label>

									<div class="col-sm-9">
										<input type="text" id="project-name" class="col-xs-10 col-sm-5">
									</div>
								</div>

								<div class="form-group">
									<label class="col-sm-3 control-label no-padding-left" for="fuzzer-configure"> 配置路径 </label>

									<div class="col-sm-9">
										<input onclick="select_directory()" type="text" id="fuzzer-configure" class="col-xs-10 col-sm-5">
									</div>

								</div>
								<div>
									<p id="zip-path" style="display: none;"></p>
									<p id="workspace" style="display: none;" onclick="create_task_sub()"></p>
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
									<button class="btn btn-info" type="button" id="create-task" onclick="create_task()">
										<i class="ace-icon glyphicon glyphicon-send"></i>
										创建
									</button>

									&nbsp; &nbsp; &nbsp;
									<button class="btn" type="reset">
										<i class="ace-icon glyphicon glyphicon-remove"></i>
										重置
									</button>
								</div>

							</div>
						</form>
					</div><!-- /.col -->
				</div><!-- /.row -->
			</div><!-- /.page-content -->
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



<script src="assets/js/index.js"></script>

<script>
	if (localStorage.getItem("current-fuzz-type") == null) {
		$("#t1").val("192.168.245.131");
		$("#t2").val("21");
		$("#project-name").val("test");
		$("#speed").val("0");
	}else{
		$("#selectd").val(localStorage.getItem("current-fuzz-type"));
		select_type();
	}
</script>