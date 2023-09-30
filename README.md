# SF-Bernieware
SF-Bernieware is a make-over of an old school online-shop into a newer, more modern and user-friendly version.
It is created without the use of any libaries, framework, or code from other coders.
OpenAI's ChatGPT was used in the making of SF-Bernieware, but it's usage does not exceed inspirational purposes and is almost exclusive to the CSS part of the project.

## To-Dos and corrections
- [ ] Improve filter logic to increase efficiency
- [ ] Improve filter logic to increase functionality
- [ ] Change file formats to next gen formats (aviv)
- [ ] Add alt to elements to increase accessebility
- [ ] Add comments so that the code could maybe even be understood a hour after writing
- [ ] Improve CSV functionality so that CSV only needs to be fetched once
- [ ] Work on caching
- [ ] Add search function for products (via attributes)
- [ ] Write descriptions for all products
- [ ] increase js efficiency by adding basic OOP
- [ ] Further develop detail-view of products
- [ ] Add shopping cart functionality (subpage AND hover)
- [ ] Add admin view
- [ ] Further develope and integrate size script
- [ ] Create an actual order form

## No-Longer-To-Dos
- [x] *The Basics*

## How does the code currently work?
The code is currently divided into HTML files for the basic structure of the website, CSS files for styling and JS files for funtionality, as well as a CSV file as a sort of offline read-only database.

  - **Current HTML files:**
    <details>
      <summary>
        <b>index.html:</b>
      </summary>
        <ul>
          <li>Homepage of the online shop.</li>
          <li>Contains selection of categories, about-us section, as well as details about the BRG.</li>
        </ul>

         <html>
           <header>
             <logo></logo><h1></h1><buttons></buttons>
           </header>
           <body>
             <categories></categories>
             <info></info>
             <details></details>
           </body>
          <footer>
            
          </footer>
        </html>
    
    </details>

    <details>
      <summary>
        <b>kleidung.html, praktisches.html and sonstiges.html:</b>
      </summary>
        <ul>
          <li>Subpages corresponding to the categories presented on the Homepage.</li>
          <li>Includes all products in the corresponding category, as well as filters.</li>
        </ul>

          <html>
            <header>
              <logo></logo><h1></h1><buttons></buttons>
            </header>
            <body>
              <filters></filters>
              <main>
                <products></products>
              </main>
            </body>
            <footer>
              
            </footer>
          </html>
    
    </details>
    <details>
      <summary>
        <b>einzel-ansicht.html:</b>
      </summary>
      <ul>
        <li>Currently only shows details about the product in single very rudimentary line of text.</li>
      </ul>

        <html>
          <header>
            
          </header>
          <body>
            <product-details>
              
            </product-details>
          </body>
          <footer>
            
          </footer>
        </html>
  
    </details>

  - **Current CSS files:**
      <details>
        <summary>
          <b>index.css:</b>
        </summary>
        <ul>
          <li>Currently gives styling info for index.html AND einzel-ansicht.html</li>
        </ul>

      ![image](https://github.com/PaulusMaulusIII/SF-Bernieware/assets/143496143/edcfcdbb-e897-4beb-811f-84d7007feaef)
      ![image](https://github.com/PaulusMaulusIII/SF-Bernieware/assets/143496143/4774c03b-af40-4600-885c-0714fb301a5a)

      </details>
      <details>
        <summary>
          <b>sub.css:</b>
        </summary>
        <ul>
          <li>Gives styling info for kleidung.html, praktisches.html and sonstiges.html</li>
        </ul>

      ![image](https://github.com/PaulusMaulusIII/SF-Bernieware/assets/143496143/39274584-6136-454e-95af-28030be93602)

      </details>

  - **Current JS files:**
      <details>
        <summary>
          <b>kleidung.js, praktisches.js and sonstiges.js:</b>
        </summary>
        <ul>
          <li>Give functionality to their corresponding HTML documents, only difference being the filters</li>
        </ul>

                                            ╷->  kleidung.html -<-╷   
                                    ╷---<---|         |           |
                     getCSV -> parseCSV -> gen -> apply -> del ->-╵
                        |                   ╵-------<-------╵
          database.csv->╵
                      
      </details>
      <details>
        <summary>
          <b>einzel-ansicht.js:</b>
        </summary>
        <ul>
          <li>Gives functionality to the corresponding HTML document</li>
        </ul>

              TO BE ADDED
        
      </details>

  - **The almigthy CSV file:**
      <details>
        <summary>
          <b>database.csv:</b>
        </summary>
        <ul>
          <li>This file is the result of very very <b>very</b> hard labour and includes all of the product available in the webshop, inlcuding all relevant details.</li>
        </ul>
  
     id | kategorie | artikel | geschlecht | hFarbe       | motiv   | aFarbe | groesse      | preis | pfad                    | beschreibung
     ---|-----------|---------|------------|--------------|---------|--------|--------------|-------|-------------------------|--------------
      1	| Kleidung	| Hoodie	| Unisex	   | Braun	      | Haende	| Rosa	 | S/M/L/XL/XXL	| 35€	  | Medien/Kleidung/Haende	| placeholder
      2	| Kleidung	| Hoodie	| Unisex	   | Dunkelblau	  | Haende	| Rosa	 | S/M/L/XL/XXL	| 35€	  | Medien/Kleidung/Haende	| placeholder
      3	| Kleidung	| Hoodie	| Unisex	   | Schwarz	    | Haende	| Rosa	 | S/M/L/XL/XXL	| 35€ 	| Medien/Kleidung/Haende	| placeholder
    ... | ...       | ...     | ...        | ...          | ...     | ...    | ...          | ...   | ...                     | ...

      </details>
