(function(){
    {
        // Internal creator function to avoid "new" keyword upon creation
        let AffirmAprCalculator = function(apikey, promosobj)
        {
            return new AffirmAprCalculator.init(apikey, promosobj);
        };

        AffirmAprCalculator.init = function(apikey, promosobj)
        {
            this.apikey = apikey;
            this.data = {
                amount: 0,
                elements: [],
                promoIds: promosobj,
                receivedData: [],
                urls: []
            };

            // Run all init functions for the default input value.
            this.forceFullRun();

            Object.defineProperty(this, "amount", {
                get: () => { return this.data.amount * 2 },
                set: (val) => { this.data.amount = val * 2 }
            });
        };

        AffirmAprCalculator.prototype = {
            inputTimer: null,
            forceFullRun: function(){
                this.initListeners();
                this.buildAsLowAsEndpointRequest();
                this.sendRequestsSetDataAndCreateElements();
            },
            initListeners: function()
            {
                // Expects an element with the id "affirm-apr-calculator-input"
                let input = document.getElementById("affirm-apr-calculator-input")
                    ,   aprSelectors = document.querySelectorAll(".apr");

                try {
                    // Update amount based on default input value
                    this.data.amount = input.value.replace(/[.,]/g, "");
                    // Add the event listener to refresh the data
                    input.addEventListener("input", () => {
                        clearTimeout(this.inputTimer);
                        setTimeout(() => {
                            this.validateAndSetPrice(input.value);
                            this.buildAsLowAsEndpointRequest();
                            this.sendRequestsSetDataAndCreateElements();
                        }, 1000);
                    });

                    aprSelectors.forEach(selector => {
                        selector.addEventListener("click", () => {
                            for (let i = 0 ; i < aprSelectors.length; i++) {
                                aprSelectors[i].classList.remove("active");
                                aprSelectors[i].querySelector("input[name='interest']").checked = false;
                            }
                            selector.classList.add("active");
                            selector.querySelector("input[name='interest']").checked = true;
                            this.appendHTMLElementsToContainer();
                        })
                    });
                }

                catch (error) {
                    console.error("Unable to locate 'affirm-apr-calculator-input'. Unable to update price.");
                }
            },

            buildAsLowAsEndpointRequest: function()
            {
                // NOTE: clear URLs array upon every build
                let promos = this.data.promoIds
                    ,   urls = this.data.urls = []
                    ,   totalCounter = 0;

                // Build URLs array for "As Low As" API Endpoint
                for (let key in promos)
                {
                    for (let i = 0; i < promos[key].length; i++)
                    {
                        // Ensure input is an array filled with strings. If a value isn't a string then do not include it.
                        if ((promos[key]).constructor !== Array || (promos[key][i].constructor !== String))
                        {
                            console.error("Expected an array filled with strings. Excluding: " + promos[key] + " from the requests.");
                            break;
                        }
                        // Otherwise build url and push into the array
                        urls[totalCounter] = "https://affirm.com/api/v2/promos/v2/"
                            + this.apikey
                            + "?promo_external_id="
                            + promos[key][i]
                            + "&amount="
                            + this.data.amount;

                        // Counter to traverse all array within object
                        totalCounter++;
                    }
                }
            },

            validateAndSetPrice: function(price)
            {
                // Looking for X,XXX.XX
                // TODO: allow merchant to pass custom regexp

                let regexp = /^([0-9]|,)+(\.[0-9]{2}$)*/;
                // Set the desired price based on a valid input. Otherwise set it to 0.
                this.data.amount = regexp.test(price)
                    ? String.prototype.replace.call(price, /[.,]/g, "")
                    : 0
            },

            sendRequestsSetDataAndCreateElements: function()
            {
                let urls = this.data.urls;
                // Set receivedData Array.length to urls size for matching/ordering needs
                let responseData = this.data.receivedData = Array(urls.length);

                // Send each request and assign response based on array position
                for (let i = 0; i < urls.length; i++)
                {
                    // Extract promo ID from URL. Expects specific promo format.
                    let promo = (/(?:promo_external_id=promo_set_alaonly_[0-9]+[A-Za-z]_)(.*)(?:_[A-Za-z]+&)/).exec(urls[i])[1];

                    fetch(urls[i])
                        .then(response => {
                            return response.json();
                        })
                        .then((json) => {
                            let tagline = json.promo.tagline;

                            // Extract specific information from tagline string.

                            let apr = tagline.match(/(?:\s)([0-9]+)(?:%\s*)/)[1].trim()
                                ,   term = tagline.match(/(\s[0-9]+\s)(?:months\.)/)[1].trim()
                                ,   perMonth = tagline.match(/(?:\$)([0-9.,]+)(?:\/mo)/)[1].trim().replace(/,/g, "")
                                ,   total = (parseInt(term) * parseInt(perMonth)).toFixed(2);

                            // Generate response data object. Attach to object for record keeping.
                            responseData[i] = {
                                gid: promo,
                                apr: apr,
                                term: term,
                                perMonth: perMonth,
                                total: total
                            };

                            // Example:
                            // GID: apr10
                            // APR: 10
                            // TERM: 12
                            // PERMONTH: 123.45
                            // TOTAL: 12345.67

                            // Generate HTML Element. Attach to object for record keeping.
                            this.data.elements[i] = this.createHTMLElementWithReferenceData(responseData[i]);

                        }).catch(error => {
                        console.error("There was an error with a request. Error -> " + error.message);
                    });
                }
            },

            createHTMLElementWithReferenceData: function(data)
            {
                // Create element with "term" class for styling & add custom object to el object
                try {
                    let el = document.createElement("div");
                    el.classList.add("term");

                    el._affirmAprCalculatorData = data;

                    el.innerHTML =
                        '<div class="term-display">' +
                        '  $<span class="term-pricing"><b>' + data.perMonth + '</b></span>/mo for ' +
                        '<span class="term-months"><b>' + data.term + '</b></span> months' +
                        '</div>\n' +
                        '<div class="d-none">\n' +
                        '  <div class="d-inline pr-2 mr-1">' +
                        '    Total $<span class="term-total"><b>' + data.total + '</b></span>' +
                        '  </div>\n' +
                        '  <div class="d-inline pl-2 ml-1">' +
                        '    Interest $<span class="term-interest"><b>' + data.apr + '</b></span>' +
                        '  </div>\n' +
                        '</div>\n';

                    return el;
                } catch (error) {
                    console.error("There was an error creating an element. Error -> " + error.message);
                }

            },

            appendHTMLElementsToContainer: function()
            {
                let container = document.getElementById("terms")
                    , selectedApr = document.querySelector("input[name='interest']:checked").value;

                container.innerText = "";

                let elements = this.data.elements.filter(el => {
                    return el._affirmAprCalculatorData.gid === selectedApr;
                });

                for (let el in elements) {
                    container.appendChild(elements[el]);
                }
            }
        };

        AffirmAprCalculator.init.prototype = AffirmAprCalculator.prototype;
        window.AffirmAprCalculator = AffirmAprCalculator;
    }
})();
