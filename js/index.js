function changeTab(value) {
    if (value === 'about') {
        document.getElementById('about').style.display = "flex";
        document.getElementById('tab-about').classList.add("active");
        document.getElementById('contact').style.display = "none";
        document.getElementById('tab-contact').classList.remove("active");
    } else if (value === 'contact') {
        document.getElementById('contact').style.display = "flex";
        document.getElementById('tab-contact').classList.add("active");
        document.getElementById('about').style.display = "none";
        document.getElementById('tab-about').classList.remove("active");
    } else if (value === 'success') {
        document.getElementById('success').style.display = "flex";
        document.getElementById('contact').style.display = "none";
        document.getElementById('tab-contact').classList.remove("active");
        document.getElementById('about').style.display = "none";
        document.getElementById('tab-about').classList.remove("active");
    }
}

function Validator(options) {
    const formEle = document.querySelector(options.form);
    if (formEle) {
        options.rules.forEach(function (rule) {
            var inputEle = formEle.querySelector(rule.selector);

            if (inputEle) {
                inputEle.onblur = function () {
                    var messError = rule.test(inputEle.value);
                    if (messError) {

                    }
                }
            }
        })
    }
}

Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : "Vui lòng nhập trường này!";
        }
    }
}

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function () {

        }
    }
}

Validator({
    form: "#form-contact",
    rules: [
        Validator.isRequired('#name'),
        Validator.isEmail('#email'),
    ]
});