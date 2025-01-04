function formatPage() {
    var course = JSON.parse(localStorage.getItem("gttcourse") || "{}");
    if(course.name == null){
        $('#course_name').text("<NOT SET>");
        return;
    }
    $('#course_name').text(course.name);

    displayTable();
};

function resetTable() {
    var rounds = [];
    localStorage.setItem('gttrounds', JSON.stringify(rounds));
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

    var rounds = JSON.parse(localStorage.getItem("gttrounds") || "[]");
    rounds.sort(compareStableford);
    rounds.reverse();
    $.each(rounds, function (index, round) {
        addRoundToTable(round, index);
    });

    $('#current_table').show(500);
};

function setCoursePars(pars) {
    var psum_out = 0;
    var psum_in = 0;
    var rowContent = '<th>&nbsp</th><th>&nbsp</th><th class=\"cell-names hd\">par </th>';
    for (let i = 0; i < 9; i++) {
        var par = '&nbsp';
        if(pars.length >= 9){
            par = pars[i];
            psum_out += par;
        }
        rowContent += '<th class=\"cell-pts\">' + par + '</th>';
    }
    rowContent += '<th class=\"cell-pts hd red\">' + psum_out + '</th><th>&nbsp</th><th>&nbsp</th>';
    for (let i = 9; i < 18; i++) {
        var par = '&nbsp';
        if(pars.length >= 18){
            par = pars[i];
            psum_in += par;
        }
        rowContent += '<th class=\"cell-pts\">' + par + '</th>';
    }
    rowContent += '<th class=\"cell-pts hd red\">' + psum_in + '</th><th class=\"cell-pts hd red\">' + (psum_in + psum_out) + '</th><th>&nbsp</th><th>&nbsp</th>';
    $('#tt_pars').append(rowContent);
};

function addRoundToTable(round, index) {
    console.log('====> ' + JSON.stringify(round.stb));
    var psum_out = psum_in = 0;
    var rowContent = '<tr>';
    rowContent += '<td class=\"cell-names\">' + round.player + '</td>';
    rowContent += '<td class=\"cell-names\">' + round.hcp + '</td>';
    rowContent += '<td class=\"cell-names\">&nbsp</td>';

    var stb1 = 0;
    for (let i = 0; i < 9; i++) {
        rowContent += '<td class=\"cell-pts\">' + round.scores[i] + '</td>';
        psum_out += round.scores[i];
        stb1 += round.stb[i];
    }
    rowContent += '<td class=\"cell-pts hd red\">' + psum_out + '</td><td class=\"cell-pts hd red\">' + stb1 + '</td><td>&nbsp</td>';

    var stb2 = 0;
    for (let i = 9; i < 18; i++) {
        rowContent += '<td class=\"cell-pts\">' + round.scores[i] + '</td>';
        psum_in += round.scores[i];
        stb2 += round.stb[i];
    }
    rowContent += '<td class=\"cell-pts hd red\">' + psum_in + '</td><td class=\"cell-pts hd red\">' + stb2 + '</td><td class=\"cell-pts hd red\">' + (psum_in + psum_out) + '</td><td class=\"cell-pts hd red\">' + (stb1 + stb2) + '</td>';

    rowContent += '</tr>';
    $('#tt_body').append(rowContent);
};

function setCourseStrokes(strokes) {
    var rowContent = '<th>&nbsp</th><th>&nbsp</th><th class=\"cell-names hd\">strokes </th>';
    for (let i = 0; i < 9; i++) {
        var str = '&nbsp';
        if(strokes.length >= 9){
            str = strokes[i];
        }
        rowContent += '<th class=\"cell-pts\">' + str + '</th>';
    }
    rowContent += '<th>&nbsp</th><th>&nbsp</th><th>&nbsp</th>';
    for (let i = 9; i < 18; i++) {
        var str = '&nbsp';
        if(strokes.length >= 9){
            str = strokes[i];
        }
        rowContent += '<th class=\"cell-pts\">' + str + '</th>';
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

function calculateStableford(round) {
    var stb = [18];
    var course = JSON.parse(localStorage.getItem("gttcourse") || "{}");
    for (let i = 0; i < 18; i++) {
        var additionalStrokes = calculateAdditionalStrokes(round.hcp, round.scores[i], course.strokes[i]);
        var points = ((course.pars[i] + additionalStrokes) - round.scores[i]) + 2;
        if (points < 0){
            points = 0;
        }
        stb[i] = points;
    }
    return stb;
};

function calculateAdditionalStrokes(hcp, score, strokes) {
    if(hcp == 18){
        return 1;
    }
    if((hcp < 18) && (hcp >= strokes)){
        return 1;
    }
    if((hcp > 18) && ((hcp - 18) >= strokes)){
        return 2;
    }
    if((hcp > 18) && ((hcp - 18) < strokes)){
        return 1;
    }
    return 0;
};

function compareStableford(round_a, round_b) {
    var stb_a = stb_b = 0;
    var stb_f9_a = stb_f9_b = 0;
    var stb_l9_a = stb_l9_b = 0;
    var stb_l6_a = stb_l6_b = 0;
    var stb_l3_a = stb_l3_b = 0;

    for (let i = 0; i < 9; i++) {
        stb_f9_a += round_a.stb[i];
        stb_f9_b += round_b.stb[i];
    }
    for (let i = 9; i < 12; i++) {
        stb_l9_a += round_a.stb[i];
        stb_l9_b += round_b.stb[i];
    }
    for (let i = 12; i < 15; i++) {
        stb_l6_a += round_a.stb[i];
        stb_l6_b += round_b.stb[i];
    }
    for (let i = 15; i < 18; i++) {
        stb_l3_a += round_a.stb[i];
        stb_l3_b += round_b.stb[i];
    }

    if( stb_a > stb_b){
        return 1;
    }
    if( stb_a < stb_b){
        return -1;
    }

    if( (stb_l9_a + stb_l6_a + stb_l3_a) > (stb_l9_b + stb_l6_b + stb_l3_b) ){
        return 1;
    }
    if( (stb_l9_a + stb_l6_a + stb_l3_a) < (stb_l9_b + stb_l6_b + stb_l3_b) ){
        return -1;
    }

    if( (stb_l6_a + stb_l3_a) > (stb_l6_b + stb_l3_b) ){
        return 1;
    }
    if( (stb_l6_a + stb_l3_a) < (stb_l6_b + stb_l3_b) ){
        return -1;
    }

    if( (stb_l3_a) > (stb_l3_b) ){
        return 1;
    }
    if( (stb_l3_a) < (stb_l3_b) ){
        return -1;
    }
    return 0;
};