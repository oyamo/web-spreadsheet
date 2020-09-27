

class CommandParser{
    
    // Initialise the parser
    constructor () {
        this.sheet = {};
        this.tokens = [
            "SUM",
            "PRODUCT",
            "DIFFERENCE",
            "AVG",
        ]
        this.operation = null;
        this.formula = null;
        this.expression = null;
    }
    setSheet(sheet){
        this.sheet = sheet;
    }
    // Set a formula 
    setFormula( formula ){
        this.formula = formula;
    }
    
    // test if the formula is valid
    isFormulaValid() {
        let re = /=(SUM|PRODUCT|DIFFERENCE|AVG)?(\(|\d|\w|-).*/g;
        return this.formula.match(re) != null;
    }
    
    // Excecute the formula
 
    execute(){
        
        if(this.isFormulaValid()){
            const operationMatch  = this.formula.match(/(SUM|PRODUCT|DIFFERENCE|AVG)/g);
            const expressionMatch =  this.formula.match(/=(SUM|PRODUCT|DIFFERENCE|AVG)\((.*)\)/);
            // get the expression
            // The expression is the string that is going to be evaluated
            if(expressionMatch == null){
                this.expression = this.formula.substring(1);
            }else if(expressionMatch.length >= 3){
                this.expression = expressionMatch[expressionMatch.length-1];
            }else{
                return "Expression Invalid";
            }
            this.operation = operationMatch[0] || "ARITHMETIC"
            // let us deal with mathematical expressions first
            console.log(this.operation)
            switch(this.operation){
                case "ARITHMETIC":
                    /**
                     * Search for cells, operators and numbers
                     * For now what is important are the cells are 
                     */
                    let cells = this.expression.match(/([A-Z][0-9]+)/g);
                    // replace the value in the cells by referencing the sheet
                    if(cells != null){
                        console.log(cells)
                        const cellVal = cells.map(v=>this.sheet[v] || 0);
                        for(let i =0; i < cells.length ; i++){
                            this.expression = this.expression.replace(cells[i], cellVal[i])
                        }
                    }

                    try{
                        console.log(this.expression)
                        return eval(this.expression);
                    }catch(e){
                        return "ERR";
                    }
                    break;
                case "SUM":
                    // Let us deal with a range
                    const sumPayload = this._parseRange() || this._parseCommas();
                
                    if(sumPayload != null){
                        let sum = 0;
                        for (const key in sumPayload) {
                            if (sumPayload.hasOwnProperty(key)) {
                                const dat =Number( sumPayload[key] );
                                sum += dat
                            }
                        }
                        return sum;
                    }
                    break;
                case "PRODUCT":
                    const prodPayload = this._parseRange() || this._parseCommas();
            
                    if(prodPayload != null){
                        let product = 1;
                        for (const key in prodPayload) {
                            if (prodPayload.hasOwnProperty(key)) {
                                const dat =Number( prodPayload[key] );
                                product *= dat
                            }
                        }
                        return product;
                    }
                    break;
                case "AVG":
                    const avgPayload = this._parseRange() || this._parseCommas();
                
                    if(avgPayload != null){
                        let sum = 0;
                        for (const key in avgPayload) {
                            if (avgPayload.hasOwnProperty(key)) {
                                const dat =Number( avgPayload[key] );
                                sum += dat
                            }
                        }
                        return sum / avgPayload.length;
                    }
                    break;
                case "DIFFERENCE":
                    const diffPayload = this._parseRange() || this._parseCommas();

                    if(diffPayload != null){
                        let difference = diffPayload[0];
                        for (const key in diffPayload) {
                            if (diffPayload.hasOwnProperty(key)) {
                                const dat = Number( diffPayload[key] );
                                difference -= dat
                            }     
                        }
                        return difference;
                    }
                    break;
            }
           
        }


    }
    // Parse expressions in a range eg A1:A50
    _parseRange(){
        let range = this.expression.match(/([A-Z][0-9]+):([A-Z][0-9]+)/g)
        if(range != null){
            let [start, stop ] = range[0].split(":").map(
                v => [v.charCodeAt(0) - 64, parseInt(v.substring(1))]
            );
            let [startCol, startRow] = start;
            let [stopCol, stopRow] = stop;
            console.log(`${startCol}${startCol}`)
            /**
             * Now let us parse the shape of the range
             * The shape may be either vertical, horizontal or span
             * Span shape means the shape is neither vertical or horizontal but covers many rows and columns
             * 
             */       
            // Vertical shape means the diference between startCol and and stopCol is zero
            // The difference between startRow and stopRow is zero
            if(stopCol - startCol == 0 && stopRow - startRow > 0){
                // Vertical Shape
                // let us loop vertically and get all the cells in that range
                let cells = [];
                for(let i = startRow; i < stopRow + 1; i++){
                    const generatedCell = `${String.fromCharCode( startCol + 64 ) + i}`;
                    cells.push(this.sheet[ generatedCell ] || 0);

                }
                return cells;
            }else if(stopCol - startCol != 0 && stopRow - startRow == 0){
               
                // Horizontal
                let cells = [];
                console.log(start)
                for(let i = startCol; i < stopCol + 1; i++){
                    const generatedCell = `${String.fromCharCode( i + 64 ) + startCol}`;
                    console.log(generatedCell)
                    cells.push(this.sheet[ generatedCell ] || 0);
                }
               
                return cells;
            }else if(stopCol - startCol != 0 && stopRow - startRow != 0){
                
            }
            console.log(this.expression);
            return null;

        }else{
            console.log('No range specified')
        }
    }
    //Parse expressions delimited by commas eg  A1,90,92,B3
    _parseCommas(){
        let cells = this.expression.match(/([A-Z][0-9]+)/g);
        if(cells != null){
            console.log(cells)
            const cellVal = cells.map(v=>this.sheet[v] || 0);
            for(let i =0; i < cells.length ; i++){
                this.expression = this.expression.replace(cells[i], cellVal[i])
            }
        }
        return this.expression.split(",");
    }

}