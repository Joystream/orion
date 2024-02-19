# Operator email notifications guide

This feature has been introduced in Orion starting from version 3.2.0 and the purpose of this documentation is 
to instruct a potential gateway operator about how setting up a email notification system using a chron scheduler

## Prerequisite
Currently in order to have the scheduling working you must clone the orion repo locally via:
```sh
    git clone https://github.com/Joystream/orion.git
```
and cd-ing into it and installing the dependencies and building using (which assumes you have [npm](https://www.npmjs.com/) installed)
```sh
    cd orion
    make prepare
```

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
*/<TIME_INTERVAL_MINUTES> * * * * <NODE_BINARY_PATH> /lib/mail-scheduler/index.js >> <PATH_TO_ORION_FOLDER>/chron_mail_scheduler.log 2>&1
```
replacing:
    - `<PATH_TO_ORION_FOLDER>` with the absolute path to the orion directory cloned in the *prerequise* step
    - `<TIME_INTERVAL_MINUTES>` with the desired time interval in minutes.
    - `<NODE_BINARY_PATH>`with the absolute path for the node-js binary (which can be obtained by running the shell line `which node`)
    
This will make the script to be executed with the desired frequency and it will output the log into a `<PATH_TO_ORION_FOLDER>/chron_mail_scheduler.log` file
3. save and close the crontab file 

### Updating the interval value 
Same steps as the in the above "Configuring the interval value during orion setup" section
but this time it suffices to update the value for `<TIME_INTERVAL_MINUTES>` and then save the crontab file

### Recommendation for the frequency values
Value ranges from 2 to 5 minutes provides a user experience that is similar to most existing 
notification delivery system.
It is important to monitor system usage in case of heavy load and if necessary increase the time interval to a value that doesn't stress excessively your setup