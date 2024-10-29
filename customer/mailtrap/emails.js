const { VERIFICATION_EMAIL_TEMPLATE } = require("./emailTemplates")
const { mailtrapClient, sender } = require('./mailtrap.config')

const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to : recipient,
            subject: 'Verification Email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category : "Email Verification"
        })

        console.log("Verification email sent successfully", response)
    }catch(error){
        console.error("Error sending verification email", error)
        throw new Error(`Error sending verification email : ${error}`);
    }
}

const sendWelcomeEmail = async (email, name) =>{
    const recipient = [{email}]; 

    try {
        await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "3a977df4-684b-4c0b-b258-55144af04332",
            template_variables: {
                "company_info_name": "sports cart",
                "name": "subash"},
        })
        console.log("Welcome email sent successfully")
    } catch (error) {
        console.error("Error sending welcome email", error)
        throw new Error(`Error sending welcome email : ${error}`);
    }
}

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
}