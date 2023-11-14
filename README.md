# SF-Bernieware

*School project to create a modern webshop*

*by Sven Eichelberg, Henrik L. Hermann und Paul Schröder*

## WHAT IS SF-Bernieware

SF-Bernieware is the renewal of the old redundant BRG webshop under the managment of the school firm Bernieware.  The goal is to create a functional, modern, intuitive webshop using only pure HTML, CSS, JS. The limitations are:

* Avoiding **over-useage of HTML div elements**
* Using **only let** type variables
* Using **only arrow functions**
* Only using **AI when reasonable**

## HOW THE PROJECT CURRENTLY FUNCTIONS

SF-Bernieware currently is a full stack consisting of a standard front end, composed of HTML sites, styled using CSS and given functionality using standard JS and a node.js based back end.

To save the available products, the known users and the orders we used CSV,TSV and generic .list files.

### HTML

* #### index.html
  Main site containing all categories of products available and all information about Bernieware, as well as the school contact details.
* #### sub.html
  Shows all products matching the selected category or search query and filters. Depending on the amount of unique product properties allows for filtering by:
  * type
  * fit
  * main color
  * motive
  * price range
* #### detail-view.html
  Shows the details of the selected products, foremost the description. Also allows for switching to related products.
* #### admin-view.html
  WIP

### CSS

* #### detail-view.css
  Defines how the detail view of each product should be styled
* #### index.css
  Defines how the main page should be styled
* #### shared.css
  Supplies styling information, that all pages have in common, is referenced in all other CSS sheets
* #### sub.css
  Defines how the overview should be styled

### JS

* #### admin.js
  WIP
* #### cart.js
  Allows for user to add, remove, clear all and display items in their virtual shooping cart. Opens on PC by hovering over the icon, on mobile devices with a tap to the icon.
* #### dark-mode.js
  Checks the user preferences of the device if dark mode is selected, if so, changes CSS root variables depending on state.
* #### detail-view.js
  Fetches the information about the selected product from the CSV and fills it into the webpage, also checks for similar products, which the user is able to select.
* #### gen.js
  Fetches all products from the CSV and fills the page with them. Also checks for available filters and possible filter values, dynamically creating the filters depending on the contents of the CSV.
* #### index.js
  Fetches the available categories and their images from the node.js back end to dynamically create the category selection field on the page.
* #### order.js
  Allows the user to submit an order through a form, which is then sent to the node.js back end using POST to be handled there.
  Also dynamically generates a table from the contents of the cart.
  Can be accessed by tapping the green button in the cart pop-up.
* #### search.js
  Allows the user to search by passing the search term to the gen.js script and displaying the fetched products on a sub.html. Can be accessed by clicking on the magnifying glass icon.

### DATA STORAGE

* #### database.csv
  Stores all products as a simple table sorted by ID.

  | ID  | CATEGORY | TYPE   | FIT    | MAIN COLOR | MOTIVE | ACCENT COLOR | AVAILABLE SIZES | PRICE | IMAGE LOCATION          | DESCRIPTION | BACKSIDE |
  | --- | -------- | ------ | ------ | ---------- | ------ | ------------ | --------------- | ----- | ----------------------- | ----------- | -------- |
  | 1   | Kleidung | Hoodie | Unisex | Rot        | Hände  | Blau         | XS/S/M/L/XL/XXL | 35€   | Medien/Kleidung/Haende/ | ...         | j        |
* #### orders.tsv
* #### users.list

### NODE.JS

* #### POST_handler.js

## THE VISION AND WHAT'S (PROBABLY) TO COME

### ISSUES

  For features currently in development or to be developed in the near future see the <a style = "color: white; " href = "https://github.com/PaulusMaulusIII/SF-Bernieware/issues">***GitHub issues section***</a>

### THE VISION

  SF-Bernieware seeks to be modern, intuitive, inclusive and efficient. The usage should be easy for each and every user and also for the admin. This should be achieved through a intuitive GUI for browsing, filtering and ordering **and** for adding new products, as well as viewing orders created by the shoppers. This could and may in the future even be achieved through a BernieWare admin Android/IOS Application, or *at least* a Web applet.
