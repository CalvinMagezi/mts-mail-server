import sendgrid from "@sendgrid/mail";
import Cors from "cors";
import initMiddleware from "../../lib/init-middleware";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST", "OPTIONS"],
  })
);

async function sendEmail(req, res) {
  // Run cors
  await cors(req, res);

  let { email, sender, link } = req.body;
  //Email client details about service request.

  const serviceMessage = `Please visit this link (${link}) to verify your email. Verification sent on: ${new Date().toDateString()}.`;

  const message = `
    Email: ${email}
    Message: ${serviceMessage} 
  `;

  try {
    // console.log("REQ.BODY", req.body);
    await sendgrid.send({
      to: email, // Your email where you'll receive emails
      from: sender, // your website email address here
      subject: "Email Verification",
      text: message,
      html: message.replace(/\r\n/g, "<br>"),
    });
  } catch (error) {
    // console.log(error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res
    .status(200)
    .json({ message: "Email Verification Successfully Sent." });
}

export default sendEmail;
