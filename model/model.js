(function () {
    var Model = {
        init: function () {
            window.Model = this;
            this.validators = {};
            this.users = {
                a: 'a'
            }
            $.validator.addMethod("lettersonly", (value, element) => {
                return /^[a-zA-Z]+$/i.test(value);
            }, "Name must contain alphabetical letters only.");
        
            $.validator.addMethod("alphanumeric", (value, element) => {
                return /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(value);
            }, "Password must contain letters AND numbers.");
        },

        initFormValidator: function () {
            if (!this.validators['register']) {

                this.validators['register'] = $('#form_register').validate({
                    rules: {
                        username: {
                            minlength: 2,
                            required: true
                        },
                        password: {
                            required: true,
                            minlength: 8,
                            alphanumeric: true
                        },
                        email: {
                            required: true,
                            email: true
                        },
                        firstname: {
                            required: true,
                            lettersonly: true
                        },
                        lastname: {
                            required: true,
                            lettersonly: true
                        },
                        birthday: {
                            required: true
                        }

                    },
                    highlight: function (element) {
                        console.log("highlighting");
                        $(element).parent().addClass('err').removeClass('valid');
                    },
                    success: function (element) {
                        element.parent().addClass('valid');
                        element.parent().removeClass('err');
                    },
                    submitHandler: function (form) {
                        console.log("Form submitted");

                        if (Model.register(form.username.value, form.password.value)) {
                            if (Model.login(form.username.value, form.password.value))
                                onLoginSuccess();
                        } else {
                            onRegisterError();
                        }

                        return false;
                    }
                });
            }
        },

        login: function (id, pw) {
            if (bLoggedIn) {
                showError("Must log out before log-in");
                return false;
            }
            bLoggedIn = this.users[id] === pw;
            if (bLoggedIn) {
                currentUser = id;
            } else {
                showError("Login failed. Username and/or password incorrect.");
            }

            return bLoggedIn;
        },

        register: function (id, pw) {
            if (this.users[id]) {
                return false;
            } else {
                this.users[id] = pw;
                return true;
            }
        },

        logout: function (oEvent) {
            bLoggedIn = false;
            currentUser = undefined;
            onLogout(oEvent);
        },

        initLoginForm: function () {
            this.validators['login'] = $('#form_login').validate({
                rules: {
                    username: {
                        minlength: 1,
                        required: true
                    },
                    password: {
                        required: true,
                        minlength: 1
                    }
                },
                highlight: function (element) {
                    $(element).parent().addClass('err').removeClass('valid');
                },
                success: function (element) {
                    element.parent().addClass('valid');
                    element.parent().removeClass('err');
                },
                submitHandler: function (form) {
                    console.log("Form submitted");

                    if (Model.login(form.username.value, form.password.value)) {
                        onLoginSuccess();
                    }

                    return false;
                }
            });
        }






    }
    Model.init();
})();