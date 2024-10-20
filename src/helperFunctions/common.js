function camelCaseToWords(camelCaseString) {
  let normalWords = camelCaseString.replace(/([A-Z])/g, ' $1').toLowerCase();
  normalWords = normalWords.charAt(0).toUpperCase() + normalWords.slice(1);
  return normalWords;
}

function LoadImageInitTrigger(url, obj) {
  const img = new Image();

  img.onload = function () {
    obj.trigger = true;
  };

  // Adding url after incase the img is small and loads before onload is initialized
  img.src = url;
}

function validateImageUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const aspectRatio = width / height;

      const isTooTall = aspectRatio < 0.62;
      const isTooWide = aspectRatio > 0.705;
      const isValidSize = width <= 950 && height <= 1300;

      if (!isValidSize) {
        resolve(['Image too big', false]);
      } else if (isTooTall) {
        resolve(['Aspect ratio too tall', false]);
      } else if (isTooWide) {
        resolve(['Aspect ratio too wide', false]);
      } else {
        resolve(['Image is valid', true]);
      }
    };

    img.onerror = () => resolve(['Invalid image URL', false]);
    img.src = url;
  });
}

export { camelCaseToWords, LoadImageInitTrigger, validateImageUrl };
