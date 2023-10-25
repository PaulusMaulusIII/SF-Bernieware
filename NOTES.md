# gen.js
## variables
	String[[]] fileList,
	String[[]] filteredFileList,
	String[] imgV,
	String[] imgH,
	HTMLElement filterSection,
	HTMLElement typeSelect,
	HTMLElement genderSelect,
	HTMLElement colorSelect,
	HTMLElement motiveSelect
## objects
### genCSV
#### methods
	parseCSV(String str) => String[[]],
	getCSV() => void,
		füllt fileList[]
	checkCSV(int column) => boolean,
	getMin(int column) => int,
	getMax(int column) => int
### filter
#### attributes
	boolean typeFilter = false,
	boolean genderFilter = false,
	boolean colorFilter = false,
	boolean motiveFilter = false,
	boolean priceFilter = false
#### methods
	init() => void,
	createFilters() => void,
	createTypeFilter() => void,
	createGenderFilter() => void,
	createColorFilter() => void,
	createMotiveFilter() => void,
	createPriceFilter() => void,
	createFilterElement(String filterType, String optContent, String type) => HTMLElement,
	createOptions(filterSelect, column) => void,
	filter() => void
### gen
#### methods
	gen() => void,
	del() => del
### sliders
#### methods
	init() => void,
	getVals() => int[]
## methods
	hover(Event evt) => void,
	exit(Event evt) => void
	window.onload() => void
		await genCSV.getCSV();
		filter.init();
		gen.gen();
# detail-view.js
## variables
	String[] interesting,
	String[] typeList,
	String[] colorList,
	String[] genderList
## objects
### detailCSV
#### methods
	parseCSV(String str) => String[[]],
	getCSV(int id) => void,
		füllt interesting[]
	checkCSV(int column, String[] list) => void
		füllt list[]
### detailGen
#### methods
	gen() => void,
	createOptions(int column, HTMLElement select, String[] list) => void,
	getElementIDByAttr(int column, String attr, String[] list) => int
## methods
	window.onload() => void
		const urlParams = new URLSearchParams(window.location.search);
		let id = urlParams.get("id");
		await detailCSV.getCSV(id);
		await detailGen.gen();
# wagen.js
## variables
	HTMLElement cartButton,
	HTMLElement cartPopup,
	HTMLElement clearCartButton,
	HTMLElement cartDisplay,
	HTMLElement closeButton,
	HTMLElement empty,
	String[[]] cartList
## classes
### cartItem
#### attributes
	int id,
	String type,
	String size,
	int amount,
	int price
#### methods
	constructor(int id, String type, String size, int amount, int price)
## objects
### userCart
#### attributes
	cartItem[] items
### cartCSV
#### methods
	parseCSV(String str) => String [[]],
	getCSV() => void
		füllt cartList[]
### cart
#### methods
	saveToLocalStorage() => void,
		speichert userCart als JSON in Cache
	loadFromLocalStorage() => void,
		lädt userCart.json aus dem Cache, wenn vorhanden
	add(int id, String type, String size, int price) => void,
	clear() => void,
		löscht userCart.json aus dem Cache
	display() => void
### popupCart
#### methods
	open() => void,
	close() => void
## code
	cartButton.addEventListener("mouseover", () => popupCart.open());
	cartPopup.addEventListener("mouseleave", () => popupCart.close());
	cartButton.addEventListener("click", () => popupCart.open());
	closeButton.addEventListener("click", () => popupCart.close());
	cart.loadFromLocalStorage();
# order.js
## variables
	HTMLElement orderPopup,
	HTMLElement orderButton,
	HTMLElement closeOrderPopup,
	HTMLElement items,
	HTMLElement sum
## methods
	displayOrder() => void
## code
	orderButton.addEventListener("click", () => {
		overlay.style.display = "block";
		orderPopup.style.display = "flex";
		cartPopup.style.display = "none";
		popup.style.display = "none";
		displayOrder();
	});

	closeOrderPopup.addEventListener("click", () => {
		overlay.style.display = "none";
		orderPopup.style.display = "none";
	});
# search.js
## variables
	HTMLElement openPopupButton,
	HTMLElement closePopupButton,
	HTMLElement overlay,
	HTMLElement popup,
	HTMLElement enter,
	HTMLElement searchbar
