var session = pl.create();

let EmployeesJson   = [];
let KnowledgesJson  = [];
let TreeJson        = [];

let Tree        = '';
let Employee    = '';

$(function() {
    getKnowledges();
    getRequireToLearns();
    getEmployees();
})

// **************************************

//Finding the right employees for a specific task
$('.get-best-to-specific-task').on('click', function() {
    let listKnowlages = $('#knowlages-multiple-select').val();
    session.consult(Employee, {
        success: function() { 
            session.query(`solve(${employeeList}, [${listKnowlages}], Ans).`, {
                success: function(goal) { 
                    session.answer({
                        success: function(answer) {
                            let textarea = $('#best-to-specific-task');
                            textarea.val('');
                            let ans = session.format_answer(answer);
                            ans = ans.split("=")[1];
                            ans = ans.trim().substring(1, ans.length-4);
                            ans = ans.split(',');
                            ans.forEach(item => {
                                textarea.val(textarea.val() + item + ', ');
                            })
                            textarea.val(textarea.val().substring(0, textarea.val().length-2))

                            if(textarea.val() == '') {
                                textarea.val('لايوجد موظف يملك الخبرات المطلوبة كاملة');
                            }
                        },
                    });
                },
                error: function(err) { console.log(err) }
            });
        },
    });
})

// **************************************

// Get To Learn
var callback = function(answer) {
    if (answer === false || answer === null) {
        return
    }
    // loop
    let list = $(".list-maps")
    
    list.append(`<li>${pl.format_answer(answer) == 'Ans = [] ;' 
    ? "الموظف متم الالخبرات المطلوبة"
    : pl.format_answer(answer)}</li>`);
    session.answer(callback)
}
$('.get-to-learn').on('click', () => {
    $(".list-maps").text("");
    
    const selectedeEmployee = $('#employeeList').val();
    const kownlageSingleSelect = $('#kownlage-single-select').val();
    var parsed = session.consult(Employee);

    var query = session.query(`getToLearn(${selectedeEmployee}, Ans, ${kownlageSingleSelect}).`);

    session.answer(callback);
})

// **************************************

// Get Max Salary
$('.get-max-salary').on('click', () => {
    session.consult(Employee, {
        success: function() { 
            session.query(`maxSalaryList(${employeeList}, Ans).`, {
                success: function(goal) { 
                    session.answer({
                        success: function(answer) {
                            let res = session.format_answer(answer).split('=')[1];
                            res = res.split('[')[1];
                            res = res.split(']')[0];
                            res = res.split(',');
                            $('#maxSalary').val(`${res[1]} his salary is : ${res[2]}`);
                        },
                    });
                },
                error: function(err) { console.log(err) }
            });
        },
    });
})

// Get Min Salary
$('.get-min-salary').on('click', () => {
    session.consult(Employee, {
        success: function() { 
            session.query(`minSalaryList(${employeeList}, Ans).`, {
                success: function(goal) { 
                    session.answer({
                        success: function(answer) {
                            let res = session.format_answer(answer).split('=')[1];
                            res = res.split('[')[1];
                            res = res.split(']')[0];
                            res = res.split(',');
                            $('#minSalary').val(`${res[1]} his salary is : ${res[2]}`);
                        },
                    });
                },
                error: function(err) { console.log(err) }
            });
        },
    });
})

// **************************************

// Get Max Experience
$('.get-max-exper').on('click', () => {
    session.consult(Employee, {
        success: function() { 
            session.query(`maxExperList(${employeeList}, Ans).`, {
                success: function(goal) { 
                    session.answer({
                        success: function(answer) {
                            let res = session.format_answer(answer).split('=')[1];
                            res = res.split('[')[1];
                            res = res.split(']')[0];
                            res = res.split(',');
                            $('#maxExper').val(`${res[1]} has ${res[3]} year of experiance and his salary is : ${res[2]}`);
                        },
                    });
                },
                error: function(err) { console.log(err) }
            });
        },
    });
})

