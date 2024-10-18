export const getContrastTextColor = (hexColor) => {
    // Remove '#' if present
    const hex = hexColor.replace(/^#/, '');

    // Convert hex to RGB
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return black or white depending on brightness
    return brightness > 128 ? 'black' : 'white';
};
