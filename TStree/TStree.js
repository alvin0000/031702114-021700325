    var jobs=new Map;
    var next_node=new Map;
    var students=["博士生", "硕士生", "本科生"];
    var tree_data;
    var parents=new Map;
    var names=[];
    function Build_Tree()
    {
        //清空全局变量
        next_node.clear;
        jobs.clear;
        names.clear;
        parents.clear;
        //得到输入框的值
        var text_str=document.getElementById('inputs').value;
        //将输入数据按导师分成块
        block_str=text_str.split('\n\n');
        for(var i=0;i<block_str.length;i++)
        {
            //将块状数据分成行
            line_str=block_str[i].split('\n');
            var item=line_str[0].split('：');
            //将每行数据的职位和姓名分开
            var teacher=item[1];
            next_node[teacher]=[];
            //子节点
            jobs[teacher]=item[0];
            //保留导师的姓名以便使用
            names.push(teacher);
            //将学生的数据按行处理
            Manage_Block(line_str,teacher);
        }
        Get_Root();
		var  myChart = echarts.init(document.getElementById("container"))
			myChart.setOption(option = {
        		tooltip: {
            	trigger: 'item',
           		triggerOn: 'mousemove'
        		},
        		series: [
	            	{
	                type: 'tree',
	                data: [tree_data],
	                top: '1%',
	                left: '7%',
	                bottom: '1%',
	                right: '20%',
	                symbolSize: 7,
	                label: {
	                    normal: {
	                        position: 'left',
	                        verticalAlign: 'middle',
	                        align: 'right',
	                        fontSize: 9
	                    }
	                },
	                leaves: {
	                    label: {
	                        normal: {
	                            position: 'right',
	                            verticalAlign: 'middle',
	                            align: 'left'
	                        }
	                    }
	                },
                    initialTreeDepth: 10,
	                expandAndCollapse: true,
	                animationDuration: 550,
	                animationDurationUpdate: 750
	            	}
	        		]
    		});
    }
    function Manage_Block(line_str,teacher)
    {
        for(var l=1;l<line_str.length;l++)
        {
            for(var val of students)
            {
                //按学生学历分别处理
                if(line_str[l].indexOf(val)!=-1)
                {
                    //将学生学历与姓名分开
                    var item=line_str[l].split('：');
                    var stu_str=item[0]+teacher;
                    next_node[teacher].push(stu_str);
                    //将导师与学生学历节点连接
                    jobs[stu_str]=val;
                    next_node[stu_str]=[];
                    parents[stu_str]=1;
                    //保留学生学历以便使用
                    names.push(stu_str);
                    break;
                }
            }
            Manage_Line(item,stu_str);
        }
    }
    function Manage_Line(item,stu_str)
    {
        //将同行学生分开处理
        var stu_names=item[1].split('、');
            for(var val of stu_names)
            {
                //将学生学历与学生姓名节点连接
                next_node[stu_str].push(val);
                parents[val]=1;
                //标记学生有导师
                jobs[val]=item[0];
                //保留学生姓名以便使用
                names.push(val);   
            }
    }
    function Get_Root()
    {
        for(var val of names)
                //无导师即为本颗树的根节点
                if(parents[val]==null)
                    tree_data=dfs(val,-1);
    }
    function dfs(now,fa)
    {
        //最终所需数据的格式
        var formal_obj={};
        formal_obj.name=now;
        formal_obj.children=[];
        //获取子节点数组
        var next=next_node[now];
        if(next==null)
            //搜索到叶节点返回
            return formal_obj;
        for(var i=0;i<next.length;i++)
            //将子节点加入子女对象数组，并进行深搜，递归建树
            formal_obj.children.push(dfs(next[i],now));
        if(now.indexOf(fa)!=-1)
        {
            var t=now.substring(0, now.indexOf(fa));
            formal_obj.name=t;
        }
        return formal_obj;
    }