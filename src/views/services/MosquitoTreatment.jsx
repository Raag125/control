import ServiceDetailPage from './ServiceDetailPage'
import { getServiceBySlug } from '../../data/servicesData'

/**
 * MosquitoTreatment View Frame
 * 👉 All content, meta, alt tags, images, FAQs, and processes are centralized in:
 *     under the ID 'mosquito-treatment'
 * You can also pass overrides directly to <ServiceDetailPage />
 */
export default function MosquitoTreatment() {
  const service = getServiceBySlug('mosquito-treatment')
  return <ServiceDetailPage service={service} />
}
