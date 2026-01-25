/**
 * High-Ticket Product Research Tool
 * 
 * Helps identify products with $100+ commission potential
 * for the $1,000/day revenue goal.
 */

const fs = require('fs').promises;
const path = require('path');

// Load dotenv only if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not available, continue without it
}


// Commission rates by Amazon category
const AMAZON_COMMISSION_RATES = {
  'Amazon Devices': 4,
  'Amazon Fashion': 10,
  'Amazon Fresh': 3,
  'Luxury Beauty': 10,
  'Amazon Coins': 10,
  'Physical Books': 4.5,
  'Kitchen': 4.5,
  'Automotive': 4.5,
  'Baby Products': 3,
  'Beauty': 4,
  'Outdoors': 5.5,
  'Business Supplies': 3,
  'Cameras': 3,
  'Clothing': 4,
  'Collectibles': 2,
  'Computers': 2.5,
  'Electronics': 2.5,
  'Eyewear': 4.5,
  'Furniture': 8,
  'Grocery': 1,
  'Health & Personal Care': 1,
  'Home': 8,
  'Home Improvement': 8,
  'Jewelry': 4,
  'Luggage': 6,
  'Musical Instruments': 3,
  'Office Products': 3,
  'Outdoors': 5.5,
  'PC': 2.5,
  'Pet Products': 5,
};

/**
 * Calculate commission for a product
 */
function calculateCommission(price, category) {
  const rate = AMAZON_COMMISSION_RATES[category] || 4; // Default 4%
  const commission = (price * rate) / 100;
  return {
    price,
    category,
    rate,
    commission: commission.toFixed(2),
    meetsGoal: commission >= 100
  };
}

/**
 * Generate high-ticket product recommendations
 */
