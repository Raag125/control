import ServiceDetailPage from './ServiceDetailPage'
import { getServiceBySlug } from '../../data/servicesData'

/**
 * TermiteTreatment View Frame
 * 👉 All content, meta, alt tags, images, FAQs, and processes are centralized in:
 *     under the ID 'termite-treatment'
 * You can also pass overrides directly to <ServiceDetailPage />
 */
export default function TermiteTreatment() {
  const service = getServiceBySlug('termite-treatment')
  return <ServiceDetailPage service={service} />
}
