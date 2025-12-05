use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn convert_to_grayscale(data: &mut [u8], _width: u32, _height: u32) {
    for pixel in data.chunks_mut(4) {
        let r = pixel[0] as f32;
        let g = pixel[1] as f32;
        let b = pixel[2] as f32;

        let gray = (0.299 * r + 0.587 * g + 0.114 * b) as u8;

        pixel[0] = gray; // R
        pixel[1] = gray; // G
        pixel[2] = gray; // B
    }
}

#[wasm_bindgen]
pub fn invert_colors(data: &mut [u8], _width: u32, _height: u32) {
    for pixel in data.chunks_mut(4) {
        pixel[0] = 255 - pixel[0];
        pixel[1] = 255 - pixel[1];
        pixel[2] = 255 - pixel[2];
    }
}