// Get Min Experience
$('.get-min-exper').on('click', () => {
    session.consult(Employee, {
        success: function() { 
            session.query(`minExperList(${employeeList}, Ans).`, {
                success: function(goal) { 
                    session.answer({
                        success: function(answer) {
                            let res = session.format_answer(answer).split('=')[1];
                            res = res.split('[')[1];
                            res = res.split(']')[0];
                            res = res.split(',');
                            $('#minExper').val(`${res[1]} has ${res[3]} year of experiance and his salary is : ${res[2]}`);
                        },
                    });
                },
                error: function(err) { console.log(err) }
            });
        },
    });
})

// **************************************

// Get Sum of Salary
$('.get-sum').on('click', () => {
    session.consult(Employee, {
        success: function() { 
            session.query(`sum(${employeeList}, Ans).`, {
                success: function(goal) { 
                    session.answer({
                        success: function(answer) {
                            let res = session.format_answer(answer).split('=')[1];
                            $('#sum').val(res.split('.')[0]);
                        },
                    });
                },
                error: function(err) { console.log(err) }
            });
        },
    });
})

// **************************************
// sort table
$('.merge').on('click', function() {
    const that = this;
    session.consult(Employee, {
        success: function() {
            let IndexMerge;
            if($(that).hasClass('min') || $(that).hasClass('max')){
                $(that).toggleClass('min max');
                if($(that).hasClass('max')) {
                    IndexMerge = $(that).data('merge');
                } else {
                    IndexMerge = $(that).data('merge') + 1;
                }
            } else {
                $(that).addClass('max');
                IndexMerge = $(that).data('merge');
            }
            $(that).siblings().removeClass('max min');
            session.query(`mergesort${IndexMerge}(${employeeList}, Ans).`, {
                success: function(goal) { 
                    session.answer({
                        success: function(answer) {
                            employeeList = session.format_answer(answer).split("=")[1];
                            employeeList = employeeList.slice(0, -1);
                            initTable();
                        },
                    });
                },
                error: function(err) { console.log(err) }
            });
        },
    });
});

// **************************************

const initTable = function() {
    $('.table .tbody').empty();
    let employees = employeeList.split('],[');
    employees[0] = employees[0].slice(2,employees[0].length)
    employees[employees.length - 1] = employees[employees.length - 1].slice(0, employees[employees.length - 1].length - 2);
    employees.forEach((item, index) => {
        item = item.split(',');
        let ExperTd = '';
        let ExperNum = 0;
        let tr = `<tr>
            <td>${item[1]}</td>
            <td>${item[2]}</td>
            <td>${item[3]}</td>`;
        for(let i = 4; i <= item.length-1; i++) {
            ExperTd += ', ' + item[i];
            ExperNum++;
        }
        tr += ` <td>${ExperTd.substring(1, ExperTd.length)}</td>
                <td>${ExperNum}</td>
            </tr>`;
        $('.table .tbody').append(tr);
    })
}

// **************************************

function getKnowledges() {
    $.ajax({
        url: 'https://localhost:44324/api/My/GetAllKnowledges',
        type: 'GET',
    }).done((json) => {
        KnowledgesJson = json;
        createKnowledgesSelects(json);
    });
}
function createKnowledgesSelects(json) {
    $('#kownlage-single-select').empty();
    $('#knowlages-multiple-select').empty();
    $('#Empknowlages').empty();
    $('#parentKnowlagePage').empty();
    json.forEach((item, index) => {
        let option = '';
        option += `<option value="${item.name}`;
        
        if(index == 0) {
            option += `" selected>${item.name}</option>`;
        } else {
            option += `">${item.name}</option>`;
        }
        $('#kownlage-single-select').append(option);
        $('#knowlages-multiple-select').append(option);
        $('#Empknowlages').append(option);
        $('#parentKnowlagePage').append(option);
    })
}

// **************************************

