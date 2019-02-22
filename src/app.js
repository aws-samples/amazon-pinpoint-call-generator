
/*
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


const AWS = require('aws-sdk');
var pinpointsmsvoice = new AWS.PinpointSMSVoice({apiVersion: '2018-09-05'});

function triggerCall (eventData) {
    return new Promise (resolve => {
        /*
        * VoiceID and Language are set from the Polly options:
        * https://docs.aws.amazon.com/polly/latest/dg/API_Voice.html
        * 
        * OriginationPhoneNumber Must be the long code set up in Amazon Pinpoint.
        */
        var parms = {
            Content: {
                SSMLMessage: {
                    LanguageCode : process.env.Language,
                    Text : eventData.Message,
                    VoiceId: process.env.Voice
                }
            },
            OriginationPhoneNumber: process.env.LongCode,
            DestinationPhoneNumber: eventData.PhoneNumber
        };

        console.log ("Call Parameters: ", JSON.stringify(parms));
        pinpointsmsvoice.sendVoiceMessage (parms, function (err, data) {
            if (err) {
                console.log ("Error : "+ err.message);
                resolve(eventData.PhoneNumber + " " + err.message);
            }
            else {
                console.log (data);
                resolve(eventData.PhoneNumber + " OK");
            }
        });
    });
}

exports.lambda_handler = async (event, context, callback) => {
    console.log ("In Function - lambda_handler")
    try {
        var result = await triggerCall (event);
    }
    catch (err) {
        console.log(err);
        callback(err, null);
    }
};
