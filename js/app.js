var CalCtrl = (function () {
    var idAdd = 0;
    var idBurn = 0;
    var storage = {
        add: [],
        burn: [],
        minCalory: 2300,
        totalAdd: 0,
        totalBurn: 0,
        total: 0,
        totalRemaining: 0,
        totalPercentage: 0,
    }
    var calculateCalory = function () {
        console.log('calculate');
        CalCtrl.storage.totalAdd = 0;
        CalCtrl.storage.totalBurn = 0;
        CalCtrl.storage.add.forEach((current) => {
            console.log(current);
            CalCtrl.storage.totalAdd += current.quantity * current.calory;
        })
        CalCtrl.storage.burn.forEach((current) => {
            CalCtrl.storage.totalBurn += current.quantity * current.calory;
        })
        CalCtrl.storage.total = CalCtrl.storage.totalAdd - CalCtrl.storage.totalBurn;
        CalCtrl.storage.totalRemaining = CalCtrl.storage.minCalory - CalCtrl.storage.total;
        CalCtrl.storage.totalPercentage = Math.round(CalCtrl.storage.total / CalCtrl.storage.minCalory * 100)
    }
    var deleteAdd = function (id) {
        for (let i = 0; i < CalCtrl.storage.add.length; i++) {
            if (CalCtrl.storage.add[i].id == id) {
                console.log('delete' + CalCtrl.storage.add[i] + ' with id = ' + id);
                CalCtrl.storage.add.splice(i, 1);
            }
        }
        CalCtrl.calculateCalory();
    }

    var deleteBurn = function (id) {
        for (let i = 0; i < CalCtrl.storage.burn.length; i++) {
            if (CalCtrl.storage.burn[i].id == id) {
                console.log('delete' + CalCtrl.storage.burn[i] + ' with id = ' + id);
                CalCtrl.storage.burn.splice(i, 1);
            }
        }
        CalCtrl.calculateCalory();
    }
    return {
        storage,
        idAdd,
        idBurn,
        calculateCalory,
        deleteAdd,
        deleteBurn,
    }

})()

if (localStorage.getItem('data') == null) {
    localStorage.setItem('data', JSON.stringify(CalCtrl.storage))
}
var local = JSON.parse(localStorage.getItem('data'));

