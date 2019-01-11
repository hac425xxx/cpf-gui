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
            <li class="">
                <a href="#" onclick="load_index()">
                    <i class="menu-icon glyphicon glyphicon-fire"></i>
                    <span class="menu-text"> 创建任务 </span>
                </a>

                <b class="arrow"></b>
            </li>

            <li class="active">
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
                    <div class="col-sm-12">

                        <div>
                            <div>
                                <h3 style=" color: #13d539; ">任务列表</h3>
                            </div>

                            <!-- <div class="hr hr-18 dotted hr-double"></div> -->

                            <div>
                                <table id="task-table" class="table  table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>工程名</th>
                                            <th>任务ID</th>
                                            <th>开始时间</th>
                                            <th>任务状态</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                    </tbody>
                                </table>
                            </div>

                        </div>


                        <div id="task-info">
                            <div>
                                <h3 style="color: #596608;font-weight: bold;">任务信息</h3>
                            </div>
                            <div class="profile-user-info profile-user-info-striped" style="margin: 0;margin-top: 20px;">
                                <div class="profile-info-row">
                                    <div class="profile-info-name"> 项目名 </div>

                                    <div class="profile-info-value">
                                        <span class="editable editable-click" id="project-name">默认</span>
                                    </div>
                                </div>

                                <div class="profile-info-row">
                                    <div class="profile-info-name"> 任务ID </div>
                                    <div class="profile-info-value">
                                        <span class="editable editable-click" id="task-id">aaaa-bbbb-cccc-dddd</span>
                                    </div>
                                </div>

                                <div class="profile-info-row">
                                    <div class="profile-info-name"> 项目状态 </div>
                                    <div class="profile-info-value">
                                        <span class="editable editable-click" id="status">运行中...</span>
                                    </div>
                                </div>

                                <div class="profile-info-row">
                                    <div class="profile-info-name"> 运行时间 </div>

                                    <div class="profile-info-value">
                                        <span class="editable editable-click" id="run-time">0 分 10 秒</span>
                                    </div>
                                </div>

                                <div class="profile-info-row">
                                    <div class="profile-info-name"> 测试次数 </div>

                                    <div class="profile-info-value">
                                        <span class="editable editable-click" id="fuzz-count">0</span>
                                    </div>
                                </div>

                                <div class="profile-info-row">
                                    <div class="profile-info-name" id="info-path"> 工作目录 </div>

                                    <div class="profile-info-value">
                                        <span class="editable editable-click" id="workspace">/tmp</span>
                                    </div>
                                </div>

                                <div class="profile-info-row" id="crash-info">
                                    <div class="profile-info-name"> Crash用例路径 </div>

                                    <div class="profile-info-value">
                                        <span class="editable editable-click" id="crash-path">f:/crash</span>
                                    </div>
                                </div>

                            </div>

                        </div>

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

<script src="assets/js/status.js"></script>