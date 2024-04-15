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
        title.innerHTML = 'Cart No: '+key
        let table = document.createElement('table')
        table.classList.add('table', 'table-light','table-bordered')
        let thead=document.createElement('thead')
        let tbody=document.createElement('tbody')
        thead.classList.add('table-primary')
        let totalElement = document.createElement('button')
        totalElement.classList.add('btn', 'btn-primary', 'btn-disabled')
        let total = 0
        
        //for each item in that cart
        data.carts[key].forEach((item) => {
            
            row = document.createElement('tr')

            Object.keys(item).forEach((field) => {
                cell = row.insertCell()
                cell.textContent = item[field]
                if(field == 'total')
                    total += item[field]
            
            })
            tbody.append(row)
        })
        //table.innerHTML = cartno
        div.append(title)
        table.append(thead)
        table.append(tbody)
        div.append(table)
        totalElement.innerHTML = 'total: '+total
        div.append(totalElement)
        maindiv.append(div)
    })
}

inter = setInterval(datafetcher, 1000);