## code
	openPopupButton.addEventListener("click", () => {
		overlay.style.display = "block";
		popup.style.display = "flex";
	});

	closePopupButton.addEventListener("click", () => {
		overlay.style.display = "none";
		popup.style.display = "none";
	});

	overlay.addEventListener("click", () => {
		overlay.style.display = "none";
		popup.style.display = "none";
		orderPopup.style.display = "none";
	});

	enter.addEventListener("click", () => {
		window.location.href = "http://localhost/sub.html?search="+document.getElementById("searchbar").value;
	});

	searchbar.addEventListener("keypress", (evt) => {
		if (evt.code === "Enter") {
			window.location.href = "http://localhost/sub.html?search="+document.getElementById("searchbar").value;
		}
	});
# classes.js
## classes
### genCSV
#### methods
	parseCSV(String str) => String[[]],
	getCSV() => void,
		füllt fileList[]
	checkCSV(int column) => boolean,
	getMin(int column) => int,
	getMax(int column) => int
### filter
#### attributes
	boolean typeFilter = false,
	boolean genderFilter = false,
	boolean colorFilter = false,
	boolean motiveFilter = false,
	boolean priceFilter = false
#### methods
	init() => void,
	createFilters() => void,
	createTypeFilter() => void,
	createGenderFilter() => void,
	createColorFilter() => void,
	createMotiveFilter() => void,
	createPriceFilter() => void,
	createFilterElement(String filterType, String optContent, String type) => HTMLElement,
	createOptions(filterSelect, column) => void,
	filter() => void
### gen
#### methods
	gen() => void,
	del() => del
### sliders
#### methods
	init() => void,
	getVals() => int[]
### detailCSV
#### methods
	parseCSV(String str) => String[[]],
	getCSV(int id) => void,
		füllt interesting[]
	checkCSV(int column, String[] list) => void
		füllt list[]
### detailGen
#### methods
	gen() => void,
	createOptions(int column, HTMLElement select, String[] list) => void,
	getElementIDByAttr(int column, String attr, String[] list) => int
### cartItem
#### attributes
	int id,
	String type,
	String size,
	int amount,
	int price
#### methods
	constructor(int id, String type, String size, int amount, int price)
### userCart
#### attributes
	cartItem[] items
### cartCSV
#### methods
	parseCSV(String str) => String [[]],
	getCSV() => void
		füllt cartList[]
### cart
#### methods
	saveToLocalStorage() => void,
		speichert userCart als JSON in Cache
	loadFromLocalStorage() => void,
		lädt userCart.json aus dem Cache, wenn vorhanden
	add(int id, String type, String size, int price) => void,
	clear() => void,
		löscht userCart.json aus dem Cache
	display() => void
### popupCart
#### methods
	open() => void,
	close() => void
### order
#### attributes
HTMLElement orderPopup,
HTMLElement orderButton,
HTMLElement closeOrderPopup,
HTMLElement items,
HTMLElement sum
#### methods
	init() => void,
		orderButton.addEventListener("click", () => {
			overlay.style.display = "block";
			orderPopup.style.display = "flex";
			cartPopup.style.display = "none";
			popup.style.display = "none";
			displayOrder();
		});

		closeOrderPopup.addEventListener("click", () => {
			overlay.style.display = "none";
			orderPopup.style.display = "none";
		});
	displayOrder() => void
### search
#### attributes
	HTMLElement openPopupButton,
	HTMLElement closePopupButton,
	HTMLElement overlay,
	HTMLElement popup,
	HTMLElement enter,
	HTMLElement searchbar
#### methods
	init() => void
		openPopupButton.addEventListener("click", () => {
			overlay.style.display = "block";
			popup.style.display = "flex";
		});

		closePopupButton.addEventListener("click", () => {
			overlay.style.display = "none";
			popup.style.display = "none";
		});

		overlay.addEventListener("click", () => {
			overlay.style.display = "none";
			popup.style.display = "none";
			orderPopup.style.display = "none";
		});

		enter.addEventListener("click", () => {
			window.location.href = "http://localhost/sub.html?search="+document.getElementById("searchbar").value;
		});

		searchbar.addEventListener("keypress", (evt) => {
			if (evt.code === "Enter") {
				window.location.href = "http://localhost/sub.html?search="+document.getElementById("searchbar").value;
			}
		});