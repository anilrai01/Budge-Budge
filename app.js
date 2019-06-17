// Budget Controller
var budgetController = (function(){

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var calculateTotal = function(type){
		var sum = 0;

		data.allItems[type].forEach(function(cur){
			sum = sum + cur.value;
		});
		data.totals[type] = sum;
	};

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

		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				totalPer: data.percentage
			}
		},

		test: function(){
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
		percentageLabel: '.budget__expenses--percentage'

	}

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
					html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
				}else if(type === 'exp'){
					element = DOMStrings.expenseContainer;
					html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
				}

				// Replacing the placeholders
				newHtml = html.replace('%id%', obj.id);
				newHtml = newHtml.replace('%description%', obj.description);
				newHtml = newHtml.replace('%value%', obj.value);

				// Insert the HTML into the DOM
				document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
				document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
				document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
				document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;
				if(obj.totalPer > 0){
					document.querySelector(DOMStrings.percentageLabel).textContent = obj.totalPer;
				}else {
					document.querySelector(DOMStrings.percentageLabel).textContent = '...';
				}
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
		}

	};

	return {
		init: function(){
			console.log('Application Started');
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