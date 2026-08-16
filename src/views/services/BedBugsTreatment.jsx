import ServiceDetailPage from './ServiceDetailPage'
import { getServiceBySlug } from '../../data/servicesData'

/**
 * BedBugsTreatment View Frame
 * 👉 All content, meta, alt tags, images, FAQs, and processes are centralized in:
 *     under the ID 'bed-bugs-treatment'
 * You can also pass overrides directly to <ServiceDetailPage />
 */
export default function BedBugsTreatment() {
  const service = getServiceBySlug('bed-bugs-treatment')
  return <ServiceDetailPage service={service} />
}
