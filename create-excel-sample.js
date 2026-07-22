const XLSX = require('xlsx');

// Sample data for seasonal products
const sampleData = [
  {
    name: 'Diwali Gold Ring',
    price: 25000,
    category: 'Rings',
    material: 'Gold',
    stone: 'Diamond',
    imageUrl: 'https://example.com/diwali-ring.jpg',
    description: 'Beautiful gold ring perfect for Diwali celebrations',
    model3d: '',
    isPersonalized: 'FALSE',
    engraving: 'TRUE',
    fontStyle: 'Script,Modern',
    nameText: 'TRUE',
    metalFinish: 'Polished,Matte',
    currentStock: 10,
    reserved: 0,
    inStock: 'TRUE',
    sku: 'DIWALI001',
    isRakhi: 'FALSE',
    isFeatured: 'TRUE',
    isNewArrival: 'TRUE',
    rakhiType: 'traditional'
  },
  {
    name: 'Festive Diamond Necklace',
    price: 45000,
    category: 'Necklaces',
    material: 'Gold',
    stone: 'Diamond',
    imageUrl: 'https://example.com/festive-necklace.jpg',
    description: 'Elegant diamond necklace for festive occasions',
    model3d: '',
    isPersonalized: 'FALSE',
    engraving: 'TRUE',
    fontStyle: 'Modern',
    nameText: 'FALSE',
    metalFinish: 'Polished',
    currentStock: 5,
    reserved: 0,
    inStock: 'TRUE',
    sku: 'DIWALI002',
    isRakhi: 'FALSE',
    isFeatured: 'TRUE',
    isNewArrival: 'FALSE',
    rakhiType: 'traditional'
  },
  {
    name: 'Traditional Gold Earrings',
    price: 15000,
    category: 'Earrings',
    material: 'Gold',
    stone: '',
    imageUrl: 'https://example.com/traditional-earrings.jpg',
    description: 'Classic gold earrings for traditional celebrations',
    model3d: '',
    isPersonalized: 'FALSE',
    engraving: 'FALSE',
    fontStyle: '',
    nameText: 'FALSE',
    metalFinish: 'Polished',
    currentStock: 15,
    reserved: 0,
    inStock: 'TRUE',
    sku: 'DIWALI003',
    isRakhi: 'FALSE',
    isFeatured: 'FALSE',
    isNewArrival: 'TRUE',
    rakhiType: 'traditional'
  },
  {
    name: 'Celebration Bracelet',
    price: 12000,
    category: 'Bracelets',
    material: 'Gold',
    stone: 'Ruby',
    imageUrl: 'https://example.com/celebration-bracelet.jpg',
    description: 'Stunning bracelet with ruby stones for special occasions',
    model3d: '',
    isPersonalized: 'TRUE',
    engraving: 'TRUE',
    fontStyle: 'Script',
    nameText: 'TRUE',
    metalFinish: 'Matte',
    currentStock: 8,
    reserved: 0,
    inStock: 'TRUE',
    sku: 'DIWALI004',
    isRakhi: 'FALSE',
    isFeatured: 'TRUE',
    isNewArrival: 'FALSE',
    rakhiType: 'traditional'
  },
  {
    name: 'Diwali Special Ring Set',
    price: 35000,
    category: 'Rings',
    material: 'Gold',
    stone: 'Emerald',
    imageUrl: 'https://example.com/diwali-ring-set.jpg',
    description: 'Complete ring set perfect for Diwali gifting',
    model3d: '',
    isPersonalized: 'FALSE',
    engraving: 'TRUE',
    fontStyle: 'Modern',
    nameText: 'FALSE',
    metalFinish: 'Polished',
    currentStock: 3,
    reserved: 0,
    inStock: 'TRUE',
    sku: 'DIWALI005',
    isRakhi: 'FALSE',
    isFeatured: 'TRUE',
    isNewArrival: 'TRUE',
    rakhiType: 'traditional'
  }
];

// Create workbook
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(sampleData);

// Add column widths for better readability
const colWidths = [
  { wch: 25 }, // name
  { wch: 10 }, // price
  { wch: 15 }, // category
  { wch: 15 }, // material
  { wch: 15 }, // stone
  { wch: 40 }, // imageUrl
  { wch: 50 }, // description
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

XLSX.utils.book_append_sheet(wb, ws, 'Seasonal Products');

// Write the file
XLSX.writeFile(wb, 'sample-seasonal-products.xlsx');

console.log('✅ Sample Excel file created: sample-seasonal-products.xlsx');
console.log('📝 This file contains 5 sample seasonal products ready for bulk upload');
console.log('🎯 Use categoryPage: "seasonal" in the admin panel dropdown');
console.log('📋 All required columns are included with proper formatting');
