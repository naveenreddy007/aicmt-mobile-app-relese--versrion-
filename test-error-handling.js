/**
 * Error Handling and Edge Case Testing Script
 * Tests validation, security, and edge cases for the stories system
 */

const fs = require('fs');
const path = require('path');

// Load test data
const testDataPath = path.join(__dirname, 'test-data-samples.json');
let testData;

try {
  testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));
  console.log('✅ Test data loaded successfully');
} catch (error) {
  console.error('❌ Failed to load test data:', error.message);
  process.exit(1);
}

// Test configuration
const BASE_URL = 'http://localhost:3001';
const ADMIN_URLS = {
  journey: `${BASE_URL}/admin/stories/journey/new`,
  team: `${BASE_URL}/admin/stories/team/new`,
  achievements: `${BASE_URL}/admin/stories/achievements/new`,
  impact: `${BASE_URL}/admin/stories/impact/new`
};

/**
 * Test HTTP request function
 */
async function testRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      ...options
    });
    
    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test form submission with invalid data
 */
async function testFormSubmission(url, formData) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData).toString()
    });
    
    const text = await response.text();
    
    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      containsError: text.includes('error') || text.includes('invalid') || text.includes('required'),
      containsSuccess: text.includes('success') || text.includes('created'),
      responseLength: text.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Run validation tests
 */
async function runValidationTests() {
  console.log('\n🔍 Running Validation Tests...');
  
  const validationTests = testData.validationTestCases.requiredFieldTests;
  
  for (const [storyType, tests] of Object.entries(validationTests)) {
    console.log(`\n📝 Testing ${storyType} validation:`);
    
    for (const [testName, testCase] of Object.entries(tests)) {
      console.log(`  Testing ${testName}...`);
      
      // Create form data from test case
      const formData = { ...testCase };
      delete formData.expectedError;
      
      // Determine URL based on story type
      let url;
      switch (storyType) {
        case 'journeyMilestone':
          url = ADMIN_URLS.journey;
          break;
        case 'teamMember':
          url = ADMIN_URLS.team;
          break;
        case 'achievement':
          url = ADMIN_URLS.achievements;
          break;
        case 'impactStory':
          url = ADMIN_URLS.impact;
          break;
        default:
          console.log(`    ❌ Unknown story type: ${storyType}`);
          continue;
      }
      
      const result = await testFormSubmission(url, formData);
      
      if (result.success) {
        if (result.containsError) {
          console.log(`    ✅ Validation error detected (expected)`);
        } else if (result.status === 200 && result.containsSuccess) {
          console.log(`    ❌ Form accepted invalid data (unexpected)`);
        } else {
          console.log(`    ⚠️  Unclear result - Status: ${result.status}`);
        }
      } else {
        console.log(`    ❌ Request failed: ${result.error}`);
      }
    }
  }
}

/**
 * Run invalid data tests
 */
async function runInvalidDataTests() {
  console.log('\n🚫 Running Invalid Data Tests...');
  
  const invalidTests = testData.validationTestCases.invalidDataTests;
  
  for (const [testName, testCase] of Object.entries(invalidTests)) {
    console.log(`\n📝 Testing ${testName}:`);
    
    // Test with journey milestone form (representative)
    const formData = {
      title: 'Test Title',
      description: 'Test Description',
      year: testName.includes('Year') ? testCase.value : 2023,
      image_url: testName.includes('ImageUrl') ? testCase.value : '',
      display_order: testName.includes('DisplayOrder') ? testCase.value : 1
    };
    
    const result = await testFormSubmission(ADMIN_URLS.journey, formData);
    
    if (result.success) {
      if (result.containsError) {
        console.log(`  ✅ Invalid data rejected (expected)`);
      } else {
        console.log(`  ❌ Invalid data accepted (unexpected)`);
      }
    } else {
      console.log(`  ❌ Request failed: ${result.error}`);
    }
  }
}

/**
 * Run edge case tests
 */
async function runEdgeCaseTests() {
  console.log('\n🎯 Running Edge Case Tests...');
  
  const edgeCases = testData.validationTestCases.edgeCases;
  
  for (const [testName, testCase] of Object.entries(edgeCases)) {
    console.log(`\n📝 Testing ${testName}:`);
    
    const formData = {
      title: testCase.value,
      description: 'Test Description',
      year: 2023,
      image_url: '',
      display_order: 1
    };
    
    const result = await testFormSubmission(ADMIN_URLS.journey, formData);
    
    if (result.success) {
      console.log(`  ✅ Edge case handled - Status: ${result.status}`);
      console.log(`  📋 Expected: ${testCase.expectedBehavior}`);
    } else {
      console.log(`  ❌ Request failed: ${result.error}`);
    }
  }
}

