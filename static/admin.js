async function datafetcher() {
    const rawResponse = await fetch('/alldata', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	});

    data = await rawResponse.json();

    console.log(data)

    let maindiv = document.getElementById('carts')
    maindiv.classList.add('container-fluid')
    maindiv.innerHTML = ''

    //for each cart in carts
    Object.keys(data.carts).forEach((key) => {
        let div = document.createElement('div')
        div.classList.add('container')

        let title = document.createElement('h4')
        title.innerHTML = key
        let table = document.createElement('table')
        table.classList.add(['table', 'table-light'])

        let totalElement = document.createElement('p')
        let total = 0
        
        //for each item in that cart
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
        div.append(title)
        div.append(table)
        div.append(totalElement.innerHTML = 'total: '+total)
        maindiv.append(div)
    })
}

setInterval(datafetcher, 1000);