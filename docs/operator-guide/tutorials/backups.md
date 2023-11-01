# Backing up Orion database
It is recommended to schedule daily backups for the `orion-db` service.
This will ensure that a copy of the whole database is saved daily to be used for emergencies
This guide shows a simple method in order to back up `orion-db` using the [cron](https://en.wikipedia.org/wiki/Cron) utility.

Suppose you want to back up orion a daily cron job at 9:00 AM CET. Provided that the `orion-db` service is being run in a docker container, you can follow these steps:

1. Open your crontab file for editing. You can do this by running the following command:

```bash
crontab -e
```

2. Add the following line to your crontab file. This line schedules the job to run every day at 9:00 AM CET:

```bash
0 9 * * * TZ='Europe/Paris' docker exec orion-db pg_dumpall -U postgres > "/path/to/backup/directory/orion-production-$(date '+\%Y-\%m-\%d').bak"
```

Make sure to replace `/path/to/backup/directory` with the actual path where you want to store the backup files.

Here's what each field in the cron expression means:

- `0`: Minutes field, specifying 0 minutes past the hour.
- `9`: Hours field, specifying 9 AM.
- `*`: Wildcard for days of the month, meaning it will run every day.
- `*`: Wildcard for months, meaning it will run every month.
- `*`: Wildcard for days of the week, meaning it will run every day of the week.
- `TZ='Europe/Paris'`: Sets the timezone to CET (Central European Time) to ensure it runs at 9:00 AM CET.

3. Save and exit the crontab file. The cron job is now scheduled to run daily at 9:00 AM CET and will dump the PostgreSQL database to the specified backup file with the current date in the filename.