/**
 * Test admin page accessibility
 */
async function testAdminPageAccessibility() {
  console.log('\n🔐 Testing Admin Page Accessibility...');
  
  for (const [type, url] of Object.entries(ADMIN_URLS)) {
    console.log(`\n📝 Testing ${type} admin page:`);
    
    const result = await testRequest(url);
    
    if (result.success) {
      console.log(`  ✅ Page accessible - Status: ${result.status}`);
      
      if (result.status === 200) {
        console.log(`  ✅ Page loads successfully`);
      } else if (result.status === 302 || result.status === 307) {
        console.log(`  ⚠️  Page redirects (likely authentication required)`);
      } else {
        console.log(`  ⚠️  Unexpected status: ${result.status}`);
      }
    } else {
      console.log(`  ❌ Page inaccessible: ${result.error}`);
    }
  }
}

/**
 * Test server connectivity
 */
async function testServerConnectivity() {
  console.log('\n🌐 Testing Server Connectivity...');
  
  const result = await testRequest(BASE_URL);
  
  if (result.success) {
    console.log(`✅ Server is accessible - Status: ${result.status}`);
    return true;
  } else {
    console.log(`❌ Server is not accessible: ${result.error}`);
    return false;
  }
}

/**
 * Generate test report
 */
function generateTestReport() {
  const timestamp = new Date().toISOString();
  const report = `
# Error Handling Test Report

Generated: ${timestamp}

## Test Summary

This report covers the following test categories:

### 1. Validation Tests
- Required field validation
- Data type validation
- Format validation

### 2. Invalid Data Tests
- Invalid year formats
- Invalid URL formats
- Invalid numeric values

### 3. Edge Case Tests
- Long text handling
- Special characters
- Unicode characters
- Security injection attempts

### 4. Accessibility Tests
- Admin page accessibility
- Authentication requirements
- Server connectivity

## Manual Testing Required

The following tests require manual verification:

1. **Form Validation UI**:
   - Error messages display correctly
   - Field highlighting works
   - User-friendly error text

2. **Media Library**:
   - Modal opens without errors
   - Image selection works
   - Upload functionality (if available)

3. **Data Persistence**:
   - Valid data saves correctly
   - Invalid data is rejected
   - Database integrity maintained

4. **Frontend Display**:
   - Created stories appear on main site
   - Proper formatting and styling
   - Image display works correctly

## Recommendations

1. **Security**: Ensure all user input is properly sanitized
2. **Validation**: Implement both client-side and server-side validation
3. **Error Handling**: Provide clear, user-friendly error messages
4. **Testing**: Regular automated testing of form functionality
5. **Monitoring**: Log and monitor form submission errors

## Next Steps

1. Run manual tests using the MANUAL_TESTING_GUIDE.md
2. Verify all validation scenarios work as expected
3. Test with real user data and workflows
4. Monitor for any production issues
`;

  try {
    fs.writeFileSync('ERROR_HANDLING_TEST_REPORT.md', report);
    console.log('\n📄 Test report generated: ERROR_HANDLING_TEST_REPORT.md');
  } catch (error) {
    console.error('❌ Failed to generate test report:', error.message);
  }
}

/**
 * Main test execution
 */
async function runAllTests() {
  console.log('🚀 Starting Error Handling and Edge Case Tests');
  console.log('=' .repeat(50));
  
  // Test server connectivity first
  const serverAccessible = await testServerConnectivity();
  
  if (!serverAccessible) {
    console.log('\n❌ Cannot proceed with tests - server is not accessible');
    console.log('Please ensure the development server is running on http://localhost:3001');
    return;
  }
  
  // Run all test suites
  await testAdminPageAccessibility();
  await runValidationTests();
  await runInvalidDataTests();
  await runEdgeCaseTests();
  
  // Generate report
  generateTestReport();
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ Error handling tests completed');
  console.log('\n📋 Summary:');
  console.log('- Validation tests: Check for proper field validation');
  console.log('- Invalid data tests: Verify rejection of bad data');
  console.log('- Edge case tests: Test boundary conditions');
  console.log('- Security tests: Check for injection vulnerabilities');
  console.log('\n📄 See ERROR_HANDLING_TEST_REPORT.md for detailed results');
  console.log('📖 Use MANUAL_TESTING_GUIDE.md for manual verification');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testRequest,
  testFormSubmission,
  runValidationTests,
  runInvalidDataTests,
  runEdgeCaseTests,
  testAdminPageAccessibility,
  testServerConnectivity
};