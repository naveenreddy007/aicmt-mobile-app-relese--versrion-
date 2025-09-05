# Stories System Manual Testing Guide

This guide provides step-by-step instructions for manually testing the stories system functionality after the validation fixes.

## Prerequisites

1. **Server Running**: Ensure the development server is running on `http://localhost:3001`
2. **Admin Access**: Have admin credentials ready for login
3. **Test Data**: Use the sample data provided in this guide

## Test Environment Setup

```bash
# Ensure server is running
npm run dev

# Server should be accessible at:
# http://localhost:3001
```

## 1. Journey Milestones Testing

### Navigation Test
1. Open browser and go to `http://localhost:3001/admin`
2. Log in with admin credentials
3. Navigate to **Stories** section
4. Click on **Journey Milestones**
5. Click **Add New Milestone** button

### Form Testing
**URL**: `http://localhost:3001/admin/stories/journey/new`

**Test Data**:
```
Title: Company Foundation
Description: The beginning of our journey in sustainable manufacturing
Year: 2020
Image URL: (leave empty or use valid URL)
Display Order: 1
```

**Test Steps**:
1. ✅ Verify form loads without errors
2. ✅ Check that all fields are present:
   - Title (required)
   - Description (required)
   - Year (required)
   - Image URL (optional)
   - Display Order (optional)
3. ✅ Test media library functionality:
   - Click "Select from Media Library" button
   - Verify media library modal opens
   - Check that images load properly
4. ✅ Fill in the form with test data
5. ✅ Submit the form
6. ✅ Verify no "Invalid form data" error occurs
7. ✅ Check successful redirect to journey milestones list
8. ✅ Confirm new entry appears in the list

### Validation Testing
**Test empty required fields**:
1. Leave Title empty → Should show validation error
2. Leave Description empty → Should show validation error
3. Leave Year empty → Should show validation error
4. Enter invalid year (e.g., "abc") → Should show validation error
5. Enter invalid URL in Image URL → Should show validation error

## 2. Team Members Testing

### Navigation Test
1. From admin dashboard, go to **Stories** → **Team Members**
2. Click **Add New Team Member**

### Form Testing
**URL**: `http://localhost:3001/admin/stories/team/new`

**Test Data**:
```
Name: John Smith
Role: Senior Engineer
Description: Experienced engineer specializing in sustainable manufacturing processes
Image URL: (leave empty or use valid URL)
Display Order: 1
```

**Test Steps**:
1. ✅ Verify form loads without errors
2. ✅ Check all required fields are present:
   - Name (required)
   - Role (required)
   - Description (required)
   - Image URL (optional)
   - Display Order (optional)
3. ✅ Test media library functionality
4. ✅ Fill in form with test data
5. ✅ Submit form
6. ✅ Verify successful creation
7. ✅ Check entry appears in team members list

### Validation Testing
- Test empty Name field
- Test empty Role field
- Test empty Description field
- Test invalid Image URL

## 3. Achievements Testing

### Navigation Test
1. Go to **Stories** → **Achievements**
2. Click **Add New Achievement**

### Form Testing
**URL**: `http://localhost:3001/admin/stories/achievements/new`

**Test Data**:
```
Title: ISO 14001 Certification
Description: Achieved environmental management system certification
Year: 2023
Image URL: (leave empty or use valid URL)
Display Order: 1
```

**Test Steps**:
1. ✅ Verify form loads without errors
2. ✅ Check all fields are present:
   - Title (required)
   - Description (required)
   - Year (required)
   - Image URL (optional)
   - Display Order (optional)
3. ✅ Test media library functionality
4. ✅ Fill in form with test data
5. ✅ Submit form
6. ✅ Verify successful creation
7. ✅ Check entry appears in achievements list

### Validation Testing
- Test empty Title field
- Test empty Description field
- Test empty Year field
- Test invalid year format
- Test invalid Image URL

## 4. Impact Stories Testing

### Navigation Test
1. Go to **Stories** → **Impact Stories**
2. Click **Add New Impact Story**

### Form Testing
**URL**: `http://localhost:3001/admin/stories/impact/new`

**Test Data**:
```
Title: Waste Reduction Initiative
Description: Implemented comprehensive waste reduction program
Impact Metrics: 50% reduction in waste, 30% cost savings
Year: 2023
Image URL: (leave empty or use valid URL)
Display Order: 1
```

