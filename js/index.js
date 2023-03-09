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
        document.getElementById('#form-contact').reset();
    } else if (value === 'success') {
        document.getElementById('success').style.display = "flex";
        document.getElementById('contact').style.display = "none";
        document.getElementById('tab-contact').classList.remove("active");
        document.getElementById('about').style.display = "none";
        document.getElementById('tab-about').classList.remove("active");
    }
}

function Validator(options) {
    function getParentEle(ele, selector) {
        while (ele.parentElement) {
            if (ele.parentElement.matches(selector)) {
                return ele.parentElement;
            }
            ele = ele.parentElement;
        }
    }

     const selectorRules = {};

    function validate(inputEle, rule) {
        const errorEle = getParentEle(inputEle, options.formGroupSelector).querySelector(options.errorSelector);
        let messError;


        const rules = selectorRules[rule.selector];
        for (let i = 0; i < rules.length; ++i) {
            switch (inputEle.type) {
                case 'radio':
                case 'checkbox':
                    messError = rules[i](
                        formEle.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    messError = rules[i](inputEle.value);
            }
            if (messError) {
                break;
            }
        }

        if (messError) {
            errorEle.innerText = messError;
            getParentEle(inputEle, options.formGroupSelector).classList.add('invalid');
        } else {
            errorEle.innerText = '';
            getParentEle(inputEle, options.formGroupSelector).classList.remove('invalid');
        }

        return !messError;
    }

    const formEle = document.querySelector(options.form);
    if (formEle) {
        formEle.onsubmit = function (e) {
            e.preventDefault();
            let isFormValid = true;
            options.rules.forEach(function (rule) {
                const inputEle = formEle.querySelector(rule.selector);
                let isValid = validate(inputEle, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });
            if (isFormValid) {
                if (typeof options.onSubmit === "function") {
                    const enableInputs = formEle.querySelectorAll('[name]');
                    const formValues = Array.from(enableInputs).reduce((values, input) => {
                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formEle.querySelector('input[name="' + input.name +'"]:checked').value;
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = false;
                                    return values;
                                }
                                // if (!Array.isArray(values[input.name])) {
                                //     values[input.name] = [];
                                // }
                                // values[input.name].push(input.value);
                                values[input.name] = true;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }
            }
        }

        options.rules.forEach(function (rule) {
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            const inputEles = formEle.querySelectorAll(rule.selector);

            Array.from(inputEles).forEach(inputEle => {
                inputEle.onblur = function () {
                    validate(inputEle, rule);
                }

                inputEle.oninput = function () {
                    const errorEle = getParentEle(inputEle, options.formGroupSelector).querySelector(options.errorSelector);
                    errorEle.innerText = '';
                    getParentEle(inputEle, options.formGroupSelector).classList.remove('invalid');
                }
            })
        });
    }
}

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || "Vui lòng nhập trường này!";
        }
    }
}

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "Email không hợp lệ!";
        }
    }
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự!`;
        }
    }
}

Validator.maxLength = function (selector, max, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length <= max ? undefined : message || `Vui lòng nhập tối đa ${max} kí tự!`;
        }
    }
}

Validator({
    form: "#form-contact",
    formGroupSelector: '.form-group',
    errorSelector: ".form-message",
    rules: [
        Validator.isRequired('#name', 'Vui lòng nhập your name!'),
        Validator.isRequired('#company', 'Vui lòng nhập your company!'),
        Validator.isRequired('#email', 'Vui lòng nhập email!'),
        Validator.isRequired('#phone', 'Vui lòng nhập phone!'),
        // Validator.isRequired('input[name="join"]'),
        Validator.isEmail('#email'),
        Validator.minLength('#phone', 10),
        Validator.maxLength('#phone', 15),
    ],
    onSubmit: function (data) {
        console.log(data);
        changeTab('success');
    }
});
