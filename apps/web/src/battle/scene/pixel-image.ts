// Static original atlases are public build assets, unlike the authenticated franchise portraits.
const images = new Map<string, Promise<HTMLImageElement | null>>()
export function pixelImage(url: string): Promise<HTMLImageElement | null> {
  let loaded = images.get(url)
  if (!loaded) {
    loaded = new Promise((resolve) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => { images.delete(url); resolve(null) }
      image.src = url
    })
    images.set(url, loaded)
  }
  return loaded
}
