angular.module('app').controller("fileController", function($http, $location, $scope) {
	$scope.files = [];
	$scope.initPerformed = false;
	$scope.actualFolder;
	$scope.folders;
	$scope.roots = [];
	$scope.init = function() {

	};

	$scope.$on('$locationChangeSuccess', function() {
		if (!$scope.initPerformed) {
			$scope.initPerformed = true;
			$http.get('rest/roots').then(function(result) {
				if (result.data !== "") {
					$scope.roots = result.data;
					if ($location.search().path === undefined) {
						$location.search("path", $scope.roots[0]);
					}
					if ($scope.folders === undefined) {
						var path = $location.search().path;
						$scope.prepareItems(path);
					}
				}
			});
		}

		var path = $location.search().path;
		$scope.prepareItems(path);
	});

	$scope.prepareItems = function(path) {
		if (path != undefined) {
			if (path.endsWith("/")) {
				path = path.slice(0, -1);
			}
			var folders = path.split("/");
			var actual = "";
			$scope.folders = [];
			for (var i = 0; i < folders.length; i++) {
				actual += folders[i] + "/";
				$scope.folders.push({
					"name" : folders[i],
					"path" : actual
				});
			}
			$scope.load();
		}
	}

	$scope.load = function() {
		$http.get('rest/files?path=' + $location.search().path).then(function(result) {
			if (result.data !== "") {
				$scope.files = result.data;
			}
		}, function() {
			alert("Nieprawidlowa siezka");
		});
	}

	$scope.getFileURL = function(file) {
		if (file.file == "true") {
			return "rest/files?path=" + file.path;
		} else {
			return "?path=" + file.path;
		}
	}
});