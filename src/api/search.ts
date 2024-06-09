const BASE_URL = 'https://api-eu.okotoki.com/coins';

export const getAllCoins = async () => {
  try {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    window.console.error('Error:', error);

    return null;
  }
};
