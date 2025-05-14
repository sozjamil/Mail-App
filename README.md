# Mail Web Application

A single-page email client built with **JavaScript**, **HTML**, and **CSS** that interacts with a Django backend API.
Here is a demo video: https://youtu.be/LDimYMVKIRc

## 🛠️ Technologies Used
- **Frontend**:  
  ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)  
  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5)  
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3)  
- **Backend API**: Django REST Framework (pre-provided)
- **Architecture**: Single-Page Application (SPA)

## 🚀 How to Run the Project

### Prerequisites
- Python 3.x
- Django (if running backend locally)
- Web browser (Chrome/Firefox recommended)

### Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/email-client.git
   cd email-client

## Implementation Requirements
All functionality must be implemented in `inbox.js` only.

### 1. Send Mail
- When the email composition form is submitted:
  - Make a POST request to `/emails` with:
    - `recipients`
    - `subject` 
    - `body`
  - After sending, load the user's Sent mailbox

### 2. Mailbox Navigation
- When visiting Inbox, Sent, or Archive:
  - Make GET request to `/emails/<mailbox>` for emails
  - Display mailbox name at top of page
  - Render each email in a bordered `<div>` showing:
    - Sender
    - Subject 
    - Timestamp
  - Visual styling:
    - Unread emails: white background
    - Read emails: gray background

### 3. View Email
- When clicking an email:
  - Make GET request to `/emails/<email_id>`
  - Display email view showing:
    - Sender
    - Recipients
    - Subject
    - Timestamp
    - Body
  - Add new `div` in `inbox.html` for email display
  - Hide/show appropriate views when navigating
  - Mark email as read (PUT request to `/emails/<email_id>`)

### 4. Archive/Unarchive
- For received emails (not Sent mailbox):
  - Inbox emails: show "Archive" button
  - Archived emails: show "Unarchive" button
- Update status via PUT request to `/emails/<email_id>`
- After archiving/unarchiving, reload Inbox

### 5. Reply Functionality
- When viewing an email:
  - Show "Reply" button
  - On click:
    - Open composition form
    - Pre-fill fields:
      - Recipient: original sender
      - Subject: 
        - Original subject → "Re: subject"
        - Existing "Re:" → leave unchanged
      - Body: 
        ```
        On [timestamp] [sender] wrote:
        [original message]
        ```

## Technical Notes
- All API interactions use REST endpoints
- State management handled through DOM manipulation
- Single-page application architecture
- Responsive design required
