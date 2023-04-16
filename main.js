const root = document.querySelector(":root");
const container = document.querySelector("#container");

let element = 16;
let quadratoSize = 4;
//change element in css
root.style.setProperty("--element" , element);

let open = [];

let sudokuProvati = 0;

//creo tutti gli elementi
let listPiece = createAllElement(element);

loopSudoku(listPiece, element, quadratoSize)


function loopSudoku(listPiece, element, quadratoSize){
	//prendo una posizione a caso
	let min = listPiece[Math.floor(Math.random() * element)][Math.floor(Math.random() * element)];
	//con un numero a caso
	let number = Math.floor(Math.random() * element+1);
	//lo aggiungo agli open
	open.push(min)
	//prima volta chiamo il changeEntropy
	changeEntropy(min, number, listPiece, quadratoSize, element)

	while (true){
		//trovo il minimo se la lista non e' vuota ovviamente
		if (open.length > 0){
			min = open[findMin(open)];
		}else{
			break;
		}

		//numero tra 0 e 9 inclusi, tra i numeri del suo entropy
		number = min.entropy[Math.floor(Math.random() * min.entropy.length)];
		//numero = undefined quando il sudoku e' impossibile come e' in qeusto momento
		if (number == undefined){
			sudokuProvati+=1;
			removeElementHtml();
			open = [];
			listPiece = createAllElement(element)
			loopSudoku(listPiece, element, quadratoSize)

			return;
		}

		//setto il entropy
		changeEntropy(min, number, listPiece, quadratoSize, element)
	}
	//stampo il numero di prove prima di trovare questo sudoku
	console.log(sudokuProvati);
}

//rimuove tutti gli elementi di classe .elm
function removeElementHtml(){
    var allElement = document.querySelectorAll(".elm");
    for (elm of allElement) {
        container.removeChild(elm);
    }
}


//chiama tutte le funzioni per rimuovere il numero scelto da tutti gli elementi in riga, colonna e nel quadrato del numero
function changeEntropy(piece, number, listPiece, quadratoSize, element){
	//cambio il numero e rimuovo il numero dalla sua entropy
	piece.elm.innerHTML = number;
	//entropy = solo in numero
	piece.entropy = [number];
	removeOpen(open, piece)
	//trovo i vicini (row, colum e quadrato)
	let vicini = findVicini(listPiece, piece, element, quadratoSize);
	//tolgo il numero ai vicini
	changeViciniEntropy(vicini, number);
	//aggiungo i vicini alla lista open
	addOpen(vicini, open);
}

function addOpen(list, open){
	for (let i = 0; i < list.length; i++){
		//se c'e' gia' vado avanti
		if (list[i].open){
			continue;
		}
		open.push(list[i]);
		list[i].open = true;
	}
}

//chiamo tutti i vicini per rimuovere il numero dalla loro entropy
function changeViciniEntropy(vicini, number){
	for (let i = 0; i < vicini.length; i++){
		removeEntropy(vicini[i], number)
	}
}

//trova tutti quelli sulla riga e sulla colonna e sul suo quadrato e ritorna la lista
function findVicini(listPiece, piece, element, quadratoSize){
	let list = [];
	//prima la riga
	for (let x = 0; x < element; x++){
		if (piece.x == x){
			continue;
		}
		list.push(listPiece[piece.y][x]);
	}
	//poi la colonna
	for (let y = 0; y < element ; y++){
		if (piece.y == y){
			continue;
		}
		list.push(listPiece[y][piece.x]);
	}

	//infine il quadrato
	for (let y = Math.floor(piece.y / quadratoSize) * quadratoSize; y < Math.floor(piece.y / quadratoSize) * quadratoSize + quadratoSize; y++){
		for (let x = Math.floor(piece.x / quadratoSize) * quadratoSize; x < Math.floor(piece.x / quadratoSize) * quadratoSize + quadratoSize; x++){
			if (piece.x == x && piece.y == y){
				continue;
			}
			list.push(listPiece[y][x]);
		}
	}
	return list;
}

function removeOpen(list, piece){
	for (let i = 0; i < list.length; i++){
		if (list[i].x == piece.x && list[i].y == piece.y){
			list.splice(i, 1);
			return;
		}
	}
	console.log(piece.x, piece.y)
	console.log("errore")
}

function removeEntropy(piece, number){
	for (let i = 0; i < piece.entropy.length; i++){
		if (piece.entropy[i] == number){
			piece.entropy.splice(i, 1);
			return;
		}
	}
	// console.log("Errore entropy non trovata")
}




//trova l'elemento con il minimo numero di entropy nell'open list, return index contenente minimo
function findMin(list){
	let min = 0;
	for (let i = 0; i < list.length; i++){
		if (list[i].entropy.length < list[min].entropy.length){
			min = i;
		}
	}
	return min;
}


//crea tutti gli elementi, ritorna un 2d array con oggetti della classe piece, nElementi = element*element
function createAllElement(element){
	let listPiece = [];
	for (let y = 0; y < element; y++){
		let list = [];
		for (let x = 0; x < element; x++){
			//creo il piece
			let piece = new Piece(x, y, element);
			//creo l'elemento html
		    let newDiv = document.createElement("div");
			piece.elm = newDiv;
			piece.elm.classList.add("elm");
			container.appendChild(piece.elm);
			list.push(piece);
		}
		listPiece.push(list);
	}
	return listPiece;
}
