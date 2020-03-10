function addCoupon() {
  console.log("addCoupon");

  if (!isLogin) {
    alert("必須登入後才能新增挑戰賽");
    return 0;
  }

  //couponNum++;
  $("#couponNumber").text("新增挑戰賽 - T" + zeroFill(couponNum+1, 4));

  $("#couponTable").hide();
  $("#couponHistoryTable").hide();
  $("#spacerBetweenTables").hide();

  $(".dataTables_filter").hide();
  $(".dataTables_info").hide();
  $('#couponTable_paginate').hide();
  $('#couponHistoryTable_paginate').hide();

  $("#addCoupon").show();


  $("#inProgress").hide();
  $("#addCouponBtn").hide();
  $("#refreshBtn").hide();
  //      $("#addCouponBtn").attr("disabled", true);
  //      $("#refreshBtn").attr("disabled", true);
}

function couponConfirm() {
  console.log("couponConfirm");

  if (!isLogin) {
    alert("必須登入後才能新增挑戰賽");
    return 0;
  }
  
  couponNum++;
    
  var dataToAdd = [
            "T" + zeroFill(couponNum, 4),
            $("#couponName").val(),
            $("#couponDateStart").val(),
            $("#couponDateEnd").val(),
            $("#挑戰賽內容").val(),
            $("#couponOtherDesc").val(),
            $("#couponFee").val(),
            $("#coupon兌換條件").val(),      
            $("#coupon獎品數量").val(),    
          ];

  console.log(dataToAdd);

  // 更新 local couponData 及 couponMember
  couponData.push(dataToAdd);
  couponMember.push(["T" + zeroFill(couponNum, 4)]); 

  // 挑戰賽寫入資料庫
  database.ref('users/林口運動中心/挑戰賽').set({
    現在挑戰賽: JSON.stringify(couponData),
    過去挑戰賽: JSON.stringify(couponHistory),
  }, function (error) {
    if (error) {
      console.log("Write to database error, revert couponData back");
      couponData.pop();
    }
    console.log('Write to database successful');
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

  // 更新挑戰賽表格
  var couponTable = $('#couponTable').DataTable();
  couponTable.clear().draw();
  couponTable.rows.add(couponData);
  couponTable.draw();

  $("#addCoupon").hide();
  $("#couponTable").show();
  $("#spacerBetweenTables").show();
  $("#couponHistoryTable").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#couponTable_paginate').show();
  $('#couponHistoryTable_paginate').show();

  $("#inProgress").show();
  $("#addCouponBtn").show();
  $("#refreshBtn").show();
  //      $("#addCouponBtn").attr("disabled", false);
  //      $("#refreshBtn").attr("disabled", false);      
}

function couponCancel() {
  console.log("couponCancel");
  //couponNum--;
  $("#addCoupon").hide();
  $("#spacerBetweenTables").show();
  $("#couponHistoryTable").show();
  $("#couponTable").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#couponTable_paginate').show();
  $('#couponHistoryTable_paginate').show();

  $("#inProgress").show();
  $("#addCouponBtn").show();
  $("#refreshBtn").show();
  //      $("#addCouponBtn").attr("disabled", false);
  //      $("#refreshBtn").attr("disabled", false);       
}

function zeroFill(number, width) {
  width -= number.toString().length;
  if (width > 0) {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
  }
  return number + ""; // always return a string
}

function refreshCourse() {
  console.log("Refresh Course");

  var couponTable = $('#couponTable').DataTable();
  couponTable.clear().draw();
  couponTable.rows.add(couponData);
  couponTable.draw();

  var couponTable = $('#couponHistoryTable').DataTable();
  couponTable.clear().draw();
  couponTable.rows.add(couponHistory);
  couponTable.draw();
}

function backToHome() {
  console.log("Refresh Course");

  $("#couponDetailDiv").hide();

  $("#couponTable").show();
  $("#couponHistoryTable").show();
  $("#spacerBetweenTables").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#couponTable_paginate').show();
  $('#couponHistoryTable_paginate').show();
  $("#addCoupon").hide();
  $("#inProgress").show();
  $("#addCouponBtn").show();
  $("#refreshBtn").show();
}

function couponUpdate() {
  console.log("couponUpdate");

  if (!isLogin) {
    alert("必須登入後才能更新挑戰賽");
    return 0;
  }

  var securityNum = Math.floor(Math.random()*8999+1000); 
  var securityStr = "確定要更新此挑戰賽，請輸入確認碼: " + String(securityNum);
  //console.log(prompt(securityStr));
  var confirmIt = prompt(securityStr) == securityNum;
  console.log("確認碼:", confirmIt);  

  if (!confirmIt) {
    alert("確認碼輸入錯誤，不進行更新動作");
    return 0;
  } else {
//    var dataToReplace = [
//      couponNumber,
//      $("#couponDetail").val(),
//      $("#couponDateDetail").val(),
//      $("#couponOtherDescDetail").val(),
//      $("#couponFeeDetail").val()
//    ];

    var dataToReplace = [
      couponNumber,
      $("#couponDetail").val(),
      $("#couponDateStartDetail").val(),
      $("#couponDateEndDetail").val(),
      $("#挑戰賽內容Detail").val(),    
      $("#couponOtherDescDetail").val(),
      $("#couponFeeDetail").val(), 
      $("#coupon兌換條件Detail").val(),  
      $("#coupon獎品數量Detail").val(),           
    ];    
    
    console.log(dataToReplace);
        
    // 尋找 couponData 這筆資料，並取代
    for (var i =0; i< couponData.length; i++){
      //console.log(couponData[i][0]);
      if (couponData[i][0]==couponNumber) {
        couponData[i] = dataToReplace;
        break;
      }
    }
    
    // 挑戰賽寫入資料庫
    database.ref('users/林口運動中心/挑戰賽').set({
      現在挑戰賽: JSON.stringify(couponData),
      過去挑戰賽: JSON.stringify(couponHistory),
    }, function (error) {
      if (error) {
        console.log("Write to database error, revert couponData back");
        couponData.pop();
      }
      console.log('Write to database successful');
    });

    // 更新挑戰賽表格
    var couponTable = $('#couponTable').DataTable();
    couponTable.clear().draw();
    couponTable.rows.add(couponData);
    couponTable.draw();

    $("#couponDetailDiv").hide();
    $("#couponTable").show();
    $("#spacerBetweenTables").show();
    $("#couponHistoryTable").show();

    $(".dataTables_filter").show();
    $(".dataTables_info").show();
    $('#couponTable_paginate').show();
    $('#couponHistoryTable_paginate').show();

    $("#inProgress").show();
    $("#addCouponBtn").show();
    $("#refreshBtn").show();    

  }

}

function logInAndOut() {
  //  if (!isLogin) {
  //    $("#password").val("");
  //    $("#loginDiv").show();
  //  } else {
  //    firebase.auth().signOut();
  console.log(isLogin);
  if (!isLogin) {
    window.location.href = '0-login.html';
  } else {
    firebase.auth().signOut();
  }
}

//function signIn() {
//  //check email
//  if (!validateEmail($("#emailAddress").val())) {
//    $("#emailAddress").val("");
//    $("#emailAddress").attr("placeholder", "Email Address Error, try again!");
//    $("#emailAddress").css("background-color", "yellow");
//  } else {
//    $("#loginDiv").hide();
//    firebase.auth().signInWithEmailAndPassword($("#emailAddress").val(), $("#password").val()).catch(function (error) {
//      // Handle Errors here.
//      var errorCode = error.code;
//      var errorMessage = error.message;
//      alert("Login Error! Try again!")
//    });
//  }
//
//}

//function validateEmail(email) {
//  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//
//  return re.test(String(email).toLowerCase());
//}
//
//
//function signInAbort() {
//  $("#loginDiv").hide();
//}

//function addNewCoach() {
//  console.log("Query and Check coach");
//
//  var coachs = $('#coachList').DataTable();
//  coachs.clear().draw();
//  coachs.rows.add(coachSet);
//  coachs.draw();
//
//  $("#addCoupon").hide();
//  $("#coachTable").show();
//  $("#coachList_paginate").css({
//    "font-size": "16px"
//  });

//}



function memberManage() {
  console.log("客戶管理");

  if (!isLogin) {
    alert("必須登入後才能進行客戶管理");
    return 0;
  }

  window.location.href = '1-addMember.html';

  //  $("#memberDiv").show();
  //  var memberTable = $('#memberTable').DataTable();
  //  memberTable.clear().draw();
  //  memberTable.rows.add(memberData);
  //  memberTable.draw();
}

function challengeManage() {
  console.log("挑戰賽管理");

  if (!isLogin) {
    alert("必須登入後才能進行挑戰賽管理");
    return 0;
  }

  window.location.href = '2-challengeManage.html';

  //  $("#memberDiv").show();
  //  var memberTable = $('#memberTable').DataTable();
  //  memberTable.clear().draw();
  //  memberTable.rows.add(memberData);
  //  memberTable.draw();
}

function closeMember() {
  console.log("關閉客戶管理");

  $("#memberDiv").hide();
}

function addMember() {
  console.log("新增客戶");

  $("#memberDiv").hide();
  $("#addMemberInfo").show();
}

function closeAddMember() {
  console.log("close addMemberInfo");
  $("#addMemberInfo").hide();
  $("#memberDiv").show();
}

function addMemberInfo() {
  console.log("確定新增會員");

  if (!isLogin) {
    alert("必須登入後才能進行新增客戶");
    return 0;
  }

  var dataToAdd = [
            $("#newMemberName").val(),
            $("#newMemberLINEId").val(),
            $("#newMemberGender").val(),
            $("#newMemberBirth").val(),
            $("#newMemberPhoneNum").val(),
            $("#newMemberIdNum").val(),
            $("#newMemberAssress").val(),
          ];

  //console.log(dataToAdd);

  // memberData 取回 完整的 LINE Id
  memberData.forEach(function(member, index, array){
    member[1]=memberLineId[index];
  });
  
  // 更新 local couponData
  memberData.push(dataToAdd);


  // 客戶寫入資料庫
  database.ref('users/林口運動中心/客戶管理').set({
    會員資料: JSON.stringify(memberData),
  }, function (error) {
    if (error) {
      console.log("Write to database error");
      couponData.pop();
    }
    console.log('Write to database successful');
  });


  // 更新客戶表格  
  //  var memberTable = $('#memberTable').DataTable();
  //  memberTable.clear().draw();
  //  memberTable.rows.add(memberData);
  //  memberTable.draw();  
  //  
  //  $("#addMemberInfo").hide();
  //  $("#memberDiv").show(); 

}