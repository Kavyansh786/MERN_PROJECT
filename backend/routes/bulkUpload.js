const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const Product = require('../models/product');
const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Bulk upload products from Excel
router.post('/products', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No Excel file uploaded' });
    }

    const { categoryPage } = req.body;
    if (!categoryPage) {
      return res.status(400).json({ error: 'Category page is required' });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    if (rawData.length === 0) {
      return res.status(400).json({ error: 'Excel file is empty' });
    }

    // Normalize headers to lowercase for case-insensitive comparison
    const data = rawData.map(row => {
      const normalizedRow = {};
      Object.keys(row).forEach(key => {
        normalizedRow[key.toLowerCase().trim()] = row[key];
      });
      return normalizedRow;
    });

    // Check for required column headers (case-insensitive)
    const requiredHeaders = ['name', 'price', 'category', 'material', 'imageurl', 'description', 'sku'];
    const firstRow = data[0];
    const availableHeaders = Object.keys(firstRow);
    const missingHeaders = requiredHeaders.filter(header => !availableHeaders.includes(header));
    
    if (missingHeaders.length > 0) {
      return res.status(400).json({ 
        error: 'Missing required column headers in Excel file',
        missingHeaders: missingHeaders,
        requiredHeaders: requiredHeaders,
        availableHeaders: availableHeaders,
        message: `Please ensure your Excel file has these required columns: ${missingHeaders.join(', ')}`
      });
    }

    const results = {
      successful: [],
      failed: [],
      duplicates: []
    };

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // Excel row number (accounting for header)

      try {
        // Validate required fields (using normalized lowercase keys)
        const requiredFields = ['name', 'price', 'category', 'material', 'imageurl', 'description', 'sku'];
        const missingFields = requiredFields.filter(field => !row[field] || row[field].toString().trim() === '');
        
        if (missingFields.length > 0) {
          results.failed.push({
            row: rowNumber,
            data: row,
            error: `Missing required fields: ${missingFields.join(', ')}`
          });
          continue;
        }

        // Check for duplicate SKU
        const existingProduct = await Product.findOne({ sku: row.sku.toString().trim() });
        if (existingProduct) {
          results.duplicates.push({
            row: rowNumber,
            data: row,
            error: `Product with SKU '${row.sku}' already exists`
          });
          continue;
        }

        // Parse customization options (using normalized lowercase keys)
        const customizationOptions = {
          engraving: row.engraving === 'TRUE' || row.engraving === true || row.engraving === 1,
          fontStyle: row.fontstyle ? row.fontstyle.toString().split(',').map(s => s.trim()) : [],
          nameText: row.nametext === 'TRUE' || row.nametext === true || row.nametext === 1,
          metalFinish: row.metalfinish ? row.metalfinish.toString().split(',').map(s => s.trim()) : []
        };

        // Normalize category to match existing categories
        const normalizeCategory = (category) => {
          const categoryMap = {
            'rings': 'Rings',
            'necklaces': 'Necklaces', 
            'earrings': 'Earrings',
            'bracelets': 'Bracelets',
            'bridal': 'Bridal Collection',
            'birthday-gifts': 'Birthday Gifts',
            'anniversary-gifts': 'Anniversary Gifts',
            'festive-gifts': 'Festive Gifts',
            'personalized-gifts': 'Personalized Gifts',
            'zodiac-jewelry': 'Zodiac Jewelry',
            'raksha-bandhan': 'Raksha Bandhan'
          };
          const lowerCategory = category.toLowerCase().trim();
          return categoryMap[lowerCategory] || category.toString().trim();
        };

        // Create product object (using normalized lowercase keys)
        const productData = {
          name: row.name.toString().trim(),
          price: parseFloat(row.price),
          category: normalizeCategory(row.category),
          material: row.material.toString().trim(),
          stone: row.stone ? row.stone.toString().trim() : '',
          imageUrl: row.imageurl.toString().trim(),
          description: row.description.toString().trim(),
          model3d: row.model3d ? row.model3d.toString().trim() : null,
          isPersonalized: row.ispersonalized === 'TRUE' || row.ispersonalized === true || row.ispersonalized === 1,
          customizationOptions,
          currentStock: row.currentstock ? parseInt(row.currentstock) : 0,
          reserved: row.reserved ? parseInt(row.reserved) : 0,
          inStock: row.instock !== 'FALSE' && row.instock !== false && row.instock !== 0,
          sku: row.sku.toString().trim(),
          isRakhi: row.israkhi === 'TRUE' || row.israkhi === true || row.israkhi === 1,
          isFeatured: row.isfeatured === 'TRUE' || row.isfeatured === true || row.isfeatured === 1,
          isNewArrival: row.isnewarrival === 'TRUE' || row.isnewarrival === true || row.isnewarrival === 1,
          rakhiType: row.rakhitype || 'traditional',
          categoryPage: categoryPage
        };

        // Validate price
        if (isNaN(productData.price) || productData.price < 0) {
          results.failed.push({
            row: rowNumber,
            data: row,
            error: 'Invalid price value'
          });
          continue;
        }

        // Validate category page - use 'seasonal' for all seasonal products
        const validCategoryPages = ['rings', 'necklaces', 'earrings', 'bracelets', 'bridal', 'birthday-gifts', 'zodiac-jewelry', 'anniversary-gifts', 'anniversary', 'festive-gifts', 'personalized-gifts', 'raksha-bandhan', 'shop', 'seasonal'];
        if (!validCategoryPages.includes(categoryPage)) {
          results.failed.push({
            row: rowNumber,
            data: row,
            error: `Invalid category page: ${categoryPage}. Valid pages: ${validCategoryPages.join(', ')}`
          });
          continue;
        }

        // Create and save product
        const product = new Product(productData);
        await product.save();

        results.successful.push({
          row: rowNumber,
          data: row,
          productId: product._id
        });

      } catch (error) {
        results.failed.push({
          row: rowNumber,
          data: row,
          error: error.message
        });
      }
    }

    res.json({
      message: 'Bulk upload completed',
      summary: {
        total: data.length,
        successful: results.successful.length,
        failed: results.failed.length,
        duplicates: results.duplicates.length
      },
      results
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ error: 'Failed to process bulk upload', details: error.message });
  }
});

