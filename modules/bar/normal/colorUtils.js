import Gtk from 'gi://Gtk';

// Helper function to calculate complementary color
const getComplementaryColor = (r, g, b) => {
    // Convert to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    // Rotate hue by 180 degrees for complementary color
    h = (h + 0.5) % 1.0;
    
    // Convert back to RGB
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    return [
        hue2rgb(p, q, h + 1/3),
        hue2rgb(p, q, h),
        hue2rgb(p, q, h - 1/3),
    ];
};

export const getThemeColor = (className, inverse = false) => {
    const dummy = new Gtk.Label();
    const context = dummy.get_style_context();
    context.add_class(className);
    
    try {
        const color = context.get_property('color', Gtk.StateFlags.NORMAL);
        if (inverse) {
            const [r, g, b] = getComplementaryColor(color.red, color.green, color.blue);
            return [r, g, b, color.alpha];
        }
        return [color.red, color.green, color.blue, color.alpha];
    } catch (e) {
        console.error(`Error getting color for ${className}:`, e);
        return [0.2, 0.8, 1, 1]; // Fallback to light blue
    }
};

export const themeColors = {
    primary: (inverse = false) => getThemeColor('osd-color-primary', inverse),
    secondary: (inverse = false) => getThemeColor('osd-color-secondary', inverse),
    tertiary: (inverse = false) => getThemeColor('osd-color-tertiary', inverse),
    surface: (inverse = false) => getThemeColor('osd-color-surface', inverse),
    error: (inverse = false) => getThemeColor('osd-color-error', inverse),
};
