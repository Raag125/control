import ServiceDetailPage from './ServiceDetailPage'
import { getServiceBySlug } from '../../data/servicesData'

/**
 * WoodBorerTreatment View Frame
 * 👉 All content, meta, alt tags, images, FAQs, and processes are centralized in:
 *     under the ID 'wood-borer-treatment'
 * You can also pass overrides directly to <ServiceDetailPage />
 */
export default function WoodBorerTreatment() {
  const service = getServiceBySlug('wood-borer-treatment')
  return <ServiceDetailPage service={service} />
}
