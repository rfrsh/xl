//var xlc = {};
var calcCell = function (cell){
    //console.log('ddddddddddddddddddddddd');

    if (cell==undefined)return;
    if (cell.charAt(0) != "=")return;
    var value = cell.toUpperCase();

    //console.log(value);    console.log(cell);
    //var newValue = '=s1_A1-s1_B1-s1_C1-s1_D1'.substring(1);
    //value.lastIndexOf('=')
    //var newValue = value.substring(value.lastIndexOf('=')+1);
    var newValue = value.substring(1);
    if (newValue.length==0)return;

    //console.log(newValue);
    //console.log(value);
    var indexPlus = '+',indexMinus = '-', indexDev= '/', indexMult = '*';
    var i=0;
    var newValue1 = '';
    dodo: do {

        var foundPlus = newValue.indexOf(indexPlus);
        var foundMinus = newValue.indexOf(indexMinus);
        var foundDev = newValue.indexOf(indexDev);
        var foundMult = newValue.indexOf(indexMult);
        if (newValue.charAt(0) == "=") newValue = newValue.substring(1);
        ifif: if(foundPlus==-1&&foundMinus==-1&&foundDev==-1&&foundMult==-1){
            //var tt ='s1_'+(newValue);
            var tt1 = xl.dataObj[newValue];//localStorage[tt];
            tt1 = (tt1+'').toLocaleUpperCase();
            //console.log('IIIIIIII',tt1);
            if (tt1.charAt(0) == "=") {
                var adRecursion =  xl._calcCells(tt1);
                newValue1+=adRecursion;
                //console.log('TTTTTTTTTT',newValue1);
                // newValue=newValue.substring(foundPlus+1);
                break ifif;
            }

            for(var key1 in xl.dataObj){

                if(key1==newValue){
                    //console.log(xl.dataObj[key1]);
                    if(xl.dataObj[key1]==undefined)xl.dataObj[key1]=0;
                    //console.log(xl.dataObj[key1]);
                    newValue1+=xl.dataObj[key1];
                    break dodo;
                }

            }


            if(newValue.search(/^[A-Z]{1,4}\d{1,4}$/)!=-1){
                newValue=0;
                newValue1+=newValue;
                break dodo;
            }
            //if(xl.dataObj[key1]==undefined)xl.dataObj[key1]=0;
            newValue1+=newValue;
            break;
        }
        if(foundPlus==-1&&foundMinus==-1&&foundDev==-1&&foundMult==-1)break;



        //console.log(foundPlus,foundMinus);
        if(foundPlus == -1)foundPlus=100;
        if(foundMinus == -1)foundMinus=100;
        if(foundDev == -1)foundDev=100;
        if(foundMult == -1)foundMult=100;

        //console.log('----------');
        //console.log(newValue);
        //console.log(newValue1);
        forfor: if(foundPlus<foundMinus&&foundPlus<foundDev&&foundPlus<foundMult){
            //var tt ='s1_'+(newValue.substring(0,foundPlus));
            var tt1 = xl.dataObj[newValue.substring(0,foundPlus)];//localStorage[tt];
            tt1 = (tt1+'').toLocaleUpperCase();
            //console.log('IIIIIIII',tt1);
            if (tt1.charAt(0) == "=") {
                var adRecursion =  xl._calcCells(tt1);
                newValue1+=adRecursion+'+';
                //console.log('TTTTTTTTTT',newValue1);
                newValue=newValue.substring(foundPlus+1);
                break forfor;
            }

            for(var key2 in xl.dataObj){
                //console.log(xl.dataObj[key2]);

                if(xl.dataObj[key2]==undefined)xl.dataObj[key2]=0;
                //console.log(xl.dataObj[key2]);
                //var s2='s1_'+newValue.substring(0,foundPlus);
                if(key2==newValue.substring(0,foundPlus)){
                    newValue1+=xl.dataObj[key2]+'+';
                }


            }
            if(!isNaN(newValue.substring(0,foundPlus)))  {
                newValue1+=newValue.substring(0,foundPlus)+'+';
            }
            newValue=newValue.substring(foundPlus+1);
        }
        else if (foundMinus<foundPlus&&foundMinus<foundDev&&foundMinus<foundMult){
            //var tt ='s1_'+(newValue.substring(0,foundMinus));
            var tt1 = xl.dataObj[newValue.substring(0,foundMinus)];//localStorage[tt];
            tt1 = (tt1+'').toLocaleUpperCase();
            if (tt1.charAt(0) == "=") {
                var adRecursion =  xl._calcCells(tt1);
                newValue1+=adRecursion+'-';
                newValue=newValue.substring(foundMinus+1);
                break forfor;
            }

            for(var key3 in xl.dataObj){
                if(xl.dataObj[key3]==undefined)xl.dataObj[key3]=0;
                //var s3='s1_'+newValue.substring(0,foundMinus);
                if(key3==newValue.substring(0,foundMinus)){
                    //if(key3==(newValue.substring(0,foundMinus))){
                    newValue1+=xl.dataObj[key3]+'-';
                }
            }
            if(!isNaN(newValue.substring(0,foundMinus)))  {
                newValue1+=newValue.substring(0,foundMinus)+'-';
            }
            newValue=newValue.substring(foundMinus+1);

        }
        else if (foundMult<foundPlus&&foundMult<foundDev&&foundMult<foundMinus){
            var tt1 = xl.dataObj[newValue.substring(0,foundMult)];
            tt1 = (tt1+'').toLocaleUpperCase();
            if (tt1.charAt(0) == "=") {
                var adRecursion =  xl._calcCells(tt1);
                newValue1+=adRecursion+'*';
                newValue=newValue.substring(foundMult+1);
                break forfor;
            }

            for(var key4 in xl.dataObj){
                if(xl.dataObj[key4]==undefined)xl.dataObj[key4]=0;
                if(key4==newValue.substring(0,foundMult)){
                    newValue1+=xl.dataObj[key4]+'*';
                }
            }
            if(!isNaN(newValue.substring(0,foundMult)))  {
                newValue1+=newValue.substring(0,foundMult)+'*';
            }
            newValue=newValue.substring(foundMult+1);

        }
        else if (foundDev<foundPlus&&foundDev<foundMult&&foundDev<foundMinus){
            var tt1 = xl.dataObj[newValue.substring(0,foundDev)];
            tt1 = (tt1+'').toLocaleUpperCase();
            if (tt1.charAt(0) == "=") {
                var adRecursion =  xl._calcCells(tt1);
                newValue1+=adRecursion+'/';
                newValue=newValue.substring(foundDev+1);
                break forfor;
            }

            for(var key4 in xl.dataObj){
                if(xl.dataObj[key4]==undefined)xl.dataObj[key4]=0;
                //var s4='s1_'+newValue.substring(0,foundDev);
                if(key4==newValue.substring(0,foundDev)){
                    //if(key3==(newValue.substring(0,foundDev))){
                    newValue1+=xl.dataObj[key4]+'/';
                }
            }
            if(!isNaN(newValue.substring(0,foundDev)))  {
                newValue1+=newValue.substring(0,foundDev)+'/';
            }
            newValue=newValue.substring(foundDev+1);

        }
        else{}
        i++;



    }while(i<100)

    try {
        //console.log('EVAL',newValue1);
        //adRecursion =eval(newValue1);
        return eval(newValue1);


    } catch(err){
        //console.log('!!!!!',newValue1);
        return 'Error';

    }
    //return elm.value;

}