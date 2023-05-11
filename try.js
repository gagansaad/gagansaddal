

async function validateSocialMediaLink(url) {
  try {
    const validationResult = await validateUrl(url);
    if (validationResult.valid) {
      console.log(`The URL "${url}" is a valid ${validationResult.provider} link.`);
      if (await validationResult.exists()) {
        console.log(`The ${validationResult.provider} link exists.`);
      } else {
        console.log(`The ${validationResult.provider} link does not exist.`);
      }
    } else {
      console.log(`The URL "${url}" is not a valid social media link.`);
    }
  } catch (error) {
    console.error('An error occurred while validating the URL:', error);
  }
}

// Example usage
const instagramLink = 'https://www.instagram.com/p/B123456789/';
validateSocialMediaLink(instagramLink);

const twitterLink = 'https://twitter.com/username/status/123456789';
validateSocialMediaLink(twitterLink);

const facebookLink = 'https://www.facebook.com/username/posts/123456789';
validateSocialMediaLink(facebookLink);
