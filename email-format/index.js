// Function to generate the working email template
const generateWorkingEmail = (url, user, trackId) => {
  const urlWithTrackId = `${url}?id=${trackId}`;
  return `
      <p>Dear <strong>${user.name}</strong>,</p>
      <p>Thank you for choosing MASHFiX Onsite Computer Repair. We’re thrilled to have the opportunity to assist you with your device. Your satisfaction is our top priority, and we’re committed to keeping you informed every step of the way.</p>
      
      <p><strong>Your Repair Track ID: ${trackId}</strong></p>
      <p>You can easily track the status of your repair by <a href="${urlWithTrackId}">clicking here</a>.</p>
      
      <p><strong>What Sets Us Apart?</strong></p>
      <ul>
        <li>Expert Technicians: Our certified professionals are dedicated to providing exceptional service.</li>
        <li>Swift Service: We understand your time is valuable, and we strive to return your device quickly.</li>
        <li>Quality Parts: We use only the highest quality parts to ensure your device functions like new.</li>
      </ul>
      
      <hr/>
      <p>We appreciate your business and look forward to delivering your repaired device soon. If you have any questions or need further assistance, please don’t hesitate to reach out to us.</p>
      
      <p>Warm Regards,<br>The MASHFiX Team</p>
      <p><a href="http://www.mashfix.com">www.mashfix.com</a></p>
      
      <p>Stay connected with us on <a href="https://www.facebook.com/ComputerRepairInDallas" target="_blank">Facebook</a>, <a href="https://www.youtube.com/@MASHFiX-repair" target="_blank">Youtube</a>, and <a href="https://www.linkedin.com/company/mashfix/"target="_blank">LinkedIn</a>.</p>
      <hr/>
      <p>We’re here to serve you with excellence!</p>
  `;
};

const generateCompletedEmail = (user, trackId) => {
  return `
      <p>Dear <strong>${user.name}</strong>,</p>
      </br>
      <p>We are pleased to inform you that your laptop has been successfully repaired and is now ready for pickup.</p>
      </br>
      <span><strong>Pickup Details: Location: </strong>MASHFiX Onsite Computer Repair 1001 W Euless Blvd suite 417, Euless, TX 76040</span>
     
      <p><strong>Pickup Hours: </strong>11am - 6PM</p>
    
      </br>
      <p>Please bring a valid ID and a copy of this email when you come to collect your device.</p>
      </br>
      <p>If you have any questions or need further assistance, feel free to contact us at 682-235-7712 or reply to this email.</p>
     </br>
      <p>Warm Regards,<br>The MASHFiX Team</p>
      <p><a href="http://www.mashfix.com">www.mashfix.com</a></p>
      
      <p>Stay connected with us on <a href="https://www.facebook.com/ComputerRepairInDallas" target="_blank">Facebook</a>, <a href="https://www.youtube.com/@MASHFiX-repair" target="_blank">Youtube</a>, and <a href="https://www.linkedin.com/company/mashfix/"target="_blank">LinkedIn</a>.</p>
      <hr/>
      <p>We’re here to serve you with excellence!</p>
  `;
};

// Function to generate the receipt email template
const generateReceiptEmail = (user) => {
  return `
      <p>Dear <strong>${user.name}</strong>,</p>
      <p>We have processed your payment, and your receipt is attached to this email for your records.</p>
      <p>Thank you for choosing MASHFiX Onsite Computer Repair. We appreciate your business and look forward to serving you again in the future.</p>
      
      <p><strong>Warranty Information:</strong></p>
      <p>We are pleased to inform you that all repairs come with a one-month warranty from today. If you encounter any issues related to the service provided, please contact us within this period for assistance.</p>
      <p>If you have any questions or need further assistance, please do not hesitate to contact us at
682-235-7712 or reply to this email.
</p>
      <p><strong>WExclusive Offer for Our Valued Customers!</strong></p>
 
      <p>As a thank you for your trust, we’re offering a 15% discount on your next repair. Use the code <strong>LOYALTY15</strong> at checkout to redeem this offer.</p>
      <hr/>

      <p>Warm Regards,<br>The MASHFiX Team</p>
      <p><a href="http://www.mashfix.com">www.mashfix.com</a></p>
      
      <p>Stay connected with us on <a href="https://www.facebook.com/ComputerRepairInDallas" target="_blank">Facebook</a>, <a href="https://www.youtube.com/@MASHFiX-repair" target="_blank">Youtube</a>, and <a href="https://www.linkedin.com/company/mashfix/"target="_blank">LinkedIn</a>.</p>
      <hr/>
      <p>We’re here to serve you with excellence!</p>
  `;
};
const quoteRequested = (quote, service) => {
  return `
  <p> You have received a quote request from customer: <strong> ${quote.customerName}</strong> for ${service.name} service.</p>
 <p><strong>Phone: </strong>${quote.customerPhone}</p>
<p><strong>Device: </strong>${quote.device}</p>
  <p><strong>Brand: </strong>${quote.brand}</p>
  <p><strong>Problem Description: </strong>${quote.problemDescription}</p>
`;
};
export {
  generateWorkingEmail,
  generateCompletedEmail,
  generateReceiptEmail,
  quoteRequested,
};
