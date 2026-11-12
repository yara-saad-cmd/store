import { unitPrice } from './pricing'

// بيتحط جوه عنصر السعر الموجود: لو مفيش خصم بيطبع السعر زي ما هو، ولو فيه بيطبع الجديد والقديم
export default function PriceValue({ price, discount }) {
  const percent = Number(discount || 0)

  if (percent <= 0) return <>{price}</>

  return (
    <>
      <span className="price-now">{unitPrice(price, percent)}</span>
      <del className="price-old">{price}</del>
    </>
  )
}