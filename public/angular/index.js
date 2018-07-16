var app = angular.module('index', ['config', 'ngCookies', 'ui-notification'])

var baseAddress = config_module._invokeQueue[0][2][1].LOGIN_URL;
var url = "";

app.factory('indexFactory', function ($http, $window) {
    return {
        createNewUser: function (userData) {
            url = baseAddress + "CreateNewUser";
            return $http.post(url, userData);
        },
        getAllUserDetails: function () {
            url = baseAddress + "GetAllUserDetails";
            return $http.get(url);
        },
        getUserDetails: function (Id) {
            url = baseAddress + "GetUserDetails/" + Id;
            return $http.get(url);
        },
        updateUserDetails: function (userDetails) {
            url = baseAddress + "UpdateUserDetails/" + userDetails._id;
            return $http.put(url, userDetails);
        },
        deleteUserDetails: function (Id) {
            url = baseAddress + "DeleteUserDetails/"+ Id;;
            return $http.delete(url);
        }
    };
});
app.factory("SharedObject", function () {
    return {
        recordsCount: 0,
        editItemNumber: 0,
        pageNum: 1,
        insertMode: false,
        reset: function () {
            //this.recordsCount=0;
            this.editItemNumber = 0;
            this.pageNum = 1;
            this.insertMode = false;
        }
    };
});
app.filter('paging', ["SharedObject", function (SharedObject) {
    return function (input, pSize) {
        SharedObject.recordsCount = (input && input.length) ? input.length : 0;
        if (input) {
            var size = parseInt(pSize, 10),
                pageNum = SharedObject.pageNum;
            if (input.length <= size)
                return input;
            var classes = [];
            for (var i = 0; i < input.length; i++) {
                if (i < size * (pageNum - 1)) continue;
                if (i >= size * (pageNum - 1) + size) break;
                else classes.push(input[i]);
            }
            return classes;
        } else return null;
    }
}]);

app.controller('indexController', function ($scope, $http, indexFactory, SharedObject, $cookies, $cookieStore, $window, $location, Notification) {
    $scope.pageSize = 5;
    $scope.localObject = SharedObject;

    //get all accounts
    $scope.getAdmin = function () {
        indexFactory.getAllUserDetails().success(function (resultData1) {
            console.log("resultData1==", resultData1);
            $scope.users = resultData1;
            $scope.Userslength = $scope.users.length;
            console.log("Total users==", $scope.Userslength);
        })
    }
    $scope.getAdmin();

    // Window refresh
    $scope.refresh = function () {
        $window.location.reload();
        // window.location.href = "/";
    };

   

    // Create an user
    $scope.create = function () {
        $scope.userData = this.user;
        console.log("$scope.userData =", $scope.userData);
        indexFactory.createNewUser($scope.userData).success(function (data) {
            if (data) {
                $window.location.reload();
            } else {

                console.log("errorMessage =", $scope.errorMessage);
            }
        }).error(function (data) {
            Notification.error({
                message: userData.name + ' ' + ',userProfile Adding Failed ',
                delay: 1000
            });
            //$scope.error = "An Error has occured while Adding userProfile! " + data.ExceptionMessage;
        });
        //End of signup api invoke    
    };

    // Get single user details
    $scope.getDetails = function (Id) {
        $scope.userId = Id
        console.log("$scope.userId =", $scope.userId);
        indexFactory.getUserDetails($scope.userId).success(function (data) {
            if (data) {
                $scope.user = data;
                console.log("$scope.user =", $scope.user);
            } else {

                console.log("errorMessage =", $scope.errorMessage);
            }
        }).error(function (data) {
            Notification.error({
                message: userData.name + ' ' + ',userProfile Adding Failed ',
                delay: 1000
            });
            //$scope.error = "An Error has occured while Adding userProfile! " + data.ExceptionMessage;
        });
        //End of signup api invoke    
    };

     // Update an user
     $scope.update = function () {
        $scope.userDetails = this.user;
        console.log("$scope.userDetails =", $scope.userDetails);
        indexFactory.updateUserDetails($scope.userDetails).success(function (data) {
            if (data) {
                $window.location.reload();
            } else {

                console.log("errorMessage =", $scope.errorMessage);
            }
        }).error(function (data) {
            Notification.error({
                message: 'userProfile Adding Failed ',
                delay: 1000
            });
            //$scope.error = "An Error has occured while Adding userProfile! " + data.ExceptionMessage;
        });
        //End of signup api invoke    
    };

     // Delete an user
     $scope.delete = function (Id) {
        $scope.userDel = Id;
        console.log("$scope.userDel =", $scope.userDel);
        indexFactory.deleteUserDetails($scope.userDel).success(function (data) {
            if (data) {
                $window.location.reload();
            } else {

                console.log("errorMessage =", $scope.errorMessage);
            }
        }).error(function (data) {
            Notification.error({
                message: userData.name + ' ' + ',userProfile Adding Failed ',
                delay: 1000
            });
            //$scope.error = "An Error has occured while Adding userProfile! " + data.ExceptionMessage;
        });
        //End of signup api invoke    
    };
    //===============================================================Pangination===========================================================================================   

    $scope.TotalPages = function () {
        var size = parseInt($scope.pageSize, 10);
        if (size > $scope.localObject.recordsCount) return 1;
        else
            return $scope.localObject.recordsCount % size === 0 ?
                $scope.localObject.recordsCount / size :
                Math.floor($scope.localObject.recordsCount / size) + 1;
    };
    $scope.NavFirst = function () {
        var pageNum = $scope.localObject.pageNum;
        var paglst = $scope.localObject.recordsCount / $scope.pageSize;

        pageNum = $scope.localObject.recordsCount > ($scope.pageSize * pageNum) ? pageNum + (paglst - 1) : pageNum;

        if (pageNum > 1) {
            pageNum = pageNum > 2 ? 1 : pageNum - 1;

        }

        $scope.localObject.reset();
        $scope.localObject.pageNum = pageNum;
    };

    $scope.NavPrev = function () {
        var pageNum = $scope.localObject.pageNum;
        pageNum = pageNum < 2 ? 1 : pageNum - 1;
        $scope.localObject.reset();
        $scope.localObject.pageNum = pageNum;
    };
    $scope.NavNext = function () {
        var pageNum = $scope.localObject.pageNum;
        pageNum = $scope.localObject.recordsCount > ($scope.pageSize * pageNum) ? pageNum + 1 : pageNum;
        $scope.localObject.reset();
        $scope.localObject.pageNum = pageNum;
    };

    $scope.NavLast = function () {
        var pageNum = $scope.localObject.pageNum;
        var paglst = Math.round($scope.localObject.recordsCount / $scope.pageSize) - pageNum;
        pageNum = $scope.localObject.recordsCount > ($scope.pageSize * pageNum) ? pageNum + (paglst) : pageNum;
        $scope.localObject.reset();
        $scope.localObject.pageNum = pageNum;
    };


    //==========================================================================================================================================================   


})