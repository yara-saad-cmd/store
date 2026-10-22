const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_INPUT_BYTES = 20 * 1024 * 1024
const MAX_SIDE = 1200
const QUALITY = 0.8

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality))

// بنحاول نحترم اتجاه الصورة (صور الموبايل)، ولو المتصفح مش بيدعم الخيار نقرأها عادي
const loadBitmap = async (file) => {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    return await createImageBitmap(file)
  }
}

// بتصغّر الصورة لأقصى 1200 بكسل وتحوّلها WebP، وكل ده جوه المتصفح قبل الرفع
export async function compressImage(file) {
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('UNSUPPORTED_TYPE')
  if (file.size > MAX_INPUT_BYTES) throw new Error('FILE_TOO_LARGE')

  let bitmap
  try {
    bitmap = await loadBitmap(file)
  } catch {
    throw new Error('UNREADABLE_IMAGE')
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const webp = await canvasToBlob(canvas, 'image/webp', QUALITY)
  if (webp && webp.type === 'image/webp') return { blob: webp, ext: 'webp' }

  // متصفح مبيدعمش WebP: نحفظ JPEG بخلفية بيضاء بدل الأسود
  context.globalCompositeOperation = 'destination-over'
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)

  const jpeg = await canvasToBlob(canvas, 'image/jpeg', QUALITY)
  if (!jpeg) throw new Error('COMPRESS_FAILED')
  return { blob: jpeg, ext: 'jpg' }
}

export function getImageErrorMessage(error) {
  switch (error.message) {
    case 'UNSUPPORTED_TYPE':
      return 'نوع الملف غير مدعوم، استخدمي JPG أو PNG أو WebP'
    case 'FILE_TOO_LARGE':
      return 'حجم الصورة أكبر من 20 ميجا'
    default:
      return 'تعذر قراءة الصورة، جربي صورة تانية'
  }
}