import easyocr
import sys

def extract_text(image_path):
    reader = easyocr.Reader(['en'])
    # This suppresses progress output during OCR processing
    result = reader.readtext(image_path, detail=0)
    text = ' '.join(result)
    return text

if __name__ == "__main__":
    image_path = sys.argv[1]  # Get image path from arguments
    extracted_text = extract_text(image_path)
    print(extracted_text)  # Only print the extracted text