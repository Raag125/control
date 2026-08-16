import ServiceDetailPage from './ServiceDetailPage'
import { getServiceBySlug } from '../../data/servicesData'

/**
 * RodentTreatment View Frame
 * 👉 All content, meta, alt tags, images, FAQs, and processes are centralized in:
 *     under the ID 'rodent-treatment'
 * You can also pass overrides directly to <ServiceDetailPage />
 */
export default function RodentTreatment() {
  const service = getServiceBySlug('rodent-treatment')
  return <ServiceDetailPage service={service} />
}
