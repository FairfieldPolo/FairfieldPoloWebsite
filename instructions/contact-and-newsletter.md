# Contact form & newsletter

## Contact form

The **Contact** page (`/contact`) sends messages through the site’s **API** using **Resend** email. Visitors do not see your SMTP password; delivery is configured on the server with environment variables.

- **What you can do without code:** Use the form as-is; replies go to the inbox configured when the site was deployed (`CONTACT_EMAIL` / Resend setup).
- **Changing the destination email or fixing “not delivered” issues:** Requires a developer or hosting admin to update environment variables and Resend settings.

The address and map on the contact page are part of the **page template**. Updating the street address or embedded map usually means a small code change unless your team later connects this to **Site settings** in Sanity.

## Newsletter (Mailchimp)

Signup forms post to the site’s **newsletter API**, which talks to **Mailchimp**.

- Subscribers are added to the **audience** configured for production (`MAILCHIMP_AUDIENCE_ID` and related keys).
- If signups fail or go to the wrong list, the Mailchimp API keys and audience ID need to be checked in hosting—not in Sanity.

Staff normally **do not** manage Mailchimp keys from Studio; they manage lists and campaigns inside **Mailchimp’s own dashboard** after subscribers arrive.
