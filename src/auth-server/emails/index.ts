import { compile } from 'handlebars'
import mjml2html from 'mjml'
import fs from 'fs'

function getEmailTemplateData<T>(templatePath: string): (data: T) => string {
  const config = {
    "beautify": false,
    "fonts": {
      "Roboto": "https://fonts.googleapis.com/css?family=Roboto"
    }
  }
  return (data) => {
    const mjmlXml = compile<T>(fs.readFileSync(templatePath).toString());
    const { html } = mjml2html(mjmlXml(data), config);
    return html
  }
}

// type aliases for template data
type RegisterEmailTemplateData = {
  link: string
  linkExpiryDate: string
  appName: string
}

type ChannelExcludedEmailTemplateData = {
  link: string
  appName: string
  userName: string
  channelId: string
}

// function exports
export const registerEmailContent: (data: RegisterEmailTemplateData) => string = getEmailTemplateData(fs.readFileSync('./templates/register.html.mst').toString())
export const channelExcludedEmailContent: (data: ChannelExcludedEmailTemplateData) => string = getEmailTemplateData(fs.readFileSync('./templates/channelExcludedFromApp.xml.mst').toString())

