/**
 * Analytics Tracker
 * 
 * Tracks daily metrics and progress toward $1,000/day goal
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

/**
 * Daily metrics structure
 */
const METRICS_TEMPLATE = {
  date: null,
  videosPosted: 0,
  totalViews: 0,
  profileVisits: 0,
  linkClicks: 0,
  amazonClicks: 0,
  sales: 0,
  revenue: 0,
  avgCommission: 0,
  topProducts: [],
  notes: ''
};

/**
 * KPI thresholds for $1,000/day goal
 */
const KPI_GOALS = {
  videosPosted: 5,
  totalViews: 50000,
  profileVisits: 2500,
  linkClicks: 1000,
  amazonClicks: 500,
  sales: 10, // Assuming $100 avg commission
  revenue: 1000,
  profileVisitRate: 5, // % of views
  linkClickRate: 40, // % of profile visits
  conversionRate: 2 // % of Amazon clicks to sales
};

/**
 * Load analytics data
 */
async function loadAnalytics() {
  const analyticsPath = path.join(__dirname, '../analytics/daily-metrics.json');
  
  try {
    const data = await fs.readFile(analyticsPath, 'utf8');
    return JSON.parse(data);
  } catch (_error) {
    // File doesn't exist yet, return empty array
    return [];
  }
}

/**
 * Save analytics data
 */
async function saveAnalytics(data) {
  const analyticsDir = path.join(__dirname, '../analytics');
  await fs.mkdir(analyticsDir, { recursive: true });
  
  const analyticsPath = path.join(analyticsDir, 'daily-metrics.json');
  await fs.writeFile(analyticsPath, JSON.stringify(data, null, 2));
  
  console.log(`Analytics saved to: ${analyticsPath}`);
}

/**
 * Add daily metrics entry
 */
async function addDailyEntry(metrics) {
  const data = await loadAnalytics();
  
  // Validate metrics
  const entry = {
    ...METRICS_TEMPLATE,
    ...metrics,
    date: metrics.date || new Date().toISOString().split('T')[0]
  };
  
  // Calculate derived metrics
  entry.avgCommission = entry.sales > 0 ? (entry.revenue / entry.sales).toFixed(2) : 0;
  entry.profileVisitRate = entry.totalViews > 0 ? ((entry.profileVisits / entry.totalViews) * 100).toFixed(2) : 0;
  entry.linkClickRate = entry.profileVisits > 0 ? ((entry.linkClicks / entry.profileVisits) * 100).toFixed(2) : 0;
  entry.conversionRate = entry.amazonClicks > 0 ? ((entry.sales / entry.amazonClicks) * 100).toFixed(2) : 0;
  entry.goalMet = entry.revenue >= KPI_GOALS.revenue;
  
  // Add to data
  data.push(entry);
  
  await saveAnalytics(data);
  return entry;
}

/**
 * Get summary statistics
 */
async function getSummary(days = 7) {
  const data = await loadAnalytics();
  
  if (data.length === 0) {
    return null;
  }
  
  // Get last N days
  const recentData = data.slice(-days);
  
  const summary = {
    period: `Last ${days} days`,
    totalRevenue: 0,
    totalSales: 0,
    totalViews: 0,
    avgDailyRevenue: 0,
    avgCommission: 0,
    daysMetGoal: 0,
    bestDay: null,
    trends: {}
  };
  
  recentData.forEach(day => {
    summary.totalRevenue += parseFloat(day.revenue) || 0;
    summary.totalSales += parseInt(day.sales) || 0;
    summary.totalViews += parseInt(day.totalViews) || 0;
    
    if (day.goalMet) {
      summary.daysMetGoal++;
    }
    
    if (!summary.bestDay || day.revenue > summary.bestDay.revenue) {
      summary.bestDay = day;
    }
  });
  
  summary.avgDailyRevenue = (summary.totalRevenue / days).toFixed(2);
  summary.avgCommission = summary.totalSales > 0 ? (summary.totalRevenue / summary.totalSales).toFixed(2) : 0;
  summary.goalAchievementRate = ((summary.daysMetGoal / days) * 100).toFixed(1);
  
  return summary;
}

