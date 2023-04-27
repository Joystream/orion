import { compile } from 'handlebars'
import fs from 'fs'
import path from 'path'

type RegisterEmailTemplateData = {
  link: string
  linkExpiryDate: string
  appName: string
}

const registerEmailContent = compile<RegisterEmailTemplateData>(
  fs.readFileSync(path.join(__dirname, './templates/register.html.mst')).toString()
)

export function registerEmailData(templateData: RegisterEmailTemplateData) {
  return {
    subject: `Welcome to ${templateData.appName}!`,
    content: registerEmailContent(templateData),
  }
}