var UICtrl = (function () {
    var htmlConnections = {
        form: document.querySelector('form'),
        submit: document.querySelector('.showForm__add-btn'),
        type: document.querySelector('.showForm__type'),
        description: document.querySelector('.showForm__description__input'),
        quantity: document.querySelector('.quantity'),
        calory: document.querySelector('.showForm__add-calories'),
        food: document.querySelector('.food__slider'),
        exercise: document.querySelector('.exercise__slider'),
        activeFood: document.querySelector('.btn-panel__food--apple'),
        activeExercise: document.querySelector('.btn-panel__food--fire'),
        resultAdd: document.querySelector('.main-panel__result--food-cal'),
        resultBurn: document.querySelector('.main-panel__result--exercise-cal'),
        resultPercentage: document.querySelector('.main-panel__date--percent'),
        resultRemaining: document.querySelector('.totalCal__remaining'),
        resultCircle: document.querySelector('.circlePercentageValue'),
        date: document.querySelector('.main-panel__date--text'),
        mainPanel: document.querySelector('.main-panel'),
        error: document.querySelector('.error'),

    }

    var UIadd = function (type) {
        if (type == 'add') {
            var insert = `<div class="food-container__foods" id="add-${CalCtrl.storage.add[CalCtrl.storage.add.length - 1].id}"><div div class="food-container__foods--name" >${CalCtrl.storage.add[CalCtrl.storage.add.length - 1].description}</div ><div class="food-container__foods--calBalance">Calorie Balance<span class="food-container__foods--cal">${CalCtrl.storage.add[CalCtrl.storage.add.length - 1].calory * CalCtrl.storage.add[CalCtrl.storage.add.length - 1].quantity}Cal</span><div class="food-container__foods--bar"></div></div><div class="food-container__foods--delete"><button class="btn-deleteItem"><i class="far fa-times-circle"></i></button></div></div >`;
            htmlConnections.food.insertAdjacentHTML('beforeend', insert);
        }
        else if (type == 'burn') {
            var insert = `<div class="food-container__foods running-container__name" id="burn-${CalCtrl.storage.burn[CalCtrl.storage.burn.length - 1].id}">
            <div class="food-container__foods--name running-container__name">
                ${CalCtrl.storage.burn[CalCtrl.storage.burn.length - 1].description}
            </div>
            <div class="food-container__foods--calBalance running__calBalance">
                Calorie Burned
                <span class="food-container__foods--cal  running__calBalance--cal"> -${CalCtrl.storage.burn[CalCtrl.storage.burn.length - 1].calory * CalCtrl.storage.burn[CalCtrl.storage.burn.length - 1].quantity}Cal</span>
                <div class="food-container__foods--bar  running__calBalance--bar"></div>

            </div>
            <div class="food-container__foods--delete running-container__delete">
                <button class="btn-deleteItem"><i class="far fa-times-circle"></i>
                </button>
            </div>
        </div>`;
            htmlConnections.exercise.insertAdjacentHTML('beforeend', insert);
        }

    }

    var totalUI = function () {
        htmlConnections.resultAdd.textContent = `+ ${UICtrl.formatIUResults(CalCtrl.storage.totalAdd)} Cal`;
        htmlConnections.resultBurn.textContent = `- ${UICtrl.formatIUResults(CalCtrl.storage.totalBurn)} Cal`;
        htmlConnections.resultRemaining.textContent = `${UICtrl.formatUIRemaining(CalCtrl.storage.totalRemaining)}`;
        htmlConnections.resultPercentage.textContent = `${CalCtrl.storage.totalPercentage}%`;
        htmlConnections.resultCircle.setAttribute('stroke-dasharray', `${CalCtrl.storage.totalPercentage}, 100`);

        if (CalCtrl.storage.totalRemaining > 2500) {
            htmlConnections.resultRemaining.style.color = 'green';
        }
        else if (CalCtrl.storage.totalRemaining > 1500) {
            htmlConnections.resultRemaining.style.color = 'yellow';
        }
        else if (CalCtrl.storage.totalRemaining > 0) {
            htmlConnections.resultRemaining.style.color = 'orange';
        }
        else if (CalCtrl.storage.totalRemaining < 0) {
            htmlConnections.resultRemaining.style.color = 'red';
        }
    }


    var dateUI = function () {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        var today = new Date;
        UICtrl.htmlConnections.date.textContent = days[today.getDay()] + ', ' + today.getDate() + ' ' + months[today.getMonth()] + ' ' + today.getFullYear() + ' ';


    }
    var deleteUI = function (id) {
        document.getElementById(id).remove();
    }

    var formatUIRemaining = function (num) {
        num = Number(num);
        num = Math.round(num);
        if (num > 0) {
            var param = num.toString();
            var res;
            if (param.length > 3) {
                res = param.substr(0, param.length - 3) + ',' + param.substr(param.length - 3);
            }
            else {
                res = param;
            }
        }
        else {
            num = Math.abs(num);
            var param = num.toString();
            var res;
            if (param.length > 3) {
                res = param.substr(0, param.length - 3) + ',' + param.substr(param.length - 3);
            }
            else {
                res = param;
            }
            res = '-' + res;
        }

        return res;
    }
    var formatIUResults = function (num) {
        num = num.toFixed(2);
        num = num.toString();
        var param = num.split('.')
        var intPart = param[0];
        var restPart = param[1];
        var res;
        if (intPart.length > 3) {
            res = intPart.substr(0, intPart.length - 3) + ',' + intPart.substr(intPart.length - 3);
        }
        else {
            res = intPart;
        }
        if (restPart != undefined) {
            res += '.' + restPart;
        }

        return res;
    }


    return {
        htmlConnections,
        UIadd,
        totalUI,
        dateUI,
        deleteUI,
        formatUIRemaining,
        formatIUResults,
    }

})()

