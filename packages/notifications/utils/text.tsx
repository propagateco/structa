export class FormattedType {
    public type;

    constructor(type: "sign-in" | "email-verification" | "forget-password") {
        this.type = type;
    }

    toBody() {
        switch (this.type) {
            case "sign-in":
                return "sign in";
            case "email-verification":
                return "sign up";
            case "forget-password":
                return "reset your password";
            default:
                return "access your account";
        }
    }

    toHyphenated() {
        switch (this.type) {
            case "sign-in":
                return "sign-in";
            case "email-verification":
                return "sign-up";
            case "forget-password":
                return "forget password";
            default:
                return "access account";
        }
    }

    toUpperCaseHyphenated() {
        switch (this.type) {
            case "sign-in":
                return "Sign-In";
            case "email-verification":
                return "Sign-Up";
            case "forget-password":
                return "Forget Password";
            default:
                return "Access Account";
        }
    }
}
