// Direct test of review submission using server action
// This simulates what happens when the form is submitted

const testDirectReviewSubmission = async () => {
  console.log('Testing direct review submission...');
  
  // Create FormData as it would be created by the form
  const formData = new FormData();
  formData.append('productId', 'c3d4e5f6-a7b8-9012-3456-7890abcdef01');
  formData.append('name', 'Test User Direct');
  formData.append('email', 'testdirect@example.com');
  formData.append('rating', '5');
  formData.append('title', 'Direct Test Review');
  formData.append('content', 'This is a direct test of the review submission functionality.');
  
  try {
    //