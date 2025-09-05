in admin :products -> able o create new catageries 
in /en/products page is rewies not working when i try give reviews with photo
      error"Console Error


Error: Cannot read properties of null (reading 'reset')

components\review-form.tsx (96:25) @ handleSubmit


  94 |
  95 |         // Reset form
> 96 |         e.currentTarget.reset()
     |                         ^
  97 |         setRating(0)
  98 |         setImages([])
  99 |         setImageUrls([])
Call Stack
1

handleSubmit
components\review-form.tsx (96:25)
Console Error


Error: Cannot read properties of null (reading 'reset')

components\review-form.tsx (96:25) @ handleSubmit


  94 |
  95 |         // Reset form
> 96 |         e.currentTarget.reset()
     |                         ^
  97 |         setRating(0)
  98 |         setImages([])
  99 |         setImageUrls([])
Call Stack
1

handleSubmit
components\review-form.tsx (96:25)
"


