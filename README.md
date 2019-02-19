## Amazon Pinpoint Call Generator

Use Lambda to trigger outbound voice phone calls with Pinpoint

## License Summary

This sample code is made available under a modified MIT license. See the LICENSE file.

## Setup process
This package requires AWS Serverless Application Model (AWS SAM) Command Line Interface (CLI) to deploy to your account.
Instructions for installing and setting up SAM CLI can be found here:
https://aws.amazon.com/serverless/sam/

### Prerequisits
This serverless application requires that you have an AWS Pinpoint project set up, and configured with voice support and a long code.
You will need to specify the long code in the template.yaml file before deploing this package.
The Long code must be owned by the same account as Pinpoint and your SAM package are deployed in. 

Optionally update the language code, and the voice to be used to generate the speach via AWS Polly. 
The list of Polly voices can be found here:
https://docs.aws.amazon.com/polly/latest/dg/voicelist.html

### Installing dependencies
Use npm install in the src directory to install any required packages prior to packaging and deploying this SAM application.

### Event Data
eventData.json defines the payload that is sent to your Lambda function. The message attribute of the payload is a SSML string. Documentatin for SSML can be found here:
https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html

Your applcation will need to specify a valid SSML message in the payload.

## Packaging and deployment

Firstly, we need a `S3 bucket` where we can upload our Lambda functions packaged as ZIP before we deploy anything - If you don't have a S3 bucket to store code artifacts then this is a good time to create one:

```bash
aws s3 mb s3://BUCKET_NAME
```

Next, run the following command to package our Lambda function to S3:

```bash
sam package \
    --template-file template.yaml \
    --output-template-file packaged.yaml \
    --s3-bucket REPLACE_THIS_WITH_YOUR_S3_BUCKET_NAME
```

Next, the following command will create a Cloudformation Stack and deploy your SAM resources.

```bash
sam deploy \
    --template-file packaged.yaml \
    --stack-name sam-app \
    --capabilities CAPABILITY_NAMED_IAM
```

> **See [Serverless Application Model (SAM) HOWTO Guide](https://github.com/awslabs/serverless-application-model/blob/master/HOWTO.md) for more details in how to get started.**

After deployment is complete you can run the following command to retrieve the API Gateway Endpoint URL:

```bash
aws cloudformation describe-stacks \
    --stack-name sam-app \
    --query 'Stacks[].Outputs'
``` 