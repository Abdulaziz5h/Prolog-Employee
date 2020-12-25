var session = pl.create();


$('button').on('click', () => {
    session.consult(`
        :- use_module(library(dom)).
        likes(sam, salad).
        likes(dean, pie).
        likes(sam, apples).
        likes(dean, whiskey).
    `, {
        success: function() { 
            session.query("likes(sam, X).", {
                success: function(goal) { 
                    session.answer({
                        success: function(answer) {
                            console.log(session.format_answer(answer)); // X = salad ;
                            session.answer({
                                success: function(answer) {
                                    console.log(session.format_answer(answer)); // X = apples ;
                                },
                            });
                        },
                        fail: function() { /* No more answers */ },
                        error: function(err) { /* Uncaught exception */ },
                        limit: function() { /* Limit exceeded */ }
                    });
                },
                error: function(err) { console.log(err) }
            });
        },
        error: function(err) { /* Error parsing program */ }
    });
})