// create employee list and fill select
function getEmployees() {
    $.ajax({
        url: 'https://localhost:44324/api/My/GetAllEmployees',
        type: 'GET',
    }).done((json) => {
        EmployeesJson = json;
        createEmployeeListAndSelect(json);
    });
}
function createEmployeeListAndSelect(json){
    employeeList = '[';
    $('#employeeList').empty();
    json.forEach((item, index) => {
        let option = '';
        let value = '';
        option += `<option value="`
        value += `[${item.id} , ${item.name} , ${item.salary} , ${item.experience} , [`;
        item.knowledgeDtos.forEach((know, indexKnow) => {
            if(indexKnow == 0) {
                value += `${know.name} ,`;
            } else if(indexKnow == item.knowledgeDtos.length - 1) {
                value += ` ${know.name}`;
            } else {
                value += ` ${know.name} ,`;
            }
        })

        employeeList = employeeList + value + ']],';
        option += value;
        if(index == 0) {
            option += `]]" selected>${item.name}</option>`;
        } else {
            option += `]]">${item.name}</option>`;
        }
        $('#employeeList').append(option);
    })
    employeeList = employeeList.substring(0, employeeList.length - 1) + "]";
    initTable();
}

let employeeList = '';
// `[[1 , ahmad , 100 , 2 , [a , b , c]],[2 , amjad , 300 , 3 , [a , c , d]],[3 , ali , 200 , 1 , [a , d , e]],[4 , fadi , 400 , 4 , [a , e , f]],[4 , hadi , 700 , 3 , [a , e]]]`;
// [1 , ahmad , 100 , 2 , [a , b , c]]

// **************************************

// create Tree
function getRequireToLearns() {
    $.ajax({
        url: 'https://localhost:44324/api/My/GetAllRequireToLearns',
        type: 'GET',
    }).done((json) => {
        // set tree
        TreeJson = json;
        createTree(json);
    });
}
function createTree(json) {
    console.log(json)
    Tree = '';
    Employee = '';
    json.forEach((edge) => {
        Tree += `next(${edge.first} , ${edge.second}).`
    })
    Employee = Tree + prologRules;
}
// next(a , b).

// **************************************

// add requests
function postNewEmployee() {
    const EmpName = $('#EmpName').val();
    const EmpSalary = $('#EmpSalary').val();
    const EmpExperience = $('#EmpExperience').val();
    const Empknowlages = [];
    $('#Empknowlages').val().forEach((knowlage) => {
        Empknowlages.push({Name: knowlage})
    })
    const data = JSON.stringify({
        Id : 0,
        Name : EmpName,
        Salary: +EmpSalary,
        Experience: +EmpExperience,
        KnowledgeDtos: Empknowlages
    });
    $.ajax({
        url: 'https://localhost:44324/api/My/AddEmployee',
        data: data,
        type: "POST",
        dataType: "json",
        contentType:"application/json; charset=utf-8",
    }).done((json) => {
        // set tree
        EmployeesJson.push(json);
        createEmployeeListAndSelect(EmployeesJson);
        $('#EmpName').val('');
        $('#EmpSalary').val(0);
        $('#EmpExperience').val(0);
        $('#addEmployee').modal('hide');
    });
}
$('.addEmp').on('click', function() {
    postNewEmployee();
})
// **************************************

// add edge
function postNewEdge() {
    const edgeSecond = $('#edgeSecond').val();
    const parentKnowlagePage = $('#parentKnowlagePage').val();
    console.log(edgeSecond, parentKnowlagePage);

    const data = JSON.stringify({
        first: parentKnowlagePage,
        second: edgeSecond
      });
    $.ajax({
        url: 'https://localhost:44324/api/My/AddRequireToLearn',
        data: data,
        type: "POST",
        dataType: "json",
        contentType:"application/json; charset=utf-8",
    }).done((json) => {
        // set tree
        console.log(json);
        TreeJson.push({
            first: json.first,
            second: json.second
        });
        createTree(TreeJson);
        if(json.returningNode !== null) {
            KnowledgesJson.push({name: json.returningNode});
            getKnowledges(KnowledgesJson);
            $('#edgeSecond').val('');
            $('#addKnowlageNode').modal('hide');
        }
    });
}
$('.addEdge').on('click', function() {
    postNewEdge();
})
// **************************************

