import { useId, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { CircleCheck, LoaderCircle, Send, TriangleAlert } from 'lucide-react'
import { formspreeEndpoint, portfolio } from '../../data/portfolio'

type Status = 'idle' | 'submitting' | 'success' | 'error'
type Field = 'name' | 'email' | 'subject' | 'message'
type Values = Record<Field, string>
type Errors = Partial<Record<Field, string>>

const EMPTY: Values = { name: '', email: '', subject: '', message: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v: Values): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = 'Please enter your name.'
  if (!v.email.trim()) e.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'That email address doesn’t look right.'
  if (!v.subject.trim()) e.subject = 'Please add a subject.'
  if (!v.message.trim()) e.message = 'Please write a message.'
  else if (v.message.trim().length < 10) e.message = 'Your message is a little short — add a few more details.'
  return e
}

interface FormspreeResponse {
  ok?: boolean
  error?: string
  errors?: { field?: string; message?: string }[]
}

export function ContactForm() {
  const uid = useId()
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const inFlight = useRef(false) // guards against double submits before state flushes
  const formRef = useRef<HTMLFormElement>(null)
  const honeypot = useRef<HTMLInputElement>(null)

  const id = (f: Field) => `${uid}-${f}`
  const submitting = status === 'submitting'

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as Field
    const next = { ...values, [field]: e.target.value }
    setValues(next)
    if (touched[field]) setErrors((prev) => ({ ...prev, [field]: validate(next)[field] }))
    if (status === 'error') setStatus('idle')
  }

  const onBlur = (field: Field) => {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors((prev) => ({ ...prev, [field]: validate(values)[field] }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (inFlight.current) return

    const found = validate(values)
    setErrors(found)
    setTouched({ name: true, email: true, subject: true, message: true })
    const firstInvalid = (['name', 'email', 'subject', 'message'] as Field[]).find((f) => found[f])
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    inFlight.current = true
    setStatus('submitting')
    setErrorMessage('')

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 20000)

    try {
      const res = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          _replyto: values.email.trim(),
          subject: values.subject.trim(),
          _subject: `[Portfolio] ${values.subject.trim()}`,
          message: values.message.trim(),
          _gotcha: honeypot.current?.value ?? '',
        }),
        signal: controller.signal,
      })

      const data = (await res.json().catch(() => null)) as FormspreeResponse | null

      // Success is only reported once Formspree itself confirms it.
      if (res.ok && data?.ok !== false && !data?.errors) {
        setStatus('success')
        setValues(EMPTY)
        setTouched({})
        setErrors({})
      } else {
        const detail =
          data?.errors?.map((x) => x.message).filter(Boolean).join(' ') ||
          data?.error ||
          `The server responded with status ${res.status}.`
        setErrorMessage(detail)
        setStatus('error')
      }
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === 'AbortError'
      setErrorMessage(
        aborted
          ? 'The request timed out. Please check your connection and try again.'
          : 'Couldn’t reach the server. Please check your connection and try again.',
      )
      setStatus('error')
    } finally {
      window.clearTimeout(timeout)
      inFlight.current = false
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <CircleCheck size={28} aria-hidden="true" />
        <h4>Message sent</h4>
        <p>Thanks for reaching out — your message was delivered and I’ll get back to you soon.</p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStatus('idle')}>
          Send another message
        </button>
      </div>
    )
  }

  const fieldProps = (f: Field) => ({
    id: id(f),
    name: f,
    value: values[f],
    onChange,
    onBlur: () => onBlur(f),
    disabled: submitting,
    required: true,
    'aria-required': true as const,
    'aria-invalid': errors[f] ? (true as const) : undefined,
    'aria-describedby': errors[f] ? `${id(f)}-err` : undefined,
  })

  const Err = ({ f }: { f: Field }) =>
    errors[f] ? (
      <p id={`${id(f)}-err`} className="field__error">
        {errors[f]}
      </p>
    ) : null

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate aria-busy={submitting}>
      <div className="form__grid">
        <div className="field">
          <label htmlFor={id('name')}>Name</label>
          <input type="text" autoComplete="name" maxLength={120} {...fieldProps('name')} />
          <Err f="name" />
        </div>
        <div className="field">
          <label htmlFor={id('email')}>Email</label>
          <input type="email" autoComplete="email" inputMode="email" maxLength={160} {...fieldProps('email')} />
          <Err f="email" />
        </div>
      </div>

      <div className="field">
        <label htmlFor={id('subject')}>Subject</label>
        <input type="text" maxLength={160} {...fieldProps('subject')} />
        <Err f="subject" />
      </div>

      <div className="field">
        <label htmlFor={id('message')}>Message</label>
        <textarea rows={5} maxLength={5000} {...fieldProps('message')} />
        <Err f="message" />
      </div>

      {/* Honeypot — hidden from people, visible to simple spam bots. */}
      <div className="sr-only" aria-hidden="true">
        <label>
          Leave this field empty
          <input ref={honeypot} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === 'error' && (
        <div className="form-error" role="alert">
          <TriangleAlert size={18} aria-hidden="true" />
          <div>
            <strong>Your message wasn’t sent.</strong>
            <p>
              {errorMessage}
              {portfolio.contact.visibility.email && portfolio.contact.email ? (
                <>
                  {' '}
                  You can also email me directly at{' '}
                  <a href={`mailto:${portfolio.contact.email}`}>{portfolio.contact.email}</a>.
                </>
              ) : null}
            </p>
          </div>
        </div>
      )}

      <button type="submit" className="btn btn--primary" disabled={submitting}>
        {submitting ? (
          <>
            <LoaderCircle size={18} className="spin" aria-hidden="true" /> Sending…
          </>
        ) : (
          <>
            <Send size={18} aria-hidden="true" /> Send message
          </>
        )}
      </button>
      <p className="sr-only" role="status" aria-live="polite">
        {submitting ? 'Sending your message' : ''}
      </p>
    </form>
  )
}
