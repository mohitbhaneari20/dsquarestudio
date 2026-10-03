import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { site } from '../../config/site';
import {
  budgets,
  projectTypes,
  submitInquiry,
  validateInquiry,
  type Inquiry,
  type InquiryErrors,
} from '../../lib/inquiry';
import { cn } from '../../lib/cn';
import { ButtonLink } from '../ui/ButtonLink';

const empty: Inquiry = { name: '', email: '', company: '', projectType: '', budget: '', message: '' };

const inputClass =
  'w-full border-0 border-b border-border bg-transparent px-0 py-3 text-lg tracking-tight placeholder:text-muted/60 focus:border-foreground focus:outline-none focus-visible:outline-none transition-colors';

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-meta flex justify-between text-muted">
        <span>{label}</span>
        {optional && <span>Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-accent" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function ChoiceGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  optional,
}: {
  name: keyof Inquiry;
  legend: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  optional?: boolean;
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="text-meta mb-4 flex w-full justify-between text-muted">
        <span>{legend}</span>
        {optional && <span>Optional</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = value === option;
          return (
            <label
              key={option}
              className={cn(
                'inline-flex h-11 cursor-pointer items-center rounded-full border px-4 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foreground',
                checked ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={checked}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {option}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-accent" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function ContactForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Inquiry>(empty);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent-endpoint' | 'sent-email' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');

  const set = (key: keyof Inquiry) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const onInput = (key: keyof Inquiry) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key)(e.target.value);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateInquiry(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move focus to the first problem
      const first = Object.keys(found)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('sending');
    const result = await submitInquiry(values);
    if (result.ok) {
      setStatus(result.via === 'endpoint' ? 'sent-endpoint' : 'sent-email');
    } else {
      setStatus('error');
      setSubmitError(result.error);
    }
  };

  const described = (key: keyof Inquiry) => (errors[key] ? { 'aria-invalid': true, 'aria-describedby': `${id}-${key}-error` } : {});

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === 'sent-endpoint' || status === 'sent-email' ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border pt-8"
          role="status"
        >
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent text-[var(--accent-foreground)]">
            <Check size={22} aria-hidden="true" />
          </span>
          <h2 className="text-h2 mt-8">{status === 'sent-endpoint' ? 'Got it. Thank you.' : 'Almost there.'}</h2>
          <p className="text-lead mt-4 max-w-lg text-muted">
            {status === 'sent-endpoint'
              ? 'We’ll read it properly and reply by email.'
              : `Your email app should have opened with the message ready to send. If it didn’t, write to ${site.email}.`}
          </p>
          <div className="mt-10">
            <ButtonLink
              variant="outline"
              onClick={() => {
                setValues(empty);
                setStatus('idle');
              }}
            >
              Send another
            </ButtonLink>
          </div>
        </motion.div>
      ) : (
        <motion.form key="form" ref={formRef} onSubmit={onSubmit} noValidate className="space-y-10" exit={{ opacity: 0, y: -8 }}>
          <div className="grid gap-10 md:grid-cols-2">
            <Field id={`${id}-name`} label="Name" error={errors.name && errors.name}>
              <input id={`${id}-name`} name="name" autoComplete="name" className={inputClass} value={values.name} onChange={onInput('name')} placeholder="Your name" {...described('name')} />
            </Field>
            <Field id={`${id}-email`} label="Email" error={errors.email}>
              <input id={`${id}-email`} name="email" type="email" autoComplete="email" className={inputClass} value={values.email} onChange={onInput('email')} placeholder="you@example.com" {...described('email')} />
            </Field>
          </div>
          <Field id={`${id}-company`} label="Company" optional>
            <input id={`${id}-company`} name="company" autoComplete="organization" className={inputClass} value={values.company} onChange={onInput('company')} placeholder="Company or project name" />
          </Field>

          <ChoiceGroup name="projectType" legend="Project type" options={projectTypes} value={values.projectType} onChange={set('projectType')} error={errors.projectType} />
          <ChoiceGroup name="budget" legend="Budget range" options={budgets} value={values.budget} onChange={set('budget')} optional />

          <Field id={`${id}-message`} label="Message" error={errors.message}>
            <textarea
              id={`${id}-message`}
              name="message"
              rows={5}
              className={cn(inputClass, 'resize-y')}
              value={values.message}
              onChange={onInput('message')}
              placeholder="What are you making, and where are you stuck?"
              {...described('message')}
            />
          </Field>

          {status === 'error' && (
            <p className="text-sm text-accent" role="alert">
              {submitError}
            </p>
          )}

          <ButtonLink type="submit" size="lg" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send inquiry'}
          </ButtonLink>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
