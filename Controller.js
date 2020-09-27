/**
 * This is a controller script for the web based spreadsheet
 */
const $ = ( a ) => document.querySelector( a ); // Jquery Style selector 
const $$ = ( a ) => document.querySelectorAll( a );

const tableHeadRow = $(".table-head");
const tableBody = $(".table-body");
const COLS = 27;
const ROWS = 50;
let sheet = {};
const main = () =>{
    // This function is loaded when the browser loads
    const addHeaderLabel = (heading)=>{
        const th = document.createElement("th");
        th.append(document.createTextNode(`${heading}`));
        tableHeadRow.append(th);
    }
    
    const headerLetterGenerator = (number) =>{
        // Since the charcode of A is 65, lets begin from here
        const start = 65; // Ascii code for A;
        const stop = 90; // Ascii code for Z;
        const payload = start + number;
        let stringBuilder = '';
        if (payload <= 90){
            stringBuilder += String.fromCharCode(payload);
        }else{

            // while(payload > 90){
            //     break;
            //      // TODO : GO beyond the scope of 26 columns
            // }
        }
        
        return stringBuilder;
    }
    const generateRow = (numberOfColumns, currentRowNumber) =>{
        
        const tr = document.createElement('tr');
        let i = numberOfColumns;
        const parser = new CommandParser();
        
        const onEntry = (event = null, input, keypressed = true) =>{
            const value = input.value.toUpperCase().replace(" ","");
            sheet[input.classList[0]] = value;
            parser.setFormula(value);
            parser.setSheet(sheet);
            if(event.keyCode == 13 || !keypressed){
                if(parser.isFormulaValid()){
                    const result = parser.execute()
                    input.value = result
                }
            }
        }
        while( --i > -1){
            const td = document.createElement('td');
            if( i != numberOfColumns -1 ){// Detecting the first Column of each row
                const input = document.createElement('input');
                input.classList.add( headerLetterGenerator( numberOfColumns - i - 2 ) + currentRowNumber  )
                input.addEventListener("keypress",ev => {
                    onEntry(ev, input);
                });

                input.addEventListener('blur', ev => {
                    onEntry(ev, input, false);
                });

                td.append(input);
            }else{
                const label = document.createElement('font');
                label.append(document.createTextNode(`${currentRowNumber}`))
                td.append(label);
            }
            tr.append(td);
        }
        tableBody.append(tr);
    }
    const init = () =>{
        for(let i = 0; i < COLS; i++){

            let hCell = headerLetterGenerator(i);
            addHeaderLabel(hCell);
          
        }
        for (let i = 0; i < ROWS; i++) {
            generateRow( COLS , i+1 );    
        }
        
    }
    init();
    
}


window.onload = main;