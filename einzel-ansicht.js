const parseCSV = (str) => {
    const arr = [];
    let quote = false;

    for (let row = 0, col = 0, c = 0; c < str.length; c++) {
        let cc = str[c], nc = str[c + 1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';

        if (cc == '"' && quote && nc == '"') {
            arr[row][col] += cc; ++c; continue;
        }

        if (cc == '"') {
            quote = !quote; continue;
        }

        if (cc == ',' && !quote) {
            ++col; continue;
        }

        if (cc == '\r' && nc == '\n' && !quote) {
            ++row; col = 0; ++c; continue;
        }

        if (cc == '\n' && !quote) {
            ++row; col = 0; continue;
        }
        if (cc == '\r' && !quote) {
            ++row; col = 0; continue;
        }

        arr[row][col] += cc;
    }
    return arr;
}

let arr,
    id;

fetch("http://localhost/database.csv")
    .then(response => response.text())
    .then((response) => {
        arr = (parseCSV(response));

        let interesting = arr.filter(function (value) { return value[0] == id; });

        console.log(interesting);
    })
    .catch(err => console.log(err));