# **App Name**: LinkJSON

## Core Features:

- Profile Data Input Form: Form on the index page allowing users to input their name, bio, avatar URL, and links (label and URL).
- Dynamic Link Input: Enable adding multiple links dynamically within the input form.
- JSON Generation and Export: Generate a JSON object from the form data and present it in an alert for copying. As a tool, ensure that the 'avatar' field will fallback to an auto-generated profile picture if an invalid url is supplied. (uses AI for URL checking, or generating the profile picture).
- Dynamic Profile Page: Create dynamic profile pages at /user/[username] that fetch user data from /public/users/[username].json.
- Profile Display: Display the profile picture, name, and bio at the top of the profile page.
- Link Rendering: Render all links from the JSON data as styled buttons on the profile page.
- Loading State: Show a loading state while the JSON data is being fetched.

## Style Guidelines:

- Primary color: Cool lavender (#B5B8DA), providing a modern and clean aesthetic.
- Background color: Light grey (#F0F2F5), to provide a clean, bright backdrop for the content.
- Accent color: Soft Blue (#94A7D9), to provide subtle contrast, focus, and visual interest, especially for interactive elements and highlights.
- Body and headline font: 'Inter' sans-serif, for a modern and readable design. 
- Center the profile card and ensure responsiveness for mobile devices using Tailwind CSS.
- Implement smooth transitions and hover effects for buttons using Tailwind CSS transitions.
- Add icons to link buttons to improve usability.