const prologRules = `
    % Reverse List 
    reverse([] , A , A). 
    reverse([H|T] , A , R):-  reverse(T , [H | A] , R).

    % Get Path Of Learning 
    getPath(Start , Ans , End) :- Start == root , path(Start , ReversedAns , End) , reverse(ReversedAns , [] , Ans).
    getPath(Start , [Start|TAns], End) :- Start \\== root , path(Start , ReversedAns , End) , reverse(ReversedAns , [] , TAns). 

    path(Start , [] , Start).
    path(Start , [Cur | TR] , Cur) :- Start \\== Cur , next(NXT , Cur) , path(Start , TR , NXT).

    % Member
    member(X,[X|_]).
    member(X,[Y|R]) :- X \\== Y , member(X , R).

    % Intersection (SET A - SET B) 
    intersection([], M, []).
    intersection([X|Y], M, [X|Z]) :- (\\+ member(X, M)), intersection(Y, M, Z).
    intersection([X|Y], M, Z) :- member(X, M), intersection(Y, M, Z).
    

    % What Should Employee Learn?? 
    % [_ , _ , _ , _ , EmpKnowledge] employee list
    % [employee id, employee name ,employee salary , employee experiance , employee Knowledge];
    getToLearn([_ , _ , _ , _ , EmpKnowledge] , Ans , Target) :- getPath(root , Path , Target) , intersection(Path , EmpKnowledge , Ans).

    % Finding the right employees for a specific task
    searhOnItem(_ , [] , -1).
    searhOnItem(Search , [Search | _] , 1).
    searhOnItem(Search , [_ | TReq] , Flag) :- searhOnItem(Search , TReq , Flag).

    matchIfContain([] , _ , 1).
    matchIfContain([HEmp | _] , Req , -1) :- searhOnItem(HEmp , Req , Flag) , Flag < 0.
    matchIfContain([HEmp | TEmp] , Req , Flag2) :- searhOnItem(HEmp , Req , Flag) , Flag > 0  , matchIfContain(TEmp , Req , Flag2).


    solve([] , _ , []).

    solve([[_ , EmpName , _ , _ , EmpKn] | TEmp] , Req , [EmpName | TRes]) :- 
    matchIfContain(Req , EmpKn , Flag) , Flag > 0 , solve(TEmp , Req , TRes).

    solve([[_ , _ , _ , _ , EmpKn] | TEmp] , Req , Res) :- 
    matchIfContain(Req , EmpKn , Flag) , Flag < 0 , solve(TEmp , Req , Res).

    % Finding The Max Salary Employee 
    maxSalaryList([X] , X).
    maxSalaryList(
        [
            [EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1],
            [EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2] | TEmp
        ] , Max) :- 
    maxSalaryList([[EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2] | TEmp] , MaxRest) , 	
    maxSalaryTwoEmployees(   [EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1] , MaxRest , Max).

    maxSalaryTwoEmployees([EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1] % first employee
    , [EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2] % secound employee
    , [EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1] % result employee max salary
    ) :-  EmpSal1 >= EmpSal2.
    
    maxSalaryTwoEmployees([EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1] 
    , [EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2] 
    , [EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2]) :-  EmpSal1 <  EmpSal2.


    % Finding The Min Salary Employee 
    minSalaryList([X] , X).
    minSalaryList(
        [
            [EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1],
            [EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2] | TEmp
        ] , Min) :- minSalaryList([[EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2] | TEmp] , MinRest),
    minSalaryTwoEmployees([EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1] , MinRest , Min).

    minSalaryTwoEmployees([EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1] 
    , [EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2] 
    , [EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1]) :-  EmpSal1 <  EmpSal2.
    
    minSalaryTwoEmployees([EmpId1 , EmpName1 , EmpSal1 , EmpYears1 , EmpKnowledge1] 
    , [EmpId2 , EmpName2 , EmpSal2 , EmpYears2 , EmpKnowledge2] 
    , [EmpId2 , EmpName2 , EmpSal2 , EmpYears2 , EmpKnowledge2]) :-  EmpSal1 >= EmpSal2.

    % Finding The Max Experience Employee 
    maxExperList([X] , X).
    maxExperList(
        [
            [EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1],
            [EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2] | TEmp
        ], Max) :- maxExperList([[EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2] | TEmp] , MaxRest), 	
    maxExperTwoEmployees(   [EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1] , MaxRest , Max).

    maxExperTwoEmployees([EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1] 
    , [EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2] 
    , [EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1]) :-  EmpExperience1 >= EmpExperience2.
    
    maxExperTwoEmployees([EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1] 
    , [EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2] 
    , [EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2]) :-  EmpExperience1 <  EmpExperience2.

    % Finding The Min Experience Employee where Experience int number meaning year of Experience
    minExperList([X] , X).
    minExperList(
        [
            [EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1],
            [EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2] | TEmp
        ], Min) :- minExperList([[EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2] | TEmp] , MinRest),
    minExperTwoEmployees(   [EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1] , MinRest , Min).

    minExperTwoEmployees([EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1] 
    , [EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2] 
    , [EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1]) :-  EmpExperience1 <  EmpExperience2.
    
    minExperTwoEmployees([EmpId1 , EmpName1 , EmpSal1 , EmpExperience1 , EmpKnowledge1] 
    , [EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2] 
    , [EmpId2 , EmpName2 , EmpSal2 , EmpExperience2 , EmpKnowledge2]) :-  EmpExperience1 >= EmpExperience2.

    % Arranging Employees According To The Salary In Ascending Order
    mergesort1([] , []).
    mergesort1([A] , [A]).
    mergesort1([A , B | R] , S) :- split1([A , B | R] , L1 , L2) , mergesort1(L1 , S1) , mergesort1(L2 , S2) , merge1(S1 , S2 , S).

    split1([] , [] , []). 
    split1([A] , [A] , []).
    split1([A , B | R] , [A | Ra] , [B | Rb]) :- split1(R , Ra , Rb).

    merge1(A , [] , A).
    merge1([] , B , B).
    merge1(
        [
            [EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra
        ],[
            [EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb
        ],[
            [EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | M
        ]) :- EmpSalA =< EmpSalB
        , merge1(Ra , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] , M).

    merge1([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | M ]) :- EmpSalA  > EmpSalB 
        , merge1([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] , Rb , M).
    
    % Arranging Employees According To The Salary In Descending Order
    mergesort2([] , []).
    mergesort2([A] , [A]).
    mergesort2([A , B | R] , S) :- split2([A , B | R] , L1 , L2) , mergesort2(L1 , S1) , mergesort2(L2 , S2) , merge2(S1 , S2 , S).
    split2([] , [] , []). 
    split2([A] , [A] , []).
    split2([A , B | R] , [A | Ra] , [B | Rb]) :- split2(R , Ra , Rb).
    merge2(A , [] , A).
    merge2([] , B , B).
    merge2([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] 
        , [[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | M ]) :- EmpSalA  > EmpSalB 
        , merge2(Ra , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] , M).
    merge2([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | M ]) :- EmpSalA =< EmpSalB 
        , merge2([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] , Rb , M).   
    
    % Arranging Employees According To The Experience In Ascending Order
    mergesort3([] , []).
    mergesort3([A] , [A]).
    mergesort3([A , B | R] , S) :- split3([A , B | R] , L1 , L2) , mergesort3(L1 , S1) , mergesort3(L2 , S2) , merge3(S1 , S2 , S).
    split3([] , [] , []). 
    split3([A] , [A] , []).
    split3([A , B | R] , [A | Ra] , [B | Rb]) :- split3(R , Ra , Rb).
    merge3(A , [] , A).
    merge3([] , B , B).
    merge3([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] 
        , [[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | M ]) :- EmpExperienceA =< EmpExperienceB 
        , merge3(Ra , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] , M).
    merge3([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | M ]) :- EmpExperienceA  > EmpExperienceB 
        , merge3([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] , Rb , M).
    
    % Arranging Employees According To The Experience In Descending Order
    mergesort4([] , []).
    mergesort4([A] , [A]).
    mergesort4([A , B | R] , S) :- split4([A , B | R] , L1 , L2) , mergesort4(L1 , S1) , mergesort4(L2 , S2) , merge4(S1 , S2 , S).
    split4([] , [] , []). 
    split4([A] , [A] , []).
    split4([A , B | R] , [A | Ra] , [B | Rb]) :- split4(R , Ra , Rb).
    merge4(A , [] , A).
    merge4([] , B , B).
    merge4([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] 
        , [[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | M ]) :- EmpExperienceA  > EmpExperienceB 
        , merge4(Ra , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] , M).
    merge4([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | M ]) :- EmpExperienceA =< EmpExperienceB 
        , merge4([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] , Rb , M).

    % Arranging Employees According To The Number Of Knowledges In Ascending Order
    mergesort5([] , []).
    mergesort5([A] , [A]).
    mergesort5([A , B | R] , S) :- split5([A , B | R] , L1 , L2) , mergesort5(L1 , S1) , mergesort5(L2 , S2) , merge5(S1 , S2 , S).
    split5([] , [] , []). 
    split5([A] , [A] , []).
    split5([A , B | R] , [A | Ra] , [B | Rb]) :- split5(R , Ra , Rb).
    merge5(A , [] , A).
    merge5([] , B , B).
    merge5([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] 
        , [[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | M ]) :- 
        length(EmpKnowledgeA , NA) 
        , length(EmpKnowledgeB , NB) 
        , NA =< NB 
        , merge5(Ra , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] , M).
    merge5([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | M ]) :- 
        length(EmpKnowledgeA , NA) 
        , length(EmpKnowledgeB , NB) 
        , NA  > NB 
        , merge5([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] , Rb , M).
    
    % Arranging Employees According To The Number Of Knowledges In Descending Order
    mergesort6([] , []).
    mergesort6([A] , [A]).
    mergesort6([A , B | R] , S) :- split6([A , B | R] , L1 , L2) , mergesort6(L1 , S1) , mergesort6(L2 , S2) , merge6(S1 , S2 , S).
    split6([] , [] , []). 
    split6([A] , [A] , []).
    split6([A , B | R] , [A | Ra] , [B | Rb]) :- split6(R , Ra , Rb).
    merge6(A , [] , A).
    merge6([] , B , B).
    merge6([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] 
        , [[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | M ]) :- 
        length(EmpKnowledgeA , NA) 
        , length(EmpKnowledgeB , NB) 
        , NA  > NB 
        , merge6(Ra , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] , M).
    merge6([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | Rb] 
        , [[EmpIdB , EmpNameB , EmpSalB , EmpExperienceB , EmpKnowledgeB] | M ]) :- 
        length(EmpKnowledgeA , NA) 
        , length(EmpKnowledgeB , NB) 
        , NA =< NB 
        , merge6([[EmpIdA , EmpNameA , EmpSalA , EmpExperienceA , EmpKnowledgeA] | Ra] , Rb , M).
    
    % Counting Number Of Elements In List
    length([] , 0).
    length([H | T] , Length) :- length(T , Length1) , Length is Length1 + 1.

    % Getting Sum Of Salarys 
    sum([] , 0).
    sum([[_ , _ , Sal , _ , _] | TEmp] , Sum) :- sum(TEmp , Sum1) , Sum is Sum1 + Sal.
`;