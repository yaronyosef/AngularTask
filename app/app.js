var app = angular.module('App', [])

	app.controller('CatalogCtrl', function($scope, dataService) {
		const vm = this;
		vm.data = {};

		vm.$onInit = function() {
			dataService.getAllItems().then(function(data){
				$scope.$apply(vm.data = data);
			});
		}

		vm.addToCart = function() {

			var historyCheckedItems = vm.getCheckedItems(vm.data.history)
			var catalogCheckedItems = vm.getCheckedItems(vm.data.catalog);

			if(historyCheckedItems.length > 0 || catalogCheckedItems > 0){
				console.log('adding to cart...');
			}else{
				console.log('no products selected');
				return;
			}
			
			var cart = Promise.resolve(historyCheckedItems);

			if(catalogCheckedItems.length > 0){
				cart = cart.then(function(historyItems){
					return dataService.getItemsByIds(catalogCheckedItems).
					then(function(catalogItems){
						return catalogItems.concat(historyItems);
					});
				});
			}

			cart.then(function(results){
				dataService.addToCatalog(results);
			});

		}

		vm.getCheckedItems = function(items){
			return angular.copy(items.filter(function(item){
				return item.check;
			})).map(function(item){
				delete item.check;
				return item;
			});
		}
		
	}
	
);

app.component('cataloglist', {
	templateUrl: 'app/templates/product.html',
	controller: 'CatalogCtrl',
	controllerAs: 'vm'
});

app.service('dataService', function(){

	var db = [
		{id: 1, name: "product1", imageUrl: "htt",price: 99.9, productId: "a1b71"},
		{id: 2, name: "product2", imageUrl: "htt",price: 99.9, productId: "a1b52"},
		{id: 3, name: "product3", imageUrl: "htt",price: 99.9, productId: "a1b33"},
		{id: 4, name: "product4", imageUrl: "htt",price: 99.9, productId: "a1b24"},
		{id: 5, name: "product5", imageUrl: "htt",price: 99.9, productId: "a1b15"},
	];

	var data = {
		catalog: [
			{id: 1, name: "product1", imageUrl: "htt",price: 99.9},
			{id: 2, name: "product2", imageUrl: "htt",price: 99.9},
			{id: 3, name: "product3", imageUrl: "htt",price: 99.9},
			{id: 4, name: "product4", imageUrl: "htt",price: 99.9},
			{id: 5, name: "product5", imageUrl: "htt",price: 99.9},
		],
		history: [
			{id: 6, name: "product11", imageUrl: "htt",price: 99.9, productId: "a1b7"},
			{id: 7, name: "product21", imageUrl: "htt",price: 99.9, productId: "a1b5"},
			{id: 8, name: "product31", imageUrl: "htt",price: 99.9, productId: "a1b3"},
			{id: 9, name: "product41", imageUrl: "htt",price: 99.9, productId: "a1b2"},
			{id: 10, name: "product51", imageUrl: "htt",price: 99.9, productId: "a1b1"},
		]
	}

	this.getAllItems = function(){
		return new Promise(function(resolve, reject){
			setTimeout(function(){
				resolve(data);
			}, 1000);
		});
	}

	// can use reduce instead of filters and map,
	// can use short arrow functions to reduce boilerplates
	this.getItemsByIds = function(items){
		return new Promise(function(resolve, reject){
			setTimeout(function(){
				var relevantCatalogItemsIds = items.map(function(item){
					return item.id;
				});
				var itemsWithProductId = db.filter(function(item){
					return relevantCatalogItemsIds.includes(item.id);
				});
				resolve(itemsWithProductId);
			}, 1000)
		});
	}

	this.addToCatalog = function(items){
		setTimeout(function(){
			console.table(items);
			console.log('added to cart');
		}, 1000);
	}

});