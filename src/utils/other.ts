export const backendURL = import.meta.env.VITE_BACKEND_URL;

export const checkIfToday = (dateString: string) => {
  // Get today's date in the format YYYY-MM-DD
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  // Compare the provided date string with today's date
  return dateString === todayString;
};

export const sortPictures = (pictures: string[]): Record<string, string[]> => {
  // Returns an object with dates as keys, and string arrays as values, so we can sort the pictures by date
  const sortedPictures: Record<string, string[]> = {};

  pictures.map((pictureName: string) => {
    const parts = pictureName.split('-');
    // If pictureName contains "2024-03-18-0", last part is the counter, the first three is the date
    if (parts.length == 4) {
      const date = `${parts[0]}-${parts[1]}-${parts[2]}`;

      // Initialize the date if it doesn't exist in the object yet
      if (!sortedPictures[date]) {
        sortedPictures[date] = [];
      }

      // Add the picture to the corresponding date group
      sortedPictures[date].push(pictureName);
    }
  })

  // Sort each picture by their counter, counting down from the highest counter
  for (const date in sortedPictures) {
    sortedPictures[date] = sortedPictures[date].sort((a, b) => {
      const counterA = Number(a.split('-').pop()?.replace('.jpg', ''));
      const counterB = Number(b.split('-').pop()?.replace('.jpg', ''));
      return counterB - counterA;
    });
  }
  return sortedPictures;
}