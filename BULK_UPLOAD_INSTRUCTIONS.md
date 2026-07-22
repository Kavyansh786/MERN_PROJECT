# Bulk Product Upload Instructions

## Overview
The bulk upload feature allows administrators to upload multiple products at once using an Excel file. This saves significant time when adding large inventories to specific category pages.

## How to Use

### 1. Access Bulk Upload
- Navigate to **Admin Panel → Bulk Upload** in the sidebar
- The page provides comprehensive instructions and template download

### 2. Download Excel Template
- Click **"Download Template"** to get the properly formatted Excel file
- The template includes sample data and all required columns
- Use this template as a reference for your product data

### 3. Prepare Your Excel File
Fill in the Excel file with your product data following these guidelines:

#### Required Fields (Must be filled):
- **name**: Product name
- **price**: Product price (numeric)
- **category**: Product category
- **material**: Material type (Gold, Silver, etc.)
- **imageUrl**: Full URL to product image
- **description**: Product description (minimum 10 characters)
- **sku**: Unique product identifier (must be unique across all products)

#### Optional Fields:
- **stone**: Stone type (Diamond, Ruby, etc.)
- **model3d**: URL to 3D model file (.glb or .gltf)
- **currentStock**: Current inventory count (default: 0)
- **reserved**: Reserved inventory (default: 0)

#### Boolean Fields (Use TRUE/FALSE):
- **isPersonalized**: Can be personalized
- **engraving**: Supports engraving
- **nameText**: Supports name text
- **inStock**: Is in stock (default: TRUE)
- **isRakhi**: Is Rakhi product
- **isFeatured**: Is featured product
- **isNewArrival**: Is new arrival

#### Array Fields (Use comma-separated values):
- **fontStyle**: Available font styles (e.g., "Script,Modern,Classic")
- **metalFinish**: Available finishes (e.g., "Polished,Matte,Brushed")

#### Special Fields:
- **rakhiType**: For Rakhi products (traditional, designer, premium)

### 4. Select Category Page
Choose which page the products should appear on:
- Rings, Necklaces, Earrings, Bracelets
- Bridal Collection
- Birthday Gifts, Anniversary Gifts, Festive Gifts
- Zodiac Jewelry, Personalized Gifts
- Raksha Bandhan, General Shop

### 5. Upload Process
1. Select your prepared Excel file
2. Choose the target category page
3. Click **"Upload Products"**
4. Review the upload results

## Upload Results
The system provides detailed feedback:
- **Total**: Number of rows processed
- **Successful**: Products successfully created
- **Failed**: Products that failed validation
- **Duplicates**: Products with existing SKUs

## Validation Rules
- All required fields must be filled
- SKU must be unique across all products
- Price must be a positive number
- Image URLs should be valid and accessible
- 3D model files must be .glb or .gltf format
- Boolean fields accept: TRUE/FALSE, true/false, 1/0

## File Specifications
- **Supported formats**: .xlsx, .xls
- **Maximum file size**: 10MB
- **Maximum products**: No limit (but consider server processing time)

## Error Handling
If products fail to upload:
1. Check the detailed error messages
2. Fix the issues in your Excel file
3. Re-upload only the failed products
4. Duplicate SKUs will be skipped automatically

## Best Practices
1. **Test with small batches** first (10-20 products)
2. **Use unique SKUs** following a consistent pattern
3. **Validate image URLs** before uploading
4. **Keep descriptions detailed** but concise
5. **Use consistent category naming**
6. **Backup your Excel file** before uploading

## Sample Data Format
```
name: "Gold Diamond Ring"
price: 25000
category: "rings"
material: "Gold"
stone: "Diamond"
imageUrl: "https://example.com/ring.jpg"
description: "Beautiful 18k gold ring with diamond stone"
sku: "RING001"
isPersonalized: TRUE
engraving: TRUE
fontStyle: "Script,Modern"
currentStock: 10
```

## Troubleshooting
- **File not uploading**: Check file format and size
- **Validation errors**: Review required fields and data types
- **Duplicate SKUs**: Use unique identifiers for each product
- **Image issues**: Ensure URLs are accessible and valid
- **Server errors**: Contact administrator if persistent issues occur

## Support
For technical issues or questions about bulk upload, contact the development team.