function generateProductRecommendations() {
  const recommendations = [];
  
  // Define high-ticket product opportunities
  const opportunities = [
    // Electronics (2.5-4% - need higher prices)
    { name: 'Gaming Laptop (High-End)', category: 'Computers', minPrice: 2000, maxPrice: 3000 },
    { name: 'Professional Camera System', category: 'Cameras', minPrice: 2500, maxPrice: 4000 },
    { name: 'Home Theater System', category: 'Electronics', minPrice: 2000, maxPrice: 3500 },
    { name: 'High-End Monitor (Ultrawide)', category: 'PC', minPrice: 1200, maxPrice: 2000 },
    
    // Furniture & Home (8% - lower prices needed)
    { name: 'Premium Mattress (King)', category: 'Furniture', minPrice: 1250, maxPrice: 2500 },
    { name: 'Ergonomic Office Chair', category: 'Furniture', minPrice: 800, maxPrice: 1500 },
    { name: 'Sectional Sofa', category: 'Furniture', minPrice: 1500, maxPrice: 3000 },
    { name: 'Dining Set (6-8 person)', category: 'Furniture', minPrice: 1000, maxPrice: 2000 },
    
    // Home Improvement (8%)
    { name: 'Air Purifier System', category: 'Home Improvement', minPrice: 800, maxPrice: 1500 },
    { name: 'Smart Home Security System', category: 'Home Improvement', minPrice: 1000, maxPrice: 2000 },
    
    // Sports & Outdoors (5.5-6%)
    { name: 'Treadmill (Premium)', category: 'Sports', minPrice: 1500, maxPrice: 3000 },
    { name: 'Exercise Bike (Peloton Alternative)', category: 'Sports', minPrice: 1200, maxPrice: 2500 },
    { name: 'Home Gym System', category: 'Sports', minPrice: 1500, maxPrice: 2500 },
    { name: 'Golf Club Set (Complete)', category: 'Sports', minPrice: 1500, maxPrice: 2500 },
    
    // Tools (6%)
    { name: 'Power Tool Combo Kit (Professional)', category: 'Tools', minPrice: 1200, maxPrice: 2000 },
    
    // Luxury Beauty (10% - best rates!)
    { name: 'Luxury Skincare Bundle', category: 'Luxury Beauty', minPrice: 1000, maxPrice: 2000 },
    
    // Watches (5%)
    { name: 'Luxury Watch', category: 'Watches', minPrice: 2000, maxPrice: 5000 }
  ];
  
  opportunities.forEach(product => {
    // Calculate for min and max prices
    const minCalc = calculateCommission(product.minPrice, product.category);
    const maxCalc = calculateCommission(product.maxPrice, product.category);
    
    recommendations.push({
      productName: product.name,
      category: product.category,
      priceRange: `$${product.minPrice}-$${product.maxPrice}`,
      commissionRate: `${minCalc.rate}%`,
      commissionRange: `$${minCalc.commission}-$${maxCalc.commission}`,
      meetsGoal: minCalc.meetsGoal || maxCalc.meetsGoal,
      priority: maxCalc.commission >= 150 ? 'HIGH' : maxCalc.commission >= 100 ? 'MEDIUM' : 'LOW',
      salesNeededFor1000: Math.ceil(1000 / parseFloat(maxCalc.commission))
    });
  });
  
  // Sort by priority
  recommendations.sort((a, b) => {
    const priorityOrder = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  return recommendations;
}

/**
 * Calculate revenue scenarios
 */
function calculateRevenueScenarios() {
  const scenarios = [
    {
      name: 'Conservative (Low-Ticket Mix)',
      avgCommission: 50,
      salesPerDay: 20,
      dailyRevenue: 1000,
      difficulty: 'HIGH - Need many conversions'
    },
    {
      name: 'Moderate (Mid-Ticket Focus)',
      avgCommission: 100,
      salesPerDay: 10,
      dailyRevenue: 1000,
      difficulty: 'MEDIUM - Balanced approach'
    },
    {
      name: 'Optimal (High-Ticket Focus)',
      avgCommission: 200,
      salesPerDay: 5,
      dailyRevenue: 1000,
      difficulty: 'LOW - Fewer sales needed'
    },
    {
      name: 'Premium (Ultra High-Ticket)',
      avgCommission: 300,
      salesPerDay: 4,
      dailyRevenue: 1200,
      difficulty: 'LOW - Best ROI per effort'
    }
  ];
  
  return scenarios;
}

/**
 * Generate product research report
 */
async function generateReport() {
  const recommendations = generateProductRecommendations();
  const scenarios = calculateRevenueScenarios();
  
  const report = {
    generatedAt: new Date().toISOString(),
    goal: {
      dailyRevenue: 1000,
      targetCommission: 100,
      strategy: 'Focus on high-ticket items ($500-$2,500) with 6-10% commission rates'
    },
    revenueScenarios: scenarios,
    topRecommendations: recommendations.filter(r => r.priority === 'HIGH'),
    allRecommendations: recommendations,
    categoryInsights: {
      bestCommissionRates: [
        { category: 'Luxury Beauty', rate: '10%', sweetSpot: '$1,000-$2,000' },
        { category: 'Furniture', rate: '8%', sweetSpot: '$1,250-$3,000' },
        { category: 'Home Improvement', rate: '8%', sweetSpot: '$1,250-$2,000' },
        { category: 'Sports', rate: '6%', sweetSpot: '$1,500-$3,000' },
        { category: 'Tools', rate: '6%', sweetSpot: '$1,500-$2,500' }
      ]
    },
    actionPlan: [
      '1. Start with Furniture category (8% commission, broad appeal)',
      '2. Focus on products in $1,250-$2,500 range',
      '3. Create 3 videos per product (different hooks)',
      '4. Target 5 sales/day at $200 avg commission = $1,000/day',
      '5. Scale to 10 different products in rotation',
      '6. Optimize based on conversion data'
    ]
  };
  
  // Save report
  const reportsDir = path.join(__dirname, '../product-research');
  await fs.mkdir(reportsDir, { recursive: true });
  
  const reportPath = path.join(reportsDir, `high-ticket-research-${Date.now()}.json`);
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  return { report, reportPath };
}

/**
 * Display formatted report
 */
function displayReport(report) {
  console.log('\n' + '='.repeat(80));
  console.log('HIGH-TICKET PRODUCT RESEARCH REPORT');
  console.log('Goal: $1,000/day Revenue');
  console.log('='.repeat(80));
  
  console.log('\n📊 REVENUE SCENARIOS:\n');
  report.revenueScenarios.forEach(scenario => {
    console.log(`${scenario.name}:`);
    console.log(`  - Avg Commission: $${scenario.avgCommission}`);
    console.log(`  - Sales Needed: ${scenario.salesPerDay}/day`);
    console.log(`  - Daily Revenue: $${scenario.dailyRevenue}`);
    console.log(`  - Difficulty: ${scenario.difficulty}`);
    console.log('');
  });
  
  console.log('\n🎯 TOP PRODUCT RECOMMENDATIONS (HIGH PRIORITY):\n');
  report.topRecommendations.forEach((rec, i) => {
    console.log(`${i + 1}. ${rec.productName}`);
    console.log(`   Category: ${rec.category} (${rec.commissionRate})`);
    console.log(`   Price Range: ${rec.priceRange}`);
    console.log(`   Commission: ${rec.commissionRange}`);
    console.log(`   Sales needed for $1K: ${rec.salesNeededFor1000}/day`);
    console.log('');
  });
  
  console.log('\n💡 BEST COMMISSION CATEGORIES:\n');
  report.categoryInsights.bestCommissionRates.forEach(cat => {
    console.log(`  ${cat.category}: ${cat.rate} commission`);
    console.log(`    Sweet spot: ${cat.sweetSpot}`);
  });
  
  console.log('\n📋 ACTION PLAN:\n');
  report.actionPlan.forEach(step => {
    console.log(`  ${step}`);
  });
  
  console.log('\n' + '='.repeat(80) + '\n');
}

// CLI execution
if (require.main === module) {
  console.log('🔍 Generating High-Ticket Product Research...\n');
  
  generateReport()
    .then(({ report, reportPath }) => {
      displayReport(report);
      console.log(`\n✅ Full report saved to: ${reportPath}`);
    })
    .catch(error => {
      console.error('❌ Error generating report:', error.message);
      process.exit(1);
    });
}

module.exports = {
  calculateCommission,
  generateProductRecommendations,
  calculateRevenueScenarios,
  generateReport
};
