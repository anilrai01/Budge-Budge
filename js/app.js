//Working with Modules

//Budget Controller **Data Module
var budgetController = (function(){
   var Expense = function(id, description, value){
       this.id = id;
       this.description = description;
       this.value = value;
   }

   var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    //Our data structure
    var data = git {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0,
        },
    }

    return {
        addItem: function(type, des, val){
            var newItem, ID;

            //Creating new ID we only need id so we extracted it using 'id'
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else {
                ID = 0;
            }

            //Create new Item on the basis of its type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else {
                newItem = new Income(ID, des, val);
            }

            //Push data to our data structure
            data.allItems[type].push(newItem);

            //Return new item
            return newItem;
        },

        testing: function(){
            console.log(data);
        }
    }

})();

//UI controller **UI Module
var UIController = (function(){
    //DOM variables
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
    };

    // Returning public function method for transferring info about the input from form
    return {
        getinput: function(){
            // It update the object everytime it is called
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            }
           
        },

        addListItem: function(obj, type){
            // Create HTML string with placeholder
            var html, newData, element;
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>';
            }else{
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>';
            }
            newData = html.replace('%id%',obj.id);
            newData = newData.replace('%description%', obj.description);
            newData = newData.replace('%value%', obj.value);

            //Insert to HTML in DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newData);
        },

        clearFields: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        // Returning DOM strings
        getDOMstrings: function(){
            return DOMstrings;
        }
    }
})();

//Global App Controller **Contorller Module
var controller = (function(budgetCtrl, UICtrl){

    //Receive DOM strings from UI module
    var DOM = UICtrl.getDOMstrings();
    
    // Set up controllers to listen the input
    var setUpEventListeners = function(){
        document.querySelector(DOM.inputBtn).addEventListener('click', addItemCtrl  );

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                addItemCtrl();
                // console.log('pressed');
            }
        });
    };

    var updateBudget = function(){
        //1. Calculate Budget

        //2. Return the budget

        //3. Display Budget to UI

    };

    var addItemCtrl = function(){

        var input, newItem;

        //1. Get the filled input Data
        input = UICtrl.getinput();
        // console.log(input);

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
             //2. Add the item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // console.log(newItem);

            //3. Update UI
            UICtrl.addListItem(newItem, input.type);

            //4. Clear Fields
            UICtrl.clearFields();
        }

    };

    return {
        init: function(){
            setUpEventListeners();
            console.log("Application has started");
        }
    }

})(budgetController, UIController);


controller.init();