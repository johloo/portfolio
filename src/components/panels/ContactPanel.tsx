import { Mail, MapPin, Phone } from 'lucide-react'
import { portfolio } from '../../data/portfolio'
import { GithubIcon, LinkedinIcon } from '../BrandIcons'
import { ContactForm } from './ContactForm'
import { PanelShell } from './PanelShell'

export function ContactPanel({ onClose }: { onClose: () => void }) {
  const { contact, social } = portfolio
  const show = contact.visibility
  const phoneHref = `tel:${contact.phone.replace(/[^\d+]/g, '')}`

  return (
    <PanelShell label="Communication beacon" title="Contact" onClose={onClose}>
      <p className="prose">Have a project, an idea, or a question? Send a signal — I’d love to hear from you.</p>

      <ul className="contact-list">
        {show.email && contact.email && (
          <li>
            <a href={`mailto:${contact.email}`}>
              <Mail size={18} aria-hidden="true" />
              <span>
                <small>Email</small>
                {contact.email}
              </span>
            </a>
          </li>
        )}
        {show.phone && contact.phone && (
          <li>
            <a href={phoneHref}>
              <Phone size={18} aria-hidden="true" />
              <span>
                <small>Phone</small>
                {contact.phone}
              </span>
            </a>
          </li>
        )}
        {show.location && contact.location && (
          <li>
            <div className="contact-list__static">
              <MapPin size={18} aria-hidden="true" />
              <span>
                <small>Location</small>
                {contact.location}
              </span>
            </div>
          </li>
        )}
      </ul>

      {(social.github || social.linkedin) && (
        <div className="panel__cta">
          {social.github && (
            <a className="btn btn--ghost btn--sm" href={social.github} target="_blank" rel="noreferrer">
              <GithubIcon /> GitHub
            </a>
          )}
          {social.linkedin && (
            <a className="btn btn--ghost btn--sm" href={social.linkedin} target="_blank" rel="noreferrer">
              <LinkedinIcon /> LinkedIn
            </a>
          )}
        </div>
      )}

      <h3 className="subhead">Send a message</h3>
      <ContactForm />
    </PanelShell>
  )
}
