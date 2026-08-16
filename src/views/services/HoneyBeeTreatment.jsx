import ServiceDetailPage from './ServiceDetailPage'
import { getServiceBySlug } from '../../data/servicesData'

/**
 * HoneyBeeTreatment View Frame
 * 👉 All content, meta, alt tags, images, FAQs, and processes are centralized in:
 *     under the ID 'honey-bee-treatment'
 * You can also pass overrides directly to <ServiceDetailPage />
 */
export default function HoneyBeeTreatment() {
  const service = getServiceBySlug('honey-bee-treatment')
  return <ServiceDetailPage service={service} />
}
