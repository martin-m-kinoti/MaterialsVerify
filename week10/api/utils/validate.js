const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegister = (data) => {
    const errors = {};

    if (!data.firstName?.trim()) errors.firstName = "First name is required";
    if (!data.lastName?.trim()) errors.lastName = "Last name is required";

    if (!data.email?.trim()) {
        errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(data.email)) {
        errors.email = "Invalid email format";
    }

    if (!data.county?.trim()) errors.county = "County is required";
    if (!data.role?.trim()) errors.role = "Role is required";

    if (!data.password) {
        errors.password = "Password is required";
    } else if (data.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
    }

    return { isValid: Object.keys(errors).length === 0, errors };
};

const validateLogin = (data) => {
    const errors = {};

    if (!data.email?.trim()) {
        errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(data.email)) {
        errors.email = "Invalid email format";
    }

    if (!data.password?.trim()) errors.password = "Password is required";

    return { isValid: Object.keys(errors).length === 0, errors };
};

module.exports = { validateRegister, validateLogin };
