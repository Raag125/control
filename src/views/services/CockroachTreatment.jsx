import ServiceDetailPage from './ServiceDetailPage'
import { getServiceBySlug } from '../../data/servicesData'

/**
 * CockroachTreatment View Frame
 * 👉 All content, meta, alt tags, images, FAQs, and processes are centralized in:
 *     under the ID 'cockroach-treatment'
 * You can also pass overrides directly to <ServiceDetailPage />
 */
export default function CockroachTreatment() {
  const service = getServiceBySlug('cockroach-treatment')
  return <ServiceDetailPage service={service} />
}
