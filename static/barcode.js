// script.js file

lastTime = new Date().getTime()
items = []

function domReady(fn) {
	if (
		document.readyState === "complete" ||
		document.readyState === "interactive"
	) {
		setTimeout(fn, 1000);
	} else {
		document.addEventListener("DOMContentLoaded", fn);
	}
}


function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}


function fillTable(dataList) {
    const table = document.getElementById('itemtable');
    const head = document.createElement('thead');

	head.classList.add('table-primary')
	const headerRow = document.createElement("tr");
	table.innerHTML = '';
	
	['Name', 'Price', 'Quantity', 'Subtotal'].forEach((headerText) => {
		const headerCell = document.createElement("th");
		headerCell.textContent = headerText;
		headerCell.scope = 'col'
		headerRow.append(headerCell);
	});

	console.log(headerRow)
	head.append(headerRow)
	table.append(head)

	const tbody = document.createElement('tbody')
	dataList.forEach(function(item) {
        var row = document.createElement('tr')

		for (var key in item) {
            if (item.hasOwnProperty(key)) {
                var cell = row.insertCell();
                cell.textContent = item[key];
            }
        }

		tbody.append(row)
    });

	table.append(tbody)
}


async function refreshItems() {
	cartno = document.getElementById('cartno').name

	console.log(cartno)
	
	const rawResponse = await fetch('/items/'+cartno, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	});
	
	console.log('asdf');
	items = await rawResponse.json();
	console.log('got items', items);
	
	fillTable(items)

}


domReady(function () {

	// If found you qr code
	async function onScanSuccess(decodeText, decodeResult) {
		let d = new Date()
		let t = d.getTime()
		if(t - lastTime > 3000){
			lastTime = t
		}else{
			return
		}

		console.log("You scanned: " + decodeText, decodeResult);

		await fetch('/additem/', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'cartno': "" + cartno,
				'code': decodeText
			})
		});

		await refreshItems()
	}


	let htmlscanner = new Html5QrcodeScanner(
		"my-qr-reader",
		{ fps: 10, qrbos: 250 }
	);
	htmlscanner.render(onScanSuccess);
});

function setCheckoutLink(){
	const link = document.getElementById('checkoutbtn')
	console.log(link)
	link.href = '/checkout/' + document.getElementById('cartno').name
	console.log('link set successfully')
}

setCheckoutLink();
refreshItems();