/**
 * Display metrics report
 */
function displayMetricsReport(entry) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`DAILY METRICS REPORT - ${entry.date}`);
  console.log('='.repeat(60));
  
  console.log('\n📊 PERFORMANCE METRICS:\n');
  
  const metrics = [
    { label: 'Videos Posted', value: entry.videosPosted, goal: KPI_GOALS.videosPosted, unit: '' },
    { label: 'Total Views', value: entry.totalViews, goal: KPI_GOALS.totalViews, unit: '' },
    { label: 'Profile Visits', value: entry.profileVisits, goal: KPI_GOALS.profileVisits, unit: '', rate: `${entry.profileVisitRate}%` },
    { label: 'Link Clicks', value: entry.linkClicks, goal: KPI_GOALS.linkClicks, unit: '', rate: `${entry.linkClickRate}%` },
    { label: 'Amazon Clicks', value: entry.amazonClicks, goal: KPI_GOALS.amazonClicks, unit: '' },
    { label: 'Sales', value: entry.sales, goal: KPI_GOALS.sales, unit: '' },
    { label: 'Revenue', value: entry.revenue, goal: KPI_GOALS.revenue, unit: '$', highlight: true },
    { label: 'Avg Commission', value: entry.avgCommission, goal: 100, unit: '$' }
  ];
  
  metrics.forEach(metric => {
    const status = metric.value >= metric.goal ? '✅' : '❌';
    const value = metric.unit === '$' ? `$${metric.value}` : metric.value.toLocaleString();
    const goal = metric.unit === '$' ? `$${metric.goal}` : metric.goal.toLocaleString();
    const rate = metric.rate ? ` (${metric.rate})` : '';
    
    if (metric.highlight) {
      console.log(`\n${status} ${metric.label}: ${value} / ${goal} goal${rate}`);
      console.log('─'.repeat(60));
    } else {
      console.log(`${status} ${metric.label}: ${value} / ${goal} goal${rate}`);
    }
  });
  
  console.log('\n📈 CONVERSION RATES:\n');
  console.log(`  Profile Visit Rate: ${entry.profileVisitRate}% (Goal: ${KPI_GOALS.profileVisitRate}%)`);
  console.log(`  Link Click Rate: ${entry.linkClickRate}% (Goal: ${KPI_GOALS.linkClickRate}%)`);
  console.log(`  Conversion Rate: ${entry.conversionRate}% (Goal: ${KPI_GOALS.conversionRate}%)`);
  
  if (entry.topProducts && entry.topProducts.length > 0) {
    console.log('\n🏆 TOP PERFORMING PRODUCTS:\n');
    entry.topProducts.forEach((product, i) => {
      console.log(`  ${i + 1}. ${product.name} - $${product.commission} commission`);
    });
  }
  
  console.log(`\n${entry.goalMet ? '🎉 GOAL MET! 🎉' : '⚠️  Goal not met - see recommendations below'}`);
  console.log(`${'='.repeat(60)}\n`);
}

/**
 * Display summary report
 */
function displaySummaryReport(summary) {
  if (!summary) {
    console.log('No data available yet. Add daily metrics first.');
    return;
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`SUMMARY REPORT - ${summary.period}`);
  console.log('='.repeat(60));
  
  console.log('\n💰 REVENUE SUMMARY:\n');
  console.log(`  Total Revenue: $${summary.totalRevenue.toFixed(2)}`);
  console.log(`  Avg Daily Revenue: $${summary.avgDailyRevenue}`);
  console.log(`  Total Sales: ${summary.totalSales}`);
  console.log(`  Avg Commission: $${summary.avgCommission}`);
  console.log(`  Total Views: ${summary.totalViews.toLocaleString()}`);
  
  console.log('\n🎯 GOAL ACHIEVEMENT:\n');
  console.log(`  Days Met Goal: ${summary.daysMetGoal}/${summary.period.match(/\d+/)[0]}`);
  console.log(`  Success Rate: ${summary.goalAchievementRate}%`);
  
  if (summary.bestDay) {
    console.log('\n🏆 BEST DAY:\n');
    console.log(`  Date: ${summary.bestDay.date}`);
    console.log(`  Revenue: $${summary.bestDay.revenue}`);
    console.log(`  Sales: ${summary.bestDay.sales}`);
    console.log(`  Views: ${summary.bestDay.totalViews.toLocaleString()}`);
  }
  
  console.log(`\n${'='.repeat(60)}\n`);
}

