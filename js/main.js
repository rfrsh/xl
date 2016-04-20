var xl = {};
xl._calcCells=calcCell;

xl.rowCount = 45;
xl.cellCount = 25;
xl.dataObj = {};

xl.init = function(){
    xl._getData();
    xl._generateTable();
   // xl._getLocalStorageValues();
   // xl._setLocalStorageValues();
    window.addEventListener('scroll',xl._addRowsAndCells);
    var table = document.querySelector('.main-table');
    table.addEventListener('click',xl._tdClick);
}

xl._getData = function() {
    if(localStorage['dataObj']){
        xl.dataObj = JSON.parse(localStorage['dataObj']);
    }

    //{A1:5, A2:5,B77:88,AC3:'ss'};
//{"A1":"1","A2":"50","B77":"88","AC3":"ss","C3":"9","D6":"=1+9","D3":"=a1*a2","E3":"=d3+3","F4":"=e3+a1","E6":"=dsd","A4":"7","A5":"3","B5":"=a4+a5+3","G7":"69","H4":"=g1+g7","H8":"00yy"}
    else {
        var testObj;
        xl._getJSONData('http://rangebag.org/getJson.php', function (data) {
            xl.dataObj = data;
            //console.log('test11', xl.dataObj);
        });
    }
}

xl._tdClick = function (e){
    if(e.target.localName=='td') {
        var td = e.target;
        //console.log(td.parentElement.rowIndex);
        var lett = document.querySelectorAll('div[data-name="trow"] div')[td.cellIndex];
        lett.classList.add("cell-selected");
        var numm = document.querySelectorAll('div[data-name="tcol"] div')[td.parentElement.rowIndex];
        numm.classList.add("cell-selected");

        var input = document.createElement('input');
        input.setAttribute("type", "text");
        //input.setAttribute("autofocus","true");

        var cell = td.getAttribute('data-cell');
        if (xl.dataObj[cell] != undefined)input.value = xl.dataObj[cell];
        td.innerHTML = '';
        td.appendChild(input);
        input.focus();

        if (input.value != undefined) {
            var highlighting = input.value.substring(1).split(/\+|\*|\/|-/);
            //console.log(highlighting);
            for (var l=0;l< highlighting.length;l++){
                var hi = "td[data-cell="+'"'+highlighting[l].toUpperCase()+'"]';
                var hil = document.querySelector(hi);
                if(hil!=null) hil.classList.add("formula-selected");
                    }
        }
        var h11;
        input.oninput = function (e) {
           var highlighting;
           //console.log(highlighting);
           if(h11!=undefined) {
               console.log('rrrr');
               for (var l = 0; l < h11.length; l++) {
                   var hi = "td[data-cell="+'"'+h11[l].toUpperCase()+'"]';
                   var hi2 = document.querySelector(hi);
                   if (hi2 != null) hi2.classList.remove("formula-selected");
               }
           }

            if (input.value != undefined) {
               highlighting = input.value.substring(1).split(/\+|\*|\/|-/);
                //console.log(highlighting);
                for (var l=0;l< highlighting.length;l++){
                    var hi = "td[data-cell="+'"'+highlighting[l].toUpperCase()+'"]';
                    var hi2 = document.querySelector(hi);
                    //console.log(hi);
                    //console.log(hil);

                    if(hi2!=null) hi2.classList.add("formula-selected");

                }
                //console.log('ddddd');
            }
           h11=highlighting;
           //console.log('gg',highlighting);

        }

        input.onblur = function (e) {
            lett.classList.remove("cell-selected");
            numm.classList.remove("cell-selected");
            if (xl.dataObj[cell] != undefined) {
                for (var l = 0; l < highlighting.length; l++) {
                    var hi = "td[data-cell=" + '"' + highlighting[l].toUpperCase() + '"]';
                    var hil = document.querySelector(hi);
                    var hi2 = document.querySelector(hi);
                    if (hil != null) hil.classList.remove("formula-selected");
                    if (hil != null) hil.classList.remove("formula-selected");

                }
            }
            // alert('dd');

            if(e.target.value!='') {
                xl.dataObj[cell] = e.target.value;
                localStorage.setItem("dataObj", JSON.stringify(xl.dataObj));
    

                xl._setJSONData('http://rangebag.org/setJson.php',xl.dataObj);
            }

            if(e.target.value!=undefined){
                if (e.target.value.charAt(0) == "=") td.innerHTML = xl._calcCells(e.target.value);
                else td.innerHTML=e.target.value;
            }
           // td.innerHTML=e.target.value;
            xl._updateTDs();

        }

    }

}
xl._updateTDs = function (){
    for (var key in xl.dataObj){
            if (String(xl.dataObj[key]).charAt(0) == "=") {
                //console.log(xl.dataObj[key]);
                var tt = 'td[data-cell="'+key+'"]';
                var td =document.querySelector(tt);
                //console.log(td1);

                if(td!=null)td.innerHTML = xl._calcCells(xl.dataObj[key]);
            }
    }
}


