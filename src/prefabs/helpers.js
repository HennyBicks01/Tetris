// Function to set a cookie with the specified name, value, and expiration days
export const setCookie = (c_name, c_value, c_days) => {
    // Create a new Date object
    let d = new Date();
    
    // Calculate the expiration time by adding c_days in milliseconds to the current time
    d.setTime(d.getTime() + (c_days * 24 * 60 * 60 * 1000));
    
    // Convert the expiration date to UTC format
    let expires = 'expires=' + d.toUTCString();
    
    // Set the cookie with the provided name, value, and expiration date, and specify the path as '/'
    document.cookie = c_name + '=' + c_value + ';' + expires + ';path=/';
}

// Function to get the value of a cookie by its name
export const getCookie = (c_name) => {
    // Construct the name of the cookie by appending '=' to c_name
    let name = c_name + '=';
    
    // Decode the entire cookie string to handle special characters
    let decodedCookie = decodeURIComponent(document.cookie);
    
    // Split the cookie string into an array of individual cookie values
    let ca = decodedCookie.split(';');
    
    // Iterate through each cookie in the array
    for (let i = 0; i < ca.length; i++) {
        // Get the current cookie value
        let c = ca[i];
        
        // Remove leading whitespace from the cookie value
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        
        // If the current cookie starts with the desired name, return its value
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    
    // If the cookie with the specified name is not found, return an empty string
    return '';
}
