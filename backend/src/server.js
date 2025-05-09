import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import roleRoutes from './routes/roleRoutes.js';


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],     
  }));

app.get('/', (req, res) => {
    res.json({ 
      message: 'API is running 🚀',
    });
  });



app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})