import ServiceDetailPage from './ServiceDetailPage'
import { getServiceBySlug } from '../../data/servicesData'

/**
 * PreConstructionTermite View Frame
 * 👉 All content, meta, alt tags, images, FAQs, and processes are centralized in:
 *     under the ID 'pre-construction-termite-treatment'
 * You can also pass overrides directly to <ServiceDetailPage />
 */
export default function PreConstructionTermite() {
  const service = getServiceBySlug('pre-construction-termite-treatment')
  return <ServiceDetailPage service={service} />
}
