# Operator email notifications guide

This feature has been introduced in Orion starting from version 3.2.0

The current implementation uses a chron job for executing the
`src/lib/mail-scheduler/index.js` script at every specified interval.
One execution of the above script file will make all the pending email notifications to be send. The plan in the future is to combine all the email for a particular account in a digest form.
It's important to remark that currently we only support [Sendgrid](https://sendgrid.com) as transactional email service

## Sendgrid configuration
Configure the `.env` variables with:
- `SENDGRID_API_KEY` : your sendgrid api key
- `SENDGRID_FROM_EMAIL` : your email for which the api key is configured. This email will be used as the sender address for the notifications, we recommend a value like `no-reply@<APPLICATION_ROOT_DOMAIN>` like `no-reply@gleev.xyz` to make it clear to users that it is a service email.


## Notification Email frequency
### Configuring the interval value during orion setup
1. Open up the chrontab file with `crontab -e`
2. Add the following line:
```bash
*/<TIME_INTERVAL_MINUTES> * * * * /home/ubuntu/.volta/bin/node <PATH_TO_ORION_FOLDER>/lib/mail-scheduler/index.js >> <PATH_TO_ORION_FOLDER>/chron_mail_scheduler.log 2>&1
```
replacing the `<PATH_TO_ORION_FOLDER>` with the path to the orion directory cloned for the setup and `<TIME_INTERVAL_MINUTES>` with the desired time interval in minutes. This will make the script to be executed with the desired frequency and it will output the log into a `<PATH_TO_ORION_FOLDER>/chron_mail_scheduler.log` file
3. save and close the crontab file 

### Updating the interval value 
Same steps as the in the above "Configuring the interval value during orion setup" section
but this time it suffices to update the value for `<TIME_INTERVAL_MINUTES>` and then save the crontab file

### Recommendation for the frequency values
Value ranges from 2 to 5 minutes provides a user experience that is similar to most existing 
notification delivery system.
It is important to monitor system usage in case of heavy load and if necessary increase the time interval to a value that doesn't stress excessively your setup