var MainCtrl = (function () {
    var initialize = function () {

        UICtrl.dateUI();

        if (local != null) {
            CalCtrl.storage = Object.assign({}, local);
            if (local.add.length > 0) {
                CalCtrl.idAdd = local.add[local.add.length - 1].id + 1;
            }
            if (local.burn.length > 0) {
                CalCtrl.idBurn = local.burn[local.burn.length - 1].id + 1;
            }
            var storageBuild = (function () {
                for (let i = 0; i < local.add.length; i++) {
                    var insert = `<div class="food-container__foods" id="add-${i}"><div div class="food-container__foods--name" >${local.add[i].description}</div ><div class="food-container__foods--calBalance">Calorie Balance<span class="food-container__foods--cal">${local.add[i].calory * local.add[i].quantity}Cal</span><div class="food-container__foods--bar"></div></div><div class="food-container__foods--delete"><button class="btn-deleteItem"><i class="far fa-times-circle"></i></button></div></div >`;
                    UICtrl.htmlConnections.food.insertAdjacentHTML('beforeend', insert);
                }
                for (let i = 0; i < local.burn.length; i++) {
                    var insert = `<div class="food-container__foods running-container__name" id="burn-${i}">
            <div class="food-container__foods--name running-container__name">
                ${local.burn[i].description}
            </div>
            <div class="food-container__foods--calBalance running__calBalance">
                Calorie Burned
                <span class="food-container__foods--cal  running__calBalance--cal"> -${local.burn[i].calory * local.burn[i].quantity}Cal</span>
                <div class="food-container__foods--bar  running__calBalance--bar"></div>

            </div>
            <div class="food-container__foods--delete running-container__delete">
                <button class="btn-deleteItem"><i class="far fa-times-circle"></i>
                </button>
            </div>
        </div>`;
                    UICtrl.htmlConnections.exercise.insertAdjacentHTML('beforeend', insert);

                }
                CalCtrl.calculateCalory();
                UICtrl.totalUI();
            })()
        }

        var events = (function () {
            UICtrl.htmlConnections.form.addEventListener('submit', (e) => {
                e.preventDefault();
                submitFunc();
            })
            UICtrl.htmlConnections.submit.addEventListener('click', (e) => {
                e.preventDefault();
                submitFunc();
            })

            UICtrl.htmlConnections.mainPanel.addEventListener('click', (e) => {
                if (e.target.classList.contains('fa-times-circle')) {
                    var deleteItem = e.target.parentNode.parentNode.parentNode;
                    var fullId = deleteItem.getAttribute('id').split('-');
                    var id = fullId[1];
                    var type = fullId[0];
                    console.log(id, type);

                    if (type == 'add') {
                        CalCtrl.deleteAdd(id);
                        UICtrl.deleteUI(deleteItem.getAttribute('id'));
                        localStorage.setItem('data', JSON.stringify(CalCtrl.storage))
                    }
                    else if (type == 'burn') {
                        CalCtrl.deleteBurn(id);
                        UICtrl.deleteUI(deleteItem.getAttribute('id'));
                        localStorage.setItem('data', JSON.stringify(CalCtrl.storage))
                    }
                    UICtrl.totalUI();

                }
            })
        })()
        function submitFunc() {
            var type = UICtrl.htmlConnections.type.value;
            var calory = UICtrl.htmlConnections.calory.value;
            var quantity = UICtrl.htmlConnections.quantity.value;
            var description = UICtrl.htmlConnections.description.value;
            if (quantity != '' && calory != '' && description != '') {
                if (quantity < 0 || calory < 0) {
                    UICtrl.htmlConnections.error.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please please the form correctly'
                }
                else {
                    var add = {
                        id: type == 'add' ? CalCtrl.idAdd : CalCtrl.idBurn,
                        type: type,
                        calory: calory,
                        quantity: quantity,
                        description: description,
                    }
                    CalCtrl.storage[add.type].push(add);
                    localStorage.setItem('data', JSON.stringify(CalCtrl.storage))

                    UICtrl.UIadd(type);
                    if (type == 'add') {
                        CalCtrl.idAdd++;
                        makeActive('add');
                    }
                    else if (type == 'burn') {
                        CalCtrl.idBurn++;
                        makeActive('burn');

                    }
                    console.log('submit');
                    CalCtrl.calculateCalory();
                    UICtrl.totalUI();
                    UICtrl.htmlConnections.form.reset();
                    UICtrl.htmlConnections.error.innerHTML = '';

                }

            }
            else {
                UICtrl.htmlConnections.error.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please please the form correctly';
            }
            console.log(CalCtrl.storage);

        }
        function makeActive(type) {
            if (type == 'add') {
                notification = `<i class="fas fa-apple-alt"></i>
                <span class="btn-panel__food--text">+ Food</span>
                <div class="circle-container">
                    <div class="pulsate"></div>
                    <div class="circle"></div>
                </div>`;
                UICtrl.htmlConnections.activeFood.innerHTML = notification;
                UICtrl.htmlConnections.activeExercise.innerHTML = `<i class="fas fa-fire"></i>
                <span class="btn-panel__food--text exercise-burn-text"> - Exercise</span>`;


            }
            else if (type == 'burn') {
                notification = `<i class="fas fa-fire"></i>
                <span class="btn-panel__food--text exercise-burn-text"> - Exercise</span>
                <div class="circle-container">
                    <div class="pulsate"></div>
                    <div class="circle"></div>
                </div>`;
                UICtrl.htmlConnections.activeExercise.innerHTML = notification;
                UICtrl.htmlConnections.activeFood.innerHTML = `<i class="fas fa-apple-alt"></i>
                <span class="btn-panel__food--text">+ Food</span>`;

            }
        }
    }
    return {
        initialize
    }

})(CalCtrl, UICtrl)
MainCtrl.initialize();


console.log(CalCtrl.storage);
