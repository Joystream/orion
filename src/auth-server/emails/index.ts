import { compile } from 'handlebars'
import fs from 'fs'
import path from 'path'
import { NotificationData } from '../../utils/notification/notificationsData'

function getEmailTemplateData<T>(templatePath: string): (data: T) => string {
  const fullPath = path.join(__dirname, 'templates/' + templatePath)
  return (data) => {
    const mailContent = compile<T>(fs.readFileSync(fullPath).toString())
    return mailContent(data).toString()
  }
}

// type aliases for template data
type RegisterEmailTemplateData = {
  link: string
  linkExpiryDate: string
  appName: string
}

// function exports
export function registerEmailContent(data: RegisterEmailTemplateData): string {
  return getEmailTemplateData<RegisterEmailTemplateData>('register.html.mst')(data)
}

export type NotificationEmailTemplateData = {
  title: string
  subTitle: string

  app: {
    name: string
    nameAlt: string
    logo: string
    logoAlt: string
    homeLink: string
    notificationLink: string
    unsubscribeLink: string
  }

  notification: NotificationData
}
export function notificationEmailContent(data: NotificationEmailTemplateData): string {
  return getEmailTemplateData<NotificationEmailTemplateData>('notification.html.mst')(data)
}