xl._addRowsAndCells = function () {

    var trCount = document.querySelectorAll('[data-name="tcol"] div');
    //console.log('trCount',trCount.length);
    var tdCount = document.querySelectorAll('[data-name="trow"] div');
    //console.log('tdCount',tdCount.length);

    var y = window.pageYOffset + window.innerHeight;
    if(y >= document.body.scrollHeight){
        var divTNum = document.querySelector('div[data-name="tcol"]');
        var fragmentNum = document.createDocumentFragment();
        for(var t=0; t<10;t++) {
            var divNum = document.createElement('div');
            divNum.innerHTML = trCount.length+t;
            fragmentNum.appendChild(divNum);
        }
        divTNum.appendChild(fragmentNum);

        var tableBody = document.querySelector('.main-table tbody');
       // var fragmentRows = document.createDocumentFragment();
        for(var i=0;i<10;i++){
            var tableRow1 = tableBody.insertRow(-1);
            for(var k=0; k<tdCount.length;k++){
                var tableCell1 = tableRow1.insertCell(-1);
                var cellValue = ''+xl._numToLet(k)+ (trCount.length+i);
                tableCell1.setAttribute('data-cell', cellValue);
                //if(xl.dataObj[cellValue]!=undefined)tableCell1.innerHTML=xl.dataObj[cellValue];


                if(xl.dataObj[cellValue]!=undefined){
                    if (String(xl.dataObj[cellValue]).charAt(0) == "=") tableCell1.innerHTML = xl._calcCells(xl.dataObj[cellValue]);
                    else tableCell1.innerHTML=xl.dataObj[cellValue];
                }
            }

        }
        //tableBody.appendChild(fragmentRows);



    }

    var x = window.pageXOffset + window.innerWidth;
     if(x >= document.body.scrollWidth) {

         var divTLet = document.querySelector('div[data-name="trow"]');
         var divTLet1 = document.querySelector('div[data-name="tcol-table"]');
         divTLet.style.width =x+3.5*80+"px";
         divTLet1.style.width = x+3.5*80+"px";
         //divTLet.style.width = document.body.scrollWidth+"px";
         //divTLet1.style.width = document.body.scrollWidth+"px";

         var fragmentLet = document.createDocumentFragment()
            for(var j=0; j<5;j++) {
                var divLet = document.createElement('div');
                divLet.innerHTML = xl._numToLet(tdCount.length+j);
                fragmentLet.appendChild(divLet);
            }
            divTLet.appendChild(fragmentLet);
         divTLet.style.width = document.body.scrollWidth+"px";
         divTLet1.style.width = document.body.scrollWidth+"px";


         var theadTrs = document.querySelectorAll('.main-table tbody tr');


             for(var k=0; k<trCount.length-1;k++){
                 for(var i=0;i<5;i++){
                 var tableCell3 = theadTrs[k].insertCell(-1);

                 var cellValue = ''+xl._numToLet(tdCount.length+i)+ (k+1);
                 tableCell3.setAttribute('data-cell', cellValue);
                 //if(xl.dataObj[cellValue]!=undefined)tableCell3.innerHTML=xl.dataObj[cellValue];

                     if(xl.dataObj[cellValue]!=undefined){
                         if (xl.dataObj[cellValue].charAt(0) == "=") tableCell3.innerHTML = xl._calcCells(xl.dataObj[cellValue]);
                         else tableCell3.innerHTML=xl.dataObj[cellValue];
                     }


             }

         }

    }


}

xl._numToLet = function(n){
    var r = '';
    for(; n >= 0; n = Math.floor(n / 26) - 1) {
        r = String.fromCharCode(n%26 + 0x41) + r;
    }
    return r;
}


xl._generateTable = function(){
    var mainTable = document.createElement('table');
    mainTable.className = 'main-table';
    var divTable = document.querySelector('div[data-name="table"]');
    var tableBody = document.createElement('tbody');
    mainTable.appendChild(tableBody);
    var tableHeader = mainTable.createTHead();
    var tableRow = tableHeader.insertRow(0);

    var divTLet = document.querySelector('div[data-name="trow"]');
    var fragmentLet = document.createDocumentFragment()
    for(var j=0; j<xl.cellCount;j++) {
        var divLet = document.createElement('div');
        divLet.innerHTML = xl._numToLet(j);
        fragmentLet.appendChild(divLet);
    }
    divTLet.appendChild(fragmentLet);

    var divTNum = document.querySelector('div[data-name="tcol"]');
    var fragmentNum = document.createDocumentFragment();
    for(var t=0; t<=xl.rowCount;t++) {
        var divNum = document.createElement('div');
        if(t==0) divNum.innerHTML = '@';
        else divNum.innerHTML = t;
        fragmentNum.appendChild(divNum);
    }
    divTNum.appendChild(fragmentNum);


    for(var i=0;i<xl.rowCount;i++){
        var tableRow1 = tableBody.insertRow(-1);
        for(var k=0; k<xl.cellCount;k++){
            var tableCell1 = tableRow1.insertCell(-1);
            var cellValue = ''+xl._numToLet(k)+ (i+1);
            tableCell1.setAttribute('data-cell', cellValue);
            if(xl.dataObj[cellValue]!=undefined){
                if (String(xl.dataObj[cellValue]).charAt(0) == "=") tableCell1.innerHTML = xl._calcCells(xl.dataObj[cellValue]);
                else tableCell1.innerHTML=xl.dataObj[cellValue];
            }
        }

    }
    divTable.appendChild(mainTable);
    console.log('generateTable');
}

xl._getJSONData = function (path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {

            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
                console.log('data',data);

            }
        }
    };
    httpRequest.open('GET', path, false);
    httpRequest.send();

}

xl._setJSONData = function(url, data) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var sendd = 'jsonData='+encodeURIComponent(JSON.stringify(data));
    xmlhttp.send(sendd);
}

xl.init();














