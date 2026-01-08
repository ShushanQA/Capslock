import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';

/**
 * Custom reporter that generates a human-readable test summary report
 */
class TestSummaryReporter implements Reporter {
  private allTests: Array<{ name: string; status: string; duration: number; isBug: boolean }> = [];
  private summaryPath = 'playwright-report/test-summary.md';

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`\n📋 Starting test run...\n`);
    console.log(`⚠️  Note: Bug documentation tests (Bug 1-6) are EXPECTED to fail when bugs exist.`);
    console.log(`   This is normal behavior - these tests document bugs in the system.\n`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const isBug = test.title.toLowerCase().includes('bug');
    const status = result.status === 'passed' ? '✅ PASSED' : 
                   result.status === 'failed' ? (isBug ? '⚠️  FAILED (Expected - Bug Exists)' : '❌ FAILED') :
                   '⏭️  SKIPPED';
    
    this.allTests.push({
      name: test.title,
      status: status,
      duration: result.duration,
      isBug: isBug,
    });
  }

  onEnd(result: FullResult) {
    this.generateSummary(result);
  }

  private generateSummary(result: FullResult) {
    const fs = require('fs');
    const path = require('path');
    
    const passedTests = this.allTests.filter(t => t.status.includes('PASSED'));
    const failedTests = this.allTests.filter(t => t.status.includes('FAILED'));
    const bugTests = this.allTests.filter(t => t.isBug);
    const validationTests = this.allTests.filter(t => !t.isBug);
    
    const bugTestsPassed = bugTests.filter(t => t.status.includes('PASSED')).length;
    const bugTestsFailed = bugTests.filter(t => t.status.includes('FAILED')).length;
    const validationTestsPassed = validationTests.filter(t => t.status.includes('PASSED')).length;
    const validationTestsFailed = validationTests.filter(t => t.status.includes('FAILED')).length;

    let summary = `# 🧪 Test Execution Summary\n\n`;
    summary += `**Generated:** ${new Date().toLocaleString()}\n\n`;
    summary += `---\n\n`;

    summary += `## 📊 Overall Statistics\n\n`;
    summary += `| Metric | Count |\n`;
    summary += `|--------|-------|\n`;
    summary += `| **Total Tests** | ${this.allTests.length} |\n`;
    summary += `| ✅ **Passed** | ${passedTests.length} |\n`;
    summary += `| ⚠️ **Failed** | ${failedTests.length} |\n`;
    summary += `| **Duration** | ${(result.duration / 1000).toFixed(2)}s |\n\n`;

    summary += `## 📋 Test Results by Category\n\n`;
    
    summary += `### ✅ Validation Tests (Core Functionality)\n\n`;
    summary += `| Status | Count | Description |\n`;
    summary += `|--------|-------|-------------|\n`;
    summary += `| ✅ Passed | ${validationTestsPassed} | Core functionality tests working correctly |\n`;
    summary += `| ❌ Failed | ${validationTestsFailed} | Core functionality issues (needs attention) |\n\n`;
    
    if (validationTestsPassed > 0) {
      summary += `**Passed Validation Tests:**\n`;
      validationTests.filter(t => t.status.includes('PASSED')).forEach(test => {
        summary += `- ✅ ${test.name}\n`;
      });
      summary += `\n`;
    }
    
    if (validationTestsFailed > 0) {
      summary += `**Failed Validation Tests:**\n`;
      validationTests.filter(t => t.status.includes('FAILED')).forEach(test => {
        summary += `- ❌ ${test.name}\n`;
      });
      summary += `\n`;
    }

    summary += `### ⚠️ Bug Documentation Tests\n\n`;
    summary += `| Status | Count | Description |\n`;
    summary += `|--------|-------|-------------|\n`;
    summary += `| ✅ Passed | ${bugTestsPassed} | Bugs fixed - tests now pass! |\n`;
    summary += `| ⚠️ Failed | ${bugTestsFailed} | Bugs still exist (expected behavior) |\n\n`;
    
    summary += `**📌 Important:** Bug documentation tests are **designed to fail** when bugs exist in the system. `;
    summary += `This is expected behavior. Tests will pass once bugs are fixed.\n\n`;
    
    if (bugTestsPassed > 0) {
      summary += `**Bugs Fixed (Tests Passing):**\n`;
      bugTests.filter(t => t.status.includes('PASSED')).forEach(test => {
        const bugNumber = test.name.match(/Bug (\d+)/)?.[1] || '';
        summary += `- ✅ Bug ${bugNumber}: ${test.name.replace(/Bug \d+: /, '')} - **FIXED!**\n`;
      });
      summary += `\n`;
    }

    summary += `---\n\n`;
    summary += `## 📝 Notes\n\n`;
    summary += `- **Bug Tests:** These tests document bugs in the system. When they fail, it means bugs still exist (expected behavior).\n`;
    summary += `- **Validation Tests:** These test core functionality and should always pass.\n`;
    summary += `- **Test Reports:** Check the HTML report in \`playwright-report/index.html\` for detailed information.\n`;
    summary += `- **Screenshots:** Visual evidence is available in the \`screenshots/\` directory.\n`;

    // Ensure directory exists
    const dir = path.dirname(this.summaryPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(this.summaryPath, summary);
    console.log(`\n📄 Test summary report generated: ${this.summaryPath}\n`);
  }
}

export default TestSummaryReporter;