**Test Steps**:
1. ✅ Verify form loads without errors
2. ✅ Check all fields are present:
   - Title (required)
   - Description (required)
   - Impact Metrics (required)
   - Year (required)
   - Image URL (optional)
   - Display Order (optional)
3. ✅ Test media library functionality
4. ✅ Fill in form with test data
5. ✅ Submit form
6. ✅ Verify successful creation
7. ✅ Check entry appears in impact stories list

### Validation Testing
- Test empty Title field
- Test empty Description field
- Test empty Impact Metrics field
- Test empty Year field
- Test invalid year format
- Test invalid Image URL

## 5. Frontend Display Verification

### Test Frontend Display
1. Navigate to main website: `http://localhost:3001`
2. Look for stories section on homepage
3. Verify that newly created stories appear:
   - Journey milestones should be visible
   - Team members should be displayed
   - Achievements should be shown
   - Impact stories should be present
4. Check that images display correctly (if URLs were provided)
5. Verify proper ordering based on display_order values

## 6. Error Handling Tests

### Test Edge Cases
1. **Network Issues**: Disconnect internet and try submitting forms
2. **Large Data**: Enter very long descriptions (>1000 characters)
3. **Special Characters**: Use special characters in text fields
4. **SQL Injection**: Try entering SQL commands in text fields
5. **XSS**: Try entering script tags in text fields

### Expected Behaviors
- Forms should show appropriate error messages
- No "Invalid form data" errors should occur with valid data
- Invalid data should be rejected with clear error messages
- Security vulnerabilities should be prevented

## 7. Media Library Testing

### Test Media Library Functionality
1. In any story form, click "Select from Media Library"
2. ✅ Verify modal opens without errors
3. ✅ Check that existing images load
4. ✅ Test image selection functionality
5. ✅ Verify selected image URL populates in form
6. ✅ Test closing modal without selection
7. ✅ Test uploading new images (if functionality exists)

## 8. Data Persistence Testing

### Verify Data Persistence
1. Create entries in all story categories
2. Refresh the browser
3. Navigate back to admin lists
4. ✅ Verify all created entries are still present
5. ✅ Check that data is correctly displayed
6. ✅ Test editing existing entries
7. ✅ Test deleting entries
8. ✅ Verify changes persist after page refresh

## Success Criteria

### All tests should pass with:
- ✅ No "Invalid form data" errors
- ✅ All forms submit successfully with valid data
- ✅ Proper validation errors for invalid data
- ✅ Media library loads and functions correctly
- ✅ New entries appear in admin lists
- ✅ Stories display correctly on frontend
- ✅ Data persists across page refreshes
- ✅ No console errors in browser developer tools

## Troubleshooting

### Common Issues and Solutions

**"Invalid form data" error**:
- Check that all required fields are filled
- Ensure image_url is either empty string or valid URL
- Verify year is a valid number
- Check display_order is a valid number

**Media library not loading**:
- Check browser console for JavaScript errors
- Verify server is running properly
- Check network connectivity

**Forms not submitting**:
- Check browser console for errors
- Verify CSRF tokens are present
- Check server logs for backend errors

**Stories not appearing on frontend**:
- Verify entries are marked as active/published
- Check that display_order is set correctly
- Ensure frontend components are properly fetching data

## Test Results Template

```
## Test Results - [Date]

### Journey Milestones
- [ ] Form loads correctly
- [ ] Validation works properly
- [ ] Submission successful
- [ ] Entry appears in list
- [ ] Frontend display correct

### Team Members
- [ ] Form loads correctly
- [ ] Validation works properly
- [ ] Submission successful
- [ ] Entry appears in list
- [ ] Frontend display correct

### Achievements
- [ ] Form loads correctly
- [ ] Validation works properly
- [ ] Submission successful
- [ ] Entry appears in list
- [ ] Frontend display correct

### Impact Stories
- [ ] Form loads correctly
- [ ] Validation works properly
- [ ] Submission successful
- [ ] Entry appears in list
- [ ] Frontend display correct

### Media Library
- [ ] Opens without errors
- [ ] Images load properly
- [ ] Selection works correctly

### Overall Assessment
- [ ] All forms working properly
- [ ] No validation errors with valid data
- [ ] Frontend display correct
- [ ] Data persistence verified

Notes: [Add any additional observations or issues]
```