// Download Excel template
router.get('/template', (req, res) => {
  try {
    // Create sample data for template
    const templateData = [
      {
        name: 'Sample Gold Ring',
        price: 25000,
        category: 'rings',
        material: 'Gold',
        stone: 'Diamond',
        imageUrl: 'https://example.com/ring.jpg',
        description: 'Beautiful gold ring with diamond stone',
        model3d: 'https://example.com/ring.glb',
        isPersonalized: 'FALSE',
        engraving: 'TRUE',
        fontStyle: 'Script,Modern',
        nameText: 'TRUE',
        metalFinish: 'Polished,Matte',
        currentStock: 10,
        reserved: 0,
        inStock: 'TRUE',
        sku: 'RING001',
        isRakhi: 'FALSE',
        isFeatured: 'TRUE',
        isNewArrival: 'FALSE',
        rakhiType: 'traditional'
      }
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Add column widths
    const colWidths = [
      { wch: 20 }, // name
      { wch: 10 }, // price
      { wch: 15 }, // category
      { wch: 15 }, // material
      { wch: 15 }, // stone
      { wch: 30 }, // imageUrl
      { wch: 40 }, // description
      { wch: 30 }, // model3d
      { wch: 15 }, // isPersonalized
      { wch: 12 }, // engraving
      { wch: 20 }, // fontStyle
      { wch: 12 }, // nameText
      { wch: 20 }, // metalFinish
      { wch: 12 }, // currentStock
      { wch: 10 }, // reserved
      { wch: 10 }, // inStock
      { wch: 15 }, // sku
      { wch: 10 }, // isRakhi
      { wch: 12 }, // isFeatured
      { wch: 15 }, // isNewArrival
      { wch: 15 }  // rakhiType
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=product-upload-template.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

  } catch (error) {
    console.error('Template generation error:', error);
    res.status(500).json({ error: 'Failed to generate template' });
  }
});

module.exports = router;
