document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // when submiting form call send_email function
  document.querySelector("#compose-form").addEventListener('submit', submit_compose);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#emails-detail').style.display = 'none';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}



function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-detail').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Load emails  
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {

      emails.forEach(email => {
        const emailContent = document.createElement('div');
        emailContent.classList = "d-flex flex-row border border-dark";
        emailContent.classList.add("email-style");
        emailContent.innerHTML = `
          <div class="p-2"><strong>${email.sender}</strong></div>
          <div class="p-2">${email.subject}</div>
          <div class="p-2 flex-grow-1 text-right ">${email.timestamp}</div>
        
        `;

        // change background color according to read or not
        emailContent.classList.add(email.read ? 'read' : 'unread');
        
        // when clicking on email, load email content
        emailContent.addEventListener('click', () => {
          view_email(email.id, mailbox)
        });
        document.querySelector('#emails-view').append(emailContent);
      })

    })

}

function submit_compose(event) {
  event.preventDefault()

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  
  // store data
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    // Print result
    console.log(result);
    load_mailbox('sent');
  })
  // return false;

}


function view_email(id, mailbox) {
  let state = false;
  console.log(mailbox)
  if (mailbox === "sent") {
    state = true;
  }

  // loading email content 
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      console.log(email);
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#emails-detail').style.display = 'block';

      archive = email.archived ? "Unarchive" : "Archive";
      document.querySelector('#emails-detail').innerHTML = `
        <div><strong>From:</strong>${email.sender}</div>
        <div><strong>To:</strong>${email.recipients}</div>
        <div><strong>Subject:</strong> ${email.subject}</div>
        <div><strong>Timestamp:</strong>${email.timestamp}</div>
        <button class="btn btn-sm btn-outline-primary " id="reply" onclick="reply('${email.id}');">Reply</button>
        <button class="btn btn-sm btn-outline-primary " id="archive" onclick="archive_email(${email.id}, ${email.archived});">${archive}</button>
        <hr>
        <pre>${email.body}</pre>
      `;
      console.log(email.body);

      //Change state to read 
      if (!email.read) {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        })
      }

      //if the email inside sent inbox remove archive button 
      if (state) {
        document.querySelector('#archive').style.display = 'none';
      }

    });

}


//Archive function
function archive_email(id, archived) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: !archived
    })
  })
    .then(() => {
      load_mailbox('inbox')
    })
};

//Replying Email
function reply(id) {
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      compose_email();
      document.querySelector('#compose-recipients').value = email.sender;
      let subject = email.subject;
      if (subject.split(' ', 1)[0] !== "Re:") {
        subject = "Re: " + email.subject;
      }
      document.querySelector('#compose-subject').value = subject;
      document.querySelector('#compose-body').value = `\n On ${email.timestamp} ${email.sender} wrote:${email.body} \n `;
    });
};
