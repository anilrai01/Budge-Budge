// Budget Controller
var budgetController = (function(){

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome){
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);	
		}else{
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function(){
		return this.percentage;
	}

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var data = {
		allItems: {
			exp: [],
			inc: [],
		},

		totals: {
			exp: 0,
			inc: 0,
		},

		budget: 0,
		percentage: -1
	};



	var calculateTotal = function(type){
		var sum = 0;

		data.allItems[type].forEach(function(cur){
			sum = sum + cur.value;
		});
		data.totals[type] = sum;
	};

	return {
		addItem: function(type, desc, val){
			var newItem, ID;

			// Creating new ID as per the last element of last array
			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length  - 1].id + 1;
			}else{
				ID = 0;
			}

			// Create new Item
			if(type === 'inc'){
				newItem = new Income(ID, desc, val);
			}else if(type === 'exp'){
				newItem = new Expense(ID, desc, val);
			}

			// Push it into our data structure
			data.allItems[type].push(newItem);

			// Return the new element
			return newItem;
		},

		deleteItem: function(type, id){
			//Lets assume
			// id = 6
			// ids = [1,2,3,5,6,8]
			// index = 4

			var ids, index;

			ids = data.allItems[type].map(function(current){
				return current.id;
			});

			index = ids.indexOf(id);

			if (index !== 0) {
				data.allItems[type].splice(index, 1);
			}


		},

		calculateBudget: function(){
			// Calculate total income and expense
			calculateTotal('exp');
			calculateTotal('inc');

			//Calculate total budge: income - expense
			data.budget = data.totals.inc - data.totals.exp;

			//Calculate percentage
			if(data.totals.inc > 0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			}else{
				data.percentage = -1;
			}
		},

		calculatePercentage: function(){
			data.allItems.exp.forEach(function(current){
				current.calcPercentage(data.totals.inc);
			});
		},

		getPercentage: function(){
			var allPer = data.allItems.exp.map(function(cur){
				return cur.getPercentage();
			});

			return allPer;
		},

		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				totalPer: data.percentage
			}
		},

		testing: function(){
			return data;
		}
	}

})();

//UI Controller
var UIController = (function(){

	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputButton: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expenseLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expPerLabel: '.item__percentage',
		dateLabel: '.budget__title--month'

	};

	var formatNumber = function(num, type){
				var numSplit, int, dec, type;

				num = Math.abs(num);
				num = num.toFixed(2);

				numSplit  = num.split('.');

				int = numSplit[0];
				if (int.length > 3) {
					int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
				}

				dec = numSplit[1];
				return (type === 'exp' ? '-':'+') + ' ' + int + '.' +dec;
			};

	return {
			getinput: function(){
				return{
					type:document.querySelector(DOMStrings.inputType).value, // will be wither inc or exp
				 	description:document.querySelector(DOMStrings.inputDescription).value,
					value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
				}
			},

			addListItem: function(obj, type){
				var html, newHtml, element;
				// Creating HTML strings

				if(type === 'inc'){
					element = DOMStrings.incomeContainer;
					html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
				}else if(type === 'exp'){
					element = DOMStrings.expenseContainer;
					html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
				}

				// Replacing the placeholders
				newHtml = html.replace('%id%', obj.id);
				newHtml = newHtml.replace('%description%', obj.description);
				newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

				// Insert the HTML into the DOM
				document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
			},

			removeListItem: function(selectedID){

				var dom = document.getElementById(selectedID);
				dom.parentNode.removeChild(dom);

			},

			clearFields: function(){
				var fields, fieldsArr;

				fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

				fieldsArr = Array.prototype.slice.call(fields);

				fieldsArr.forEach(function(current, index, array){
					current.value = "";
				});

				fieldsArr[0].focus();
			},

			displayBudget: function(obj){

				 var type;
				 obj.budget > 0 ? type = 'inc' : type = 'exp';

				document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget,type);
				document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
				document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
				if(obj.totalPer > 0){
					document.querySelector(DOMStrings.percentageLabel).textContent = obj.totalPer + '%';
				}else {
					document.querySelector(DOMStrings.percentageLabel).textContent = '...';
				}
			},

			displayPercentages: function(percentage){
				var fields = document.querySelectorAll(DOMStrings.expPerLabel);

				var nodeList = function(list, callback){
					for(var i = 0; i< list.length; i++){
						callback(list[i], i);
					}
				};

				nodeList(fields, function(current, index){
					if(percentage[index] > 0){
						current.textContent = percentage[index] + '%';
					} else{
						current.textContent = '---';
					}
				});
			},

			displayDate: function(){
				var current , months, month, year;

				current = new Date();

				months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
				'August', 'September', 'October', 'November', 'December'];
				month = current.getMonth();

				year = current.getFullYear();
				document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
			},

			getDOMStrings: function(){
				return DOMStrings;
			}
		}
})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl){

	var DOM = UICtrl.getDOMStrings();

	var setupEventListeners = function(){
		document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(e){
			if(e.keyCode === 13 || e.which === 13){
				ctrlAddItem();
			}
		});

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	};

	var updateBudget = function(){

		// Calculate the budget
		budgetCtrl.calculateBudget();

		// Return Budget
		var budget = budgetCtrl.getBudget();

		// Display the budget on the UI
		// console.log(budget);
		UICtrl.displayBudget(budget);

	};

	var updatePercentage = function(){
		//Calc Percentagess
		budgetCtrl.calculatePercentage();

		//Read Percentages
		var per = budgetCtrl.getPercentage();

		//Update UI
		UICtrl.displayPercentages(per);


	};

	var ctrlAddItem = function(){
		var input, newItem;

		// Get Data from input field
		input = UICtrl.getinput();


		if(input.description !== "" && !isNaN(input.value) && input.value > 0){
			// Add item to the budget Controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// Add the item to the UI
			UICtrl.addListItem(newItem, input.type);

			//Clear Fields
			UICtrl.clearFields();

			// update budgets
			updateBudget();

			//update percentages
			updatePercentage();
		}

	};

	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		// console.log(event.target);
		// console.log(itemID);
		if (itemID) {

			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// Delete the item from data structure
			budgetCtrl.deleteItem(type, ID);

			// Deleting from UI
			UICtrl.removeListItem(itemID);

			//Update Budget
			updateBudget();

			//update percentages
			updatePercentage();
		}

	};

	return {
		init: function(){
			console.log('Application Started');
			UICtrl.displayDate();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				totalPer: -1
			});
			setupEventListeners();
		}
	}

})(budgetController, UIController);


controller.init();