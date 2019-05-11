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
    var data = {
        allItems: {
            exp: [],
            inc: [],
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
        inputValue: '.value',
        inputDescription: '.descrip',
        inputType: '.select_type',
        inputBtn: '.add_btn',
    };

    // Returning public function method for transferring info about the input from form
    return {
        getinput: function(){

            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            }
           
        },

        addListItem: function(obj, type){
            // Create HTML string with placeholder
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
        document.querySelector(DOM.inputBtn).addEventListener('click', addItemCtrl);

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                addItemCtrl();
            }
        });
    }

    var addItemCtrl = function(){

        var input, newItem;

        //1. Get the filled input Data
        input = UICtrl.getinput();
        // console.log(input);

        //2. Add the item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        //3. Update UI

        //4. Calculate Budget

        //5. Display Budget to UI
    };

    return {
        init: function(){
            setUpEventListeners();
            console.log("Application has started");
        }
    }

})(budgetController, UIController);


controller.init();