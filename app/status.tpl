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
                        <div class="row">
                            <h3>当前任务列表</h3>
                        </div>

                        <!-- <div class="hr hr-18 dotted hr-double"></div> -->

                        <div class="row">
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


                        <div id="task-info">

                            <div class="row" style="background: #8bc36e;">
                                <h3>任务信息</h3>
                            </div>
                            <div class="row">
                                <div class="col-sm-3 no-padding-right" style="text-align: center; background-color: #eee;">
                                    <label>项目名</label>
                                </div>
                                <div class="col-sm-9" style="background-color: #31c5386e; text-align: left;">
                                    <label id="project-name">默认</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-3 no-padding-right" style="text-align: center; background-color: #eee;">
                                    <label>任务ID</label>
                                </div>
                                <div class="col-sm-9" style="background-color: #31c5386e; text-align: left;">
                                    <label id="task-id">aaaa-bbbb-cccc-dddd</label>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-3 no-padding-right" style="text-align: center; background-color: #eee;">
                                    <label>项目状态</label>
                                </div>
                                <div class="col-sm-9" style="background-color: #31c5386e; text-align: left;">
                                    <label id="status">运行中...</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-3 no-padding-right" style="text-align: center; background-color: #eee;">
                                    <label>运行时间</label>
                                </div>
                                <div class="col-sm-9" style="background-color: #31c5386e; text-align: left;">
                                    <label id="run-time">0 分 0 秒</label>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-3 no-padding-right" style="text-align: center; background-color: #eee;">
                                    <label>测试次数</label>
                                </div>
                                <div class="col-sm-9" style="background-color: #31c5386e; text-align: left;">
                                    <label id="fuzz-count"> 0 次 </label>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-3 no-padding-right" style="text-align: center; background-color: #eee;">
                                    <label>工作目录</label>
                                </div>
                                <div class="col-sm-9" style="background-color: #31c5386e; text-align: left;">
                                    <label id="workspace">不存在 </label>
                                </div>
                            </div>

                            <div class="row" style="display: none;" id="crash-info">
                                <div class="col-sm-3 no-padding-right" style="text-align: center; background-color: #eee;">
                                    <label>Crash用例路径</label>
                                </div>
                                <div class="col-sm-9" style="background-color: #31c5386e; text-align: left;">
                                    <label id="crash-path"></label>
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