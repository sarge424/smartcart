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
    let table = document.getElementById('itemtable');
	table.innerHTML = '';
	
	dataList.forEach(function(item) {
        var row = table.insertRow();

		for (var key in item) {
            if (item.hasOwnProperty(key)) {
                var cell = row.insertCell();
                cell.textContent = item[key];
            }
        }
    });
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
	
	items = await rawResponse.json();
	
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

refreshItems();
