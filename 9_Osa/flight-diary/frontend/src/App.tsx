import { useState, useEffect } from 'react';
import { type Weather, type DiaryEntry, type Visibility } from './types';
import { getAllDiaries, createDiary } from './services/diaryService';
import axios from 'axios';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [visibility, setVisibility] = useState<Visibility>('good');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getAllDiaries().then(data => setDiaries(data));
  }, []);

  const newDiary = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    
    const diaryObject = {
      date,
      weather,
      visibility,
      comment
    };

    try {
      const data = await createDiary(diaryObject);
      setDiaries(diaries.concat(data));
      setDate('');
      setComment('');
      setErrorMessage(null);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setErrorMessage(e.response?.data || 'An error occurred');
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      <h1>Add New Diary Entry</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={newDiary}>
        <div>
          Date: 
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>
        <div>
          Weather: 
          <input type="radio" name="weather" id="sunny" checked={weather === 'sunny'} onChange={() => setWeather('sunny')} />
          <label htmlFor="sunny">Sunny</label>
          <input type="radio" name="weather" id="rainy" checked={weather === 'rainy'} onChange={() => setWeather('rainy')} />
          <label htmlFor="rainy">Rainy</label>
          <input type="radio" name="weather" id="cloudy" checked={weather === 'cloudy'} onChange={() => setWeather('cloudy')} />
          <label htmlFor="cloudy">Cloudy</label>
          <input type="radio" name="weather" id="stormy" checked={weather === 'stormy'} onChange={() => setWeather('stormy')} />
          <label htmlFor="stormy">Stormy</label>
          <input type="radio" name="weather" id="windy" checked={weather === 'windy'} onChange={() => setWeather('windy')} />
          <label htmlFor="windy">Windy</label>
        </div>
        <div>
          Visibility: 
          <input type="radio" name="visibility" id="great" checked={visibility === 'great'} onChange={() => setVisibility('great')} />
          <label htmlFor="great">Great</label>
          <input type="radio" name="visibility" id="good" checked={visibility === 'good'} onChange={() => setVisibility('good')} />
          <label htmlFor="good">Good</label>
          <input type="radio" name="visibility" id="ok" checked={visibility === 'ok'} onChange={() => setVisibility('ok')} />
          <label htmlFor="ok">Ok</label>
          <input type="radio" name="visibility" id="poor" checked={visibility === 'poor'} onChange={() => setVisibility('poor')} />
          <label htmlFor="poor">Poor</label>
        </div>
        <div>
          Comment: 
          <input 
            type="text" 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
          />
        </div>
        <button type="submit">Add Diary</button>
      </form>
      <h1>Flight Diaries</h1>
      {diaries.map(diary => (
        <div key={diary.id}>
          <h2>{diary.date}</h2>
          <p>Weather: {diary.weather}</p>
          <p>Visibility: {diary.visibility}</p>
          <p>Comment: {diary.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
