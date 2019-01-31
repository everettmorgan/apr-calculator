// Merchant Options
const options = {
    key: API_KEY,
    promos: {
        promo10: [
            PROMO_ID,
            PROMO_ID,
            PROMO_ID
        ],
        promo20: [
            PROMO_ID,
            PROMO_ID,
            PROMO_ID
        ],
        promo30: [
            PROMO_ID,
            PROMO_ID,
            PROMO_ID
        ]
    }
};

// Affirm APR Calc Setup
let urls = [],
    valid_input = true,
    typing_timer = undefined,
    int_amount = Number;

// Sets up event listeners and runs initial request
window.onload = function() {
    'use strict';
    build_requests();
    fetch_affirm_data();

    // Adds eventListeners to els
    document.querySelectorAll('.apr').forEach(function(apr) {
        apr.addEventListener("click", function() {
            document.querySelectorAll('.apr').forEach(function(apr) {
                apr.classList.remove("active");
                apr.childNodes[1].checked = false;
            });
            this.classList.add("active");
            apr.childNodes[1].checked = true;
            clearTimeout();
            setTimeout(function() {
                build_requests();
                fetch_affirm_data();
            }, 250);
        });
    });

    document.querySelectorAll(".term").forEach(function(term) {
        term.addEventListener("mouseover", function() {
            this.childNodes[1].classList.add('d-none');
            this.childNodes[3].classList.remove('d-none');
        });
        term.addEventListener("mouseout", function() {
            this.childNodes[1].classList.remove('d-none');
            this.childNodes[3].classList.add('d-none');
        });
    });

    document.querySelector("#amount").addEventListener("input", function() {
        clearTimeout(typing_timer);
        if (this.value) {
            typing_timer = setTimeout(function() {
                build_requests();
                fetch_affirm_data();
            }, 1000);
        }
    });
};

// Determine desired APR & Amount, then setup the URLs array
function build_requests() {
    'use strict';
    let reg_test = /^([0-9]|,)+\.[0-9]{2}$/,
        amount = document.querySelector("#amount").value.trim().replace(/\$/g, ""),
        promo_selector = document.querySelector("[name='interest']:checked").value;

    // Validate XXXX.XX format
    if (reg_test.test(amount)) {
        // If valid: remove any warning messages and create the URLs array
        int_amount = amount.replace(/[.,]/g, "");
        warn_user("", true, true);
        urls = options.promos[promo_selector].map(promo => {
            return "https://affirm.com/api/v2/promos/v2/" + options.key + "?promo_external_id=" + promo + "&amount=" + int_amount;
        });
    } else {
        // If invalid: prompt user for correct input format
        warn_user("Please use 0,000.00 format", false, false);
    }
}

// Make every request in the URLs array (3), store the response data "tagline" in the data array, and then render all
function fetch_affirm_data() {
    // If int_amount is within Affirm's loan range: fetchData and pass to callback
    if (valid_input === true && int_amount >= 10000 && int_amount <= 3000000) {
        let data = [];
        document.querySelectorAll(".term").forEach(el => {
            el.style.opacity = ".5"
        });

        $.ajax({
            method: "GET",
            url: urls[0],
            statusCode: {
                400: function(error) {
                    warn_user("", true, true);
                }
            },
            error: function(response) {
                var errorMsg = JSON.parse(response.responseText).message;
                render_response(null, errorMsg);
            },
            success: function(response) {
                data.push(response.promo.tagline);
                $.ajax({
                    method: "GET",
                    url: urls[1],
                    statusCode: {
                        400: function(error) {
                            warn_user("", true, true);
                        }
                    },
                    error: function(response) {
                        var errorMsg = JSON.parse(response.responseText).message;
                        render_response(null, errorMsg);
                    },
                    success: function(response) {
                        data.push(response.promo.tagline);
                        $.ajax({
                            method: "GET",
                            url: urls[2],
                            statusCode: {
                                400: function(error) {
                                    warn_user("", true, true);
                                }
                            },
                            error: function(response) {
                                var errorMsg = JSON.parse(response.responseText).message;
                                render_response(null, errorMsg);
                            },
                            success: function(response) {
                                data.push(response.promo.tagline);
                                render_response(data, null);
                                document.querySelectorAll(".term").forEach(el => {
                                    el.style.opacity = "1"
                                });
                            }
                        });
                    }
                });
            }
        });
    } else {
        // If amount is out of range: negate render and pass a null data value
        render_response(null, undefined);
    }
}

// Renders received data or processes error
function render_response(data, error) {
    // Setup display elements
    let termsPricing = document.querySelectorAll('.term .term-pricing'),
        termsMonths = document.querySelectorAll('.term .term-months'),
        termsTotal = document.querySelectorAll('.term .term-total'),
        termsTotalInterest = document.querySelectorAll('.term .term-interest');

    if (error != null || data === null) {
        // If error or data is null: apply '--' to all values as placeholders
        for (let i = 0; i < urls.length; i++) {
            placeholder_value([termsPricing[i], termsMonths[i], termsTotal[i], termsTotalInterest[i]]);
        }
    } else {
        // If no error -> check each response for months string -> if no month: apply '--' to all values
        for (let i = 0; i < data.length; i++) {
            if (data[i].split(" ")[12] === undefined) {
                placeholder_value([termsPricing[i], termsMonths[i], termsTotal[i], termsTotalInterest[i]]);
            } else {
                let totalLoan = Number(Number(data[i].split(" ")[0].replace(/\$|,|\/mo\./g, "")).toFixed(2) * Number(data[i].split(" ")[12])).toFixed(2);
                termsPricing[i].innerHTML = data[i].split(" ")[0].replace(/\$|,|\/mo\./g, "");
                termsMonths[i].innerHTML = data[i].split(" ")[12];
                termsTotal[i].innerHTML = totalLoan;
                termsTotalInterest[i].innerHTML = Number(totalLoan - Number(document.querySelector("#amount").value.replace(/[$,]/g, ""))).toFixed(2);
            }
        }
    }
}


function warn_user(el_message, is_valid, hide_el) {
    (el_message != null) ? document.querySelector("#warning").innerHTML = el_message: console.error("There was an error. Please contact help@affirm.com.");
    (hide_el) ? document.querySelector("#warning").classList.add("d-none"): document.querySelector("#warning").classList.remove("d-none");
    valid_input = is_valid;
}

function placeholder_value(els_array) {
    els_array.forEach(el => {
        el.innerHTML = "\u002d\u002d";
    })
}
