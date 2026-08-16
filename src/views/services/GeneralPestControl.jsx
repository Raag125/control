import ServiceDetailPage from './ServiceDetailPage'
import { getServiceBySlug } from '../../data/servicesData'

/**
 * GeneralPestControl View Frame
 * 👉 All content, meta, alt tags, images, FAQs, and processes are centralized in:
 *     under the ID 'general-pest-control'
 * You can also pass overrides directly to <ServiceDetailPage />
 */
export default function GeneralPestControl() {
  const service = getServiceBySlug('general-pest-control')
  return <ServiceDetailPage service={service} />
}
