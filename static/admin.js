async function datafetcher() {
    const rawResponse = await fetch('/alldata', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	});

    data = await rawResponse.json();

    let maindiv = document.getElementById('carts')
    maindiv.innerHTML = ''

    Object.keys(data.carts).forEach((key) => {
        let title = document.createElement('h4')
        title.innerHTML = key
        let table = document.createElement('table')
        
        let totalElement = document.createElement('p')
        let total = 0
        data.carts[key].forEach((item) => {
            row = table.insertRow()

            Object.keys(item).forEach((field) => {
                cell = row.insertCell()
                cell.textContent = item[field]
                if(field == 'total')
                    total += item[field]
            })
        })
        //table.innerHTML = cartno
        maindiv.append(title)
        maindiv.append(table)
        maindiv.append(totalElement.innerHTML = 'total: '+total)
    })
}

setInterval(datafetcher, 1000);