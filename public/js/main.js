var app = angular.module('searchModule', []);
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.controller('searchController', function($scope,$http) {

    $scope.submitForm = function(query, $event) {

        if (typeof $event !== 'undefined') {
            $event.preventDefault();
        }

        searchContainer(query);
        function searchContainer(query) {
            $http.get("/search/container/"+query)
                .then(function(response) {

					if(response.data.code === 0) {
						buildSearchResult(response.data.data);
					} else {
						onSearchError(response.data.errorMessage);
					}
                }, function (response) {
                    onSearchError(response.data.errorMessage);
                });
        }
        return false;
    };

    function buildSearchResult(responseData) {
        angular.forEach(responseData, function(value, key) {
            $scope[key] = value;
        });
        $scope.containerId = responseData.containerID;
		$scope.searchResult=true;
    }
	
	function onSearchError(error) {
		$scope.searchResult=false;
		$scope.searchErrorMsg = error;
	}

    $scope.sendSms = function(e) {
		e.preventDefault();

        $http.post("/send-sms", {number:$scope.phoneNumber, containerID:$scope.containerId})
			.then(function (response) {

				if(response.data.code === 0) {
					onSmsSendSuccess(response.data);
				} else {
					onSmsSendError(response.data.errorMessage);
				}
			}, function (response) {
                onSmsSendError(response.data.errorMessage);
			});

    };

	function onSmsSendSuccess(responseData) {
        $scope.smsSentMsg = responseData.message;
		$scope.smsResult=true;
    }
	
	function onSmsSendError(error) {
		$scope.smsResult=false;
		$scope.smsErrorMsg = error;
	}

});