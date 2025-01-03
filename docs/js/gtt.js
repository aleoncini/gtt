function formatPage() {
    var course = JSON.parse(localStorage.getItem("gttcourse") || "{}");
    if(course.name == null){
        $('#course_name').text("<NOT SET>");
        return;
    }

    $('#course_name').text(course.name);
    displayTable();

    var course = JSON.parse(localStorage.getItem("gttrounds") || "[]");
    if(course.name == null){
        $('#course_name').text("<NOT SET>");
        return;
    }

};

function resetTable() {
    var pars = [];
    localStorage.setItem('gttPars', JSON.stringify(pars));
    displayTable();
};

function displayTable() {
    $('#current_table').hide();
    $("#tt_pars").empty();
    $("#tt_strokes").empty();
    $("#tt_body").empty();

    var course = JSON.parse(localStorage.getItem("gttcourse") || "{}");
    setCoursePars(course.pars);
    setCourseStrokes(course.strokes);

//    $.each(trips, function (index, trip) {
//        addTripToTable(trip, index)
//    });

    $('#current_table').show(500);
};

function setCoursePars(pars) {
    var psum_out = 0;
    var psum_in = 0;
    var rowContent = '<th>&nbsp</th><th>&nbsp</th><th class=\"table-cell-centre-align\">par</th>';
    for (let i = 0; i < 9; i++) {
        var par = '&nbsp';
        if(pars.length >= 9){
            par = pars[i];
            psum_out += par;
        }
        rowContent += '<th class=\"table-cell-centre-align\">' + par + '</th>';
    }
    rowContent += '<th class=\"table-cell-centre-align\">' + psum_out + '</th><th>&nbsp</th><th>&nbsp</th>';
    for (let i = 9; i < 18; i++) {
        var par = '&nbsp';
        if(pars.length >= 18){
            par = pars[i];
            psum_in += par;
        }
        rowContent += '<th class=\"table-cell-centre-align\">' + par + '</th>';
    }
    rowContent += '<th class=\"table-cell-centre-align\">' + psum_in + '</th><th class=\"table-cell-centre-align\">' + (psum_in + psum_out) + '</th><th>&nbsp</th><th>&nbsp</th>';
    $('#tt_pars').append(rowContent);
};

function setCourseStrokes(strokes) {
    var rowContent = '<th>&nbsp</th><th>&nbsp</th><th class=\"table-cell-centre-align\">strokes</th>';
    for (let i = 0; i < 9; i++) {
        var str = '&nbsp';
        if(strokes.length >= 9){
            str = strokes[i];
        }
        rowContent += '<th class=\"table-cell-centre-align\">' + str + '</th>';
    }
    rowContent += '<th>&nbsp</th><th>&nbsp</th><th>&nbsp</th>';
    for (let i = 9; i < 18; i++) {
        var str = '&nbsp';
        if(strokes.length >= 9){
            str = strokes[i];
        }
        rowContent += '<th class=\"table-cell-centre-align\">' + str + '</th>';
    }
    rowContent += '<th>&nbsp</th><th>&nbsp</th><th>&nbsp</th><th>&nbsp</th>';
    $('#tt_strokes').append(rowContent);
};

function parseInput(parsString) {
    var pars = [];
    if(parsString.includes(".")){
        pars = parsString.split('.').map(Number);
    }
    if(parsString.includes(" ")){
        pars = parsString.split(' ').map(Number);
    }
    return pars;
};