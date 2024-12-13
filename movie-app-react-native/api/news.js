export const fetchNews = async () => {
    try {
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=f743aa0a8b144d7bbdec96ff31a0dff5`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };
  