import { WebGLRenderer } from 'three';

// Initialize the renderer with optional configurations
export function initializeRenderer({ antialias = true, width = window.innerWidth, height = window.innerHeight } = {}) {
    // Create the renderer with antialiasing enabled
    const renderer = new WebGLRenderer({
        antialias: antialias,
    });
    
    // Set the size of the renderer
    renderer.setSize(width, height);
    
    // Set the pixel ratio to ensure consistent rendering across different devices
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Append the renderer to the document body
    document.body.appendChild(renderer.domElement);

    // Handle window resize to maintain the correct renderer size
    window.addEventListener('resize', () => {
        // Update the size of the renderer when the window is resized
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    return renderer;
}
