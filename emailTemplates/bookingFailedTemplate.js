// templates/bookingFailed.js
module.exports = ({ userName, packageName, noOfPersons, amountPaid }) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #fff4f4; padding: 20px;">
      <h2 style="color: #dc3545;">❌ Booking Failed</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>Your booking for <strong>${packageName}</strong> could not be completed.</p>
      <p><strong>No of Persons:</strong> ${noOfPersons}</p>
      <p><strong>Amount Attempted:</strong> ₹${amountPaid}</p>
      <p>Please try again later or contact our support team.</p>
      <hr />
      <p style="font-size: 12px; color: gray;">Smart Yatra Team</p>
    </div>
  `;
};
