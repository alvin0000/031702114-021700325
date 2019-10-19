    var jobs=new Map;
    var next_node=new Map;
    var students=["博士生", "硕士生", "本科生"];
    var tree_data;
    var parents=new Map;
    var names=[];
    function Build_Tree()
    {
        next_node.clear;
        jobs.clear;
        names.clear;
        parents.clear;
        var text_str=document.getElementById('inputs').value;
        block_str=text_str.split('\n\n');
        for(var i=0;i<block_str.length;i++)
        {
            line_str=block_str[i].split('\n');
            var item=line_str[0].split('：');
            var teacher=item[1];
            next_node[teacher]=[];
            jobs[teacher]=item[0];
            names.push(teacher);
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
                if(line_str[l].indexOf(val)!=-1)
                {
                    var item=line_str[l].split('：');
                    var stu_str=item[0]+teacher;
                    next_node[teacher].push(stu_str);
                    jobs[stu_str]=val;
                    next_node[stu_str]=[];
                    parents[stu_str]=1;
                    names.push(stu_str);
                    break;
                }
            }
            Manage_Line(item,stu_str);
        }
    }
    function Manage_Line(item,stu_str)
    {
        var stu_names=item[1].split('、');
            for(var val of stu_names)
            {
                next_node[stu_str].push(val);
                parents[val]=1;
                jobs[val]=item[0];
                names.push(val);   
            }
    }
    function Get_Root()
    {
        for(var val of names)
                if(parents[val]==null)
                    tree_data=dfs(val,-1);
    }
    function dfs(now,fa)
    {
        var formal_obj={};
        formal_obj.name=now;
        formal_obj.children=[];
        var next=next_node[now];
        if(next==null)
            return formal_obj;
        for(var i=0;i<next.length;i++)
            formal_obj.children.push(dfs(next[i],now));
        if(now.indexOf(fa)!=-1)
        {
            var t=now.substring(0, now.indexOf(fa));
            formal_obj.name=t;
        }
        return formal_obj;
    }