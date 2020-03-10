function initMainPage() {
  $("#loginDiv").hide();
  $("#addCoupon").hide();
//  $("#coachTable").hide();
//  $("#couponDetailDiv").hide();
  $("#newCoachInfo").hide();
  $("#memberDiv").hide();
  $("#addMemberInfo").hide();
  

  var couponTable = $('#couponTable').DataTable({
    order: [[ 0, "desc" ]],
    data: couponData,
    pageLength: 8,
    lengthChange: false,
    deferRender: true,
    columns: [{ //title: "挑戰賽編號"
        className: "centerCell"
              },
      {
        //title: "挑戰賽內容", 不對中，對左
              },
      {
        //title: "挑戰賽開始"
        className: "centerCell"
              },
      {
        //title: "挑戰結束"
        className: "centerCell"
              },              
      {
        //title: "操作",
        data: null,
        defaultContent: "<button id='couponDueBtn' class = 'dueButton to-edit'>到期</button> " +
          "<button id='couponDetailBtn' class = 'detailButton to-edit'>詳細</button> " +
          "<button id='couponDeleteBtn' class = 'deleteButton to-delete'>刪除</button>"
              }
            ]
  });

  $('#couponTable tbody').on('click', '.dueButton', function () {
    console.log("Due is clicked");

    if (!isLogin) {
      alert("必須登入後才能修改");
      return 0;
    }
  
    var securityNum = Math.floor(Math.random()*8999+1000); 
    var securityStr = "確定要將挑戰賽過期!無法回復! 請輸入確認碼: " + String(securityNum);
    //console.log(prompt(securityStr));
    var confirmIt = prompt(securityStr) == securityNum;
    console.log("確認碼:", confirmIt);
    
    if (!confirmIt) {
      alert("確認碼輸入錯誤，不進行挑戰賽過期動作");
      return 0;     
    }
    
    var data = couponTable.row($(this).parents('tr')).data();
    console.log("due:" + data[0]);

    couponHistory.push(data);

    couponData = couponData.filter(function (value, index, arr) {
      return value[0] != data[0];
    });

    // 更新 couponNum
    if (couponData.length>0) {
      var tmp1 = couponData[couponData.length - 1][0];
      var tmp2 = parseInt(tmp1.substr(1, 4));
    } else tmp2 = 0;

    if (couponHistory.length>0) {    
      var tmp3 = couponHistory[couponHistory.length - 1][0];
      var tmp4 = parseInt(tmp3.substr(1, 4));  
    } else tmp4 = 0;

    couponNum = (tmp4 > tmp2)? tmp4:tmp2;

    // 更新 database
    database.ref('users/林口運動中心/挑戰賽').set({
      現在挑戰賽: JSON.stringify(couponData),
      過去挑戰賽: JSON.stringify(couponHistory),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    });

    couponTable.clear().draw();
    couponTable.rows.add(couponData);
    couponTable.draw();

    couponHistoryTable.clear().draw();
    couponHistoryTable.rows.add(couponHistory);
    couponHistoryTable.draw();

  });

  $('#couponTable tbody').on('click', '.detailButton', function () {
    console.log("Detail is clicked");
    
    if (!isLogin) {
      alert("必須登入後才能查看");
      return 0;
    }    
    
    couponMemberSet=[];

    $("#couponTable").hide();
    $("#couponHistoryTable").hide();
    $("#spacerBetweenTables").hide();

    //$(".dataTables_filter").hide();
    //$(".dataTables_info").hide();
    $('#couponTable_filter').hide();
    $('#couponTable_info').hide();
    $('#couponTable_paginate').hide();
    $('#couponHistoryTable_filter').hide();
    $('#couponHistoryTable_info').hide();
    $('#couponHistoryTable_paginate').hide();
    $("#addCoupon").hide();
    $("#inProgress").hide();
    $("#addCouponBtn").hide();
    $("#refreshBtn").hide();

    $("#couponMemberTable_filter").css({
      "font-size": "16px"
    });
    $("#couponMemberTable_info").css({
      "font-size": "16px"
    });
    $("#couponMemberTable_paginate").css({
      "font-size": "16px"
    });

    var data = couponTable.row($(this).parents('tr')).data();
    //console.log("detail:" + data[0]);

    $("#couponNumberDetail").text("挑戰賽頁面 - " + data[0] + " "+ data[1]);
    
    couponNumber = data[0];

    $("#couponDetail").val(data[1]);
    $("#couponDateStartDetail").val(data[2]);
    $("#couponDateEndDetail").val(data[3]);    
    $("#挑戰賽內容Detail").val(data[4]);    
    $("#couponOtherDescDetail").val(data[5]);
    console.log(data[6]);
    $("#couponFeeDetail").val(data[6]);  
    $("#coupon兌換條件Detail").val(data[7]);    
    $("#coupon獎品數量Detail").val(data[8]);        

    couponMember.forEach(function (item, index, array) {
      if (item[0] == data[0]) {
        item.shift();

        var tmp1 = [];
        item.forEach(function (item1, index, array) {
          memberData.forEach(function (item2, index, array) {
            if (item1[4] == item2[3]) {
              tmp1 = item2;
            };
          });

          // Convert 
          var dataToAdd = tmp1.slice(0,1);

          dataToAdd.push(tmp1.slice(3,4)[0]);
          dataToAdd.push(item1[1], item1[2]);

          couponMemberSet.push(dataToAdd);
        });

        item.unshift(data[0]);
      }
    });

    couponMemberTable.clear().draw();
    couponMemberTable.rows.add(couponMemberSet);
    couponMemberTable.draw();

    $("#couponDetailDiv").show();

  });

  $("#couponTable tbody").on('click', '.deleteButton', function () {
    // delete button
    console.log("delete:");
    if (!isLogin) {
      alert("必須登入後才能刪除");
      return 0;
    }
  
    var securityNum = Math.floor(Math.random()*8999+1000); 
    var securityStr = "確定要刪除此挑戰賽!無法回復! 請輸入確認碼: " + String(securityNum);
    //console.log(prompt(securityStr));
    var confirmIt = prompt(securityStr) == securityNum;
    console.log("確認碼:", confirmIt);
    
    if (!confirmIt) {
      alert("確認碼輸入錯誤，不進行挑戰賽刪除動作");
      return 0;     
    }    

    var data = couponTable.row($(this).parents('tr')).data();
    

    //console.log("dddd");
    couponData = couponData.filter(function (value, index, arr) {
      return value[0] != data[0];
    });

    // 更新 couponNum
    if (couponData.length>0) {
      var tmp1 = couponData[couponData.length - 1][0];
      var tmp2 = parseInt(tmp1.substr(1, 4));
    } else tmp2 = 0;

    if (couponHistory.length>0) {    
      var tmp3 = couponHistory[couponHistory.length - 1][0];
      var tmp4 = parseInt(tmp3.substr(1, 4));  
    } else tmp4 = 0;

    couponNum = (tmp4 > tmp2)? tmp4:tmp2;

    // 更新 database
    database.ref('users/林口運動中心/挑戰賽').set({
      現在挑戰賽: JSON.stringify(couponData),
      過去挑戰賽: JSON.stringify(couponHistory),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    });

    couponMember = couponMember.filter(function (value, index, arr) {
      return value[0] != data[0];
    });
    database.ref('users/林口運動中心/挑戰賽管理').set({
      挑戰賽會員: JSON.stringify(couponMember),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    });

    console.log(couponData);
    couponTable.clear().draw();
    couponTable.rows.add(couponData);
    couponTable.draw();

  });

  var couponHistoryTable = $('#couponHistoryTable').DataTable({
    order: [[ 0, "desc" ]],
    data: couponHistory,
    pageLength: 8,
    deferRender: true,
    lengthChange: false,
    columns: [{ //title: "挑戰賽編號"
        className: "centerCell"
              },
      {
        //title: "挑戰賽內容", 不對中，對左
              },
      {
        //title: "挑戰賽開始"
        className: "centerCell"
              },
      {
        //title: "挑戰賽結束"
        className: "centerCell"
              },              

      {
        //title: "操作",
        className: "centerCell",
        data: null,
        defaultContent: "<button class='copyButton to-edit' style='width: 150px'>複製新增挑戰賽</button>" 
              }              

            ]
  });
  
  $('#couponHistoryTable tbody').on('click', '.copyButton', function () {
    console.log("Copy coupon");
    
    var data = couponHistoryTable.row($(this).parents('tr')).data();     

    console.log(data);
    $("#couponName").val(data[1]);
    //$("#couponDate").val(data[2]);
    $("#couponOtherDesc").val(data[3]);

    
    addCoupon();
      
  });

  var couponMemberTable = $('#couponMemberTable').DataTable({
    order: [[ 2, "desc" ]],
    data: couponMemberSet,
    pageLength: 8,
    lengthChange: false,
    deferRender: true,
    columns: [{ //title: "客戶姓名"
        className: "centerCell"
              },
      { //title: "電話號碼"
        className: "centerCell"
              },
      {
        //title: "參加"
        className: "centerCell"
              },
      {
        //title: "確認"
        className: "centerCell"
              },
      {
        //title: "操作",
        className: "centerCell",
        data: null,
        defaultContent: "<button class = 'cancelUsingCoupon to-edit' style='width:80px'>取消參加</button> " 
                      + "<button class = 'confirmUsingCoupon to-edit' style='width:90px'>確認繳費</button> "      
       
              }
            ]
  });
  
  $('#couponMemberTable tbody').on('click', '.cancelUsingCoupon', function () {
    console.log("cancelUsingCoupon is clicked");
    
    var securityNum = Math.floor(Math.random()*8999+1000); 
    var securityStr = "確定取消參加挑戰賽，請輸入確認碼: " + String(securityNum);
    //console.log(prompt(securityStr));
    var confirmIt = prompt(securityStr) == securityNum;
    console.log("確認碼:", confirmIt);
    
    if (!confirmIt) {
      alert("確認碼輸入錯誤，不進行取消動作");
      return 0;     
    }
    

    //var data = couponMemberTable.row($(this)).data();
    var data = couponMemberTable.row($(this).parents('tr')).data();    
    //console.log(data[0]);
    
    var thisCoupon;
    var thisIndex;
    couponMember.forEach(function(item, index, array) {
      //console.log(item[1][0]);
      if (item[0]== couponNumber) {
        //console.log(item, data[0]);
        thisCoupon = item;
        thisIndex = index;
      }
    });
      
    //console.log(thisCourse, thisIndex, data[0]);
      
    var thisCouponLength = thisCoupon.length;
    var thisI;
    for (var i = 0; i < thisCouponLength; i++) {
      if (thisCoupon[i][4] == data[1]) { //比對用戶電話號碼
        //console.log(thisCoupon[i], thisIndex, i);
        thisI = i;
      };
    }   
    
    //console.log(couponMember[thisIndex][thisI][0],couponMember[thisIndex][thisI][1]);
    //couponMember[thisIndex][thisI][1] = "未參加";
    couponMember[thisIndex].splice(thisI, 1); //整個 ["小白","已參加","已確認","U002","09XXXXX222"] 都刪掉

    // Update couponMemberSet 及其 Table  
    for (var i=0; i< couponMemberSet.length; i++){
      //console.log(couponMemberSet[i][0], data[0]);
      if (couponMemberSet[i][0] == data[0]) { 
        //console.log("match");
        //couponMemberSet[i][1] = "未參加";
        thisI = i;
      };
    };
    
    couponMemberSet.splice(thisI, 1); //整個 ["小白","已參加","已確認","U002","09XXXXX222"] 都刪掉
    
    var table = $('#couponMemberTable').DataTable();
    table.clear().draw();
    table.rows.add(couponMemberSet);
    table.draw();    
    
    // Write couponMember to database
    database.ref('users/林口運動中心/挑戰賽管理').set({
      挑戰賽會員: JSON.stringify(couponMember),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    }); 
    
  });

  $('#couponMemberTable tbody').on('click', '.confirmUsingCoupon', function () {
    console.log("confirmUsingCoupon is clicked");
    
    var securityNum = Math.floor(Math.random()*8999+1000); 
    var securityStr = "確定參加挑戰賽，請輸入確認碼: " + String(securityNum);
    //console.log(prompt(securityStr));
    var confirmIt = prompt(securityStr) == securityNum;
    console.log("確認碼:", confirmIt);
    
    if (!confirmIt) {
      alert("確認碼輸入錯誤，不進行確認動作");
      return 0;    
    }    

    //var data = couponMemberTable.row($(this)).data();
    var data = couponMemberTable.row($(this).parents('tr')).data();    
    //console.log(data[0]);
    
    var thisCoupon;
    var thisIndex;
    couponMember.forEach(function(item, index, array) {
      //console.log(item[1][0]);
      if (item[0]== couponNumber) {
        //console.log(item, data[0]);
        thisCoupon = item;
        thisIndex = index;
      }
    });
      
    //console.log(thisCourse, thisIndex, data[0]);
      
    var thisCouponLength = thisCoupon.length;
    var thisI;
    for (var i = 0; i < thisCouponLength; i++) {
      if (thisCoupon[i][4] == data[1]) {
        //console.log(thisCoupon[i], thisIndex, i);
        thisI = i;
      };
    }   
    
    // Conver local date to format "YYYY-MM-DD"
    var nowDate = new Date();
    var localDateStr = nowDate.toLocaleDateString();
    var formatDateStr = localDateStr.replace(/\//g, "-");
    var dateArr = formatDateStr.split("-");
    if (dateArr[1].length == 1) dateArr[1]="0"+dateArr[1]; //若是個位數，前面補 0
    if (dateArr[2].length == 1) dateArr[2]="0"+dateArr[2]; //若是個位數，前面補 0   
    var dateStr = dateArr[0] + "-" + dateArr[1] + "-" + dateArr[2];   
    //console.log(dateStr);
    // End of Conver local date to format "YYYY-MM-DD"    
    
    //console.log(couponMember[thisIndex][thisI][2]);
    couponMember[thisIndex][thisI][2] = dateStr + " 已繳費";

    // Update couponMemberSet 及其 Table
    for (var i=0; i< couponMemberSet.length; i++){
      //console.log(couponMemberSet[i][0], data[0]);
      if (couponMemberSet[i][0] == data[0]) {
        console.log("match");
        couponMemberSet[i][3] = dateStr + " 已繳費";
      };
    };
    
    var table = $('#couponMemberTable').DataTable();
    table.clear().draw();
    table.rows.add(couponMemberSet);
    table.draw();  
    
    // Write couponMember to database
    database.ref('users/林口運動中心/挑戰賽管理').set({
      挑戰賽會員: JSON.stringify(couponMember),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    });
    
  });  

  $("#couponDetailDiv").hide();
  
//  $('#couponMemberTable tbody').on('click', '.resetButton', function () {
//    var confirmIt = confirm("請確定要重置!");
//    if (!confirmIt) return 0;
//    
//    console.log("resetButton is clicked");
//
//    //var data = couponMemberTable.row($(this)).data();
//    var data = couponMemberTable.row($(this).parents('tr')).data();    
//    //console.log(data[0]);
//    
//    var thisCourse;
//    var thisIndex;
//    couponMember.forEach(function(item, index, array) {
//      //console.log(item[1][0]);
//      if (item[0]== couponNumber) {
//        //console.log(item, data[0]);
//        thisCourse = item;
//        thisIndex = index;
//      }
//    });
//      
//    //console.log(thisCourse, thisIndex, data[0]);
//      
//    var thisCourseLength = thisCourse.length;
//    var thisI;
//    for (var i = 0; i < thisCourseLength; i++) {
//      if (thisCourse[i][0] == data[0]) {
//        //console.log(thisCourse[i], thisIndex, i);
//        thisI = i;
//      };
//    }   
//    
//    //console.log(couponMember[thisIndex][thisI][0],couponMember[thisIndex][thisI][1]);
//    couponMember[thisIndex][thisI][1] = "未繳費";
//    couponMember[thisIndex][thisI][2] = "未簽到";
//
//    // Update couponMemberSet 及其 Table  
//    for (var i=0; i< couponMemberSet.length; i++){
//      //console.log(couponMemberSet[i][0], data[0]);
//      if (couponMemberSet[i][0] == data[0]) {
//        //console.log("match");
//        couponMemberSet[i][5] = "未繳費";
//        couponMemberSet[i][6] = "未簽到";
//      };
//    };
//    
//    var table = $('#couponMemberTable').DataTable();
//    table.clear().draw();
//    table.rows.add(couponMemberSet);
//    table.draw();    
//    
//    // Write couponMember to database
//    database.ref('users/林口運動中心/挑戰賽管理').set({
//      挑戰賽會員: JSON.stringify(couponMember),
//    }, function (error) {
//      if (error) {
//        //console.log(error);
//        return 0;
//      }
//      console.log('Write to database successful');
//    });
//    
//  });
  
}



var coachList = $('#coachList').DataTable({
  data: coachSet,
  //ordering: false,
  pageLength: 14,
  lengthChange: false,
  deferRender: true,
  columns: [
    { //title: "老師姓名"
      className: "centerCell"
    },
    {
      //title: "性別"
      className: "centerCell"
    },
    {
      //title: "其他說明"
    }
  ]
});

$('#coachList tbody').on('click', 'tr', function () {
  console.log("coach is clicked");


  var data = coachList.row($(this)).data();
  console.log(data);
  $("#couponName").val(data[0]);
  $("#addCoupon").show();
//  $("#coachTable").hide();

});