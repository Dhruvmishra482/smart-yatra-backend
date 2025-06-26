module.exports = ({ userName, packageName, amountPaid, noOfPersons }) => {
  return `
    <div style="font-family: Arial; padding: 20px;">
      <h2 style="color: #1e90ff;">✅ Booking Confirmed!</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Thank you for booking the <strong>${packageName}</strong> tour package with us.</p>
      <p><strong>No. of Persons:</strong> ${noOfPersons}</p>
      <p><strong>Total Amount Paid:</strong> ₹${amountPaid}</p>
      <p>We wish you a wonderful journey!</p>
      <br />
      <p style="color: #888;">Regards,<br>Team SmartYatra</p>
    </div>
  `;
};