/**
 * Generate recommendations based on metrics
 */
function generateRecommendations(entry) {
  const recommendations = [];
  
  if (entry.totalViews < KPI_GOALS.totalViews) {
    recommendations.push('📹 Increase posting frequency or improve content virality');
    recommendations.push('   - Use trending sounds and hashtags');
    recommendations.push('   - Post at optimal times (see guide)');
    recommendations.push('   - Analyze competitors\' viral content');
  }
  
  if (entry.profileVisitRate < KPI_GOALS.profileVisitRate) {
    recommendations.push('🎯 Improve video hooks to drive profile visits');
    recommendations.push('   - Strengthen CTAs in videos');
    recommendations.push('   - Add curiosity gaps');
    recommendations.push('   - Test different hook formats');
  }
  
  if (entry.linkClickRate < KPI_GOALS.linkClickRate) {
    recommendations.push('🔗 Optimize bio and link presentation');
    recommendations.push('   - Improve bio copy');
    recommendations.push('   - Add urgency to link descriptions');
    recommendations.push('   - Use better link-in-bio tool');
  }
  
  if (entry.conversionRate < KPI_GOALS.conversionRate) {
    recommendations.push('💰 Focus on higher-converting products');
    recommendations.push('   - Switch to higher-ticket items');
    recommendations.push('   - Choose products with better reviews');
    recommendations.push('   - Improve product demonstration quality');
  }
  
  if (entry.avgCommission < 100) {
    recommendations.push('📈 Increase average commission per sale');
    recommendations.push('   - Focus on $1,000+ products');
    recommendations.push('   - Target 8-10% commission categories');
    recommendations.push('   - See product research guide');
  }
  
  if (recommendations.length > 0) {
    console.log('💡 RECOMMENDATIONS:\n');
    recommendations.forEach(rec => console.log(rec));
    console.log('');
  }
}

/**
 * Interactive CLI for adding metrics
 */
async function interactiveEntry() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = prompt => new Promise(resolve => {
    readline.question(prompt, resolve);
  });
  
  try {
    console.log('\n📊 Daily Metrics Entry\n');
    console.log('Enter today\'s metrics (press Enter to skip optional fields):\n');
    
    const metrics = {};
    
    metrics.videosPosted = parseInt(await question('Videos Posted: ')) || 0;
    metrics.totalViews = parseInt(await question('Total Views: ')) || 0;
    metrics.profileVisits = parseInt(await question('Profile Visits: ')) || 0;
    metrics.linkClicks = parseInt(await question('Link Clicks: ')) || 0;
    metrics.amazonClicks = parseInt(await question('Amazon Clicks: ')) || 0;
    metrics.sales = parseInt(await question('Sales: ')) || 0;
    metrics.revenue = parseFloat(await question('Revenue ($): ')) || 0;
    metrics.notes = await question('Notes (optional): ') || '';
    
    const entry = await addDailyEntry(metrics);
    displayMetricsReport(entry);
    generateRecommendations(entry);
    
    return entry;
  } finally {
    readline.close();
  }
}

// CLI execution
if (require.main === module) {
  const command = process.argv[2];
  
  (async () => {
    try {
      if (command === 'add') {
        await interactiveEntry();
        console.log('✅ Metrics saved successfully!');
        process.exit(0);
      } else if (command === 'summary') {
        const days = parseInt(process.argv[3]) || 7;
        const summary = await getSummary(days);
        displaySummaryReport(summary);
        process.exit(0);
      } else {
        console.log('\nUsage:');
        console.log('  node analyticsTracker.js add         - Add daily metrics (interactive)');
        console.log('  node analyticsTracker.js summary [7] - Show summary (default: last 7 days)');
        console.log('');
        process.exit(0);
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = {
  addDailyEntry,
  getSummary,
  displayMetricsReport,
  displaySummaryReport,
  generateRecommendations
};
