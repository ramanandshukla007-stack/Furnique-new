#!/usr/bin/env node
/**
 * Quick test of the furniture yardage calculator
 */
const { calculateFurnitureYardage, calculateItemTotalYardage, calculateFabricForRoom, calculateProject } = require('./lib/calculator.ts');

// Test data
const testItems = [
  { type: 'sofa-3seater', quantity: 1 },
  { type: 'armchair', quantity: 2 },
  { type: 'cushion-small', quantity: 4 },
  { type: 'ottoman', quantity: 1 },
  { type: 'dining-chair', quantity: 6 },
];

console.log('\n=== FURNITURE YARDAGE CALCULATOR TEST ===\n');
console.log('Testing individual item calculations:\n');

let totalYards = 0;
testItems.forEach(item => {
  const calc = calculateFurnitureYardage(item);
  const total = calculateItemTotalYardage(item);
  totalYards += total;
  console.log(`${item.type} (qty: ${item.quantity})`);
  console.log(`  Details: ${calc.details}`);
  console.log(`  Per-item: ${calc.yardage} yd`);
  console.log(`  Total: ${total} yd`);
  console.log();
});

console.log('---');
console.log(`Grand Total: ${totalYards} yards\n`);

// Test dimension-based calculation
console.log('=== CUSTOM DIMENSION-BASED CALCULATION ===\n');
const customCushion = {
  type: 'cushion-generic',
  quantity: 2,
  width: 24,      // 24 inches
  height: 20,     // 20 inches
};

const customCalc = calculateFurnitureYardage(customCushion);
const customTotal = calculateItemTotalYardage(customCushion);

console.log(`Custom Cushion (24" x 20")`);
console.log(`  Details: ${customCalc.details}`);
console.log(`  Per-item: ${customCalc.yardage} yd`);
console.log(`  Total (qty 2): ${customTotal} yd\n`);

// Test headboard
console.log('=== HEADBOARD SIZE OPTIONS ===\n');
const headboardSizes = ['twin', 'full', 'queen', 'king'];
headboardSizes.forEach(size => {
  const hb = { type: 'headboard-' + size, quantity: 1, headboardSize: size };
  const calc = calculateFurnitureYardage(hb);
  console.log(`Headboard (${size.toUpperCase()}): ${calc.yardage} yd`);
});

console.log('\n✅ All tests completed!\n');
