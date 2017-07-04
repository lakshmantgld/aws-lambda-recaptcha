# AWS-Lambda-reCAPTCHA
Simple **static websites** that does not have a signUp/signIn, can have **reCAPTCHA** on their form to avoid these scripting kiddies spamming you. Google has come up with nice [reCAPTCHA](https://www.google.com/recaptcha/intro/) technology that is easy to set up which solves the spamming problem.

**AWS Lambda** is **revolutionizing** the cloud. Developers are creating interesting use cases day-by-day with the Lambda. In our use case, we are using Lambda as the **Form backend** that verifies the captcha and perform your business logic. Lambdas and APIGateway together form a scalable, highly available and cost-efficient backend for your web application.

## Technical Architecture:

This high level architecture would help us understand how we use **reCAPTCHA** in our contact forms.

![reCAPTCHA Architecture](https://raw.githubusercontent.com/lakshmantgld/aws-lambda-recaptcha/master/readmeFiles/architecture.png)

### Overview:
- Google's reCAPTCHA has to be added in your webpage. Once the user fills the contact form, he has to answer the captcha. Once user submits the form, captcha is sent as part of the request to the Lambda.
- In Lambda, the user entered captcha is verified with google's captcha API. If the request returns success, then your business logic will be executed. Thus, having captcha prevents our form from spamming abuse.

### Setting up Captcha:
Since the captcha's information has to be set in **client**(react app) and in **server**(lambda), I have divided the instructions into three sections namely **Registering Captcha**, **Client-Side Integration**, **Server-Side Integration**.

#### Registering Captcha:
Google has made it very easy to register captcha. To set up your own reCAPTCHA, navigate to [google-reCAPTCHA](https://www.google.com/recaptcha/intro/).
- Enter the label for the captcha.
- There are two types of captcha available at the time of this writing. They are **reCAPTCHA V2** and **Invisible reCAPTCHA**. **reCAPTCHA V2** is the famous **I'm not a robot checkbox** which will give you random questions like find the car in the image and so on. **Invisible reCAPTCHA** is embedding captcha in the existing button.
- Enter the domains (eg: `lonesmoke.com`), where you will be using the reCAPTCHA. Add `Localhost` for testing the captcha during the development.
- Check the terms & conditions box and register your captcha.

#### Client-Side Integration:
The google reCAPTCHA page has provided the instructions for integrating the client side by adding a script tag. Since I am a react fanboy, there is this captcha wrapper for react called [react-google-recaptcha](https://www.npmjs.com/package/react-google-recaptcha). This makes the job even more easy. Here is the snippet:

```js
import ReCAPTCHA from 'react-google-recaptcha';

/* You need to persist the captcha response, so that you
can send that as part of your request to Lambda.

*/
storeCaptcha(captchaValue){
  console.log(captchaValue);
  this.setState({captchaResponse: captchaValue});
}


<ReCAPTCHA sitekey="your-site-key" onChange={this.storeCaptcha}/>

```
- You can find your **reCAPTCHA-site-key** in the registration page. Make sure you send the captcha response as part of the request, so that you can verify that with your lambda.


#### Server-Side Integration:
Now, we need to verify the captcha response that is sent as part of the client request. The verification part is also made easy by using an NPM package called [google-recaptcha](https://github.com/martin-experiments/google-recaptcha). Here is the snippet:

```js
const googleRecaptcha = require('google-recaptcha');

const captcha = new googleRecaptcha({
  secret: config.captchaSiteSecret
});

let captchaResponse = event.body.captchaResponse;

captcha.verify({response: captchaResponse}, (error) => {
  if (error) {
    callback(error);
  }

  callback(null, response);
})
```
- `captchaSiteSecret` is provided in the registration page of google Recaptcha. As you can see, the `captchaResponse` is sent as part of the request.

Once all the above things are setup, you can prevent your static site from bots and spamming.
