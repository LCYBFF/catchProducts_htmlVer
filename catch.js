// 淘宝和天猫通用商铺商品信息抓取(主要以img为中心抓取)
// 仅抓取主图，不抓取略缩图
// 注意天猫会把本店内推荐一起抓取
// 使用layui的jquery模块
layui.use(['jquery','form','layer','element'],function(){
	var $ = layui.jquery
	, form = layui.form
	,layer = layui.layer
	,element = layui.element;
	
	function download(filename, text) {
	  var element = document.createElement('a');
	  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	  element.setAttribute('download', filename);
	 
	  element.style.display = 'none';
	  document.body.appendChild(element);
	 
	  element.click();
	 
	  document.body.removeChild(element);
	}
    $("#load").click(function(data){
    	// 载入目标页面
		$('#target').load("target.html");
    })
    $("#view").click(function(data){
    	// 载入目标页面
		$('#target').toggle();
    })
	$("#ok").click(function(data){
		// 检查是淘宝还是天猫
	    var type = $("[name='type']:checked").val()
        // 设置抓取的div区域
	    ,area = $(".J_TItems")
	    ,format = $("[name='format']:checked").val()
	    // 根据type设置后缀
	    if (type == "taobao") {
	        // 淘宝后缀一般为_240x240.jpg
	        suffix = "_240x240.jpg";
	    }else if(type == "tmall"){
	        // 天猫后缀一般为_180x180.jpg
	        suffix = "_180x180.jpg";
	    }
	    // 根据format判断是否格式化过
	    if (format == "y") {
	        // 源格式图片地址为src
	        format = "src";
	    }else if(format == "n"){
	        // 格式化过图片地址为data-ks-lazyload
	        format = "data-ks-lazyload";
	    }
		// 移除本店内推荐列表
		$('.pagination').nextAll().remove();
		// 统计抓取的数量
		var count = $(".item").length;
		console.log(count);
		// 预设空列表与序号
		var list = [];
		var id = 0;
		// 开始遍历所有img
		area.find("img").each(function(index,element){
			// 商品名称
			var title = $(this).attr("alt");
			// 序号赋值
			id++;
			// 如果商品名称为空(即商品略缩图)结束本次循环
			if (!title) {
				id--;
				return true;
			}else{
				// 名称非空(即商品主图)
				// 商品图片(移除限制大小的后缀)
				var img = String($(this).attr(format)).replace(suffix,'');
				// 如果使用格式化工具请注意路径属性将src更换为data-ks-lazyload
				// 商品价格
				var pric = $(this).parents("dt").siblings(".detail").find(".c-price").text();
				// 商品编号
				var proid = $(this).parents("dl").attr("data-id");
			}
			// 将有效列表加入数组
			list.push({
				"id":id,
				"proid":proid,
				"title":title,
				"img":img,
				"pric":pric
			});
		})
		if (list.length > 0) {
			// 将数组转为JSON字符串并输出在控制台
			console.log(JSON.stringify(list));
			msg = "抓取完毕，请查看console控制台";
			icon = 1;
		}else{
			msg = "抓取失败，请确认是否载入或选择条件有误";
			icon = 0;
		}
		layer.msg(msg,{icon:icon});
	})
})